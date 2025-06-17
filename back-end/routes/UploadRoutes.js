// routes/uploadRoutes.js

import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

const createStorage = (folder) => {
  return multer.diskStorage({
    destination(req, file, cb) {
      const uploadPath = `public/img/${folder}/`;
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename(req, file, cb) {
      cb(null, `${folder.slice(0, -1)}-${Date.now()}${path.extname(file.originalname)}`);
    }
  });
};

const uploadCategories = multer({ storage: createStorage('categories') });
const uploadProducts = multer({ storage: createStorage('products') });

// Rota para upload de imagens de categorias
router.post('/categories', uploadCategories.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Nenhum arquivo enviado.');
  }
  res.status(201).json({
    message: 'Imagem enviada com sucesso',
    // Retorna o caminho parcial que será usado pelo front-end
    image: `/img/categories/${req.file.filename}`
  });
});

// Rota para upload de imagens de produtos
router.post('/products', uploadProducts.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Nenhum arquivo enviado.');
  }
  res.status(201).json({
    message: 'Imagem enviada com sucesso',
    image: `/img/products/${req.file.filename}`
  });
});

export default router;