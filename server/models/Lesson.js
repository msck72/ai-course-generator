const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Lesson title is required'],
            trim: true,
        },
        module: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Module',
            required: true,
        },
        objectives: [
            {
                type: String,
            },
        ],
        content: [
            {
                type: mongoose.Schema.Types.Mixed,
                default: [],
            },
        ],
        isEnriched: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Lesson', lessonSchema);