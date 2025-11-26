// GR EXPRESSO - Authentication Module

const Auth = {
    currentUser: null,

    // Fazer Login
    async login(email, password) {
        try {
            const user = await DB.getUser(email);
            
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            if (user.password !== password) {
                throw new Error('Senha incorreta');
            }

            this.currentUser = user;
            localStorage.setItem('gr_current_user', JSON.stringify(user));
            
            showNotification('Login realizado com sucesso!', 'success');
            return user;
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    },

    // Fazer Cadastro
    async register(userData) {
        try {
            // Verificar se email já existe
            const existingUser = await DB.getUser(userData.email);
            
            if (existingUser) {
                throw new Error('Email já cadastrado');
            }

            // Criar novo usuário
            const newUser = await DB.createUser({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: 'driver',
                vehicle_type: userData.vehicleType,
                points: 0,
                earnings: 0,
                month_loads: 0,
                rating: 5.0,
                completed_freights: 0,
                created_at: new Date().toISOString()
            });

            showNotification('Cadastro realizado! Faça login para continuar.', 'success');
            return newUser;
        } catch (error) {
            showNotification(error.message, 'error');
            throw error;
        }
    },

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('gr_current_user');
        showNotification('Logout realizado com sucesso!', 'success');
        window.location.reload();
    },

    // Verificar se está logado
    isAuthenticated() {
        if (this.currentUser) return true;
        
        const storedUser = localStorage.getItem('gr_current_user');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            return true;
        }
        
        return false;
    },

    // Pegar usuário atual
    getCurrentUser() {
        if (!this.currentUser) {
            const storedUser = localStorage.getItem('gr_current_user');
            if (storedUser) {
                this.currentUser = JSON.parse(storedUser);
            }
        }
        return this.currentUser;
    },

    // Atualizar dados do usuário
    async updateCurrentUser(updates) {
        try {
            const updatedUser = await DB.updateUser(this.currentUser.id, updates);
            this.currentUser = { ...this.currentUser, ...updates };
            localStorage.setItem('gr_current_user', JSON.stringify(this.currentUser));
            return updatedUser;
        } catch (error) {
            showNotification('Erro ao atualizar usuário', 'error');
            throw error;
        }
    },

    // Admin Access (para testes)
    async adminLogin() {
        const adminUser = {
            id: 999,
            name: 'Administrador',
            email: 'admin@grexpresso.com',
            role: 'admin',
            created_at: new Date().toISOString()
        };
        
        this.currentUser = adminUser;
        localStorage.setItem('gr_current_user', JSON.stringify(adminUser));
        showNotification('Acesso administrativo concedido', 'success');
        return adminUser;
    }
};

// Event Listeners para Login/Cadastro
document.addEventListener('DOMContentLoaded', () => {
    // Botão para mostrar formulário de login
    const btnShowLogin = document.getElementById('btn-show-login');
    if (btnShowLogin) {
        btnShowLogin.addEventListener('click', () => {
            document.getElementById('login-form').classList.remove('hidden');
            document.getElementById('register-form').classList.add('hidden');
            btnShowLogin.classList.add('bg-teal-600', 'text-white');
            btnShowLogin.classList.remove('bg-gray-200');
            document.getElementById('btn-show-register').classList.remove('bg-teal-600', 'text-white');
            document.getElementById('btn-show-register').classList.add('bg-gray-200');
        });
    }

    // Botão para mostrar formulário de cadastro
    const btnShowRegister = document.getElementById('btn-show-register');
    if (btnShowRegister) {
        btnShowRegister.addEventListener('click', () => {
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('register-form').classList.remove('hidden');
            btnShowRegister.classList.add('bg-teal-600', 'text-white');
            btnShowRegister.classList.remove('bg-gray-200');
            btnShowLogin.classList.remove('bg-teal-600', 'text-white');
            btnShowLogin.classList.add('bg-gray-200');
        });
    }

    // Botão de Login
    const btnLogin = document.getElementById('btn-login');
    if (btnLogin) {
        btnLogin.addEventListener('click', async () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            if (!email || !password) {
                showNotification('Preencha todos os campos', 'warning');
                return;
            }

            try {
                const user = await Auth.login(email, password);
                initializeApp();
            } catch (error) {
                console.error('Erro no login:', error);
            }
        });
    }

    // Botão de Cadastro
    const btnRegister = document.getElementById('btn-register');
    if (btnRegister) {
        btnRegister.addEventListener('click', async () => {
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const vehicleType = document.getElementById('register-vehicle').value;

            if (!name || !email || !password) {
                showNotification('Preencha todos os campos', 'warning');
                return;
            }

            try {
                await Auth.register({ name, email, password, vehicleType });
                // Voltar para tela de login
                document.getElementById('btn-show-login').click();
                document.getElementById('register-name').value = '';
                document.getElementById('register-email').value = '';
                document.getElementById('register-password').value = '';
            } catch (error) {
                console.error('Erro no cadastro:', error);
            }
        });
    }

    // Botão de acesso admin
    const btnAdminAccess = document.getElementById('btn-admin-access');
    if (btnAdminAccess) {
        btnAdminAccess.addEventListener('click', async () => {
            await Auth.adminLogin();
            initializeApp();
        });
    }
});

// Sistema de Notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="text-sm font-medium">${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
