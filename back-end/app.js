// Import the Express framework, which is the foundation of our back-end application.
import express from "express";
// Import mongoose, an Object Data Modeling (ODM) library for MongoDB and Node.js.
import mongoose from "mongoose";
// Import cookie-parser, a middleware to parse cookies attached to the client request object.
import cookieParser from 'cookie-parser';
// Import all the modularized route files. Each file handles a specific resource.
import userRoutes from './routes/UserRoutes.js';
import productRoutes from './routes/ProductRoutes.js';
import categoryRoutes from './routes/CategoryRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';
import cardRoutes from './routes/CardRoutes.js';
import addressRoutes from './routes/AddressRoutes.js';
import uploadRoutes from './routes/UploadRoutes.js';
// Import cors, a middleware to enable Cross-Origin Resource Sharing.
import cors from 'cors';
// Import dotenv to load environment variables from a .env file into process.env.
import dotenv from 'dotenv';
// Import custom error handling middlewares.
import { notFound, errorHandler } from './middleware/ErrorMiddleware.js';
// Import the built-in 'path' module from Node.js to handle and transform file paths.
import path from 'path';

// Define the port number for the server to listen on.
const PORT = 3000;
// Define the connection string for the MongoDB Atlas database.
const connectionString = 'mongodb+srv://leoleonardomarangoni:inNfZbmV2Vf0cNd6@cluster0.eahyuw5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// Get the absolute path of the current project's root directory. Useful for serving static files.
const __dirname = path.resolve();

// Load environment variables from the .env file.
dotenv.config();
// Initialize the Express application.
const app = express();

// --- MIDDLEWARE CONFIGURATION ---

// Use the cors middleware. This is crucial for allowing the front-end (at a different origin) to communicate with the back-end.
app.use(cors({
  // Specifies the exact origin that is allowed to make requests.
  origin: 'http://localhost:5173',
  // Allows the front-end to send cookies along with its requests.
  credentials: true,
}));

// Use the built-in express.json() middleware to parse incoming requests with JSON payloads.
app.use(express.json());
// Use the built-in express.urlencoded() middleware to parse incoming requests with URL-encoded payloads.
app.use(express.urlencoded({ extended: true }));
// Use the cookie-parser middleware to parse cookies and populate req.cookies.
app.use(cookieParser());

// A simple custom logger middleware to log every incoming request to the console for debugging purposes.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  // next() passes control to the next middleware in the stack.
  next();
});

// Serve static files (like uploaded images) from the 'public' directory.
// path.join() creates a cross-platform-compatible absolute path to the public folder.
app.use(express.static(path.join(__dirname, 'public')));


// --- DATABASE CONNECTION ---

// Connect to the MongoDB database using the connection string.
mongoose.connect(connectionString)
  // If the connection is successful, log a confirmation message.
  .then(() => console.log('Conectado ao MongoDB Atlas!'))
  // If there's an error during connection, log the error.
  .catch(err => console.error('Erro ao conectar:', err));


// --- ROUTE DEFINITIONS ---

// A simple test route for the root URL.
app.get("/", (req, res) => {
  res.send("Home page");
});

// Mount the modularized routers on their respective base paths.
// Any request starting with '/api/users' will be handled by userRoutes.
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cards', cardRoutes);       
app.use('/api/addresses', addressRoutes);   
app.use('/api/upload', uploadRoutes);


// --- ERROR HANDLING MIDDLEWARE ---
// These must be placed AFTER all the other routes.

// Use the 'notFound' middleware to catch all requests for routes that don't exist (404).
app.use(notFound);
// Use the 'errorHandler' as the final, catch-all error handler to format all errors into a consistent JSON response.
app.use(errorHandler);


// --- SERVER INITIALIZATION ---

// Start the Express server and make it listen for incoming requests on the specified port.
app.listen(PORT, () => {
  console.log(`Rodando em http://localhost:${PORT}`);
}); 

// Export the 'app' instance. This is useful for testing purposes (e.g., with Supertest).
export default app;