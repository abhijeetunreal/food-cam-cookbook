
export async function generateSpeech(text: string, apiKey: string): Promise<Blob> {
  // Using Sarah's voice ID, which is good for multilingual text
  const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL";

  const response = await fetch(ELEVENLABS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2", // A model that supports multiple languages
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("ElevenLabs API error:", errorData);
    throw new Error(errorData.detail?.message || 'Failed to generate speech.');
  }

  const audioBlob = await response.blob();
  return audioBlob;
}
