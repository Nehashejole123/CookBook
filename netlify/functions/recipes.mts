import type { Context, Config } from "@netlify/functions";
import { db } from './lib/db.mts';

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const method = req.method;
  const pathParts = url.pathname.split('/');
  const recipeId = pathParts[pathParts.length - 1];

  // Set CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Handle preflight requests
  if (method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    // GET /api/recipes - Get all recipes
    if (method === 'GET' && !recipeId.match(/^\d+$/)) {
      const recipes = db.recipes.findAll();
      return new Response(JSON.stringify(recipes), { status: 200, headers });
    }

    // GET /api/recipes/:id - Get single recipe
    if (method === 'GET' && recipeId.match(/^\d+$/)) {
      const recipe = db.recipes.findById(recipeId);
      if (!recipe) {
        return new Response(JSON.stringify({ error: 'Recipe not found' }), { status: 404, headers });
      }
      return new Response(JSON.stringify(recipe), { status: 200, headers });
    }

    // POST /api/recipes - Create new recipe
    if (method === 'POST') {
      const body = await req.json();
      const { title, description, ingredients, instructions, image_url } = body;
      
      if (!title || !description || !ingredients || !instructions) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers });
      }

      const newRecipe = db.recipes.create({
        title,
        description,
        ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split('\n'),
        instructions: Array.isArray(instructions) ? instructions : instructions.split('\n'),
        image_url: image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        author_id: '1' // Default user for demo
      });

      return new Response(JSON.stringify(newRecipe), { status: 201, headers });
    }

    // PUT /api/recipes/:id - Update recipe
    if (method === 'PUT' && recipeId.match(/^\d+$/)) {
      const body = await req.json();
      const updatedRecipe = db.recipes.update(recipeId, body);
      
      if (!updatedRecipe) {
        return new Response(JSON.stringify({ error: 'Recipe not found' }), { status: 404, headers });
      }

      return new Response(JSON.stringify(updatedRecipe), { status: 200, headers });
    }

    // DELETE /api/recipes/:id - Delete recipe
    if (method === 'DELETE' && recipeId.match(/^\d+$/)) {
      const deletedRecipe = db.recipes.delete(recipeId);
      
      if (!deletedRecipe) {
        return new Response(JSON.stringify({ error: 'Recipe not found' }), { status: 404, headers });
      }

      return new Response(JSON.stringify({ message: 'Recipe deleted successfully' }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });

  } catch (error) {
    console.error('Error in recipes API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
  }
};

export const config: Config = {
  path: ["/api/recipes", "/api/recipes/*"]
};
