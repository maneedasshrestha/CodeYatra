'use client';

import { useState } from 'react';

import Image from '@/node_modules/next/image';
import { API_BASE_URL } from '@/config/api';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function ImageClassification() {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [prediction, setPrediction] = useState<string>('');
    const [confidence, setConfidence] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!image) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', image); // Note: FastAPI expects 'file' as the key

        try {
            const response = await fetch(`${API_BASE_URL}/api/predict`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                console.log(response)
                throw new Error('Prediction failed');
            }

            const data = await response.json();
            setPrediction(data.prediction);
            setConfidence(data.confidence);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
                <div className="space-y-4">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full"
                    />

                    {preview && (
                        <div className="relative w-full h-64">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}

                    <Button
                        onClick={handleSubmit}
                        disabled={!image || loading}
                        className="w-full"
                    >
                        {loading ? 'Processing...' : 'Classify Waste'}
                    </Button>

                    {prediction && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                            <p className="font-bold">Detected Waste Type: {prediction}</p>
                            <p>Confidence: {(confidence * 100).toFixed(2)}%</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}