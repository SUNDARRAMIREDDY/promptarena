import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

async function testConnection() {
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', MONGODB_URI.replace(/\/\/.*:.*@/, '//****:****@')); // Hide credentials

    try {
        await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
        console.log('Successfully connected to MongoDB!');
        await mongoose.connection.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

testConnection();
