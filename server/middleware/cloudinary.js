const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const stream = require('stream');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Memory storage for multer (we'll upload to Cloudinary immediately)
const memoryStorage = multer.memoryStorage();

// File filters
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|webm|ogg|mov|avi/;
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (mp4, webm, ogg, mov, avi)'));
  }
};

// Multer configs
const uploadToMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB max
});

const uploadImage = uploadToMemory.single('image');
const uploadVideo = uploadToMemory.single('video');

// Helper function to upload buffer to Cloudinary using stream
const uploadToCloudinary = (buffer, folder, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folder,
      resource_type: resourceType,
    };

    if (resourceType === 'image') {
      uploadOptions.transformation = [{ width: 1200, crop: 'limit', quality: 'auto' }];
    }

    // Use upload_stream for better performance with large files
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error details:', {
            message: error.message,
            http_code: error.http_code,
            name: error.name
          });
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Pipe buffer to upload stream
    const bufferStream = new stream.PassThrough();
    bufferStream.on('error', reject);
    uploadStream.on('error', reject);
    
    bufferStream.pipe(uploadStream);
    bufferStream.end(buffer);
  });
};

module.exports = {
  uploadImage,
  uploadVideo,
  uploadToCloudinary,
  cloudinary,
};

