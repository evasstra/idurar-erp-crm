const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const updateManySetting = async (req, res) => {
  // req/body = [{settingKey:"",settingValue}]
  let settingsHasError = false;
  const updateDataArray = [];
  const { settings } = req.body;

  for (const setting of settings) {
    // Use Object.prototype.hasOwnProperty.call for safer check
    if (
      !Object.prototype.hasOwnProperty.call(setting, 'settingKey') ||
      !Object.prototype.hasOwnProperty.call(setting, 'settingValue')
    ) {
      settingsHasError = true;
      break;
    }

    // Destructure settingCategory as well
    const { settingKey, settingValue, settingCategory } = setting;

    // Define the update operation - Relying only on $set and upsert defaults
    const updateOperation = {
      $set: { settingValue: settingValue },
      // Removed $setOnInsert - let Mongoose handle defaults based on schema + filter
    };

    updateDataArray.push({
      updateOne: {
        filter: { settingKey: settingKey, settingCategory: settingCategory }, // Filter by key and category
        update: updateOperation,
        upsert: true,
      },
    });
  }

  if (updateDataArray.length === 0) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'No settings provided ',
    });
  }
  if (settingsHasError) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'Settings provided has Error',
    });
  }
  const result = await Model.bulkWrite(updateDataArray);

  // Check if the bulk write operation itself was acknowledged and successful
  // result.nMatched might be 0 if only new documents were upserted
  if (!result || !result.acknowledged) {
    return res.status(500).json({ // Use 500 for server-side bulk write issues
      success: false,
      result: null,
      message: 'Bulk write operation failed',
    });
  }

  // Check if any documents were matched OR upserted
  if (result.nMatched === 0 && result.nUpserted === 0) {
    return res.status(404).json({ // 404 if nothing was found or inserted (shouldn't happen with upsert usually)
      success: false,
      result: null,
      message: 'No settings found to update', // Corrected typo
    });
  }
  // Remove unnecessary else block
  return res.status(200).json({
    success: true,
    result: [],
    message: 'we update all settings',
  });
};

module.exports = updateManySetting;
