'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import ReactMarkdown from 'react-markdown';

const COLORS = {
  organic: '#8884d8',
  paper: '#82ca9d',
  glass: '#ffc658',
  plastic: '#ff7300',
  mixed: '#387908',
  clothes: '#a4de6c',
  'e-waste': '#d0ed57',
  metal: '#83a6ed',
  batteries: '#ff8c00'
};

const CustomLineChart = ({ data, title }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[300px] bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const wasteTypes = [...new Set(data.map(item => item.waste_type))].filter(type => type);

  return (
    <div className="mb-6">
      <h4 className="text-md font-semibold mb-2">{title}</h4>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} className="bg-white rounded-lg shadow-md p-2">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey={title.includes('Monthly') ? 'month' : 'date'} 
            stroke="#9CA3AF" 
          />
          <YAxis stroke="#9CA3AF" allowDecimals={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#333', 
              color: '#fff', 
              borderRadius: '5px' 
            }} 
          />
          <Legend verticalAlign="top" height={36} />
          {wasteTypes.map((type) => (
            <Line
              key={type}
              type="monotone"
              dataKey={d => d.waste_type === type ? d.count : 0}
              name={type}
              stroke={COLORS[type]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function CsvAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [backendReview, setBackendReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',').map(v => v.trim());
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
      });
  };

  const analyzeData = (records) => {
    // Process monthly data
    const monthlyDataMap = new Map();
    records.forEach(record => {
      const waste_type = record.predicted_class;
      const month = record.month;
      if (waste_type && waste_type.trim()) {  // Only process non-empty waste types
        const key = `${month}-${waste_type}`;
        monthlyDataMap.set(key, (monthlyDataMap.get(key) || 0) + 1);
      }
    });

    const monthlyData = Array.from(monthlyDataMap.entries()).map(([key, count]) => {
      const [month, waste_type] = key.split('-');
      return {
        month,
        waste_type,
        count
      };
    });

    // Process daily data
    const dailyDataMap = new Map();
    records.forEach(record => {
      const date = record.timestamp.split(' ')[0];
      const waste_type = record.predicted_class;
      if (waste_type && waste_type.trim()) {  // Only process non-empty waste types
        const key = `${date}-${waste_type}`;
        dailyDataMap.set(key, (dailyDataMap.get(key) || 0) + 1);
      }
    });

    const dailyData = Array.from(dailyDataMap.entries()).map(([key, count]) => {
      const [date, waste_type] = key.split('-');
      return {
        date,
        waste_type,
        count
      };
    });

    // Generate summary
    const totalItems = records.length;
    const wasteTypes = [...new Set(records.map(r => r.predicted_class))];
    const wasteTypeCounts = wasteTypes.map(type => ({
      type,
      count: records.filter(r => r.predicted_class === type).length
    }));

    const summary = `
## Waste Analysis Summary

Total items analyzed: ${totalItems}

### Waste Type Distribution:
${wasteTypeCounts.map(w => `- ${w.type}: ${w.count} items (${((w.count/totalItems) * 100).toFixed(1)}%)`).join('\n')}

### Key Insights:
- Most common waste type: ${wasteTypeCounts.sort((a,b) => b.count - a.count)[0].type}
- Least common waste type: ${wasteTypeCounts.sort((a,b) => a.count - b.count)[0].type}
    `;

    return {
      monthlyData,
      dailyData,
      summary,
      records  // Return the records for the backend analysis
    };
  };

  const fetchBackendAnalysis = async (records) => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch backend analysis');
      }

      const data = await response.json();
      return data.review;
    } catch (error) {
      console.error('Error fetching backend analysis:', error);
      return null;
    }
  };

  //fetch dir
  // list csvs
  // send for processing

  // /get-csvs => os.listdir
  // return  [filenames]
  // list =? filename ... onclick => 

  useEffect(() => {
    const fetchAndAnalyzeFile = async () => {
      try {
        const response = await fetch('http://localhost:8000/test.csv');
        if (!response.ok) {
          throw new Error('Failed to fetch CSV file');
        }
        const text = await response.text();
        if (!text) {
          throw new Error('CSV file is empty');
        }
        const records = parseCSV(text);
        const analysisResults = analyzeData(records);
        setAnalysis(analysisResults);
        
        // Fetch backend review
        const review = await fetchBackendAnalysis(records);
        setBackendReview(review);
      } catch (error) {
        console.error('Error analyzing CSV:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndAnalyzeFile();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className="text-red-500">
              Error: {error}
            </div>
          ) : (
            analysis && (
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Analysis Results</h3>

                <CustomLineChart 
                  data={analysis.monthlyData}
                  title="Monthly Waste Distribution"
                />

                <CustomLineChart 
                  data={analysis.dailyData}
                  title="Daily Waste Distribution"
                />

                {analysis.summary && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <h4 className="text-md font-semibold mb-2">Analysis Summary</h4>
                    <ReactMarkdown className="prose prose-sm max-w-none">
                      {analysis.summary}
                    </ReactMarkdown>
                    
                    {backendReview && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="text-md font-semibold mb-2">Advanced Analysis</h4>
                        <ReactMarkdown className="prose prose-sm max-w-none">
                          {backendReview}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}