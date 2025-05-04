const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const AdminPassword = mongoose.model('AdminPassword');
const bcrypt = require('bcryptjs');
const { generate: uniqueId } = require('shortid');

const createUserController = require('@/controllers/middlewaresControllers/createUserController');

// Existing controller methods from the factory
const baseController = createUserController('Admin');

// Custom create function
const createAdmin = async (req, res) => {
  try {
    const { email, password, name, surname, role } = req.body;

    // Basic validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Missing required fields: email, password, name, role.',
      });
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase(), removed: false });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Email already exists.',
      });
    }

    // Create Admin document
    const newAdmin = new Admin({
      email: email.toLowerCase(),
      name,
      surname,
      role,
      // enabled defaults to true based on our model change
    });
    const adminResult = await newAdmin.save();

    // Create AdminPassword document
    const salt = uniqueId();
    const hashedPassword = bcrypt.hashSync(salt + password);
    const newAdminPassword = new AdminPassword({
      user: adminResult._id,
      password: hashedPassword,
      salt: salt,
      emailVerified: true, // Assuming admin-created users are verified
    });
    await newAdminPassword.save();

    // Return success response (excluding password details)
    const adminObject = adminResult.toObject();
    // Use destructuring to exclude password and salt from the returned object
    const { password: removedPassword, salt: removedSalt, ...adminData } = adminObject;


    return res.status(201).json({ // 201 Created status
      success: true,
      result: adminData, // Send the object without password/salt
      message: 'Admin user created successfully.',
    });

  } catch (error) {
    console.error("Error creating admin user:", error);
    // More specific error handling could be added here
    if (error.name === 'ValidationError') {
       return res.status(400).json({
        success: false,
        result: null,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred while creating the admin user.',
      error: error.message,
    });
  }
};

// List all non-removed admin users
const listAdmins = async (req, res) => {
  try {
    // Find all admins that are not marked as removed
    // Exclude password details from the result using .select()
    // We don't need AdminPassword here, just the Admin details
    const admins = await Admin.find({ removed: false }).select('-password'); // Exclude password field if it existed directly on Admin

    if (!admins) {
      return res.status(404).json({ // 404 Not Found might be more appropriate if no users exist
        success: false,
        result: [],
        message: 'No admin users found.',
      });
    }

    return res.status(200).json({
      success: true,
      result: admins,
      message: 'Successfully retrieved admin users list.',
    });

  } catch (error) {
    console.error("Error listing admin users:", error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred while listing admin users.',
      error: error.message,
    });
  }
};

// Update admin user details (excluding password)
const updateAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, name, surname, role, enabled } = req.body;

    // Basic validation
    if (!userId || (!email && !name && role === undefined && enabled === undefined)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Missing user ID or update fields.',
      });
    }

    const admin = await Admin.findById(userId);
    if (!admin || admin.removed) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Admin user not found.',
      });
    }

    // Prevent changing the role of the 'owner'
    if (admin.role === 'owner' && role && role !== 'owner') {
       return res.status(403).json({ // 403 Forbidden
        success: false,
        result: null,
        message: "Cannot change the role of the 'owner' user.",
      });
    }

    // Prepare update object
    const updateData = {};
    if (email) updateData.email = email.toLowerCase();
    if (name) updateData.name = name;
    if (surname !== undefined) updateData.surname = surname; // Allow setting surname to empty string
    if (role && role !== 'owner') updateData.role = role; // Only update role if it's not 'owner'
    if (enabled !== undefined) updateData.enabled = enabled;

    // Check if email is being changed and if the new email already exists
    if (email && email.toLowerCase() !== admin.email) {
      const existingAdmin = await Admin.findOne({ email: email.toLowerCase(), removed: false, _id: { $ne: userId } });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'New email address is already in use.',
        });
      }
    }

    // Perform the update
    const updatedAdmin = await Admin.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation runs
    }).select('-password'); // Exclude password if it existed

    if (!updatedAdmin) {
       return res.status(404).json({
        success: false,
        result: null,
        message: 'Admin user not found after update attempt.',
      });
    }

    return res.status(200).json({
      success: true,
      result: updatedAdmin,
      message: 'Admin user updated successfully.',
    });

  } catch (error) {
    console.error("Error updating admin user:", error);
     if (error.name === 'ValidationError') {
       return res.status(400).json({
        success: false,
        result: null,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      result: null,
      message: 'An error occurred while updating the admin user.',
      error: error.message,
    });
  }
};


module.exports = {
  ...baseController, // Spread existing methods
  create: createAdmin,
  list: listAdmins,
  update: updateAdmin, // Add the new update method
};
