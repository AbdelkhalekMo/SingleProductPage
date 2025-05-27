document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatHeaderTitle = document.querySelector('.chat-header h4');

    const userName = localStorage.getItem('chatUserName') || 'User';


    function addMessage(text, sender, time, senderName = null) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender); // sender is 'user' or 'support'
        
        let messagePrefix = "";
        if (senderName && sender === 'user') { // Or however you wish to display it
           // messagePrefix = `${senderName}: `;
        } // For now, user messages don't show their name inline, but support might later.

        const textNode = document.createTextNode(messagePrefix + text);
        messageDiv.appendChild(textNode);

        if (time) {
            const timeSpan = document.createElement('span');
            timeSpan.classList.add('timestamp');
            timeSpan.textContent = time;
            messageDiv.appendChild(timeSpan);
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
    }

    function getCurrentTime() {
        return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }

    function handleSendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText !== '') {
            addMessage(messageText, 'user', getCurrentTime(), userName);
            chatInput.value = '';

            // Simulate a support reply (replace with actual logic later)
            setTimeout(() => {
                addMessage('Thank you for your message. A support agent will be with you shortly.', 'support', getCurrentTime());
            }, 1500);
        }
    }

    sendMessageBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Example: addMessage(`Welcome to support, ${userName}! How can I assist?`, 'support', getCurrentTime());
    // Initial greeting from support
    setTimeout(() => {
        addMessage(`Hello ${userName}! How can I help you today?`, 'support', getCurrentTime());
    }, 500);
}); 