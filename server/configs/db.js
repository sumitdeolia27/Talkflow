import mongoose from 'mongoose';

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI is missing. Add it to server/.env before starting the server.');
    }

    mongoose.connection.on('connected', () => console.log('Database connected'));

    try {
        await mongoose.connect(mongoUri, { dbName: 'talkflow' });
    } catch (error) {
        throw new Error(`Database connection failed: ${error.message}`);
    }
}

export default connectDB
