'use client';

import { API_BASE_URL } from '@/config/api';
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

const LineChart = ({ data, dataKey, width = 600, height = 300, color }) => {
    // Guard against invalid data
    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <div className="flex items-center justify-center w-full h-[300px] bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    // Chart dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Calculate scales
    const values = data.map(d => Number(d[dataKey]) || 0);
    const maxY = Math.ceil(Math.max(...values) * 1.1); // Add 10% padding
    const minY = Math.floor(Math.min(0, ...values));

    // Create points
    const points = data.map((d, i) => ({
        x: (i * innerWidth) / (data.length - 1) + margin.left,
        y: innerHeight - (((Number(d[dataKey]) || 0) - minY) / (maxY - minY)) * innerHeight + margin.top
    }));

    // Generate Y-axis ticks
    const numYTicks = 5;
    const yTicks = Array.from({ length: numYTicks }, (_, i) => {
        const value = minY + ((maxY - minY) * i) / (numYTicks - 1);
        return {
            value: Math.round(value),
            y: innerHeight - ((value - minY) / (maxY - minY)) * innerHeight + margin.top
        };
    });

    // X-axis labels (assuming first property is the label)
    const xLabels = data.map(d => Object.values(d)[0]);

    return (
        <svg
            width={width}
            height={height}
            className="bg-white"
            style={{ minWidth: '600px' }}
        >
            {/* Background grid */}
            {yTicks.map((tick, i) => (
                <g key={`grid-${i}`}>
                    <line
                        x1={margin.left}
                        y1={tick.y}
                        x2={width - margin.right}
                        y2={tick.y}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                    />
                </g>
            ))}

            {/* Y-axis */}
            <line
                x1={margin.left}
                y1={margin.top}
                x2={margin.left}
                y2={height - margin.bottom}
                stroke="#9CA3AF"
                strokeWidth="1"
            />

            {/* X-axis */}
            <line
                x1={margin.left}
                y1={height - margin.bottom}
                x2={width - margin.right}
                y2={height - margin.bottom}
                stroke="#9CA3AF"
                strokeWidth="1"
            />

            {/* Y-axis ticks and labels */}
            {yTicks.map((tick, i) => (
                <g key={`tick-${i}`}>
                    <line
                        x1={margin.left - 5}
                        y1={tick.y}
                        x2={margin.left}
                        y2={tick.y}
                        stroke="#9CA3AF"
                    />
                    <text
                        x={margin.left - 10}
                        y={tick.y}
                        textAnchor="end"
                        dominantBaseline="middle"
                        className="text-xs fill-gray-500"
                    >
                        {tick.value}
                    </text>
                </g>
            ))}

            {/* X-axis labels */}
            {data.map((_, i) => (
                <g key={`label-${i}`}>
                    <text
                        x={points[i].x}
                        y={height - margin.bottom + 20}
                        textAnchor="middle"
                        className="text-xs fill-gray-500"
                    >
                        {xLabels[i]}
                    </text>
                </g>
            ))}

            {/* Data line */}
            <path
                d={points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={color}
                strokeWidth="2"
            />

            {/* Data points */}
            {points.map((point, i) => (
                <g key={`point-${i}`} className="group">
                    <circle
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill={color}
                        className="transition-all duration-200 hover:r-6"
                    />
                    {/* Tooltip */}
                    <g className="opacity-0 group-hover:opacity-100">
                        <rect
                            x={point.x - 40}
                            y={point.y - 30}
                            width="80"
                            height="20"
                            rx="4"
                            fill="black"
                            fillOpacity="0.8"
                        />
                        <text
                            x={point.x}
                            y={point.y - 18}
                            textAnchor="middle"
                            fill="white"
                            className="text-xs"
                        >
                            {`${xLabels[i]}: ${data[i][dataKey]}`}
                        </text>
                    </g>
                </g>
            ))}
        </svg>
    );
};

export default function CsvAnalysis() {
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/api/analyze`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();
            setAnalysis(data);
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
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="w-full"
                    />

                    <Button
                        onClick={handleAnalyze}
                        disabled={!file || loading}
                        className="w-full"
                    >
                        {loading ? 'Analyzing...' : 'Analyze CSV'}
                    </Button>

                    {analysis && (
                        <div className="mt-8">
                            <h3 className="text-lg font-bold mb-4">Analysis Results</h3>

                            {/* Monthly Distribution Chart */}
                            <div className="mb-8">
                                <h4 className="text-md font-semibold mb-2">Monthly Waste Distribution</h4>
                                <div className="w-full overflow-x-auto">
                                    <LineChart
                                        data={analysis.monthlyData}
                                        dataKey="count"
                                        color="#8884d8"
                                        width={600}
                                        height={300}
                                    />
                                </div>
                            </div>

                            {/* Daily Distribution Chart */}
                            <div className="mb-8">
                                <h4 className="text-md font-semibold mb-2">Daily Waste Distribution</h4>
                                <div className="w-full overflow-x-auto">
                                    <LineChart
                                        data={analysis.dailyData}
                                        dataKey="count"
                                        color="#82ca9d"
                                        width={600}
                                        height={300}
                                    />
                                </div>
                            </div>

                            {/* Summary */}
                            {analysis.summary && (
                                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                    <h4 className="text-md font-semibold mb-2">Analysis Summary</h4>
                                    <p className="whitespace-pre-wrap">{analysis.summary}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}