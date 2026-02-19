import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import Submission from '../lib/models/submission';
import User from '../lib/models/user';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI not found');
        return;
    }

    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        console.log('Finding a user...');
        const user = await User.findOne();
        if (!user) {
            console.log('No user found in DB. Please register a user first.');
        } else {
            console.log('Found user:', user.email, 'ID:', user._id);

            console.log('Finding submissions for user...');
            const submissions = await Submission.find({ userId: user._id });
            console.log('Found', submissions.length, 'submissions');
        }

        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (err) {
        console.error('Error during diagnostic:', err);
    }
}

run();
