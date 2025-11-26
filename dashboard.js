// GR EXPRESSO - Driver Dashboard Module

async function loadDriverDashboard() {
    const user = Auth.getCurrentUser();
    await Freight.loadActiveFreights();
    await Maintenance.loadHistory();
    
    const companies = await DB.getAllCompanies();
    const activeFreights = Freight.activeFreights;

    const dashboard = document.getElementById('driver-dashboard');
    dashboard.innerHTML = `
        <!-- Header -->
        <div class="bg-teal-700 text-white p-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <div>
                    <div class="font-bold text-xl">GR EXPRESSO</div>
                    <div class="text-sm opacity-90">Olá, ${user.name}!</div>
                </div>
            </div>
            <div class="flex gap-4 items-center">
                <button onclick="Chat.open()" class="relative hover:bg-teal-600 p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
                <button onclick="Auth.logout()" class="hover:bg-teal-600 p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </button>
            </div>
        </div>

        <div class="p-6 max-w-7xl mx-auto">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-white p-6 rounded-lg shadow card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-gray-500 text-sm">Ganhos do Mês</div>
                            <div class="text-2xl font-bold text-green-600">R$ ${(user.earnings || 0).toFixed(2)}</div>
                        </div>
                        <div class="text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-gray-500 text-sm">Cargas do Mês</div>
                            <div class="text-2xl font-bold text-blue-600">${user.month_loads || 0}</div>
                        </div>
                        <div class="text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-gray-500 text-sm">Pontos</div>
                            <div class="text-2xl font-bold text-purple-600">${user.points || 0}</div>
                        </div>
                        <div class="text-purple-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="8" r="7"></circle>
                                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-gray-500 text-sm">Avaliação</div>
                            <div class="text-2xl font-bold text-yellow-600">${(user.rating || 5.0).toFixed(1)} ⭐</div>
                        </div>
                        <div class="text-yellow-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <button onclick="showFreightModal()" class="bg-teal-600 text-white p-4 rounded-lg shadow hover:bg-teal-700 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Novo Frete
                </button>

                <button onclick="NFe.showNFeList()" class="bg-blue-600 text-white p-4 rounded-lg shadow hover:bg-blue-700 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    Minhas NF-e
                </button>

                <button onclick="Maintenance.showMaintenanceModal()" class="bg-orange-600 text-white p-4 rounded-lg shadow hover:bg-orange-700 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                    </svg>
                    Manutenção
                </button>

                <button onclick="showRankingModal()" class="bg-purple-600 text-white p-4 rounded-lg shadow hover:bg-purple-700 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                    Ranking
                </button>
            </div>

            <!-- Active Freights -->
            <div class="bg-white rounded-lg shadow p-6 mb-6">
                <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                    Fretes Ativos
                </h2>
                ${activeFreights.length === 0 ? 
                    '<p class="text-gray-500 text-center py-8">Nenhum frete ativo no momento. Inicie um novo frete ou aceite um contrato semanal!</p>' :
                    `<div class="space-y-4">
                        ${activeFreights.map(freight => `
                            <div class="border rounded-lg p-4 hover:bg-gray-50">
                                <div class="flex justify-between items-start mb-3">
                                    <div class="flex-1">
                                        <div class="font-bold text-lg">${freight.origin} → ${freight.destination}</div>
                                        <div class="text-sm text-gray-600 mt-1">
                                            <span class="inline-block mr-4">📦 ${freight.cargo}</span>
                                            <span class="inline-block mr-4">⚖️ ${freight.weight}kg</span>
                                            <span class="inline-block">${freight.vehicle_type === 'truck' ? '🚚' : '🚌'}</span>
                                        </div>
                                        <div class="text-sm text-green-600 font-semibold mt-2">💰 R$ ${freight.value.toFixed(2)}</div>
                                        ${freight.bonus_points ? `<div class="text-sm text-purple-600 font-semibold">⭐ +${freight.bonus_points} pontos bônus</div>` : ''}
                                    </div>
                                    <div class="flex gap-2">
                                        <button onclick="finishFreightAction(${freight.id})" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                                            Finalizar
                                        </button>
                                        <button onclick="cancelFreightAction(${freight.id})" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                                <div class="text-xs text-gray-500">
                                    Iniciado: ${new Date(freight.start_time).toLocaleString('pt-BR')}
                                </div>
                            </div>
                        `).join('')}
                    </div>`
                }
            </div>

            <!-- Weekly Contracts -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    Contratos Semanais - Empresas Parceiras
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${companies.map(company => `
                        <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <div class="font-bold text-lg">${company.name}</div>
                                    <div class="text-sm text-gray-600">📍 ${company.city}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-sm text-gray-600">Cargas</div>
                                    <div class="text-3xl font-bold text-teal-600">${company.available_loads}</div>
                                </div>
                            </div>
                            <button 
                                onclick="acceptContractAction(${company.id}, '${company.name}', '${company.city}')"
                                class="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 mt-2"
                                ${company.available_loads === 0 ? 'disabled' : ''}
                            >
                                ${company.available_loads > 0 ? 'Aceitar Contrato (+25 pontos)' : 'Sem Cargas Disponíveis'}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    dashboard.classList.remove('hidden');
}

// Ações dos fretes
async function finishFreightAction(freightId) {
    if (confirm('Deseja finalizar este frete?')) {
        await Freight.finishFreight(freightId);
        loadDriverDashboard();
    }
}

async function cancelFreightAction(freightId) {
    const reason = prompt('Motivo do cancelamento:');
    if (reason) {
        await Freight.cancelFreight(freightId, reason);
        loadDriverDashboard();
    }
}

// Aceitar contrato
function acceptContractAction(companyId, companyName, city) {
    const modal = `
        <div id="contract-modal" class="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full fade-in">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Aceitar Contrato</h3>
                    <button onclick="closeContractModal()" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="space-y-3 mb-4">
                    <div><strong>Empresa:</strong> ${companyName}</div>
                    <div><strong>Origem:</strong> ${city}</div>
                    <div><strong>Carga:</strong> Carga Geral</div>
                    <div><strong>Peso:</strong> ${Math.floor(Math.random() * 20000) + 5000} kg</div>
                    <div><strong>Valor:</strong> R$ ${(Math.random() * 3000 + 1000).toFixed(2)}</div>
                    <div class="text-purple-600 font-bold"><strong>Bônus:</strong> +25 pontos</div>
                    <input type="text" id="contract-destination" placeholder="Destino (personalize se necessário)" class="w-full p-3 border rounded mt-2">
                </div>
                <button onclick="confirmContractAccept(${companyId}, '${companyName}', '${city}')" class="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">
                    Confirmar e Iniciar Frete
                </button>
            </div>
        </div>
    `;
    document.getElementById('modals-container').innerHTML = modal;
}

function closeContractModal() {
    document.getElementById('modals-container').innerHTML = '';
}

async function confirmContractAccept(companyId, companyName, city) {
    const destination = document.getElementById('contract-destination').value || 'A definir';
    
    const contract = {
        id: Date.now(),
        companyId: companyId,
        origin: city,
        destination: destination,
        cargo: 'Carga Geral',
        weight: Math.floor(Math.random() * 20000) + 5000,
        value: (Math.random() * 3000 + 1000).toFixed(2),
        bonusPoints: 25
    };

    await Freight.acceptContract(contract, destination);
    closeContractModal();
    loadDriverDashboard();
}

// Mostrar ranking
async function showRankingModal() {
    const users = await DB.getAllUsers();
    const sortedUsers = users.filter(u => u.role !== 'admin').sort((a, b) => (b.points || 0) - (a.points || 0));
    const currentUser = Auth.getCurrentUser();

    const rankingHTML = sortedUsers.map((user, index) => {
        const isCurrentUser = user.id === currentUser.id;
        return `
            <div class="border rounded-lg p-4 flex justify-between items-center ${isCurrentUser ? 'bg-teal-50 border-teal-500' : 'hover:bg-gray-50'}">
                <div class="flex items-center gap-4">
                    <div class="text-3xl font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : 'text-gray-400'}">
                        ${index + 1}°
                    </div>
                    <div>
                        <div class="font-bold text-lg">${user.name} ${isCurrentUser ? '(Você)' : ''}</div>
                        <div class="text-sm text-gray-600">
                            ${user.vehicle_type === 'truck' ? '🚚 Caminhão' : '🚌 Ônibus'}
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-purple-600">${user.points || 0} pts</div>
                    <div class="text-sm text-gray-600">R$ ${(user.earnings || 0).toFixed(2)}</div>
                    <div class="text-sm text-yellow-600">${(user.rating || 5.0).toFixed(1)} ⭐</div>
                </div>
            </div>
        `;
    }).join('');

    const modal = `
        <div id="ranking-modal" class="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-auto fade-in">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold">🏆 Ranking de Motoristas</h3>
                    <button onclick="closeRankingModal()" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="space-y-3">
                    ${rankingHTML || '<p class="text-gray-500 text-center py-8">Nenhum motorista cadastrado</p>'}
                </div>
            </div>
        </div>
    `;

    document.getElementById('modals-container').innerHTML = modal;
}

function closeRankingModal() {
    document.getElementById('modals-container').innerHTML = '';
}
