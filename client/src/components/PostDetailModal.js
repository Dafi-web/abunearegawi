import React, { useState } from 'react';
import MediaViewer from './MediaViewer';
import './PostDetailModal.css';

const PostDetailModal = ({ post, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);

  if (!post) return null;

  // Get all images - support both single image and images array
  const allImages = post.images && post.images.length > 0 
    ? post.images 
    : (post.image ? [post.image] : []);

  // Get all videos - support both single video and videos array
  const allVideos = post.videos && post.videos.length > 0
    ? post.videos.map(v => ({ url: v.url, videoType: v.videoType || 'file' }))
    : (post.video ? [{ url: post.video, videoType: post.videoType || 'file' }] : []);

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setShowFullscreenImage(true);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <div className="post-detail-modal-overlay" onClick={onClose}>
        <div className="post-detail-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="post-detail-close-btn" onClick={onClose}>×</button>
          
          <div className="post-detail-header">
            <span className="post-detail-type">{post.type}</span>
            <span className="post-detail-date">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <h1 className="post-detail-title">{post.title}</h1>
          
          {post.author && (
            <p className="post-detail-author">By {post.author.name}</p>
          )}

          {(post.eventDate || post.location) && (
            <div className="post-detail-event-info">
              {post.eventDate && (
                <div className="event-date-time">
                  <strong>📅 Date & Time:</strong>{' '}
                  {new Date(post.eventDate).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: post.timezone || 'UTC'
                  })}
                  {post.eventEndDate && (
                    <span>
                      {' - '}
                      {new Date(post.eventEndDate).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: post.timezone || 'UTC'
                      })}
                    </span>
                  )}
                  {post.timezone && post.timezone !== 'UTC' && (
                    <span className="timezone-info"> ({post.timezone})</span>
                  )}
                </div>
              )}
              {post.location && (
                <div className="event-location">
                  <strong>📍 Location:</strong> {post.location}
                </div>
              )}
            </div>
          )}

          {allImages.length > 0 && (
            <div className="post-detail-images-gallery">
              <h3>Images ({allImages.length})</h3>
              <div className="images-grid">
                {allImages.map((img, index) => (
                  <div key={index} className="image-thumbnail-wrapper">
                    <img
                      src={img}
                      alt={`${post.title} - Image ${index + 1}`}
                      className="image-thumbnail"
                      onClick={() => handleImageClick(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="post-detail-content">
            <h3>Description</h3>
            <p>{post.content}</p>
          </div>

          {allVideos.length > 0 && (
            <div className="post-detail-videos">
              <h3>Videos ({allVideos.length})</h3>
              {allVideos.map((vid, index) => (
                <div key={index} className="video-item" style={{ marginBottom: '20px' }}>
                  <MediaViewer
                    video={vid.url}
                    videoType={vid.videoType}
                    title={`${post.title} - Video ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Single image/video for backward compatibility */}
          {!allImages.length && !allVideos.length && (post.image || post.video) && (
            <div className="post-detail-media">
              <MediaViewer
                image={post.image}
                video={post.video}
                videoType={post.videoType}
                title={post.title}
              />
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {showFullscreenImage && allImages.length > 0 && (
        <div className="fullscreen-image-viewer" onClick={() => setShowFullscreenImage(false)}>
          <button className="fullscreen-close-btn" onClick={() => setShowFullscreenImage(false)}>×</button>
          <button className="fullscreen-nav-btn prev-btn" onClick={handlePrevImage}>‹</button>
          <button className="fullscreen-nav-btn next-btn" onClick={handleNextImage}>›</button>
          <div className="fullscreen-image-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={allImages[currentImageIndex]}
              alt={`${post.title} - Image ${currentImageIndex + 1}`}
              className="fullscreen-image"
            />
            <div className="fullscreen-image-counter">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetailModal;

