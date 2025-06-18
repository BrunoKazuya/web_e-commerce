import mongoose from "mongoose";

// Define the schema for the Category collection.
const CategorySchema = new mongoose.Schema({
  // Define the 'name' field.
  name: {
    type: String,
    required: [true, 'O nome da categoria é obrigatório.'],
    unique: true, // Ensures each category name is unique.
    trim: true,
    minlength: [3, 'O nome da categoria deve ter no mínimo 3 caracteres.'],
    maxlength: [50, 'O nome da categoria pode ter no máximo 50 caracteres.']
  },
  // Define the 'slogan' field.
  slogan: {
    type: String,
    trim: true,
    maxlength: [100, 'O slogan pode ter no máximo 100 caracteres.']
  },
  // Define the 'slug' field, a URL-friendly version of the category name.
  slug: {
    type: String,
    unique: true, // Slugs must be unique for clean URLs.
    lowercase: true // Slugs are typically stored in lowercase.
  },
  // Define the 'image' field for the category's image filename.
  image: {
    type: String,
    default: 'no-image.jpg' // Default image if none is provided.
  }
}, {
  timestamps: true // Automatically add 'createdAt' and 'updatedAt'.
});

// Mongoose middleware that runs BEFORE a document is saved.
// This is used to automatically generate the 'slug' from the 'name'.
CategorySchema.pre('save', function(next) {
  // Only generate the slug if the 'name' field was modified (or is new).
  if (this.isModified('name')) {
    // Generate the slug by converting the name to lowercase, replacing spaces with hyphens,
    // and removing any non-alphanumeric characters (except hyphens).
    this.slug = this.name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')        // Remove all non-word chars except -
      .replace(/\-\-+/g, '-');         // Replace multiple - with single -
  }
  // Proceed to the next step in the save process.
  next();
});

// Create and export the Category model.
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default Category;