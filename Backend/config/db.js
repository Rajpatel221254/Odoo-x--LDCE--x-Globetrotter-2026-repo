import mongoose from 'mongoose';

/**
 * Connects to MongoDB database using connection string from environment variables.
 * Handles successful connection and errors.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
