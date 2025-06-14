import { motion } from 'framer-motion';
import type { Recipe } from '@/types';
import { Button } from '@/components/ui/button';
import { Volume2, LoaderCircle } from 'lucide-react';

interface RecipeDisplayProps {
  recipe: Recipe;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  canSpeak: boolean;
}

export function RecipeDisplay({ recipe, onSpeak, isSpeaking, canSpeak }: RecipeDisplayProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1,
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800">{recipe.dish}</h2>
        <p className="mt-2 text-secondary-foreground">{recipe.description}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
        <h3 className="font-serif text-2xl font-bold text-gray-800 mb-4">Ingredients</h3>
        <ul className="list-disc list-inside space-y-2 text-secondary-foreground">
          {recipe.ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-2xl font-bold text-gray-800">Instructions</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSpeak(recipe.instructions.join('. '))}
            disabled={!canSpeak || isSpeaking}
            title={canSpeak ? "Read instructions aloud" : "Enter ElevenLabs API key to enable speech"}
          >
            {isSpeaking ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>
        <ol className="list-decimal list-inside space-y-4 text-secondary-foreground">
          {recipe.instructions.map((item, index) => (
            <li key={index} className="pl-2">{item}</li>
          ))}
        </ol>
      </motion.div>
    </motion.div>
  );
}
