import mongoose from 'mongoose';

/**
 * Establishes a connection to the MongoDB database.
 * @returns {Promise<boolean>} True if connection succeeded, false otherwise.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    return false;
  }
};

export default connectDB;
