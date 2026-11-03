const mongoose = require('mongoose');

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const mongoURI = process.env.MONGODB_URI || (isProduction ? '' : 'mongodb://127.0.0.1:27017/emblem_db');
  if (!mongoURI) throw new Error('MONGODB_URI is required in production.');
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database] MongoDB Connection Error: ${error.message}`);
    if (isProduction) throw error;
    return null;
  }
};

module.exports = connectDB;
