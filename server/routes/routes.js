import express from 'express';
import File from '../models/file.js'; // Path to your File model
import multer from 'multer'; // Assuming you're using multer for file upload

const router = express.Router();

// Set up multer for file upload (you can customize it as per your requirements)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Retrieve expiration time (in hours) from the request body (or set a default)
        const expirationPeriod = req.body.expirationPeriod || 24; // Default 24 hours
        const expirationDate = new Date(Date.now() + expirationPeriod * 60 * 60 * 1000); // Expiration time in milliseconds

        // Create a new file record
        const file = new File({
            filename: req.file.originalname,
            fileUrl: `uploads/${req.file.filename}`, // Assuming the file URL is this
            expiresAt: expirationDate
        });

        // Save the file record
        await file.save();

        res.status(200).json({
            message: 'File uploaded successfully!',
            fileUrl: file.fileUrl,
            expiresAt: file.expiresAt
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Server Error');
    }
});

export default router;
