// GR EXPRESSO - Chat Module

const Chat = {
    messages: [],
    isOpen: false,

    // Inicializar chat
    async init() {
        await this.loadMessages();
        this.startPolling();
    },

    // Carregar mensagens
    async loadMessages() {
        try {
            this.messages = await DB.getMessages(50);
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
            this.messages = JSON.parse(localStorage.getItem('gr_expresso_messages') || '[]');
        }
    },

    // Enviar mensagem
    async sendMessage(content) {
        const user = Auth.getCurrentUser();
        
        if (!content.trim()) {
            return;
        }

        const message = {
            user_id: user.id,
            user_name: user.name,
            content: content.trim(),
            timestamp: new Date().toISOString()
        };

        try {
            await DB.sendMessage(message);
            this.messages.push(message);
            this.renderMessages();
            showNotification('Mensagem enviada!', 'success');
        } catch (error) {
            showNotification('Erro ao enviar mensagem', 'error');
        }
    },

    // Renderizar mensagens
    renderMessages() {
        const chatContainer = document.getElementById('chat-messages');
        if (!chatContainer) return;

        const user = Auth.getCurrentUser();
        
        chatContainer.innerHTML = this.messages.map(msg => {
            const isOwnMessage = msg.user_id === user.id;
            const messageClass = isOwnMessage ? 'sent' : 'received';
            
            return `
                <div class="flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4">
                    <div class="chat-message ${messageClass} p-3 max-w-[70%]">
                        ${!isOwnMessage ? `<div class="text-xs font-semibold mb-1">${msg.user_name}</div>` : ''}
                        <div class="text-sm">${this.escapeHtml(msg.content)}</div>
                        <div class="text-xs opacity-70 mt-1">
                            ${new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Scroll para o final
        chatContainer.scrollTop = chatContainer.scrollHeight;
    },

    // Escape HTML para prevenir XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Polling para novas mensagens (simples)
    startPolling() {
        setInterval(async () => {
            if (this.isOpen) {
                await this.loadMessages();
                this.renderMessages();
            }
        }, 5000); // Atualizar a cada 5 segundos
    },

    // Abrir chat
    open() {
        this.isOpen = true;
        this.showChatModal();
        this.renderMessages();
    },

    // Fechar chat
    close() {
        this.isOpen = false;
        document.getElementById('modals-container').innerHTML = '';
    },

    // Mostrar modal de chat
    showChatModal() {
        const modal = `
            <div id="chat-modal" class="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-lg w-full max-w-2xl h-[600px] flex flex-col fade-in">
                    <!-- Header -->
                    <div class="bg-teal-700 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <div>
                                <div class="font-bold">Chat de Motoristas</div>
                                <div class="text-xs opacity-90">Converse com outros motoristas</div>
                            </div>
                        </div>
                        <button onclick="Chat.close()" class="text-white hover:text-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <!-- Messages Container -->
                    <div id="chat-messages" class="flex-1 overflow-y-auto p-4 bg-gray-50">
                        <!-- Mensagens serão inseridas aqui -->
                    </div>

                    <!-- Input -->
                    <div class="p-4 bg-white border-t">
                        <div class="flex gap-2">
                            <input 
                                type="text" 
                                id="chat-input" 
                                placeholder="Digite sua mensagem..."
                                class="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                onkeypress="if(event.key === 'Enter') sendChatMessage()"
                            >
                            <button 
                                onclick="sendChatMessage()"
                                class="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modals-container').innerHTML = modal;
    }
};

// Função global para enviar mensagem
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const content = input.value;
    
    if (content.trim()) {
        await Chat.sendMessage(content);
        input.value = '';
    }
}

// Inicializar chat quando app carregar
document.addEventListener('DOMContentLoaded', () => {
    Chat.init();
});
