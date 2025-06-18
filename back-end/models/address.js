// Import mongoose to use its schema and model functionalities.
import mongoose from "mongoose";

// Define the schema for the Address collection.
const AddressSchema = new mongoose.Schema(
  {
    // Define the 'street' field.
    street: {
      type: String, // Data type is a string.
      required: [true, "O nome da rua é obrigatório."], // This field is mandatory.
      trim: true, // Automatically removes whitespace from the start and end.
      maxlength: [100, "O nome da rua pode ter no máximo 100 caracteres."], // Sets a maximum length.
    },
    // Define the 'number' field for the address.
    number: {
      type: String, // String is used to allow for values like "S/N" (No Number) or "100-A".
      required: [true, "O número é obrigatório."],
      trim: true,
      maxlength: [20, "O número pode ter no máximo 20 caracteres."],
    },
    // Define the 'complement' field (e.g., apartment number, block).
    complement: {
      type: String,
      trim: true,
      maxlength: [50, "O complemento pode ter no máximo 50 caracteres."],
    },
    // Define the 'district' field (neighborhood).
    district: {
      type: String,
      required: [true, "O bairro é obrigatório."],
      trim: true,
      maxlength: [50, "O bairro pode ter no máximo 50 caracteres."],
    },
    // Define the 'city' field.
    city: {
      type: String,
      required: [true, "A cidade é obrigatória."],
      trim: true,
      maxlength: [50, "A cidade pode ter no máximo 50 caracteres."],
    },
    // Define the 'state' field (UF in Brazil).
    state: {
      type: String,
      required: [true, "O estado (UF) é obrigatório."],
      trim: true,
      uppercase: true, // Automatically converts the state abbreviation to uppercase.
      minlength: [2, "O estado deve ter 2 caracteres (UF)."], // Enforces a 2-character length.
      maxlength: [2, "O estado deve ter 2 caracteres (UF)."],
    },
    // Define the 'cep' field (Brazilian postal code).
    cep: {
      type: String,
      required: [true, "O CEP é obrigatório."],
      // A custom validator for the CEP format.
      validate: {
        validator: function (v) {
          // Checks if the value matches the regex for XXXXX-XXX or XXXXXXXX.
          return /^\d{8}$/.test(v); // Validates the cleaned CEP (after the setter runs).
        },
        message: (props) => `${props.value} não é um CEP válido!`, // Custom error message.
      },
    },
    // Define the 'user' field, creating a relationship to the User model.
    user: {
      type: mongoose.Schema.Types.ObjectId, // The type is a MongoDB unique identifier.
      ref: "User", // This tells Mongoose this ID refers to a document in the 'User' collection.
      required: true,
      index: true, // An index improves performance when querying for a user's addresses.
    },
  },
  {
    // Schema options: automatically add 'createdAt' and 'updatedAt' fields.
    timestamps: true,
  }
);

// Defines a "setter" for the 'cep' path.
// This function runs automatically BEFORE the data is saved or validated.
AddressSchema.path("cep").set(function (cep) {
  // It removes all non-digit characters (`\D`) from the CEP string.
  // This ensures that '99999-999' is stored as '99999999' for data consistency.
  return cep.replace(/\D/g, "");
});

// Creates the Address model, using a pattern to prevent OverwriteModelError in development.
const Address = mongoose.models.Address || mongoose.model("Address", AddressSchema);

// Export the Address model.
export default Address;