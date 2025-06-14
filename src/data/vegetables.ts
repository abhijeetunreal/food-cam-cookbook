import { Carrot, Grape, Circle } from 'lucide-react';
import type { Vegetable } from '@/types';

export const vegetables: Vegetable[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    icon: Grape, // Using Grape as a stand-in for Tomato
    recipe: {
      dish: 'Simple Tomato Soup',
      description: 'A creamy and comforting tomato soup, perfect for a chilly day.',
      ingredients: [
        '4 large tomatoes',
        '1 onion, chopped',
        '2 cloves garlic, minced',
        '1 tbsp olive oil',
        '2 cups vegetable broth',
        '1/2 cup heavy cream (optional)',
        'Salt and pepper to taste',
        'Fresh basil for garnish',
      ],
      instructions: [
        'Heat olive oil in a large pot over medium heat. Add onion and garlic, and cook until softened.',
        'Add chopped tomatoes and vegetable broth. Bring to a boil, then reduce heat and simmer for 15-20 minutes, or until tomatoes are very tender.',
        'Use an immersion blender to blend the soup until smooth. Alternatively, let it cool slightly and blend in a regular blender in batches.',
        'Stir in the heavy cream, if using. Season with salt and pepper.',
        'Serve hot, garnished with fresh basil.',
      ],
    },
  },
  {
    id: 'potato',
    name: 'Potato',
    icon: Circle, // Using Circle as a stand-in for Potato
    recipe: {
      dish: 'Garlic Roasted Potatoes',
      description: 'Crispy on the outside, fluffy on the inside, these potatoes are a perfect side dish.',
      ingredients: [
        '4 medium potatoes, cubed',
        '3 tbsp olive oil',
        '4 cloves garlic, minced',
        '1 tsp dried rosemary',
        '1 tsp dried thyme',
        'Salt and freshly ground black pepper',
      ],
      instructions: [
        'Preheat oven to 400°F (200°C).',
        'In a large bowl, toss the potato cubes with olive oil, minced garlic, rosemary, and thyme.',
        'Season generously with salt and pepper and toss again to coat well.',
        'Spread the potatoes in a single layer on a baking sheet.',
        'Roast for 30-40 minutes, flipping halfway through, until golden brown and crispy.',
        'Serve immediately as a delicious side.',
      ],
    },
  },
  {
    id: 'carrot',
    name: 'Carrot',
    icon: Carrot,
    recipe: {
      dish: 'Honey Glazed Carrots',
      description: 'A sweet and savory side dish that brings out the natural sweetness of carrots.',
      ingredients: [
        '1 lb carrots, peeled and sliced',
        '2 tbsp butter',
        '2 tbsp honey',
        '1 tbsp lemon juice',
        'Pinch of salt',
        'Fresh parsley, chopped, for garnish',
      ],
      instructions: [
        'Place carrots in a saucepan with enough water to cover. Bring to a boil and cook for 5-7 minutes until tender-crisp. Drain well.',
        'In the same saucepan, melt the butter over medium heat.',
        'Stir in the honey, lemon juice, and a pinch of salt.',
        'Add the cooked carrots back to the saucepan and toss to coat with the glaze.',
        'Cook for another 2-3 minutes, stirring occasionally, until the glaze has thickened slightly.',
        'Garnish with fresh parsley before serving.',
      ],
    },
  },
];
