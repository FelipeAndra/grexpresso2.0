// GR EXPRESSO - Supabase Configuration

// ⚠️ INSTRUÇÕES IMPORTANTES:
// 1. Crie uma conta em https://supabase.com
// 2. Crie um novo projeto
// 3. Substitua as credenciais abaixo com as suas
// 4. Execute os scripts SQL fornecidos no arquivo database-setup.sql

const SUPABASE_URL = 'SUA_URL_AQUI'; // Ex: https://xyzcompany.supabase.co
const SUPABASE_ANON_KEY = 'SUA_CHAVE_AQUI'; // Sua chave anônima do Supabase

// Inicializar Supabase Client
let supabaseClient;

if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.warn('Supabase não carregado. Usando armazenamento local.');
}

// Database Helper Functions
const DB = {
    // Usuários
    async createUser(userData) {
        if (!supabaseClient) return this.localStorageFallback('users', 'create', userData);
        
        const { data, error } = await supabaseClient
            .from('users')
            .insert([userData])
            .select();
        
        if (error) throw error;
        return data[0];
    },

    async getUser(email) {
        if (!supabaseClient) return this.localStorageFallback('users', 'get', email);
        
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async updateUser(userId, updates) {
        if (!supabaseClient) return this.localStorageFallback('users', 'update', { userId, updates });
        
        const { data, error } = await supabaseClient
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select();
        
        if (error) throw error;
        return data[0];
    },

    async getAllUsers() {
        if (!supabaseClient) return this.localStorageFallback('users', 'getAll');
        
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .order('points', { ascending: false });
        
        if (error) throw error;
        return data;
    },

    // Fretes
    async createFreight(freightData) {
        if (!supabaseClient) return this.localStorageFallback('freights', 'create', freightData);
        
        const { data, error } = await supabaseClient
            .from('freights')
            .insert([freightData])
            .select();
        
        if (error) throw error;
        return data[0];
    },

    async getActiveFreights(userId) {
        if (!supabaseClient) return this.localStorageFallback('freights', 'getActive', userId);
        
        const { data, error } = await supabaseClient
            .from('freights')
            .select('*')
            .eq('driver_id', userId)
            .eq('status', 'active');
        
        if (error) throw error;
        return data;
    },

    async updateFreight(freightId, updates) {
        if (!supabaseClient) return this.localStorageFallback('freights', 'update', { freightId, updates });
        
        const { data, error } = await supabaseClient
            .from('freights')
            .update(updates)
            .eq('id', freightId)
            .select();
        
        if (error) throw error;
        return data[0];
    },

    async getAllFreights() {
        if (!supabaseClient) return this.localStorageFallback('freights', 'getAll');
        
        const { data, error } = await supabaseClient
            .from('freights')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    },

    // Empresas
    async createCompany(companyData) {
        if (!supabaseClient) return this.localStorageFallback('companies', 'create', companyData);
        
        const { data, error } = await supabaseClient
            .from('companies')
            .insert([companyData])
            .select();
        
        if (error) throw error;
        return data[0];
    },

    async getAllCompanies() {
        if (!supabaseClient) return this.localStorageFallback('companies', 'getAll');
        
        const { data, error } = await supabaseClient
            .from('companies')
            .select('*')
            .order('name', { ascending: true });
        
        if (error) throw error;
        return data;
    },

    async updateCompany(companyId, updates) {
        if (!supabaseClient) return this.localStorageFallback('companies', 'update', { companyId, updates });
        
        const { data, error } = await supabaseClient
            .from('companies')
            .update(updates)
            .eq('id', companyId)
            .select();
        
        if (error) throw error;
        return data[0];
    },

    // Chat
    async sendMessage(messageData) {
        if (!supabaseClient) return this.localStorageFallback('messages', 'create', messageData);
        
        const { data, error } = await supabaseClient
            .from('messages')
            .insert([messageData])
            .select();
        
        if (error) throw error;
        return data[0];
    },

    async getMessages(limit = 50) {
        if (!supabaseClient) return this.localStorageFallback('messages', 'getAll');
        
        const { data, error } = await supabaseClient
            .from('messages')
            .select('*, users(name, email)')
            .order('created_at', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        return data.reverse();
    },

    // Manutenção
    async createMaintenance(maintenanceData) {
        if (!supabaseClient) return this.localStorageFallback('maintenance', 'create', maintenanceData);
        
        const { data, error } = await supabaseClient
            .from('maintenance')
            .insert([maintenanceData])
            .select();
        
        if (error) throw error;
        return data[0];
    },

    async getMaintenanceHistory(userId) {
        if (!supabaseClient) return this.localStorageFallback('maintenance', 'getByUser', userId);
        
        const { data, error } = await supabaseClient
            .from('maintenance')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });
        
        if (error) throw error;
        return data;
    },

    // Custos de Combustível
    async addFuelCost(fuelData) {
        if (!supabaseClient) return this.localStorageFallback('fuel_costs', 'create', fuelData);
        
        const { data, error } = await supabaseClient
            .from('fuel_costs')
            .insert([fuelData])
            .select();
        
        if (error) throw error;
        return data[0];
    },

    async getFuelCosts(userId) {
        if (!supabaseClient) return this.localStorageFallback('fuel_costs', 'getByUser', userId);
        
        const { data, error } = await supabaseClient
            .from('fuel_costs')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });
        
        if (error) throw error;
        return data;
    },

    // Fallback para localStorage quando Supabase não está configurado
    localStorageFallback(table, action, data) {
        const storageKey = `gr_expresso_${table}`;
        let storage = JSON.parse(localStorage.getItem(storageKey) || '[]');

        switch (action) {
            case 'create':
                const newItem = { ...data, id: Date.now(), created_at: new Date().toISOString() };
                storage.push(newItem);
                localStorage.setItem(storageKey, JSON.stringify(storage));
                return newItem;

            case 'get':
                return storage.find(item => item.email === data);

            case 'getAll':
                return storage;

            case 'getActive':
                return storage.filter(item => item.driver_id === data && item.status === 'active');

            case 'getByUser':
                return storage.filter(item => item.user_id === data);

            case 'update':
                const index = storage.findIndex(item => item.id === data.userId || item.id === data.freightId || item.id === data.companyId);
                if (index !== -1) {
                    storage[index] = { ...storage[index], ...data.updates };
                    localStorage.setItem(storageKey, JSON.stringify(storage));
                    return storage[index];
                }
                return null;

            default:
                return null;
        }
    }
};

// Inicializar dados de exemplo se estiver usando localStorage
function initializeSampleData() {
    if (!supabaseClient) {
        const users = JSON.parse(localStorage.getItem('gr_expresso_users') || '[]');
        if (users.length === 0) {
            // Adicionar admin padrão
            DB.createUser({
                name: 'Administrador',
                email: 'admin@grexpresso.com',
                password: 'admin123',
                role: 'admin',
                vehicle_type: 'truck',
                points: 0,
                earnings: 0,
                month_loads: 0,
                rating: 5.0,
                completed_freights: 0
            });

            // Adicionar empresas exemplo
            ['gr_expresso_companies'].forEach(key => {
                if (!localStorage.getItem(key)) {
                    const companies = [
                        { name: 'Logística São Paulo', city: 'São Paulo', available_loads: 15 },
                        { name: 'Transportes Rio', city: 'Rio de Janeiro', available_loads: 10 },
                        { name: 'Cargas Minas', city: 'Belo Horizonte', available_loads: 8 }
                    ];
                    companies.forEach(comp => DB.createCompany(comp));
                }
            });
        }
    }
}

// Executar inicialização ao carregar
setTimeout(initializeSampleData, 100);
