'use client';

import { useState } from 'react';

import { Button} from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { API_BASE_URL } from '@/config/api';

export default function Chatbot() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!question.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            if (!response.ok) {
                throw new Error('Chat request failed');
            }

            const data = await response.json();
            setAnswer(data.answer);
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
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask a question about waste management..."
                        className="w-full"
                    />

                    <Button
                        onClick={handleSubmit}
                        disabled={!question.trim() || loading}
                        className="w-full"
                    >
                        {loading ? 'Getting Answer...' : 'Submit Question'}
                    </Button>

                    {answer && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                            <p className="whitespace-pre-wrap">{answer}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}