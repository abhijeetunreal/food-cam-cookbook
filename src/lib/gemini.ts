
export async function suggestRecipeStyles(vegetableName: string, apiKey: string): Promise<string[]> {
  const prompt = `You are a creative chef. Suggest 4 diverse and interesting cooking styles for a recipe using ${vegetableName}. Examples: Indian, Mexican, Italian, Thai, Fusion, etc. Your response should be a comma-separated list of just the style names, nothing else. For example: "Indian, Mexican, Italian, Thai"`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(errorData.error?.message || 'Failed to fetch recipe styles from Gemini API.');
    }

    const data = await response.json();
    const stylesText = data.candidates[0].content.parts[0].text;
    // Simple parsing, assuming the AI follows instructions.
    const styles = stylesText.split(',').map(s => s.trim()).filter(s => s);
    return styles;
  } catch (error) {
    console.error('Error fetching recipe styles:', error);
    if (error instanceof Error) {
        throw new Error(`Could not get recipe styles. ${error.message}`);
    }
    throw new Error('Could not get recipe styles. Please check your API key and network connection.');
  }
}

export async function identifyIngredientFromImage(base64Image: string, apiKey: string): Promise<string> {
  const prompt = "Identify the single, most prominent vegetable or fruit in this image. Respond with only the name of the ingredient, and nothing else. For example: 'Tomato'. If you cannot identify a vegetable or fruit, respond with 'Unknown'.";

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        {
          inline_data: {
            mime_type: "image/jpeg",
            data: base64Image
          }
        }
      ]
    }]
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API error:", errorData);
        throw new Error(errorData.error?.message || 'Failed to analyze image with Gemini API.');
    }

    const data = await response.json();
    const ingredientName = data.candidates[0].content.parts[0].text.trim();
    
    if (ingredientName.toLowerCase().includes('unknown')) {
        throw new Error("Could not identify a vegetable or fruit in the image.");
    }
    
    return ingredientName;

  } catch (error) {
    console.error('Error analyzing image:', error);
    if (error instanceof Error) {
        throw new Error(`Could not analyze image. ${error.message}`);
    }
    throw new Error('Could not analyze image. Please check your API key, network connection, and image quality.');
  }
}
