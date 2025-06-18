// Import the User model to interact with the users collection.
import User from "../models/user.js";
// Import the express-async-handler to handle exceptions in async routes.
import asyncHandler from 'express-async-handler';
// Import the token generation utility.
import generateToken from '../utils/generateToken.js';

// Create an empty object to attach our controller functions to.
const controller = {};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
controller.registerUser = asyncHandler(async (req, res) => {
  // Destructure user data from the request body.
  const { name, email, password, phone } = req.body; // Role is not taken from here for security

  // Check if a user with the provided email already exists in the database.
  const userExists = await User.findOne({ email });

  // If a user with that email is found,
  if (userExists) {
    // Respond with a 400 (Bad Request) status and throw an error.
    res.status(400);
    throw new Error('Email já cadastrado.'); // "Email already registered."
  }

  // If the email is unique, create a new user document.
  // The 'role' will default to 'user' as defined in the Mongoose schema.
  const user = await User.create({
    name,
    email,
    password, // The password will be automatically hashed by the pre-save hook in the model.
    phone,
  });

  // If the user was created successfully,
  if (user) {
    // Generate a JWT and set it in an httpOnly cookie.
    generateToken(res, user._id);
    // Respond with a 201 (Created) status and the new user's data (excluding the password).
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    // If creation fails for some reason, respond with a 400 status.
    res.status(400);
    throw new Error('Dados de usuário inválidos.'); // "Invalid user data."
  }
});

// @desc    Authenticate a user & get token (Login)
// @route   POST /api/users/login
// @access  Public
controller.loginUser = asyncHandler(async (req, res) => {
  // Destructure login credentials from the request body.
  const { email, password } = req.body;

  // Find the user by email. Use .select('+password') to explicitly include the password,
  // which is normally excluded by the schema's 'select: false'.
  const user = await User.findOne({ email }).select('+password');

  // Check if a user was found AND if the provided password matches the stored hashed password.
  // The 'comparePassword' method is a custom instance method defined on our UserSchema.
  if (user && (await user.comparePassword(password))) {
    // If credentials are valid, generate a token and send the cookie.
    generateToken(res, user._id);
    // Respond with a 200 (OK) status and the user's data.
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    // If credentials are not valid, respond with a 401 (Unauthorized) status.
    res.status(401);
    throw new Error('E-mail ou senha inválidos.'); // "Invalid email or password."
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private (though can be public)
controller.logoutUser = asyncHandler(async (req, res) => {
  // "Logs out" the user by sending a cookie with the same name ('jwt'),
  // but with empty content and an expiration date in the past.
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // Set expiration to a past date to invalidate it.
  });

  // Respond with a success message.
  res.status(200).json({ message: 'Logout realizado com sucesso.' }); // "Logout successful."
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
controller.getUserProfile = asyncHandler(async (req, res) => {
  // The 'protect' middleware already fetched the user and attached it to 'req.user'.
  // We don't need to find them again. We can just send back the data.
  const user = req.user;
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado.'); // "User not found."
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
controller.updateUserProfile = asyncHandler(async (req, res) => {
  // Find the user by the ID stored in the token (from the 'protect' middleware).
  const user = await User.findById(req.user._id);

  // If the user is found in the database,
  if (user) {
    // Update the user's fields with data from the request body.
    // If a field is not provided in the body, keep the existing value.
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    // The password is only updated if a new one is provided.
    // The pre-save hook in the User model will automatically hash it.
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Save the updated document.
    const updatedUser = await user.save();

    // Respond with the new user data.
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado.'); // "User not found."
  }
});

// @desc    Update user password
// @route   PUT /api/users/profile/password
// @access  Private
controller.updateUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  // Find the user and explicitly include their password for comparison.
  const user = await User.findById(req.user._id).select('+password');

  // Check if user exists and if the provided current password is correct.
  if (user && (await user.comparePassword(currentPassword))) {
    // If correct, set the new password. The pre-save hook will hash it.
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Senha atualizada com sucesso.' }); // "Password updated successfully."
  } else {
    // If the current password is wrong, respond with a 401 error.
    res.status(401);
    throw new Error('Senha atual inválida.'); // "Invalid current password."
  }
});


// --- ADMIN CONTROLLERS ---

// @desc    Get all users (Admin)
// @route   GET /api/users/admin/all
// @access  Private/Admin
controller.getAllUsersAdmin = asyncHandler(async (req, res) => {
  // Find all user documents in the database.
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc    Get user by ID (Admin)
// @route   GET /api/users/admin/:id
// @access  Private/Admin
controller.getUserByIdAdmin = asyncHandler(async (req, res) => {
  // Find a specific user by their ID, excluding their password from the result.
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado.'); // "User not found."
  }
});

// @desc    Update user (Admin)
// @route   PUT /api/users/admin/:id
// @access  Private/Admin
controller.updateUserAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.phone = req.body.phone || user.phone;
        
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } else {
        res.status(404);
        throw new Error('Usuário não encontrado.'); // "User not found."
    }
});


// @desc    Delete user (Admin)
// @route   DELETE /api/users/admin/:id
// @access  Private/Admin
controller.deleteUserAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    // A safety check to prevent an admin from deleting another admin.
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Não é possível deletar um usuário administrador.'); // "Cannot delete an admin user."
    }
    // If not an admin, proceed with deletion.
    await user.deleteOne();
    res.status(200).json({ message: 'Usuário deletado com sucesso.' }); // "User deleted successfully."
  } else {
    res.status(404);
    throw new Error('Usuário não encontrado.'); // "User not found."
  }
});

// @desc    Create a new user (Admin)
// @route   POST /api/users/admin/add
// @access  Private/Admin
controller.addUserAdmin = asyncHandler(async (req, res) => {
  // This function is similar to registerUser, but performed by an admin.
  const { name, email, password, phone, role } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Um usuário com este e-mail já existe.'); // "A user with this email already exists."
  }

  const user = await User.create({ name, email, password, phone, role });

  if (user) {
    // We don't generate a token here because the admin is creating the user, not logging in as them.
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Dados de usuário inválidos.'); // "Invalid user data."
  }
});

// Export the controller object.
export default controller;