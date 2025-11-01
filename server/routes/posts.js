const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const { auth, adminAuth } = require('../middleware/auth');
const { uploadImage, uploadVideo, uploadToCloudinary } = require('../middleware/cloudinary');
const path = require('path');

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const posts = await Post.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload image endpoint (Cloudinary)
router.post('/upload-image', adminAuth, (req, res, next) => {
  uploadImage(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message || 'File upload failed' });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ message: 'Cloudinary is not fully configured. Please add all Cloudinary credentials to .env file.' });
    }

    console.log('Uploading image to Cloudinary:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      secret_length: process.env.CLOUDINARY_API_SECRET?.length,
      buffer_size: req.file.buffer.length,
      mimetype: req.file.mimetype
    });

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'abunearegawi/images', 'image');
    
    if (!result || !result.secure_url) {
      return res.status(500).json({ message: 'Cloudinary upload succeeded but no URL returned' });
    }
    
    res.json({ imageUrl: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error('Image upload error:', error);
    const errorMessage = error.message || 'Image upload failed';
    const errorDetails = {
      message: errorMessage,
      http_code: error.http_code || error.status || 'unknown',
      name: error.name || 'UnknownError'
    };
    
    // Log full error for debugging
    if (error.http_code) {
      console.error('Cloudinary error details:', {
        http_code: error.http_code,
        message: error.message,
        name: error.name
      });
    }
    
    res.status(500).json(errorDetails);
  }
});

// Upload video endpoint (Cloudinary)
router.post('/upload-video', adminAuth, (req, res, next) => {
  uploadVideo(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message || 'File upload failed' });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ message: 'Cloudinary is not fully configured. Please add all Cloudinary credentials to .env file.' });
    }

    console.log('Uploading video to Cloudinary:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      secret_length: process.env.CLOUDINARY_API_SECRET?.length,
      buffer_size: req.file.buffer.length,
      mimetype: req.file.mimetype
    });

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'abunearegawi/videos', 'video');
    
    if (!result || !result.secure_url) {
      return res.status(500).json({ message: 'Cloudinary upload succeeded but no URL returned' });
    }
    
    res.json({ videoUrl: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error('Video upload error:', error);
    const errorMessage = error.message || 'Video upload failed';
    const errorDetails = {
      message: errorMessage,
      http_code: error.http_code || error.status || 'unknown',
      name: error.name || 'UnknownError'
    };
    
    // Log full error for debugging
    if (error.http_code) {
      console.error('Cloudinary error details:', {
        http_code: error.http_code,
        message: error.message,
        name: error.name
      });
    }
    
    res.status(500).json(errorDetails);
  }
});

// Create post (admin only)
router.post('/', adminAuth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('type').isIn(['event', 'learning', 'bible', 'song']).withMessage('Invalid post type'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Creating post with data:', {
      title: req.body.title,
      type: req.body.type,
      hasImage: !!req.body.image,
      hasImages: Array.isArray(req.body.images) ? req.body.images.length : 0,
      hasVideo: !!req.body.video,
      hasVideos: Array.isArray(req.body.videos) ? req.body.videos.length : 0,
    });

    // Prepare post data
    const postData = {
      title: req.body.title?.trim(),
      content: req.body.content?.trim(),
      type: req.body.type || 'event',
      author: req.user._id,
    };

    // Handle single image (backward compatibility)
    if (req.body.image) {
      postData.image = req.body.image;
    }

    // Handle images array
    if (Array.isArray(req.body.images) && req.body.images.length > 0) {
      postData.images = req.body.images.filter(img => img && img.trim());
    }

    // Handle single video (backward compatibility)
    if (req.body.video) {
      postData.video = req.body.video;
      if (req.body.videoType) {
        postData.videoType = req.body.videoType;
      }
    }

    // Handle videos array
    if (Array.isArray(req.body.videos) && req.body.videos.length > 0) {
      postData.videos = req.body.videos.filter(v => v && v.url && v.url.trim()).map(v => ({
        url: v.url.trim(),
        videoType: v.videoType || 'file',
      }));
    }

    // Handle date and time fields
    if (req.body.eventDate) {
      postData.eventDate = new Date(req.body.eventDate);
    }
    if (req.body.eventEndDate) {
      postData.eventEndDate = new Date(req.body.eventEndDate);
    }
    if (req.body.location) {
      postData.location = req.body.location.trim();
    }
    if (req.body.timezone) {
      postData.timezone = req.body.timezone.trim();
    }

    const post = new Post(postData);
    
    await post.save();
    await post.populate('author', 'name email');
    
    console.log('Post created successfully:', {
      _id: post._id,
      title: post.title,
      type: post.type,
    });
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update post (admin only)
router.put('/:id', adminAuth, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
  body('type').optional().isIn(['event', 'learning', 'bible', 'song']).withMessage('Invalid post type'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Updating post:', req.params.id, 'with data:', {
      title: req.body.title,
      type: req.body.type,
      hasImage: !!req.body.image,
      hasImages: Array.isArray(req.body.images) ? req.body.images.length : 0,
      hasVideo: !!req.body.video,
      hasVideos: Array.isArray(req.body.videos) ? req.body.videos.length : 0,
    });

    // Prepare update data - only include defined fields
    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title.trim();
    if (req.body.content !== undefined) updateData.content = req.body.content.trim();
    if (req.body.type !== undefined) updateData.type = req.body.type;
    
    // Handle single image (backward compatibility)
    if (req.body.image !== undefined) updateData.image = req.body.image || null;
    
    // Handle images array
    if (req.body.images !== undefined) {
      updateData.images = Array.isArray(req.body.images) 
        ? req.body.images.filter(img => img && img.trim())
        : [];
    }
    
    // Handle single video (backward compatibility)
    if (req.body.video !== undefined) updateData.video = req.body.video || null;
    if (req.body.videoType !== undefined) updateData.videoType = req.body.videoType || null;
    
    // Handle videos array
    if (req.body.videos !== undefined) {
      updateData.videos = Array.isArray(req.body.videos)
        ? req.body.videos.filter(v => v && v.url && v.url.trim()).map(v => ({
            url: v.url.trim(),
            videoType: v.videoType || 'file',
          }))
        : [];
    }

    // Handle date and time fields
    if (req.body.eventDate !== undefined) {
      updateData.eventDate = req.body.eventDate ? new Date(req.body.eventDate) : null;
    }
    if (req.body.eventEndDate !== undefined) {
      updateData.eventEndDate = req.body.eventEndDate ? new Date(req.body.eventEndDate) : null;
    }
    if (req.body.location !== undefined) {
      updateData.location = req.body.location ? req.body.location.trim() : null;
    }
    if (req.body.timezone !== undefined) {
      updateData.timezone = req.body.timezone ? req.body.timezone.trim() : 'UTC';
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    console.log('Post updated successfully:', {
      _id: post._id,
      title: post.title,
      type: post.type,
    });
    
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete post (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

