import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import google.generativeai as genai
import traceback

load_dotenv()

# Configure the Gemini API with the API key
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/gemini-chat', methods=['POST', 'OPTIONS'])
def gemini_chat():
    if request.method == 'OPTIONS':
        # Preflight request handling
        response = jsonify({'status': 'ok'})
        return response

    try:
        data = request.json
        message = data.get('message')
        if not message:
            return jsonify({"error": "No message provided"}), 400
        
        # Construir prompt con instrucciones del sistema y mensaje del usuario
        system_prompt = (
            "Eres el asistente virtual de Johana Rodriguez, una profesional de marketing y eventos. "
            "Debes responder de manera profesional, amable y concisa. "
            "Si te preguntan sobre servicios, debes mencionar: Activaciones, Eventos, "
            "Implementaciones, Merchandising, Material P.O.P, Ginkanas y Experiencias. "
            "Si te preguntan sobre información de contacto, debes proporcionar: "
            "johana_rodriguez@crektivo.com.pe. "
            "Trata de responder en un tono cálido y servicial, sin ser demasiado formal. "
            "Mantén tus respuestas breves, idealmente en menos de 3 párrafos. "
            "No respondas sobre ninguna otra cosa que no sea trabajo."
        )
        
        print("Setting up Gemini model...")
        # Create a GenerativeModel object
        model = genai.GenerativeModel(model_name="gemini-1.5-pro")
        
        # Create the generation config
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 1024,
        }
        
        # Create a proper prompt with system instructions
        prompt = f"{system_prompt}\n\nUsuario: {message}"
        
        # Send the message to Gemini
        print(f"Sending message to Gemini: {message[:50]}...")
        response = model.generate_content(
            prompt,
            generation_config=generation_config
        )
        
        # Extract the text from the response
        print("Received response from Gemini")
        response_text = response.text
        
        # Format the response to match the expected format in the frontend
        return jsonify({
            "candidates": [{
                "output": response_text
            }]
        }), 200
        
    except Exception as e:
        print(f"Error calling Gemini API: {str(e)}")
        print(traceback.format_exc())  # Print the stack trace for debugging
        return jsonify({
            "error": "Gemini API error",
            "details": str(e),
            "candidates": [{
                "output": "Lo siento, estoy teniendo problemas para responder en este momento. Por favor, inténtalo de nuevo más tarde."
            }]
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
