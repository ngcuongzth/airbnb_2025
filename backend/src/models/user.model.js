const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const toJSON = require('../plugins/toJSON.plugin');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            private: true, // Will not be returned in queries by default
        },
        phone: {
            type: String,
            trim: true,
        },
        profileImageUrl: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        birthday: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
        languages: [String],
        emailVerified: {
            type: Boolean,
            default: false,
        },
        phoneVerified: {
            type: Boolean,
            default: false,
        },
        governmentIdVerified: {
            type: Boolean,
            default: false,
        },
        isSuperhost: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ['guest', 'host', 'admin'],
            default: 'guest',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt
    }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {mongoose.ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

// Method to check if password matches
userSchema.methods.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;