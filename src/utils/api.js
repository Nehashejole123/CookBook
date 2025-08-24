import axios from 'axios';

const API_BASE = '/api';

export const api = {
  // Recipe endpoints
  getAllRecipes: () => axios.get(`${API_BASE}/recipes`),
  getRecipe: (id) => axios.get(`${API_BASE}/recipes/${id}`),
  createRecipe: (recipe) => axios.post(`${API_BASE}/recipes`, recipe),
  updateRecipe: (id, recipe) => axios.put(`${API_BASE}/recipes/${id}`, recipe),
  deleteRecipe: (id) => axios.delete(`${API_BASE}/recipes/${id}`),
  
  // Comment endpoints
  getComments: (recipeId) => axios.get(`${API_BASE}/recipes/${recipeId}/comments`),
  addComment: (recipeId, comment) => axios.post(`${API_BASE}/recipes/${recipeId}/comments`, comment),
};

// Error handler
export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    return error.response.data.error || 'Something went wrong!';
  }
  return 'Network error. Please check your connection.';
};
