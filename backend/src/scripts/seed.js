const mongoose = require('mongoose');
const config = require('../config/config');
const { User } = require('../models');

const seedAdmin = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(config.mongoose.url, config.mongoose.options);
        console.log('Connected to database.');

        const adminExists = await User.findOne({ email: config.admin.email });

        if (adminExists) {
            console.log('Admin user already exists.');
            return;
        }

        await User.create({
            name: config.admin.name,
            email: config.admin.email,
            password: config.admin.password,
            role: 'admin',
            emailVerified: true, // Admins are trusted
        });

        console.log('Admin user created successfully.');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database.');
    }
};

seedAdmin();

