// GR EXPRESSO - Admin Dashboard Module

async function loadAdminDashboard() {
    const users = await DB.getAllUsers();
    const freights = await DB.getAllFreights();
    const companies = await DB.getAllCompanies();
    
    const drivers = users.filter(u => u.role !== 'admin');
    const activeFreights = freights.filter(f => f.status === 'active');
    const completedFreights = freights.filter(f => f.status === 'completed');
    
    const totalEarnings = drivers.reduce((sum, u) => sum + (u.earnings || 0), 0);
    const totalLoads = drivers.reduce((sum, u) => sum + (u.month_loads || 0), 0);

    const dashboard = document.getElementById('admin-dashboard');
    dashboard.innerHTML = `
        <!-- Header -->
        <div class="bg-teal-700 text-white p-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6m5.66-14.66L14.5 7.5m-5 5l-3.16 3.16m12.32 0L15.5 12.5m-7 0L5.34 15.66"></path>
                </svg>
                <div>
                    <div class="font-bold text-xl">Painel Administrativo</div>
                    <div class="text-sm opacity-90">GR EXPRESSO</div>
                </div>
            </div>
            <button onclick="Auth.logout()" class="hover:bg-teal-600 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
            </button>
        </div>

        <div class="p-6 max-w-7xl mx-auto">
            <!-- Admin Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-white p-6 rounded-lg shadow card-hover">
                    <div class="text-gray-500 text-sm mb-2">Total Motoristas</div>
                    <div class="text-3xl font-bold text-teal-600">${drivers.length}</div>
                    <div class="text-xs text-gray-400 mt-1">Cadastrados no sistema</div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow card-hover">
                    <div class="text-gray-500 text-sm mb-2">Fretes Ativos</div>
                    <div class="text-3xl font-bold text-blue-600">${activeFreights.length}</div>
                    <div class="text-xs text-gray-400 mt-1">${completedFreights.length} concluídos</div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow card-hover">
                    <div class="text-gray-500 text-sm mb-2">Total Ganhos</div>
                    <div class="text-3xl font-bold text-green-600">R$ ${totalEarnings.toFixed(2)}</div>
                    <div class="text-xs text-gray-400 mt-1">Rendimento total</div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow card-hover">
                    <div class="text-gray-500 text-sm mb-2">Cargas do Mês</div>
                    <div class="text-3xl font-bold text-purple-600">${totalLoads}</div>
                    <div class="text-xs text-gray-400 mt-1">Entregas realizadas</div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <!-- Earnings Chart -->
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-bold mb-4">Ganhos por Motorista</h3>
                    <div class="chart-container">
                        <canvas id="earningsChart"></canvas>
                    </div>
                </div>

                <!-- Loads Chart -->
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-bold mb-4">Cargas por Veículo</h3>
                    <div class="chart-container">
                        <canvas id="vehicleChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Companies Management -->
            <div class="bg-white rounded-lg shadow p-6 mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Empresas Parceiras</h2>
                    <button onclick="showAddCompanyModal()" class="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Adicionar Empresa
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${companies.map(company => `
                        <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                            <div class="flex justify-between items-start mb-2">
                                <div class="flex-1">
                                    <div class="font-bold text-lg">${company.name}</div>
                                    <div class="text-sm text-gray-600">📍 ${company.city}</div>
                                </div>
                                <button onclick="editCompany(${company.id})" class="text-gray-400 hover:text-teal-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="mt-3">
                                <div class="text-sm text-gray-600 mb-1">Cargas Disponíveis</div>
                                <input 
                                    type="number" 
                                    value="${company.available_loads}" 
                                    onchange="updateCompanyLoads(${company.id}, this.value)"
                                    class="w-full p-2 border rounded text-center text-2xl font-bold text-teal-600"
                                >
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Active Freights -->
            <div class="bg-white rounded-lg shadow p-6 mb-6">
                <h2 class="text-xl font-bold mb-4">Fretes Ativos em Tempo Real</h2>
                ${activeFreights.length === 0 ? 
                    '<p class="text-gray-500 text-center py-8">Nenhum frete ativo no momento</p>' :
                    `<div class="overflow-x-auto">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Motorista</th>
                                    <th>Origem → Destino</th>
                                    <th>Carga</th>
                                    <th>Valor</th>
                                    <th>Iniciado</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${activeFreights.map(freight => `
                                    <tr>
                                        <td class="font-semibold">${freight.driver_name}</td>
                                        <td>${freight.origin} → ${freight.destination}</td>
                                        <td>${freight.cargo} (${freight.weight}kg)</td>
                                        <td class="font-bold text-green-600">R$ ${freight.value.toFixed(2)}</td>
                                        <td class="text-sm">${new Date(freight.start_time).toLocaleString('pt-BR')}</td>
                                        <td><span class="badge badge-success">Em Andamento</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>`
                }
            </div>

            <!-- Drivers Ranking -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-bold mb-4">Ranking de Motoristas</h2>
                <div class="space-y-3">
                    ${drivers.sort((a, b) => (b.points || 0) - (a.points || 0)).map((driver, index) => `
                        <div class="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                            <div class="flex items-center gap-4">
                                <div class="text-3xl font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : 'text-gray-400'}">
                                    #${index + 1}
                                </div>
                                <div class="avatar">${driver.name.charAt(0).toUpperCase()}</div>
                                <div>
                                    <div class="font-bold text-lg">${driver.name}</div>
                                    <div class="text-sm text-gray-600">
                                        ${driver.vehicle_type === 'truck' ? '🚚 Caminhão' : '🚌 Ônibus'} | 
                                        ${driver.completed_freights || 0} fretes concluídos
                                    </div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-xl font-bold text-purple-600">${driver.points || 0} pts</div>
                                <div class="text-sm text-gray-600">R$ ${(driver.earnings || 0).toFixed(2)}</div>
                                <div class="text-sm text-yellow-600">${(driver.rating || 5.0).toFixed(1)} ⭐</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    dashboard.classList.remove('hidden');
    
    // Renderizar gráficos
    renderAdminCharts(drivers);
}

function renderAdminCharts(drivers) {
    // Gráfico de Ganhos
    const earningsCtx = document.getElementById('earningsChart');
    if (earningsCtx) {
        new Chart(earningsCtx, {
            type: 'bar',
            data: {
                labels: drivers.slice(0, 5).map(d => d.name),
                datasets: [{
                    label: 'Ganhos (R$)',
                    data: drivers.slice(0, 5).map(d => d.earnings || 0),
                    backgroundColor: 'rgba(15, 118, 110, 0.7)',
                    borderColor: 'rgba(15, 118, 110, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Gráfico de Veículos
    const truckDrivers = drivers.filter(d => d.vehicle_type === 'truck').length;
    const busDrivers = drivers.filter(d => d.vehicle_type === 'bus').length;
    
    const vehicleCtx = document.getElementById('vehicleChart');
    if (vehicleCtx) {
        new Chart(vehicleCtx, {
            type: 'doughnut',
            data: {
                labels: ['Caminhões', 'Ônibus'],
                datasets: [{
                    data: [truckDrivers, busDrivers],
                    backgroundColor: [
                        'rgba(15, 118, 110, 0.7)',
                        'rgba(59, 130, 246, 0.7)'
                    ],
                    borderColor: [
                        'rgba(15, 118, 110, 1)',
                        'rgba(59, 130, 246, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Modal para adicionar empresa
function showAddCompanyModal() {
    const modal = `
        <div id="add-company-modal" class="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full fade-in">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Adicionar Empresa Parceira</h3>
                    <button onclick="closeAddCompanyModal()" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="space-y-4">
                    <input type="text" id="company-name" placeholder="Nome da Empresa" class="w-full p-3 border rounded">
                    <input type="text" id="company-city" placeholder="Cidade" class="w-full p-3 border rounded">
                    <input type="number" id="company-loads" placeholder="Número de Cargas Disponíveis" class="w-full p-3 border rounded">
                    <button onclick="submitAddCompany()" class="w-full bg-teal-600 text-white py-3 rounded hover:bg-teal-700">
                        Adicionar Empresa
                    </button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('modals-container').innerHTML = modal;
}

function closeAddCompanyModal() {
    document.getElementById('modals-container').innerHTML = '';
}

async function submitAddCompany() {
    const companyData = {
        name: document.getElementById('company-name').value,
        city: document.getElementById('company-city').value,
        available_loads: parseInt(document.getElementById('company-loads').value) || 0
    };

    if (!companyData.name || !companyData.city) {
        showNotification('Preencha todos os campos', 'warning');
        return;
    }

    try {
        await DB.createCompany(companyData);
        showNotification('Empresa adicionada com sucesso!', 'success');
        closeAddCompanyModal();
        loadAdminDashboard();
    } catch (error) {
        showNotification('Erro ao adicionar empresa', 'error');
    }
}

async function updateCompanyLoads(companyId, newLoads) {
    try {
        await DB.updateCompany(companyId, { available_loads: parseInt(newLoads) });
        showNotification('Cargas atualizadas!', 'success');
    } catch (error) {
        showNotification('Erro ao atualizar cargas', 'error');
    }
}

function editCompany(companyId) {
    showNotification('Recurso de edição em desenvolvimento', 'info');
}
