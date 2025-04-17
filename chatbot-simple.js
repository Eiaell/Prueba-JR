// --- Chatbot Funcional Simple --- //
document.addEventListener('DOMContentLoaded', () => {
    // Referencias DOM
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotButton = document.querySelector('.chatbot-button');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatMessages = document.querySelector('.chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Respuestas predefinidas para el chatbot
    const respuestas = {
        "servicios": "Ofrezco una variedad de servicios profesionales incluyendo: Activaciones, Eventos, Implementaciones, Merchandising, Material P.O.P, Ginkanas y Experiencias. ¿En cuál estás interesado?",
        "contacto": "Puedes contactarme directamente por email a johana_rodriguez@crektivo.com.pe para cualquier consulta o para solicitar una propuesta personalizada.",
        "experiencia": "Soy Johana Rodriguez, ejecutiva de cuentas en CREAKTIVO con más de 15 años de experiencia transformando ideas de marketing, branding y eventos en soluciones impecables para el mercado peruano.",
        "ayuda": "Estoy aquí para asistirte con información sobre los servicios de Johana Rodriguez. Puedes preguntarme sobre servicios disponibles, información de contacto o experiencia profesional.",
        "hola": "¡Hola! Soy el asistente virtual de Johana Rodriguez. ¿En qué puedo ayudarte hoy?",
        "gracias": "¡De nada! Estoy aquí para ayudarte. Si necesitas algo más, no dudes en preguntar.",
        "default": "Gracias por tu mensaje. Johana Rodriguez te ofrece soluciones profesionales para marketing y eventos. ¿Te gustaría conocer más sobre nuestros servicios o prefieres contactar directamente?"
    };

    // Abrir/cerrar el chatbot
    chatbotButton.addEventListener('click', () => {
        chatbotContainer.classList.toggle('chatbot-open');
    });

    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('chatbot-open');
    });

    // Enviar mensaje (Enter)
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && userInput.value.trim() !== '') {
            procesarMensaje();
        }
    });

    // Enviar mensaje (Botón)
    sendButton.addEventListener('click', () => {
        if (userInput.value.trim() !== '') {
            procesarMensaje();
        }
    });

    // Función principal para procesar mensajes
    function procesarMensaje() {
        const mensaje = userInput.value.trim();
        
        // Añadir mensaje del usuario a la interfaz
        addUserMessage(mensaje);
        userInput.value = '';
        
        // Mostrar indicador de escritura
        showTypingIndicator();
        
        // Simular tiempo de respuesta realista
        setTimeout(() => {
            // Ocultar indicador de escritura
            hideTypingIndicator();
            
            // Obtener y mostrar respuesta
            const respuesta = obtenerRespuesta(mensaje);
            addBotMessage(respuesta);
        }, 1500);
    }

    // Determinar respuesta apropiada
    function obtenerRespuesta(mensaje) {
        mensaje = mensaje.toLowerCase();
        
        // Palabras clave para diferentes tipos de preguntas
        if (contienePalabras(mensaje, ['servicio', 'servicios', 'ofrece', 'ofrecen', 'qué hace', 'que hace', 'activacion', 'evento', 'implementacion', 'merchandising', 'pop', 'ginkana'])) {
            return respuestas.servicios;
        }
        
        if (contienePalabras(mensaje, ['contacto', 'contactar', 'email', 'correo', 'comunicar', 'teléfono', 'telefono', 'llamar', 'mensaje'])) {
            return respuestas.contacto;
        }
        
        if (contienePalabras(mensaje, ['experiencia', 'quién es', 'quien es', 'sobre ti', 'acerca', 'trayectoria', 'currículum', 'curriculum', 'profesional'])) {
            return respuestas.experiencia;
        }
        
        if (contienePalabras(mensaje, ['ayuda', 'ayudar', 'asistencia', 'puedes hacer', 'como funciona', 'cómo funciona'])) {
            return respuestas.ayuda;
        }
        
        if (contienePalabras(mensaje, ['hola', 'saludos', 'buenos días', 'buenos dias', 'buenas tardes', 'buenas noches'])) {
            return respuestas.hola;
        }
        
        if (contienePalabras(mensaje, ['gracias', 'agradecido', 'agradezco', 'thanks'])) {
            return respuestas.gracias;
        }
        
        // Respuesta por defecto
        return respuestas.default;
    }

    // Verificar si el mensaje contiene palabras clave
    function contienePalabras(mensaje, palabrasClave) {
        return palabrasClave.some(palabra => mensaje.includes(palabra));
    }

    // Añadir mensaje del usuario a la interfaz
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user-message');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = message;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll al final
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Añadir mensaje del bot a la interfaz
    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot-message');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = message;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll al final
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
});
