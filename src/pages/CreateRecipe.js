import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, handleApiError } from '../utils/api';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    image_url: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.ingredients || !formData.instructions) {
      alert('Please fill in all required fields! 📝');
      return;
    }

    setLoading(true);
    try {
      const recipeData = {
        ...formData,
        ingredients: formData.ingredients.split('\n').filter(item => item.trim()),
        instructions: formData.instructions.split('\n').filter(item => item.trim()),
        image_url: formData.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
      };

      const response = await api.createRecipe(recipeData);
      navigate(`/recipe/${response.data.id}`);
    } catch (error) {
      alert(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Link to="/" className="modern-btn modern-btn-outline">
        <span>←</span>
        Back to Home
      </Link>
      
      <div className="hero-section" style={{ marginTop: '2rem' }}>
        <span className="hero-icon">👨‍🍳</span>
        <h1 className="modern-title" style={{ marginBottom: '1rem' }}>Create New Recipe</h1>
        <p className="hero-text">
          Share your favorite recipe with the CookBook community! Fill in the details below and let your culinary creativity shine.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="modern-form">
        <div className="form-group">
          <label className="form-label">Recipe Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Grandma's Secret Pancakes"
            className="modern-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Tell us about your recipe. What makes it special?"
            className="modern-textarea"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Image URL (optional)</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
            placeholder="https://example.com/your-recipe-photo.jpg"
            className="modern-input"
          />
          <small className="modern-text" style={{ 
            fontSize: '0.875rem', 
            color: 'var(--text-light)', 
            display: 'block', 
            marginTop: '0.5rem' 
          }}>
            📸 Add a link to a photo of your finished dish!
          </small>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="ingredient-list">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🥘</span>
                Ingredients *
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                placeholder="1 cup flour&#10;2 eggs&#10;1 cup milk&#10;1 tsp salt"
                className="modern-textarea"
                rows="8"
                required
              />
              <small className="modern-text" style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-light)', 
                display: 'block', 
                marginTop: '0.5rem' 
              }}>
                📝 Write each ingredient on a new line
              </small>
            </div>
          </div>

          <div className="instruction-list">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>👨‍🍳</span>
                Instructions *
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                placeholder="Mix all dry ingredients in a bowl&#10;Add wet ingredients slowly&#10;Cook on medium heat for 3-4 minutes&#10;Flip and cook for 2 more minutes"
                className="modern-textarea"
                rows="8"
                required
              />
              <small className="modern-text" style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-light)', 
                display: 'block', 
                marginTop: '0.5rem' 
              }}>
                📋 Write each step on a new line
              </small>
            </div>
          </div>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem', 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center', 
          flexWrap: 'wrap' 
        }}>
          <button 
            type="submit" 
            className="modern-btn modern-btn-accent"
            disabled={loading}
            style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
          >
            <span>{loading ? '⏳' : '✨'}</span>
            {loading ? 'Creating...' : 'Create Recipe'}
          </button>
          <Link to="/" className="modern-btn modern-btn-outline">
            <span>✕</span>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;
