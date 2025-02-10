from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import numpy as np
import pandas as pd
import google.generativeai as genai
import io
import cv2
import os
from datetime import datetime
from typing import Optional
import json
from pydantic import BaseModel

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "http://192.168.50.211:3000"],  # Update with your Next.js frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Initialize models and configurations
MODEL_PATH = 'runs/detect/waste_classification2/weights/best.pt'
LOG_FILE = 'waste_predictions_log.csv'
GEMINI_API_KEY = "your-gemini-api-key"  # Replace with your actual API key

# Initialize models
yolo_model = YOLO(MODEL_PATH)
genai.configure(api_key="AIzaSyAU9duCSva2f3XfdJKCEr80VeE3ZjxvW6g")
gemini_model = genai.GenerativeModel("gemini-1.5-flash")

class ChatRequest(BaseModel):
    question: str

def ensure_log_file_exists():
    if not os.path.exists(LOG_FILE):
        df = pd.DataFrame(columns=[
            'timestamp', 'predicted_class', 'confidence', 
            'image_name', 'day_of_week', 'month'
        ])
        df.to_csv(LOG_FILE, index=False)

def log_prediction(prediction: str, confidence: float, image_name: str):
    now = datetime.now()
    new_row = pd.DataFrame([{
        'timestamp': now.strftime('%Y-%m-%d %H:%M:%S'),
        'predicted_class': prediction,
        'confidence': confidence,
        'image_name': image_name,
        'day_of_week': now.strftime('%A'),
        'month': now.strftime('%B')
    }])
    new_row.to_csv(LOG_FILE, mode='a', header=False, index=False)

@app.post("/api/predict")
async def predict_waste(file: UploadFile = File(...)):
    try:
        print("hello")
        # Read and validate image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert PIL Image to numpy array
        img_array = np.array(image)
        
        # Make prediction
        results = yolo_model.predict(img_array)
        result = results[0]
        
        # Process results
        prediction = "No detection"
        confidence = 0.0
        box = None
        
        if len(result.boxes) > 0:
            confidences = result.boxes.conf
            class_indices = result.boxes.cls
            max_conf_idx = confidences.argmax()
            
            prediction = result.names[int(class_indices[max_conf_idx])]
            confidence = float(confidences[max_conf_idx])
            box = result.boxes[max_conf_idx].xyxy[0].cpu().numpy().tolist()
        
        # Log prediction
        ensure_log_file_exists()
        log_prediction(prediction, confidence, file.filename)
        
        return {
            "prediction": prediction,
            "confidence": confidence,
            "box": box
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze")
async def analyze_csv(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Monthly analysis
        monthly_stats = df.groupby(['month', 'predicted_class']).size().unstack(fill_value=0)
        monthly_data = monthly_stats.reset_index().to_dict('records')
        
        # Daily analysis
        daily_stats = df.groupby(['day_of_week', 'predicted_class']).size().unstack(fill_value=0)
        daily_data = daily_stats.reset_index().to_dict('records')
        
        # Generate summary using Gemini
        summary = await generate_summary(df)
        
        return {
            "monthlyData": monthly_data,
            "dailyData": daily_data,
            "summary": summary
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Prepare the prompt
        prompt = f"You are an expert in waste management logistics. Please provide detailed advice about: {request.question}"
        
        # Generate response
        response = gemini_model.generate_content(prompt)
        
        return {"answer": response.text}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def generate_summary(df: pd.DataFrame) -> str:
    try:
        # Create a summary of the data
        data_summary = df.to_string()
        
        prompt = f"""Based on the following waste prediction data:
        {data_summary}
        
        Please provide:
        1. Key trends and patterns
        2. Waste-to-energy recommendations
        3. Logistics optimization suggestions
        """
        
        response = gemini_model.generate_content(prompt)
        return response.text
    
    except Exception as e:
        return f"Error generating summary: {str(e)}"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app,port=8080)
