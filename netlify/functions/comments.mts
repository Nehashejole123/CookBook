import type { Context, Config } from "@netlify/functions";
import { db } from './lib/db.mts';

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const method = req.method;
  const pathParts = url.pathname.split('/');
  const recipeId = pathParts[pathParts.length - 2]; // .../recipes/:id/comments

  // Set CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    // GET /api/recipes/:id/comments - Get comments for a recipe
    if (method === 'GET') {
      const comments = db.comments.findByRecipeId(recipeId);
      return new Response(JSON.stringify(comments), { status: 200, headers });
    }

    // POST /api/recipes/:id/comments - Add comment to recipe
    if (method === 'POST') {
      const body = await req.json();
      const { content } = body;
      
      if (!content) {
        return new Response(JSON.stringify({ error: 'Comment content is required' }), { status: 400, headers });
      }

      // Check if recipe exists
      const recipe = db.recipes.findById(recipeId);
      if (!recipe) {
        return new Response(JSON.stringify({ error: 'Recipe not found' }), { status: 404, headers });
      }

      const newComment = db.comments.create({
        recipe_id: recipeId,
        user_id: '1', // Default user for demo
        content
      });

      return new Response(JSON.stringify(newComment), { status: 201, headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });

  } catch (error) {
    console.error('Error in comments API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
  }
};

export const config: Config = {
  path: "/api/recipes/*/comments"
};
