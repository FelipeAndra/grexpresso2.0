// GR EXPRESSO - Maintenance & Fuel Module

const Maintenance = {
    maintenanceHistory: [],
    fuelHistory: [],

    // Adicionar manutenção
    async addMaintenance(maintenanceData) {
        const user = Auth.getCurrentUser();
        
        const maintenance = {
            user_id: user.id,
            date: new Date().toISOString(),
            type: maintenanceData.type,
            description: maintenanceData.description,
            cost: parseFloat(maintenanceData.cost),
            vehicle_type: user.vehicle_type,
            mileage: maintenanceData.mileage || 0,
            status: 'completed'
        };

        try {
            await DB.createMaintenance(maintenance);
            this.maintenanceHistory.push(maintenance);
            
            // Atualizar gastos do usuário
            const currentUser = Auth.getCurrentUser();
            await Auth.updateCurrentUser({
                earnings: (currentUser.earnings || 0) - maintenance.cost
            });

            showNotification('Manutenção registrada com sucesso!', 'success');
            return maintenance;
        } catch (error) {
            showNotification('Erro ao registrar manutenção', 'error');
            throw error;
        }
    },

    // Adicionar custo de combustível
    async addFuelCost(fuelData) {
        const user = Auth.getCurrentUser();
        
        const fuel = {
            user_id: user.id,
            date: new Date().toISOString(),
            liters: parseFloat(fuelData.liters),
            price_per_liter: parseFloat(fuelData.pricePerLiter),
            total_cost: parseFloat(fuelData.liters) * parseFloat(fuelData.pricePerLiter),
            location: fuelData.location,
            vehicle_type: user.vehicle_type,
            mileage: fuelData.mileage || 0
        };

        try {
            await DB.addFuelCost(fuel);
            this.fuelHistory.push(fuel);
            
            // Atualizar gastos do usuário
            const currentUser = Auth.getCurrentUser();
            await Auth.updateCurrentUser({
                earnings: (currentUser.earnings || 0) - fuel.total_cost
            });

            showNotification(`Abastecimento registrado: R$ ${fuel.total_cost.toFixed(2)}`, 'success');
            return fuel;
        } catch (error) {
            showNotification('Erro ao registrar abastecimento', 'error');
            throw error;
        }
    },

    // Carregar histórico
    async loadHistory() {
        const user = Auth.getCurrentUser();
        
        try {
            this.maintenanceHistory = await DB.getMaintenanceHistory(user.id);
            this.fuelHistory = await DB.getFuelCosts(user.id);
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
    },

    // Calcular custos totais
    calculateTotalCosts() {
        const maintenanceCosts = this.maintenanceHistory.reduce((sum, m) => sum + (m.cost || 0), 0);
        const fuelCosts = this.fuelHistory.reduce((sum, f) => sum + (f.total_cost || 0), 0);
        
        return {
            maintenance: maintenanceCosts,
            fuel: fuelCosts,
            total: maintenanceCosts + fuelCosts
        };
    },

    // Mostrar modal de manutenção
    showMaintenanceModal() {
        const modal = `
            <div id="maintenance-modal" class="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto fade-in">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold">Gestão de Veículo</h3>
                        <button onclick="closeMaintenanceModal()" class="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <!-- Tabs -->
                    <div class="flex gap-2 mb-6 border-b">
                        <button onclick="switchMaintenanceTab('maintenance')" id="tab-maintenance" class="px-4 py-2 font-semibold border-b-2 border-teal-600 text-teal-600">
                            Manutenção
                        </button>
                        <button onclick="switchMaintenanceTab('fuel')" id="tab-fuel" class="px-4 py-2 font-semibold text-gray-500 hover:text-gray-700">
                            Combustível
                        </button>
                        <button onclick="switchMaintenanceTab('history')" id="tab-history" class="px-4 py-2 font-semibold text-gray-500 hover:text-gray-700">
                            Histórico
                        </button>
                    </div>

                    <!-- Maintenance Form -->
                    <div id="content-maintenance" class="space-y-4">
                        <h4 class="font-bold text-lg mb-4">Registrar Manutenção</h4>
                        <select id="maintenance-type" class="w-full p-3 border rounded">
                            <option value="preventiva">Manutenção Preventiva</option>
                            <option value="corretiva">Manutenção Corretiva</option>
                            <option value="troca_oleo">Troca de Óleo</option>
                            <option value="pneus">Troca de Pneus</option>
                            <option value="freios">Sistema de Freios</option>
                            <option value="suspensao">Suspensão</option>
                            <option value="eletrica">Sistema Elétrico</option>
                            <option value="outros">Outros</option>
                        </select>
                        <textarea id="maintenance-description" placeholder="Descrição detalhada" class="w-full p-3 border rounded" rows="3"></textarea>
                        <input type="number" id="maintenance-cost" placeholder="Custo (R$)" step="0.01" class="w-full p-3 border rounded">
                        <input type="number" id="maintenance-mileage" placeholder="Quilometragem atual" class="w-full p-3 border rounded">
                        <button onclick="submitMaintenance()" class="w-full bg-teal-600 text-white py-3 rounded hover:bg-teal-700">
                            Registrar Manutenção
                        </button>
                    </div>

                    <!-- Fuel Form -->
                    <div id="content-fuel" class="space-y-4 hidden">
                        <h4 class="font-bold text-lg mb-4">Registrar Abastecimento</h4>
                        <input type="number" id="fuel-liters" placeholder="Litros" step="0.01" class="w-full p-3 border rounded">
                        <input type="number" id="fuel-price" placeholder="Preço por litro (R$)" step="0.01" class="w-full p-3 border rounded">
                        <input type="text" id="fuel-location" placeholder="Local do abastecimento" class="w-full p-3 border rounded">
                        <input type="number" id="fuel-mileage" placeholder="Quilometragem atual" class="w-full p-3 border rounded">
                        <div class="bg-gray-100 p-4 rounded">
                            <div class="text-sm text-gray-600">Total a pagar:</div>
                            <div id="fuel-total" class="text-2xl font-bold text-green-600">R$ 0,00</div>
                        </div>
                        <button onclick="submitFuel()" class="w-full bg-teal-600 text-white py-3 rounded hover:bg-teal-700">
                            Registrar Abastecimento
                        </button>
                    </div>

                    <!-- History -->
                    <div id="content-history" class="hidden">
                        <div id="history-content">
                            <!-- Histórico será carregado aqui -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modals-container').innerHTML = modal;
        this.loadHistoryContent();

        // Event listener para calcular total do combustível
        const fuelLiters = document.getElementById('fuel-liters');
        const fuelPrice = document.getElementById('fuel-price');
        
        const updateFuelTotal = () => {
            const liters = parseFloat(fuelLiters.value) || 0;
            const price = parseFloat(fuelPrice.value) || 0;
            const total = liters * price;
            document.getElementById('fuel-total').textContent = `R$ ${total.toFixed(2)}`;
        };

        if (fuelLiters) fuelLiters.addEventListener('input', updateFuelTotal);
        if (fuelPrice) fuelPrice.addEventListener('input', updateFuelTotal);
    },

    // Carregar conteúdo do histórico
    loadHistoryContent() {
        const costs = this.calculateTotalCosts();
        
        const maintenanceItems = this.maintenanceHistory.map(m => `
            <div class="border-l-4 border-orange-500 pl-4 py-2">
                <div class="font-semibold">${m.type}</div>
                <div class="text-sm text-gray-600">${m.description}</div>
                <div class="text-sm text-gray-500">${new Date(m.date).toLocaleDateString('pt-BR')}</div>
                <div class="text-lg font-bold text-red-600">- R$ ${m.cost.toFixed(2)}</div>
            </div>
        `).join('');

        const fuelItems = this.fuelHistory.map(f => `
            <div class="border-l-4 border-blue-500 pl-4 py-2">
                <div class="font-semibold">Abastecimento - ${f.location}</div>
                <div class="text-sm text-gray-600">${f.liters}L × R$ ${f.price_per_liter.toFixed(2)}</div>
                <div class="text-sm text-gray-500">${new Date(f.date).toLocaleDateString('pt-BR')}</div>
                <div class="text-lg font-bold text-red-600">- R$ ${f.total_cost.toFixed(2)}</div>
            </div>
        `).join('');

        document.getElementById('history-content').innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-orange-50 p-4 rounded-lg">
                    <div class="text-sm text-gray-600">Total Manutenção</div>
                    <div class="text-2xl font-bold text-orange-600">R$ ${costs.maintenance.toFixed(2)}</div>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="text-sm text-gray-600">Total Combustível</div>
                    <div class="text-2xl font-bold text-blue-600">R$ ${costs.fuel.toFixed(2)}</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg">
                    <div class="text-sm text-gray-600">Total Custos</div>
                    <div class="text-2xl font-bold text-red-600">R$ ${costs.total.toFixed(2)}</div>
                </div>
            </div>

            <h4 class="font-bold text-lg mb-3">Histórico de Manutenção</h4>
            <div class="space-y-3 mb-6">
                ${maintenanceItems || '<p class="text-gray-500">Nenhuma manutenção registrada</p>'}
            </div>

            <h4 class="font-bold text-lg mb-3">Histórico de Combustível</h4>
            <div class="space-y-3">
                ${fuelItems || '<p class="text-gray-500">Nenhum abastecimento registrado</p>'}
            </div>
        `;
    }
};

// Funções globais
function closeMaintenanceModal() {
    document.getElementById('modals-container').innerHTML = '';
}

function switchMaintenanceTab(tab) {
    // Remover active de todos
    ['maintenance', 'fuel', 'history'].forEach(t => {
        document.getElementById(`tab-${t}`).className = 'px-4 py-2 font-semibold text-gray-500 hover:text-gray-700';
        document.getElementById(`content-${t}`).classList.add('hidden');
    });

    // Ativar selecionado
    document.getElementById(`tab-${tab}`).className = 'px-4 py-2 font-semibold border-b-2 border-teal-600 text-teal-600';
    document.getElementById(`content-${tab}`).classList.remove('hidden');
}

async function submitMaintenance() {
    const maintenanceData = {
        type: document.getElementById('maintenance-type').value,
        description: document.getElementById('maintenance-description').value,
        cost: document.getElementById('maintenance-cost').value,
        mileage: document.getElementById('maintenance-mileage').value
    };

    if (!maintenanceData.description || !maintenanceData.cost) {
        showNotification('Preencha todos os campos', 'warning');
        return;
    }

    try {
        await Maintenance.addMaintenance(maintenanceData);
        await Maintenance.loadHistory();
        Maintenance.loadHistoryContent();
        
        // Limpar formulário
        document.getElementById('maintenance-description').value = '';
        document.getElementById('maintenance-cost').value = '';
        document.getElementById('maintenance-mileage').value = '';
        
        switchMaintenanceTab('history');
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function submitFuel() {
    const fuelData = {
        liters: document.getElementById('fuel-liters').value,
        pricePerLiter: document.getElementById('fuel-price').value,
        location: document.getElementById('fuel-location').value,
        mileage: document.getElementById('fuel-mileage').value
    };

    if (!fuelData.liters || !fuelData.pricePerLiter || !fuelData.location) {
        showNotification('Preencha todos os campos', 'warning');
        return;
    }

    try {
        await Maintenance.addFuelCost(fuelData);
        await Maintenance.loadHistory();
        Maintenance.loadHistoryContent();
        
        // Limpar formulário
        document.getElementById('fuel-liters').value = '';
        document.getElementById('fuel-price').value = '';
        document.getElementById('fuel-location').value = '';
        document.getElementById('fuel-mileage').value = '';
        
        switchMaintenanceTab('history');
    } catch (error) {
        console.error('Erro:', error);
    }
}
