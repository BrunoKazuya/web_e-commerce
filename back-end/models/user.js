// Import mongoose, the library used to create and manage schemas and models for MongoDB.
import mongoose from "mongoose";
// Import bcryptjs, a library used to hash passwords for secure storage.
import bcrypt from "bcryptjs";

// Define the schema for the User collection.
const UserSchema = new mongoose.Schema(
  {
    // Define the 'name' field.
    name: {
      type: String, // The data type is a string.
      required: [true, "Nome é obrigatório"], // This field is mandatory. Provides a custom error message.
      trim: true, // Automatically removes whitespace from the start and end of the string.
      minlength: [3, "O nome precisa ter no mínimo 3 caracteres."], // Sets a minimum length for the name.
      maxlength: [50, "O nome pode ter no máximo 50 caracteres."], // Sets a maximum length.
    },
    // Define the 'email' field.
    email: {
      type: String, // The data type is a string.
      required: [true, "O campo e-mail é obrigatório."], // This field is mandatory.
      unique: true, // Ensures every user has a unique email address by creating a unique index in MongoDB.
      lowercase: true, // Automatically converts the email to lowercase before saving, preventing duplicates like 'Test@' and 'test@'.
      trim: true, // Removes whitespace.
      // Uses a regular expression to validate the email format.
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Por favor, insira um endereço de e-mail válido.", // Custom error message if the format is invalid.
      ],
    },
    // Define the 'password' field.
    password: {
      type: String, // The data type is a string.
      required: [true, "O campo senha é obrigatório."], // This field is mandatory.
      minlength: [8, "A senha deve ter no mínimo 8 caracteres."], // Enforces a minimum password length for security.
      select: false, // By default, this field will NOT be returned in queries (e.g., find()), for security.
    },
    // Define the 'phone' field.
    phone: {
      type: String, // The data type is a string.
      required: [true, "O telefone é obrigatório."], // This field is mandatory.
    },
    // Define the 'role' field to manage user permissions.
    role: {
      type: String, // The data type is a string.
      // 'enum' restricts the value of this field to be one of the strings in the 'values' array.
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} não é uma função válida.", // Custom error message for invalid roles.
      },
      default: "user", // If no role is provided, it will default to 'user'.
    },
    // A flag to deactivate accounts instead of hard deleting them (soft delete).
    isActive: {
      type: Boolean, // The data type is a boolean (true/false).
      default: true, // New users are active by default.
    },
  },
  {
    // Schema options object.
    // 'timestamps: true' automatically adds 'createdAt' and 'updatedAt' fields to the document.
    timestamps: true,
  }
);

// Mongoose middleware that runs BEFORE a document is saved (`.pre('save')`).
// This is used to hash the password before it's stored in the database.
UserSchema.pre("save", async function (next) {
  // Check if the password field was modified in this update. If not, do nothing and proceed.
  // This prevents re-hashing the password every time the user updates their email or name.
  if (!this.isModified("password")) {
    return next();
  }

  // Generate a 'salt' - a random string to be added to the password to make the hash more secure.
  const salt = await bcrypt.genSalt(10);
  // Hash the plain-text password with the salt and update the password field with the hash.
  this.password = await bcrypt.hash(this.password, salt);
  // Proceed to the next step in the save process.
  next();
});

// Defines a custom method on the user document instance to compare passwords.
UserSchema.methods.comparePassword = async function (candidatePassword) {
  // Uses bcrypt to securely compare the plain-text password provided by the user
  // with the hashed password stored in the database for this user instance.
  // Returns true if they match, false otherwise.
  return await bcrypt.compare(candidatePassword, this.password);
};

// Creates the User model.
// It checks if the model already exists (`mongoose.models.User`) before trying to create it.
// This prevents the 'OverwriteModelError' in development environments with hot-reloading.
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Export the User model to be used in other parts of the application (e.g., controllers).
export default User;