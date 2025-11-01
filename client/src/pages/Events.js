import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import PostDetailModal from '../components/PostDetailModal';
import './Events.css';

const Events = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    loadPosts();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPosts = async () => {
    try {
      const endpoint = filter === 'all' ? '/posts' : `/posts?type=${filter}`;
      const response = await api.get(endpoint);
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  // Get first image for card display
  const getFirstImage = (post) => {
    if (post.images && post.images.length > 0) {
      return post.images[0];
    }
    return post.image || null;
  };

  if (loading) {
    return <div className="loading">{t('events.loading')}</div>;
  }

  return (
    <div className="events-page">
      <div className="container">
        <h1>{t('events.title')}</h1>
        <div className="filter-tabs">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            {t('events.all')}
          </button>
          <button
            className={filter === 'event' ? 'active' : ''}
            onClick={() => setFilter('event')}
          >
            {t('events.event')}
          </button>
          <button
            className={filter === 'learning' ? 'active' : ''}
            onClick={() => setFilter('learning')}
          >
            {t('events.learning')}
          </button>
          <button
            className={filter === 'bible' ? 'active' : ''}
            onClick={() => setFilter('bible')}
          >
            {t('events.bible')}
          </button>
          <button
            className={filter === 'song' ? 'active' : ''}
            onClick={() => setFilter('song')}
          >
            {t('events.song')}
          </button>
        </div>
        <div className="posts-grid">
          {posts.length === 0 ? (
            <p className="no-posts">{t('events.noPosts')}</p>
          ) : (
            posts.map((post) => {
              const firstImage = getFirstImage(post);
              return (
                <div key={post._id} className="post-card-grid">
                  <div className="post-card-header">
                    <span className="post-type-badge">{post.type}</span>
                    <span className="post-date-small">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {firstImage && (
                    <div className="post-card-image">
                      <img
                        src={firstImage}
                        alt={post.title}
                        onClick={() => handleViewDetails(post)}
                      />
                    </div>
                  )}
                  <div className="post-card-body">
                    <h3 className="post-card-title">{post.title}</h3>
                    {post.eventDate && (
                      <p className="post-event-date">
                        📅 {new Date(post.eventDate).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: post.timezone || 'UTC'
                        })}
                        {post.eventEndDate && (
                          <span> - {new Date(post.eventEndDate).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: post.timezone || 'UTC'
                          })}</span>
                        )}
                      </p>
                    )}
                    {post.location && (
                      <p className="post-event-location">
                        📍 {post.location}
                      </p>
                    )}
                    <p className="post-card-content">
                      {post.content.length > 100 
                        ? post.content.substring(0, 100) + '...' 
                        : post.content}
                    </p>
                    {post.images && post.images.length > 1 && (
                      <p className="post-image-count">
                        📷 {post.images.length} images
                      </p>
                    )}
                    {post.videos && post.videos.length > 0 && (
                      <p className="post-video-count">
                        🎥 {post.videos.length} video{post.videos.length > 1 ? 's' : ''}
                      </p>
                    )}
                    <button
                      className="btn-view-details"
                      onClick={() => handleViewDetails(post)}
                    >
                      {t('events.viewDetails')}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Events;
