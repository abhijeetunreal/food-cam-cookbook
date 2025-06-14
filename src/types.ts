
import type { LucideIcon } from 'lucide-react';

export interface Recipe {
  dish: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

export interface Vegetable {
  id: string;
  name: string;
  icon: LucideIcon;
  recipe: Recipe;
}
