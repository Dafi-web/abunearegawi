import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import MediaViewer from '../components/MediaViewer';
import './Home.css';

const Home = () => {
  const { t } = useLanguage();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll-to-top button when user scrolls down more than 300px
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadData = async () => {
    try {
      const [eventsRes, postsRes] = await Promise.all([
        api.get('/posts?type=event'),
        api.get('/posts?limit=3'),
      ]);
      
      setFeaturedEvents(eventsRes.data.slice(0, 3));
      setRecentPosts(postsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">{t('home.loading')}</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-logo">
            <img 
              src="https://github.com/Dafi-web/logos/blob/main/c.jpeg?raw=true" 
              alt="Abune Aregawi Tigrayans Orthodox Church Logo" 
            />
          </div>
          <h1>{t('home.welcome')}</h1>
          <p>{t('home.joinUs')}</p>
          <div className="hero-buttons">
            <Link to="/events" className="btn btn-primary">{t('home.viewEvents')}</Link>
            <Link to="/membership" className="btn btn-secondary">{t('home.becomeMember')}</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-card">
              <h3>{t('home.events')}</h3>
              <p>{t('home.stayUpdated')}</p>
              <Link to="/events" className="btn btn-primary">{t('home.viewEvents')}</Link>
            </div>
            <div className="feature-card">
              <h3>{t('home.calendar')}</h3>
              <p>{t('home.checkSchedule')}</p>
              <Link to="/calendar" className="btn btn-primary">{t('home.viewCalendar')}</Link>
            </div>
            <div className="feature-card">
              <h3>{t('home.donate')}</h3>
              <p>{t('home.supportChurch')}</p>
              <Link to="/donate" className="btn btn-primary">{t('home.donateNow')}</Link>
            </div>
          </div>
        </div>
      </section>

      {featuredEvents.length > 0 && (
        <section className="featured-events">
          <div className="container">
            <h2>{t('home.featuredEvents')}</h2>
            <div className="events-grid">
              {featuredEvents.map((event) => (
                <div key={event._id} className="card">
                  <MediaViewer 
                    image={event.image}
                    video={event.video}
                    videoType={event.videoType}
                    title={event.title}
                  />
                  <h3>{event.title}</h3>
                  <p>{event.content.substring(0, 150)}...</p>
                  <Link to={`/events/${event._id}`} className="btn btn-primary">
                    {t('home.readMore')}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {recentPosts.length > 0 && (
        <section className="recent-posts">
          <div className="container">
            <h2>{t('home.recentUpdates')}</h2>
            <div className="posts-grid">
              {recentPosts.map((post) => (
                <div key={post._id} className="card">
                  <MediaViewer 
                    image={post.image}
                    video={post.video}
                    videoType={post.videoType}
                    title={post.title}
                  />
                  <span className="post-type">{post.type}</span>
                  <h3>{post.title}</h3>
                  <p>{post.content.substring(0, 100)}...</p>
                  <Link to={`/posts/${post._id}`} className="btn btn-secondary">
                    {t('home.readMore')}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="6" y1="15" x2="18" y2="15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Home;

