

import mongoose from 'mongoose';

export async function connectDB() {

    const baseUrl = 'mongodb://localhost:8000/applications'
  await mongoose.connect( baseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');
}