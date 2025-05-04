const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const updateManySetting = async (req, res) => {
  // req.body = [{settingKey:"", settingValue, settingCategory}]
  const { settings } = req.body;

  if (!settings || !Array.isArray(settings) || settings.length === 0) {
    return res.status(400).json({ // Use 400 for bad request
      success: false,
      result: null,
      message: 'No settings array provided in request body',
    });
  }

  const results = [];
  let errors = [];

  for (const setting of settings) {
    // Validate individual setting object
    if (
      !Object.prototype.hasOwnProperty.call(setting, 'settingKey') ||
      !Object.prototype.hasOwnProperty.call(setting, 'settingValue') ||
      !Object.prototype.hasOwnProperty.call(setting, 'settingCategory') // Also check for category
    ) {
      errors.push({ setting: setting, message: 'Missing required fields (settingKey, settingValue, settingCategory)' });
      continue; // Skip this setting
    }

    const { settingKey, settingValue, settingCategory } = setting;

    try {
      const filter = { settingKey: settingKey, settingCategory: settingCategory };
      const update = { $set: { settingValue: settingValue } }; // Only set the value, let upsert handle others
      const options = {
        new: true, // Return the modified document
        upsert: true, // Create if it doesn't exist
        setDefaultsOnInsert: true, // Apply schema defaults on insert
      };

      const updatedSetting = await Model.findOneAndUpdate(filter, update, options);
      results.push(updatedSetting);
    } catch (error) {
      errors.push({ setting: setting, message: error.message });
    }
  }

  if (errors.length > 0) {
    // If there were errors, report them (could be partial success)
    return res.status(500).json({ // Internal Server Error if any update failed
      success: false,
      result: { updated: results, errors: errors },
      message: 'Error updating some settings',
    });
  }

  // If all updates were successful
  return res.status(200).json({
    success: true,
    result: results, // Return the updated/created documents
    message: 'All settings updated successfully',
  });
};

module.exports = updateManySetting;
