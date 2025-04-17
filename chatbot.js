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
    
    // Variables para la API de Gemini
    let genAI = null;
    let geminiModel = null;

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

    // Inicializar la API de Gemini
    function initGeminiApi() {
        try {
            // Verifica que la biblioteca esté disponible (cargada desde el HTML)
            if (!window.google || !window.google.generativeai) {
                console.error('Error: La biblioteca Google Generative AI no está disponible');
                return false;
            }
            
            // Inicializar el cliente con la API key
            genAI = new google.generativeai.GoogleGenerativeAI(geminiApiKey);
            geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
            
            console.log('API de Gemini inicializada correctamente');
            return true;
        } catch (error) {
            console.error('Error al inicializar la API de Gemini:', error);
            return false;
        }
    }

    // Inicializar la API de Gemini al cargar la página
    const apiInitialized = initGeminiApi();
    if (!apiInitialized) {
        console.warn('No se pudo inicializar la API de Gemini. El chatbot tendrá funcionalidad limitada.');
    }

    // Toggle del chatbot
    if (chatbotButton) {
        chatbotButton.addEventListener('click', () => {
            // Añadir efecto squash al botón
            addSquashEffect(chatbotButton);
            
            chatbotContainer.classList.toggle('chatbot-closed');
            // Inicializar API si se abre el chat y aún no se ha inicializado
            if (!chatbotContainer.classList.contains('chatbot-closed') && !geminiModel) {
                initGeminiApi();
            }
        });
    }

    chatbotClose.addEventListener('click', () => {
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
            // Verificar que la API esté inicializada
            if (!geminiModel) {
                console.error('El modelo de Gemini no está inicializado');
                hideTypingIndicator();
                addBotMessage('Lo siento, estoy teniendo problemas para procesar mensajes. Por favor, intenta recargar la página.');
                return;
            }
            
            // Definir el contexto para el asistente
            const prompt = `Eres el asistente virtual de Johana Rodriguez, una profesional de marketing y eventos. 
            Debes responder de manera profesional, amable y concisa. 
            Si te preguntan sobre servicios, debes mencionar: Activaciones, Eventos, Implementaciones, Merchandising, Material P.O.P, Ginkanas y Experiencias. 
            Si te preguntan sobre información de contacto, debes proporcionar: johana_rodriguez@crektivo.com.pe. 
            Trata de responder en un tono cálido y servicial, sin ser demasiado formal. 
            Mantén tus respuestas breves, idealmente en menos de 3 párrafos. No respondas sobre ninguna otra cosa que no sea trabajo`;
            
            // Generar respuesta usando el modelo de Gemini
            console.log('Enviando solicitud a Gemini API...');
            const generationConfig = {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            };
            
            const result = await geminiModel.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt + '\n\nUsuario: ' + message }] }],
                generationConfig,
            });
            
            const response = await result.response;
            const botResponse = response.text();
            console.log('Respuesta recibida de Gemini API');
            
            // Ocultar indicador de escritura
            hideTypingIndicator();
            
            // Agregar respuesta del bot a la interfaz
            addBotMessage(botResponse);
        } catch (error) {
            console.error('Error al comunicarse con la API de Gemini:', error);
            hideTypingIndicator();
            addBotMessage('Lo siento, no puedo procesar tu mensaje en este momento. Por favor, intenta de nuevo más tarde.');
        }
    }
});
