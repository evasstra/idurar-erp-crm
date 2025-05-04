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
    const adminData = adminResult.toObject();
    delete adminData.password; // Ensure password details aren't sent back

    return res.status(201).json({ // 201 Created status
      success: true,
      result: adminData,
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


module.exports = {
  ...baseController, // Spread existing methods
  create: createAdmin, // Add the new create method
};
