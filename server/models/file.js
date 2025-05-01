import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    filename: String,
    fileUrl: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date
});

fileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export default mongoose.model('File', fileSchema);

