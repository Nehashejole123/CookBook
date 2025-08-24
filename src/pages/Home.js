import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, handleApiError } from '../utils/api';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await api.getAllRecipes();
      setRecipes(response.data);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-icon">👨‍🍳</div>
          <div className="loading-text">Loading delicious recipes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">❌ {error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="hero-section">
        <span className="hero-icon">👨‍🍳</span>
        <h1 className="modern-title">Welcome to CookBook</h1>
        <p className="hero-text">
          Share your favorite recipes with our passionate culinary community! Create, share, and discover amazing dishes from fellow chefs around the world.
        </p>
        
        <Link to="/create" className="modern-btn modern-btn-accent" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
          <span>✨</span>
          Add New Recipe
        </Link>
      </div>

      <div className="recipe-grid">
        {recipes.map(recipe => (
          <Link key={recipe.id} to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none' }}>
            <div className="recipe-card">
              <img 
                src={recipe.image_url} 
                alt={recipe.title}
                className="recipe-image"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                }}
              />
              <div className="recipe-content">
                <h3 className="recipe-title">{recipe.title}</h3>
                <p className="recipe-description">{recipe.description}</p>
                <div className="recipe-meta">
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--primary-color)', 
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>🥘</span>
                    {recipe.ingredients?.length || 0} ingredients
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {recipes.length === 0 && (
        <div className="modern-card" style={{ textAlign: 'center', marginTop: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🍽️</div>
          <h3 className="modern-subtitle">No recipes yet!</h3>
          <p className="modern-text" style={{ 
            marginBottom: '2rem', 
            fontSize: '1.1rem',
            maxWidth: '400px',
            margin: '0 auto 2rem auto'
          }}>
            Be the first to share a delicious recipe with our community!
          </p>
          <Link to="/create" className="modern-btn modern-btn-primary" style={{ fontSize: '1.1rem' }}>
            <span>👨‍🍳</span>
            Create First Recipe
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
