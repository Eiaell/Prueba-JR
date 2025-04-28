from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

# Obtener la API key de las variables de entorno
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@app.route('/')
def index():
    return "Proxy API para Google Gemini está funcionando."

@app.route('/gemini-chat', methods=['POST'])
def gemini_chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': {'message': 'No se proporcionó un mensaje'}}), 400
        
        # URL de la API de Gemini
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"
        
        # Configuración de la solicitud a la API de Gemini
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": user_message}]
                }
            ],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1024,
            }
        }
        
        # Realizar la solicitud a la API de Gemini
        response = requests.post(url, json=payload)
        
        # Verificar si la solicitud fue exitosa
        if response.status_code != 200:
            print(f"Error en la API de Gemini: {response.text}")
            return jsonify({'error': {'message': f'Error en la API de Gemini: {response.text}'}}), response.status_code
        
        # Extraer y procesar la respuesta
        response_data = response.json()
        candidates = response_data.get('candidates', [])
        
        if not candidates:
            return jsonify({'error': {'message': 'No se recibieron candidatos de respuesta'}}), 500
        
        # Extraer el texto de la respuesta
        response_text = candidates[0]['content']['parts'][0]['text']
        
        # Devolver la respuesta en el formato esperado por el cliente
        return jsonify({
            'candidates': [{
                'output': response_text
            }]
        })
        
    except Exception as e:
        print(f"Error en el servidor: {str(e)}")
        return jsonify({'error': {'message': f'Error en el servidor: {str(e)}'}}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
