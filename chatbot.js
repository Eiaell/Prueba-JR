// --- Chatbot with Gemini API Integration --- //
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotButton = document.querySelector('.chatbot-button');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatMessages = document.querySelector('.chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // Función para añadir efecto 'squash-gel' al botón
    function addSquashEffect(element) {
        element.classList.add('squash-gel');
        setTimeout(() => {
            element.classList.remove('squash-gel');
        }, 380); // Duración de la animación
    }

    // API key de Gemini
    const geminiApiKey = 'AIzaSyArrdFk8-kTiLVIoSr0zzSUs5rSuOnoiO8';
    // No inicializamos SDK: usaremos la API REST directamente

    // --- Verifica si los elementos existen ---
    if (!chatbotButton || !chatbotContainer || !chatMessages || !userInput || !sendButton || !chatbotClose) {
        console.error("Error: Elementos de la interfaz del chat o botón toggle no encontrados.");
        // Oculta ambos si falta algo esencial
        if (chatbotContainer) {
            chatbotContainer.style.display = 'none';
        }
        if (chatbotButton) {
            chatbotButton.style.display = 'none';
        }
        // return; // Mantenlo comentado por ahora para diagnosticar
    }

    // Toggle del chatbot
    if (chatbotButton) {
        chatbotButton.addEventListener('click', async () => {
            addSquashEffect(chatbotButton);
            const isClosed = chatbotContainer.classList.contains('chatbot-closed');
            if (isClosed) {
                chatbotContainer.classList.remove('chatbot-closed');
                chatbotContainer.classList.add('chatbot-open');
            } else {
                chatbotContainer.classList.add('chatbot-closed');
                chatbotContainer.classList.remove('chatbot-open');
            }
        });
    }

    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.add('chatbot-closed');
        chatbotContainer.classList.remove('chatbot-open');
    });

    // Enviar mensaje cuando se presiona Enter
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && userInput.value.trim() !== '') {
            sendMessage();
        }
    });

    // Enviar mensaje cuando se hace clic en el botón de enviar
    sendButton.addEventListener('click', () => {
        if (userInput.value.trim() !== '') {
            sendMessage();
        }
    });

    // Función para agregar un mensaje del usuario a la interfaz
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user-message');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = message;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Hacer scroll al final del chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Función para agregar un mensaje del bot a la interfaz
    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot-message');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = message;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Hacer scroll al final del chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Mostrar indicador de escritura
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        typingDiv.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingDiv.appendChild(dot);
        }
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Ocultar indicador de escritura
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Enviar mensaje a la API de Gemini y mostrar la respuesta
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Agregar mensaje del usuario a la interfaz
        addUserMessage(message);
        userInput.value = '';
        
        // Mostrar indicador de escritura
        showTypingIndicator();
        
        try {
            console.log('Enviando solicitud a Gemini via REST...');
            const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`;
            const payload = {
                contents: [{ role: 'user', parts: [{ text: `Eres el asistente virtual de Johana Rodriguez, una profesional de marketing y eventos. 
                Debes responder de manera profesional, amable y concisa. 
                Si te preguntan sobre servicios, debes mencionar: Activaciones, Eventos, Implementaciones, Merchandising, Material P.O.P, Ginkanas y Experiencias. 
                Si te preguntan sobre información de contacto, debes proporcionar: johana_rodriguez@crektivo.com.pe. 
                Trata de responder en un tono cálido y servicial, sin ser demasiado formal. 
                Mantén tus respuestas breves, idealmente en menos de 3 párrafos. No respondas sobre ninguna otra cosa que no sea trabajo` + '\n\nUsuario: ' + message }] }],
                generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 1024 }
            };
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            const botRes = Array.isArray(data.candidates) && data.candidates.length
                ? (data.candidates[0].output || data.candidates[0].text || '')
                : 'Sin respuesta';
            hideTypingIndicator();
            addBotMessage(botRes);
        } catch (error) {
            console.error('Error al comunicarse con la API REST de Gemini:', error);
            hideTypingIndicator();
            addBotMessage('Lo siento, no puedo procesar tu mensaje en este momento.');
        }
    }
});
