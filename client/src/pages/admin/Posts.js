import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import MediaViewer from '../../components/MediaViewer';
import './Posts.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const SERVER_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5001';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'event',
    image: '', // For backward compatibility
    images: [], // Array of image URLs
    video: '', // For backward compatibility
    videos: [], // Array of {url, videoType}
    videoType: 'file',
    youtubeUrl: '',
    vimeoUrl: '',
    eventDate: '',
    eventEndDate: '',
    location: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Form field changed:', { name, value });
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        alert('Image upload failed: Server returned invalid response');
        setUploadingImage(false);
        return;
      }

      const data = await response.json();
      if (response.ok) {
        // Cloudinary returns the full URL directly
        // Add to images array
        setFormData(prevData => ({
          ...prevData,
          images: [...(prevData.images || []), data.imageUrl],
          image: data.imageUrl, // Also set single image for backward compatibility
        }));
        alert('Image uploaded successfully!');
      } else {
        alert('Image upload failed: ' + (data.message || data.details || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error instanceof SyntaxError) {
        alert('Image upload failed: Server error. Please check server logs.');
      } else {
        alert('Error uploading image: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setUploadingImage(false);
      // Reset file input to allow re-uploading same file
      e.target.value = '';
    }
  };

  const handleVideoChange = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.target.files[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('video', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts/upload-video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        alert('Video upload failed: Server returned invalid response');
        setUploadingVideo(false);
        return;
      }

      const data = await response.json();
      if (response.ok) {
        // Cloudinary returns the full URL directly
        // Add to videos array
        setFormData(prevData => ({
          ...prevData,
          videos: [...(prevData.videos || []), { url: data.videoUrl, videoType: 'file' }],
          video: data.videoUrl, // Also set single video for backward compatibility
          videoType: 'file',
        }));
        alert('Video uploaded successfully!');
      } else {
        alert('Video upload failed: ' + (data.message || data.details || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      if (error instanceof SyntaxError) {
        alert('Video upload failed: Server error. Please check server logs.');
      } else {
        alert('Error uploading video: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setUploadingVideo(false);
      // Reset file input to allow re-uploading same file
      e.target.value = '';
    }
  };

  const handleVideoTypeChange = (e) => {
    const videoType = e.target.value;
    setFormData({
      ...formData,
      videoType,
      video: videoType === 'youtube' ? formData.youtubeUrl : videoType === 'vimeo' ? formData.vimeoUrl : formData.video,
      youtubeUrl: '',
      vimeoUrl: '',
    });
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const extractVimeoId = (url) => {
    const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/)|(video\/)|)([0-9]+)/;
    const match = url.match(regExp);
    return match ? match[6] : null;
  };

  const handleYouTubeUrlChange = (e) => {
    const url = e.target.value;
    const videoId = extractYouTubeId(url);
    if (videoId) {
      setFormData({
        ...formData,
        youtubeUrl: url,
        video: `https://www.youtube.com/embed/${videoId}`,
      });
    } else {
      setFormData({ ...formData, youtubeUrl: url, video: url });
    }
  };

  const handleVimeoUrlChange = (e) => {
    const url = e.target.value;
    const videoId = extractVimeoId(url);
    const embedUrl = videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    setFormData({
      ...formData,
      vimeoUrl: url,
      video: embedUrl,
    });
  };

  const addVideoUrl = () => {
    const videoUrl = formData.video || formData.youtubeUrl || formData.vimeoUrl;
    if (!videoUrl) {
      alert('Please enter a video URL or upload a video file');
      return;
    }

    const videoType = formData.videoType || 'file';
    setFormData(prevData => ({
      ...prevData,
      videos: [...(prevData.videos || []), { url: videoUrl, videoType }],
      video: videoUrl,
      youtubeUrl: '',
      vimeoUrl: '',
    }));
    alert('Video added!');
  };

  const removeImage = (index) => {
    setFormData(prevData => {
      const newImages = [...(prevData.images || [])];
      newImages.splice(index, 1);
      return {
        ...prevData,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : '', // Set first image as single image
      };
    });
  };

  const removeVideo = (index) => {
    setFormData(prevData => {
      const newVideos = [...(prevData.videos || [])];
      newVideos.splice(index, 1);
      return {
        ...prevData,
        videos: newVideos,
        video: newVideos.length > 0 ? newVideos[0].url : '', // Set first video as single video
        videoType: newVideos.length > 0 ? newVideos[0].videoType : 'file',
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get the type from the select element directly to ensure it's correct
      const typeSelect = e.target.querySelector('select[name="type"]');
      const selectedType = typeSelect ? typeSelect.value : (formData.type || 'event');
      
      // Prepare submit data - only include fields that have values
      const submitData = {
        title: (formData.title || '').trim(),
        content: (formData.content || '').trim(),
        type: selectedType, // Use type from select element
      };

      // Validate required fields
      if (!submitData.title) {
        alert('Title is required');
        return;
      }
      if (!submitData.content) {
        alert('Content is required');
        return;
      }
      if (!submitData.type || !['event', 'learning', 'bible', 'song'].includes(submitData.type)) {
        alert('Please select a valid post type');
        return;
      }

      // Handle images - prioritize array, fallback to single
      if (formData.images && formData.images.length > 0) {
        submitData.images = formData.images.filter(img => img && img.trim());
      } else if (formData.image) {
        submitData.image = formData.image;
      }

      // Handle videos - prioritize array, fallback to single
      if (formData.videos && formData.videos.length > 0) {
        submitData.videos = formData.videos.filter(v => v && v.url && v.url.trim());
      } else if (formData.video) {
        submitData.video = formData.video;
        submitData.videoType = formData.videoType || 'file';
      }

      // Handle date and time fields
      if (formData.eventDate) {
        submitData.eventDate = formData.eventDate;
      }
      if (formData.eventEndDate) {
        submitData.eventEndDate = formData.eventEndDate;
      }
      if (formData.location) {
        submitData.location = formData.location.trim();
      }
      if (formData.timezone) {
        submitData.timezone = formData.timezone.trim();
      }

      console.log('Submitting post data:', submitData);
      console.log('Form data state:', formData);

      if (editingPost) {
        await api.put(`/posts/${editingPost._id}`, submitData);
      } else {
        await api.post('/posts', submitData);
      }
      setShowForm(false);
      setEditingPost(null);
      setFormData({ 
        title: '', 
        content: '', 
        type: 'event', 
        image: '', 
        images: [],
        video: '', 
        videos: [],
        videoType: 'file', 
        youtubeUrl: '', 
        vimeoUrl: '',
        eventDate: '',
        eventEndDate: '',
        location: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      });
      loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || error.message || 'Error saving post';
      alert(errorMessage);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    // Get all images
    const allImages = post.images && post.images.length > 0 
      ? post.images 
      : (post.image ? [post.image] : []);
    
    // Get all videos
    const allVideos = post.videos && post.videos.length > 0
      ? post.videos
      : (post.video ? [{ url: post.video, videoType: post.videoType || 'file' }] : []);

    // Format dates for input fields (YYYY-MM-DDTHH:mm)
    const formatDateTime = (date) => {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setFormData({
      title: post.title || '',
      content: post.content || '',
      type: post.type || 'event',
      image: allImages.length > 0 ? allImages[0] : '',
      images: allImages,
      video: allVideos.length > 0 ? allVideos[0].url : '',
      videos: allVideos,
      videoType: allVideos.length > 0 ? allVideos[0].videoType : 'file',
      youtubeUrl: '',
      vimeoUrl: '',
      eventDate: formatDateTime(post.eventDate),
      eventEndDate: formatDateTime(post.eventEndDate),
      location: post.location || '',
      timezone: post.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${id}`);
        loadPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
    setFormData({ 
      title: '', 
      content: '', 
      type: 'event', 
      image: '', 
      images: [],
      video: '', 
      videos: [],
      videoType: 'file', 
      youtubeUrl: '', 
      vimeoUrl: '',
      eventDate: '',
      eventEndDate: '',
      location: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-posts">
      <div className="container">
        <div className="page-header">
          <h1>Manage Posts</h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Create New Post'}
          </button>
        </div>

        {showForm && (
          <div className="post-form card">
            <h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  name="type"
                  value={formData.type || 'event'}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                >
                  <option value="event">Event</option>
                  <option value="learning">Learning</option>
                  <option value="bible">Bible</option>
                  <option value="song">Song</option>
                </select>
                <p style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                  Selected type: <strong>{formData.type || 'event'}</strong>
                </p>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  name="content"
                  value={formData.content || ''}
                  onChange={handleChange}
                  required
                  rows="10"
                />
              </div>

              <div className="form-group">
                <label>Event Date & Time</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'normal' }}>
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="eventDate"
                      value={formData.eventDate || ''}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'normal' }}>
                      End Date & Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="eventEndDate"
                      value={formData.eventEndDate || ''}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'normal' }}>
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleChange}
                      placeholder="e.g., Church Hall, Online"
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'normal' }}>
                      Timezone
                    </label>
                    <select
                      name="timezone"
                      value={formData.timezone || 'UTC'}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                    >
                      <option value="UTC">UTC</option>
                      <option value="Europe/Amsterdam">Europe/Amsterdam (Netherlands)</option>
                      <option value="Europe/London">Europe/London (UK)</option>
                      <option value="Europe/Paris">Europe/Paris (France)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                      <option value="Asia/Dubai">Asia/Dubai (UAE)</option>
                      <option value="Asia/Shanghai">Asia/Shanghai (China)</option>
                      <option value="Australia/Sydney">Australia/Sydney</option>
                    </select>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  Date and time are stored in international ISO format. Select your timezone for proper display.
                </p>
              </div>

              <div className="form-group">
                <label>Images {formData.images && formData.images.length > 0 && `(${formData.images.length})`}</label>
                {formData.images && formData.images.length > 0 && (
                  <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                    {formData.images.map((img, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img 
                          src={img} 
                          alt={`Preview ${index + 1}`} 
                          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', display: 'block' }}
                        />
                        <button 
                          type="button" 
                          onClick={() => removeImage(index)} 
                          className="btn btn-secondary btn-sm"
                          style={{ 
                            position: 'absolute', 
                            top: '5px', 
                            right: '5px',
                            background: 'rgba(255,0,0,0.8)',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    onClick={(e) => e.stopPropagation()}
                    disabled={uploadingImage}
                    style={{ display: 'block', marginBottom: '10px' }}
                  />
                  {uploadingImage && (
                    <p style={{ color: '#007bff', fontStyle: 'italic' }}>
                      ⏳ Uploading image... Please wait
                    </p>
                  )}
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    You can upload multiple images. Click "Choose File" again to add more.
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label>Videos {formData.videos && formData.videos.length > 0 && `(${formData.videos.length})`}</label>
                {formData.videos && formData.videos.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    {formData.videos.map((vid, index) => (
                      <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', position: 'relative' }}>
                        {vid.videoType === 'file' ? (
                          <video 
                            src={vid.url} 
                            controls 
                            style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '10px' }}
                          />
                        ) : vid.videoType === 'youtube' || vid.videoType === 'vimeo' ? (
                          <iframe
                            src={vid.url}
                            width="100%"
                            height="200"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ marginBottom: '10px', borderRadius: '4px' }}
                          ></iframe>
                        ) : null}
                        <button 
                          type="button" 
                          onClick={() => removeVideo(index)} 
                          className="btn btn-secondary btn-sm"
                          style={{ 
                            background: 'rgba(255,0,0,0.8)',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Remove Video
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <select
                    name="videoType"
                    value={formData.videoType}
                    onChange={handleVideoTypeChange}
                    style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
                  >
                    <option value="file">Upload Video File</option>
                    <option value="youtube">YouTube URL</option>
                    <option value="vimeo">Vimeo URL</option>
                  </select>
                  {formData.videoType === 'file' && (
                    <div>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        onClick={(e) => e.stopPropagation()}
                        disabled={uploadingVideo}
                        style={{ display: 'block', marginBottom: '10px' }}
                      />
                      {uploadingVideo && (
                        <p style={{ color: '#007bff', fontStyle: 'italic' }}>
                          ⏳ Uploading video... This may take a moment
                        </p>
                      )}
                    </div>
                  )}
                  {formData.videoType === 'youtube' && (
                    <div>
                      <input
                        type="url"
                        placeholder="Enter YouTube URL"
                        value={formData.youtubeUrl || ''}
                        onChange={handleYouTubeUrlChange}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                      />
                      <button 
                        type="button" 
                        onClick={addVideoUrl}
                        className="btn btn-secondary btn-sm"
                        style={{ marginBottom: '10px' }}
                      >
                        Add YouTube Video
                      </button>
                    </div>
                  )}
                  {formData.videoType === 'vimeo' && (
                    <div>
                      <input
                        type="url"
                        placeholder="Enter Vimeo URL"
                        value={formData.vimeoUrl || ''}
                        onChange={handleVimeoUrlChange}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                      />
                      <button 
                        type="button" 
                        onClick={addVideoUrl}
                        className="btn btn-secondary btn-sm"
                        style={{ marginBottom: '10px' }}
                      >
                        Add Vimeo Video
                      </button>
                    </div>
                  )}
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    You can upload/add multiple videos. Upload or add URL, then do it again to add more.
                  </p>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="posts-list">
          {posts.length === 0 ? (
            <p className="no-posts">No posts found</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="post-card card">
                <div className="post-header">
                  <span className="post-type">{post.type}</span>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <MediaViewer 
                  image={post.image}
                  video={post.video}
                  videoType={post.videoType}
                  title={post.title}
                />
                <div className="post-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
