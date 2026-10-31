const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Course title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Course description is required'],
            trim: true,
        },
        creator: {
            type: String,
            default: 'guest_user',
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        modules: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Module',
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Course', courseSchema);