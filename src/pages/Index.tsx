import { useState, useEffect } from 'react';
import { vegetables } from '@/data/vegetables';
import type { Vegetable, Recipe } from '@/types';
import { RecipeDisplay } from '@/components/RecipeDisplay';
import { ChefHat, X, LoaderCircle, Camera, Circle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { suggestRecipeStyles, generateRecipe } from "@/lib/gemini";
import { Button } from '@/components/ui/button';
import { CameraScanner } from '@/components/CameraScanner';

const Index = () => {
  const [selectedVegetable, setSelectedVegetable] = useState<Vegetable | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [recipeStyles, setRecipeStyles] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('gemini-api-key', newKey);
  };

  const handleSelectVegetable = async (veg: Vegetable) => {
    setSelectedVegetable(veg);
    setError(null);
    setRecipeStyles([]);
    setSelectedStyle(null);
    setGeneratedRecipe(null);

    if (!apiKey) {
      console.log("No Gemini API key found. Showing default recipe.");
      setSelectedStyle('default'); // Use a default style to show the recipe
      return;
    }

    setIsLoading(true);
    try {
      const styles = await suggestRecipeStyles(veg.name, apiKey);
      setRecipeStyles(styles);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedVegetable(null);
    setRecipeStyles([]);
    setSelectedStyle(null);
    setError(null);
    setIsLoading(false);
    setGeneratedRecipe(null);
    setIsGeneratingRecipe(false);
  };

  const handleIngredientFound = (ingredientName: string) => {
    const foundVeg = vegetables.find(v => v.name.toLowerCase() === ingredientName.toLowerCase().trim());
    setShowCamera(false);
    if (foundVeg) {
        handleSelectVegetable(foundVeg);
    } else {
        const newVegetable: Vegetable = {
            id: ingredientName.toLowerCase().replace(/\s+/g, '-'),
            name: ingredientName,
            icon: Circle, // A default icon
            recipe: { // This is a placeholder, it won't be shown
                dish: `Recipe for ${ingredientName}`,
                description: 'A delicious dish waiting to be discovered.',
                ingredients: [],
                instructions: [],
            }
        };
        handleSelectVegetable(newVegetable);
    }
  };
  
  const handleStyleSelect = async (style: string) => {
    setSelectedStyle(style);
    setError(null);

    const isStaticVegetable = vegetables.some(v => v.id === selectedVegetable?.id);
    if (isStaticVegetable) {
      return; 
    }

    if (!apiKey) {
      setError("A Google Gemini API key is required to generate recipes.");
      return;
    }

    if (selectedVegetable) {
      setIsGeneratingRecipe(true);
      setGeneratedRecipe(null);
      try {
        const recipe = await generateRecipe(selectedVegetable.name, style, apiKey);
        setGeneratedRecipe(recipe);
      } catch (err: any) {
        setError(err.message || "Failed to generate recipe.");
      } finally {
        setIsGeneratingRecipe(false);
      }
    }
  };

  if (showCamera) {
    return (
      <CameraScanner
        apiKey={apiKey}
        onCancel={() => setShowCamera(false)}
        onIngredientFound={handleIngredientFound}
      />
    );
  }

  return (
    <div className="min-h-screen bg-secondary/50 font-sans text-foreground p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2"
        >
          <ChefHat className="w-8 h-8 text-primary" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold">ChefAI</h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-secondary-foreground mt-2"
        >
          Your personal AI cooking assistant.
        </motion.p>
      </header>

      <main className="w-full">
        <AnimatePresence mode="wait">
          {!selectedVegetable ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">What ingredient are you cooking with today?</h2>
              {error && (
                <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm font-medium">{error}</motion.div>
              )}
              <div className="grid grid-cols-3 gap-4">
                {vegetables.map((veg, index) => (
                  <motion.button
                    key={veg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    onClick={() => handleSelectVegetable(veg)}
                    className="group flex flex-col items-center justify-center p-4 bg-white/60 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <veg.icon className="w-12 h-12 text-primary mb-2 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-medium text-gray-700">{veg.name}</span>
                  </motion.button>
                ))}
              </div>

              <div className="my-8 flex items-center justify-center gap-4 text-sm">
                <div className="flex-1 border-t border-muted"></div>
                <span className="text-muted-foreground">OR</span>
                <div className="flex-1 border-t border-muted"></div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * vegetables.length }}
              >
                <Button onClick={() => {setError(null); setShowCamera(true)}} variant="outline" className="w-full max-w-sm mx-auto">
                    <Camera className="mr-2 h-5 w-5" />
                    Scan Ingredient with Camera
                </Button>
              </motion.div>

              <div className="mt-8 max-w-sm mx-auto">
                <Label htmlFor="api-key" className="text-sm font-medium text-gray-600">Google Gemini API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key here"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">Your key is stored locally and used to suggest recipe styles.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="recipe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center"
            >
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <LoaderCircle className="w-12 h-12 text-primary animate-spin" />
                  <p className="mt-4 text-secondary-foreground">Asking the chef for ideas...</p>
                </div>
              )}
              {error && !selectedStyle && (
                <div className="flex flex-col items-center justify-center h-64 bg-destructive/10 rounded-lg p-4">
                  <p className="text-destructive font-semibold">Oops! Something went wrong.</p>
                  <p className="mt-2 text-sm text-destructive-foreground">{error}</p>
                </div>
              )}
              {!isLoading && recipeStyles.length > 0 && !selectedStyle && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
                    How should we cook the <span className="text-primary">{selectedVegetable.name}</span>?
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4">
                    {recipeStyles.map(style => (
                      <motion.div
                        key={style}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button onClick={() => handleStyleSelect(style)} size="lg">
                          {style}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              {selectedStyle && (
                <>
                  {isGeneratingRecipe && (
                    <div className="flex flex-col items-center justify-center h-64">
                      <LoaderCircle className="w-12 h-12 text-primary animate-spin" />
                      <p className="mt-4 text-secondary-foreground">Crafting your custom recipe...</p>
                    </div>
                  )}
                  {error && !isGeneratingRecipe && !vegetables.some(v => v.id === selectedVegetable?.id) && (
                     <div className="flex flex-col items-center justify-center h-64 bg-destructive/10 rounded-lg p-4">
                       <p className="text-destructive font-semibold">Oops! Something went wrong.</p>
                       <p className="mt-2 text-sm text-destructive-foreground">{error}</p>
                     </div>
                  )}
                  {!isGeneratingRecipe && (
                    (vegetables.some(v => v.id === selectedVegetable.id) && selectedVegetable.recipe) 
                    ? <RecipeDisplay recipe={selectedVegetable.recipe} />
                    : generatedRecipe && <RecipeDisplay recipe={generatedRecipe} />
                  )}
                </>
              )}
              
              <div className="text-center mt-8">
                <button
                  onClick={handleClear}
                  className="bg-primary text-primary-foreground font-bold py-2 px-6 rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
                >
                  <X className="w-4 h-4" />
                  Try another ingredient
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="text-center mt-12 text-sm text-muted-foreground">
        <p>Built with ♡ by Lovable.</p>
      </footer>
    </div>
  );
};

export default Index;
