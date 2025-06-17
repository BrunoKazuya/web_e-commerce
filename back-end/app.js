import express from "express";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import userRoutes from './routes/UserRoutes.js';
import productRoutes from './routes/ProductRoutes.js';
import categoryRoutes from './routes/CategoryRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';
import cardRoutes from './routes/CardRoutes.js';
import addressRoutes from './routes/AddressRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware/ErrorMiddleware.js';
import uploadRoutes from './routes/UploadRoutes.js';
import path from 'path';

const PORT = 3000;
const connectionString = 'mongodb+srv://leoleonardomarangoni:inNfZbmV2Vf0cNd6@cluster0.eahyuw5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const __dirname = path.resolve();

dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // A origem exata do seu front-end
  credentials: true, // Permite que o front-end envie cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(connectionString)
  .then(() => console.log('Conectado ao MongoDB Atlas!'))
  .catch(err => console.error('Erro ao conectar:', err));

app.get("/", (req, res) => {
  res.send("Home page");
});
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cards', cardRoutes);         
app.use('/api/addresses', addressRoutes);  
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Rodando em http://localhost:${PORT}`);
}); 

export default app; 