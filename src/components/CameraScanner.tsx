
import { useState, useRef, useEffect } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { identifyIngredientFromImage } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraScannerProps {
    apiKey: string;
    onCancel: () => void;
    onIngredientFound: (ingredient: string) => void;
}

export const CameraScanner = ({ apiKey, onCancel, onIngredientFound }: CameraScannerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        
        const startCamera = async () => {
            setIsCameraReady(false);
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.onloadedmetadata = () => {
                            setIsCameraReady(true);
                        };
                    }
                } else {
                    setError("Your browser does not support camera access.");
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Could not access the camera. Please check permissions and try again.");
            }
        };

        if (!capturedImage) {
            startCamera();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [capturedImage]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current && isCameraReady) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const imageDataUrl = canvas.toDataURL('image/jpeg');
                setCapturedImage(imageDataUrl);
            }
        }
    };

    const handleConfirm = async () => {
        if (!capturedImage) return;
        if (!apiKey) {
            setError("A Google Gemini API key is required to identify ingredients.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const base64Image = capturedImage.split(',')[1];
            const ingredient = await identifyIngredientFromImage(base64Image, apiKey);
            onIngredientFound(ingredient);
        } catch (err: any) {
            setError(err.message || "Failed to identify ingredient. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-4"
        >
            <Button variant="ghost" className="absolute top-4 right-4 z-10" onClick={!isLoading ? onCancel : () => {}}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
            </Button>
            
            <div className="w-full max-w-lg text-center">
                <h2 className="font-serif text-3xl font-bold mb-2">Scan Ingredient</h2>
                <p className="text-muted-foreground mb-4">Center the ingredient in the frame.</p>

                {error && <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-destructive/20 text-destructive p-3 rounded-md mb-4 text-sm font-medium">{error}</motion.div>}

                <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
                    <AnimatePresence mode="wait">
                        {!capturedImage ? (
                            <motion.div key="video" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full h-full">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                                {!isCameraReady && !error && <div className="absolute inset-0 flex items-center justify-center bg-black/50"><LoaderCircle className="w-10 h-10 text-white animate-spin" /></div>}
                            </motion.div>
                        ) : (
                            <motion.img key="preview" src={capturedImage} alt="Captured ingredient" className="w-full h-full object-contain" initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} />
                        )}
                    </AnimatePresence>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>

                <div className="mt-6 flex flex-col items-center gap-4 w-full">
                    {isLoading ? (
                        <div className="flex items-center gap-3 text-lg">
                            <LoaderCircle className="w-6 h-6 animate-spin" />
                            <span>Analyzing...</span>
                        </div>
                    ) : capturedImage ? (
                        <div className="flex justify-center gap-4">
                             <Button variant="outline" size="lg" onClick={() => { setCapturedImage(null); setError(null); }}>Retake</Button>
                             <Button size="lg" onClick={handleConfirm}>Use this Photo</Button>
                        </div>
                    ) : (
                        <Button size="lg" onClick={handleCapture} disabled={!isCameraReady}>
                            Capture Photo
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
