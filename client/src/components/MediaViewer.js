import React, { useState } from 'react';
import './MediaViewer.css';

const MediaViewer = ({ image, video, videoType, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!image && !video) return null;

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="media-container">
        {image && (
          <img 
            src={image} 
            alt={title || 'Image'} 
            className="media-thumbnail"
            onClick={handleOpen}
            style={{ 
              cursor: 'pointer',
              maxWidth: '100%',
              maxHeight: '400px',
              borderRadius: '4px',
              display: 'block',
              margin: '15px 0'
            }}
          />
        )}
        {video && (
          <div 
            className="video-container"
            style={{ margin: '15px 0', position: 'relative' }}
          >
            {videoType === 'file' ? (
              <div style={{ position: 'relative' }}>
                <video 
                  src={video} 
                  controls 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '400px',
                    borderRadius: '4px',
                    display: 'block'
                  }}
                />
                <button
                  onClick={handleOpen}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  Fullscreen
                </button>
              </div>
            ) : (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
                <iframe
                  src={video}
                  title={title || 'Video content'}
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="media-modal" onClick={handleClose}>
          <div className="media-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="media-modal-close" onClick={handleClose}>×</button>
            {image && (
              <img 
                src={image} 
                alt={title || 'Image'} 
                className="media-modal-image"
              />
            )}
            {video && (
              <div className="media-modal-video">
                {videoType === 'file' ? (
                  <video 
                    src={video} 
                    controls 
                    autoPlay
                    style={{ 
                      maxWidth: '95vw',
                      maxHeight: '95vh'
                    }}
                  />
                ) : (
                  <iframe
                    src={video}
                    title={title || 'Video content'}
                    style={{ 
                      width: '90vw',
                      height: '90vh',
                      maxWidth: '1280px',
                      maxHeight: '720px',
                      border: 'none'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MediaViewer;

