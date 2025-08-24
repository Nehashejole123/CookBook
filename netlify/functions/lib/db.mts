// Database schema initialization and connection utilities
export interface User {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  created_at: Date;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  image_url: string;
  author_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Comment {
  id: string;
  recipe_id: string;
  user_id: string;
  content: string;
  created_at: Date;
}

// Simple in-memory storage for demo (in production, use Neon PostgreSQL)
let users: User[] = [
  {
    id: '1',
    email: 'chef@cookbook.com',
    username: 'ChefPixel',
    password_hash: 'hashed_password',
    created_at: new Date()
  }
];

let recipes: Recipe[] = [
  {
    id: '1',
    title: 'Pixel Perfect Pancakes',
    description: 'Fluffy pancakes that look like they came from a video game!',
    ingredients: ['2 cups flour', '2 eggs', '1 cup milk', '2 tbsp sugar', '1 tsp baking powder'],
    instructions: ['Mix dry ingredients', 'Add wet ingredients', 'Cook on griddle until golden', 'Stack like power-ups!'],
    image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    author_id: '1',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2',
    title: 'Retro Ramen Bowl',
    description: 'A nostalgic noodle soup that brings back childhood memories',
    ingredients: ['1 pack ramen noodles', '1 egg', '2 cups broth', '1 green onion', 'nori seaweed'],
    instructions: ['Boil water and add noodles', 'Add seasoning packet', 'Crack egg into bowl', 'Garnish with onions and nori'],
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    author_id: '1',
    created_at: new Date(),
    updated_at: new Date()
  }
];

let comments: Comment[] = [
  {
    id: '1',
    recipe_id: '1',
    user_id: '1',
    content: 'These pancakes are amazing! My kids love them!',
    created_at: new Date()
  }
];

export const db = {
  users: {
    findAll: () => users,
    findById: (id: string) => users.find(u => u.id === id),
    findByEmail: (email: string) => users.find(u => u.email === email),
    create: (user: Omit<User, 'id'>) => {
      const newUser = { ...user, id: Date.now().toString() };
      users.push(newUser);
      return newUser;
    }
  },
  recipes: {
    findAll: () => recipes,
    findById: (id: string) => recipes.find(r => r.id === id),
    create: (recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) => {
      const newRecipe = {
        ...recipe,
        id: Date.now().toString(),
        created_at: new Date(),
        updated_at: new Date()
      };
      recipes.push(newRecipe);
      return newRecipe;
    },
    update: (id: string, updates: Partial<Recipe>) => {
      const index = recipes.findIndex(r => r.id === id);
      if (index !== -1) {
        recipes[index] = { ...recipes[index], ...updates, updated_at: new Date() };
        return recipes[index];
      }
      return null;
    },
    delete: (id: string) => {
      const index = recipes.findIndex(r => r.id === id);
      if (index !== -1) {
        return recipes.splice(index, 1)[0];
      }
      return null;
    }
  },
  comments: {
    findByRecipeId: (recipeId: string) => comments.filter(c => c.recipe_id === recipeId),
    create: (comment: Omit<Comment, 'id' | 'created_at'>) => {
      const newComment = {
        ...comment,
        id: Date.now().toString(),
        created_at: new Date()
      };
      comments.push(newComment);
      return newComment;
    }
  }
};
