import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, handleApiError } from '../utils/api';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchRecipeAndComments();
  }, [id]);

  const fetchRecipeAndComments = async () => {
    try {
      const [recipeResponse, commentsResponse] = await Promise.all([
        api.getRecipe(id),
        api.getComments(id)
      ]);
      setRecipe(recipeResponse.data);
      setComments(commentsResponse.data);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await api.addComment(id, { content: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      alert(handleApiError(error));
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteRecipe = async () => {
    if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone!')) {
      try {
        await api.deleteRecipe(id);
        navigate('/');
      } catch (error) {
        alert(handleApiError(error));
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-icon">👨‍🍳</div>
          <div className="loading-text">Loading recipe...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">❌ {error}</div>
        <Link to="/" className="modern-btn modern-btn-outline">
          <span>←</span>
          Back to Home
        </Link>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container">
        <div className="error">Recipe not found! 😞</div>
        <Link to="/" className="modern-btn modern-btn-outline">
          <span>←</span>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/" className="modern-btn modern-btn-outline">
        <span>←</span>
        Back to Home
      </Link>
      
      <div className="modern-card" style={{ marginTop: '2rem' }}>
        <img 
          src={recipe.image_url} 
          alt={recipe.title}
          style={{ 
            width: '100%', 
            height: '320px', 
            objectFit: 'cover',
            borderRadius: 'var(--border-radius)',
            marginBottom: '2rem',
            border: '1px solid rgba(231, 126, 34, 0.2)'
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
          }}
        />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: '2rem', 
          flexWrap: 'wrap', 
          gap: '1rem' 
        }}>
          <h1 className="modern-title" style={{ margin: 0, textAlign: 'left' }}>{recipe.title}</h1>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to={`/edit/${recipe.id}`} className="modern-btn modern-btn-accent">
              <span>✏️</span>
              Edit
            </Link>
            <button 
              onClick={handleDeleteRecipe}
              className="modern-btn modern-btn-danger"
            >
              <span>🗑️</span>
              Delete
            </button>
          </div>
        </div>
        
        <p className="modern-text" style={{ 
          fontSize: '1.2rem', 
          marginBottom: '2.5rem', 
          lineHeight: 1.6,
          color: 'var(--text-primary)',
          fontWeight: '400'
        }}>
          {recipe.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div className="ingredient-list">
            <h3 className="modern-subtitle" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🥘</span>
              Ingredients
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} style={{ 
                  padding: '1rem 0', 
                  borderBottom: '1px solid rgba(231, 126, 34, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <span style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    background: 'var(--primary-color)',
                    flexShrink: 0
                  }}></span>
                  <span className="modern-text" style={{ fontSize: '1rem' }}>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="instruction-list">
            <h3 className="modern-subtitle" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>👨‍🍳</span>
              Instructions
            </h3>
            <ol style={{ padding: 0, margin: 0, listStyle: 'none' }}>
              {recipe.instructions.map((instruction, index) => (
                <li key={index} style={{ 
                  padding: '1.25rem 0', 
                  borderBottom: '1px solid rgba(39, 174, 96, 0.1)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ 
                    background: 'var(--secondary-color)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    flexShrink: 0,
                    marginTop: '0.1rem'
                  }}>
                    {index + 1}
                  </span>
                  <span className="modern-text" style={{ 
                    fontSize: '1rem', 
                    lineHeight: 1.6 
                  }}>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3 className="modern-subtitle" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          marginBottom: '1.5rem' 
        }}>
          <span style={{ fontSize: '1.5rem' }}>💬</span>
          Comments ({comments.length})
        </h3>
        
        <form onSubmit={handleAddComment} className="modern-form">
          <div className="form-group">
            <label className="form-label">Add a comment</label>
            <textarea
              className="modern-textarea"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this recipe..."
              rows="3"
            />
          </div>
          <button 
            type="submit" 
            className="modern-btn modern-btn-secondary"
            disabled={commentLoading || !newComment.trim()}
          >
            <span>{commentLoading ? '⏳' : '📝'}</span>
            {commentLoading ? 'Posting...' : 'Add Comment'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem' }}>
          {comments.length === 0 ? (
            <div className="modern-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💭</div>
              <h4 className="modern-subtitle" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                No comments yet
              </h4>
              <p className="modern-text">Be the first to share your thoughts about this recipe!</p>
            </div>
          ) : (
            comments.map((comment, index) => (
              <div key={comment.id || index} className="comment">
                <div className="comment-content" style={{ marginBottom: '1rem', fontSize: '1rem' }}>
                  {comment.content}
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--text-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>👨‍🍳</span>
                  <span>Chef • {new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
