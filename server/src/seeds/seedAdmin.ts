import mongoose from 'mongoose';
import User from '../models/User';
import env from '../config/env';

async function seedAdmin() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@homedecore.homes';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin account already exists: ${adminEmail}`);
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated user role to admin.');
      }
    } else {
      const newAdmin = await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: 'AdminPassword123!',
        role: 'admin',
        isEmailVerified: true,
      });
      console.log(`Created default Admin user: ${newAdmin.email}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
