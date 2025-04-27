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

    // La API KEY ahora se gestiona en el backend (Flask proxy). No se expone en el frontend.
    // No inicializamos SDK: usaremos el backend Flask como proxy seguro.

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
            console.log('Enviando solicitud a Gemini via proxy backend...');
            const url = 'http://localhost:5050/gemini-chat';
            // Construir payload con solo el mensaje de usuario para el proxy
            const payload = { message };
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('Error en el proxy Gemini:', data);
                hideTypingIndicator();
                addBotMessage(data.error?.message || JSON.stringify(data));
                return;
            }
            // Extraer respuesta del proxy (Google Gemini generateContent)
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
