// Import Node.js built-in modules for handling file paths.
import path from 'path';
// Import the Express framework.
import express from 'express';
// Import multer, the middleware for handling multipart/form-data, used for file uploads.
import multer from 'multer';
// Import Node.js built-in File System module to interact with the file system.
import fs from 'fs';

// Initialize a new router object.
const router = express.Router();

// A factory function to create a multer storage configuration for a specific folder.
const createStorage = (folder) => {
  // Use diskStorage to save files directly to the server's disk.
  return multer.diskStorage({
    // 'destination' specifies the folder where files will be saved.
    destination(req, file, cb) {
      const uploadPath = `public/img/${folder}/`;
      // Check if the directory exists, and if not, create it recursively.
      fs.mkdirSync(uploadPath, { recursive: true });
      // The callback 'cb' signals that the destination is ready. null means no error.
      cb(null, uploadPath);
    },
    // 'filename' determines the name of the file inside the destination folder.
    filename(req, file, cb) {
      // Create a unique filename to prevent overwrites.
      // Format: folderName-timestamp.extension (e.g., categories-1678886400000.jpg)
      cb(null, `${folder.slice(0, -1)}-${Date.now()}${path.extname(file.originalname)}`);
    }
  });
};

// Create multer instances with specific storage configurations.
const uploadCategories = multer({ storage: createStorage('categories') });
const uploadProducts = multer({ storage: createStorage('products') });

// Defines the route for uploading category images.
// It uses the 'uploadCategories' middleware to process a single file from a field named 'image'.
router.post('/categories', uploadCategories.single('image'), (req, res) => {
  // Multer adds a 'file' object to the request object if the upload is successful.
  if (!req.file) {
    // If no file was uploaded, send a 400 Bad Request error.
    res.status(400);
    throw new Error('Nenhum arquivo enviado.'); // "No file sent."
  }
  // Respond with a 201 (Created) status, a success message, and the public path to the new image.
  res.status(201).json({
    message: 'Imagem enviada com sucesso',
    image: `/img/categories/${req.file.filename}`
  });
});

// Defines the route for uploading product images.
router.post('/products', uploadProducts.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Nenhum arquivo enviado.'); // "No file sent."
  }
  res.status(201).json({
    message: 'Imagem enviada com sucesso',
    image: `/img/products/${req.file.filename}`
  });
});

// Export the router.
export default router;