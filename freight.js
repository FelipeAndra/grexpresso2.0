// GR EXPRESSO - Freight Management Module

const Freight = {
    activeFreights: [],
    contracts: [],

    // Iniciar novo frete
    async startFreight(freightData) {
        try {
            const user = Auth.getCurrentUser();
            
            const freight = {
                driver_id: user.id,
                driver_name: user.name,
                origin: freightData.origin,
                destination: freightData.destination,
                cargo: freightData.cargo,
                weight: parseFloat(freightData.weight),
                value: parseFloat(freightData.value),
                vehicle_type: user.vehicle_type,
                status: 'active',
                start_time: new Date().toISOString(),
                distance_km: Math.floor(Math.random() * 1000) + 100,
                fuel_consumed: 0,
                damages: [],
                fines: []
            };

            const createdFreight = await DB.createFreight(freight);
            this.activeFreights.push(createdFreight);

            // Gerar NF-e automaticamente
            await NFe.generate(createdFreight);

            showNotification('Frete iniciado com sucesso! NF-e gerada.', 'success');
            return createdFreight;
        } catch (error) {
            showNotification('Erro ao iniciar frete', 'error');
            throw error;
        }
    },

    // Aceitar contrato semanal
    async acceptContract(contract, customDestination = null) {
        try {
            const user = Auth.getCurrentUser();
            
            const freight = {
                driver_id: user.id,
                driver_name: user.name,
                contract_id: contract.id,
                company_id: contract.companyId,
                origin: contract.origin,
                destination: customDestination || contract.destination || 'A definir',
                cargo: contract.cargo,
                weight: contract.weight,
                value: contract.value,
                vehicle_type: user.vehicle_type,
                status: 'active',
                start_time: new Date().toISOString(),
                bonus_points: contract.bonusPoints || 25,
                distance_km: Math.floor(Math.random() * 1000) + 100,
                is_contract: true,
                fuel_consumed: 0,
                damages: [],
                fines: []
            };

            const createdFreight = await DB.createFreight(freight);
            this.activeFreights.push(createdFreight);

            // Gerar NF-e
            await NFe.generate(createdFreight);

            // Diminuir cargas disponíveis da empresa
            const companies = await DB.getAllCompanies();
            const company = companies.find(c => c.id === contract.companyId);
            if (company && company.available_loads > 0) {
                await DB.updateCompany(contract.companyId, {
                    available_loads: company.available_loads - 1
                });
            }

            showNotification('Contrato aceito! Frete iniciado com bônus.', 'success');
            return createdFreight;
        } catch (error) {
            showNotification('Erro ao aceitar contrato', 'error');
            throw error;
        }
    },

    // Finalizar frete
    async finishFreight(freightId) {
        try {
            const user = Auth.getCurrentUser();
            const freight = this.activeFreights.find(f => f.id === freightId);
            
            if (!freight) {
                throw new Error('Frete não encontrado');
            }

            // Calcular tempo de viagem
            const startTime = new Date(freight.start_time);
            const endTime = new Date();
            const travelTimeHours = Math.abs(endTime - startTime) / 36e5;

            // Atualizar status do frete
            await DB.updateFreight(freightId, {
                status: 'completed',
                end_time: endTime.toISOString(),
                travel_time_hours: travelTimeHours.toFixed(2)
            });

            // Calcular ganhos e pontos
            const earnings = parseFloat(freight.value);
            const points = freight.bonus_points || 10;
            const rating = this.calculateRating(freight);

            // Atualizar usuário
            await Auth.updateCurrentUser({
                earnings: (user.earnings || 0) + earnings,
                points: (user.points || 0) + points,
                month_loads: (user.month_loads || 0) + 1,
                completed_freights: (user.completed_freights || 0) + 1,
                rating: ((user.rating || 5.0) + rating) / 2
            });

            // Remover dos ativos
            this.activeFreights = this.activeFreights.filter(f => f.id !== freightId);

            showNotification(`Frete finalizado! +R$${earnings.toFixed(2)} +${points} pontos`, 'success');
            
            return { earnings, points, rating };
        } catch (error) {
            showNotification('Erro ao finalizar frete', 'error');
            throw error;
        }
    },

    // Calcular avaliação baseado em performance
    calculateRating(freight) {
        let rating = 5.0;
        
        // Penalidades por danos
        if (freight.damages && freight.damages.length > 0) {
            rating -= freight.damages.length * 0.5;
        }
        
        // Penalidades por multas
        if (freight.fines && freight.fines.length > 0) {
            rating -= freight.fines.length * 0.3;
        }
        
        // Bonus por entregas rápidas
        const travelTime = freight.travel_time_hours || 0;
        if (travelTime < 2) {
            rating += 0.2;
        }
        
        return Math.max(1, Math.min(5, rating));
    },

    // Carregar fretes ativos
    async loadActiveFreights() {
        try {
            const user = Auth.getCurrentUser();
            this.activeFreights = await DB.getActiveFreights(user.id);
            return this.activeFreights;
        } catch (error) {
            console.error('Erro ao carregar fretes:', error);
            return [];
        }
    },

    // Adicionar dano ao frete
    async addDamage(freightId, damage) {
        try {
            const freight = this.activeFreights.find(f => f.id === freightId);
            if (freight) {
                const damages = freight.damages || [];
                damages.push({
                    type: damage.type,
                    description: damage.description,
                    cost: damage.cost,
                    timestamp: new Date().toISOString()
                });
                
                await DB.updateFreight(freightId, { damages });
                showNotification('Dano registrado no frete', 'warning');
            }
        } catch (error) {
            showNotification('Erro ao registrar dano', 'error');
        }
    },

    // Adicionar multa ao frete
    async addFine(freightId, fine) {
        try {
            const freight = this.activeFreights.find(f => f.id === freightId);
            if (freight) {
                const fines = freight.fines || [];
                fines.push({
                    type: fine.type,
                    value: fine.value,
                    location: fine.location,
                    timestamp: new Date().toISOString()
                });
                
                await DB.updateFreight(freightId, { fines });
                showNotification(`Multa de R$${fine.value} registrada`, 'warning');
            }
        } catch (error) {
            showNotification('Erro ao registrar multa', 'error');
        }
    },

    // Cancelar frete (com penalidade)
    async cancelFreight(freightId, reason) {
        try {
            const user = Auth.getCurrentUser();
            const freight = this.activeFreights.find(f => f.id === freightId);
            
            if (!freight) {
                throw new Error('Frete não encontrado');
            }

            // Atualizar status
            await DB.updateFreight(freightId, {
                status: 'cancelled',
                cancellation_reason: reason,
                cancelled_at: new Date().toISOString()
            });

            // Aplicar penalidade
            const penalty = freight.value * 0.3; // 30% do valor
            const pointsPenalty = 15;

            await Auth.updateCurrentUser({
                earnings: (user.earnings || 0) - penalty,
                points: Math.max(0, (user.points || 0) - pointsPenalty)
            });

            this.activeFreights = this.activeFreights.filter(f => f.id !== freightId);

            showNotification(`Frete cancelado. Penalidade: -R$${penalty.toFixed(2)} -${pointsPenalty} pontos`, 'error');
        } catch (error) {
            showNotification('Erro ao cancelar frete', 'error');
            throw error;
        }
    },

    // Simular integração com Euro Truck Simulator 2
    simulateETS2Integration(freightId, etsData) {
        // etsData contém informações do simulador
        const freight = this.activeFreights.find(f => f.id === freightId);
        
        if (freight) {
            // Atualizar dados baseado no simulador
            if (etsData.damages) {
                etsData.damages.forEach(dmg => this.addDamage(freightId, dmg));
            }
            
            if (etsData.fines) {
                etsData.fines.forEach(fine => this.addFine(freightId, fine));
            }
            
            if (etsData.fuelConsumed) {
                DB.updateFreight(freightId, { fuel_consumed: etsData.fuelConsumed });
            }
            
            console.log('ETS2 Data synchronized:', etsData);
        }
    }
};

// Mostrar modal de novo frete
function showFreightModal() {
    const modal = `
        <div id="freight-modal" class="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full fade-in">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">Iniciar Novo Frete</h3>
                    <button onclick="closeFreightModal()" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="space-y-4">
                    <input type="text" id="freight-origin" placeholder="Origem" class="w-full p-3 border rounded">
                    <input type="text" id="freight-destination" placeholder="Destino" class="w-full p-3 border rounded">
                    <input type="text" id="freight-cargo" placeholder="Tipo de Carga" class="w-full p-3 border rounded">
                    <input type="number" id="freight-weight" placeholder="Peso (kg)" class="w-full p-3 border rounded">
                    <input type="number" id="freight-value" placeholder="Valor (R$)" step="0.01" class="w-full p-3 border rounded">
                    <button onclick="submitNewFreight()" class="w-full bg-teal-600 text-white py-3 rounded hover:bg-teal-700">
                        Iniciar Frete e Gerar NF-e
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modals-container').innerHTML = modal;
}

function closeFreightModal() {
    document.getElementById('modals-container').innerHTML = '';
}

async function submitNewFreight() {
    const freightData = {
        origin: document.getElementById('freight-origin').value,
        destination: document.getElementById('freight-destination').value,
        cargo: document.getElementById('freight-cargo').value,
        weight: document.getElementById('freight-weight').value,
        value: document.getElementById('freight-value').value
    };
    
    if (!freightData.origin || !freightData.destination || !freightData.cargo || !freightData.weight || !freightData.value) {
        showNotification('Preencha todos os campos', 'warning');
        return;
    }
    
    try {
        await Freight.startFreight(freightData);
        closeFreightModal();
        loadDriverDashboard(); // Recarregar dashboard
    } catch (error) {
        console.error('Erro ao criar frete:', error);
    }
}
