// GR EXPRESSO - NF-e Generator Module

const NFe = {
    generatedNFes: [],

    // Gerar NF-e
    async generate(freightData) {
        const nfeNumber = this.generateNFeNumber();
        const accessKey = this.generateAccessKey();
        
        const nfe = {
            id: Date.now(),
            nfe_number: nfeNumber,
            access_key: accessKey,
            freight_id: freightData.id,
            driver_name: freightData.driver_name,
            driver_id: freightData.driver_id,
            issue_date: new Date().toISOString(),
            origin: freightData.origin,
            destination: freightData.destination,
            cargo: freightData.cargo,
            weight: freightData.weight,
            value: freightData.value,
            vehicle_type: freightData.vehicle_type,
            status: 'active'
        };

        this.generatedNFes.push(nfe);
        
        // Salvar no localStorage
        const nfes = JSON.parse(localStorage.getItem('gr_expresso_nfes') || '[]');
        nfes.push(nfe);
        localStorage.setItem('gr_expresso_nfes', JSON.stringify(nfes));

        return nfe;
    },

    // Gerar número da NF-e
    generateNFeNumber() {
        const year = new Date().getFullYear().toString().substr(-2);
        const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        return `${year}${random}`;
    },

    // Gerar chave de acesso
    generateAccessKey() {
        let key = '';
        for (let i = 0; i < 44; i++) {
            key += Math.floor(Math.random() * 10);
        }
        return key;
    },

    // Gerar PDF da NF-e
    async generatePDF(nfeId) {
        const nfe = this.generatedNFes.find(n => n.id === nfeId) || 
                     JSON.parse(localStorage.getItem('gr_expresso_nfes') || '[]').find(n => n.id === nfeId);

        if (!nfe) {
            showNotification('NF-e não encontrada', 'error');
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Cores
            const primaryColor = [15, 118, 110]; // Teal
            const textColor = [31, 41, 55]; // Gray-800

            // Cabeçalho
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, 210, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont(undefined, 'bold');
            doc.text('GR EXPRESSO', 105, 15, { align: 'center' });

            doc.setFontSize(10);
            doc.setFont(undefined, 'italic');
            doc.text('Transportando confiança, conectando destinos.', 105, 22, { align: 'center' });

            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text('NOTA FISCAL ELETRÔNICA DE TRANSPORTE', 105, 32, { align: 'center' });

            // Informações da NF-e
            doc.setTextColor(...textColor);
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');

            let yPos = 50;

            // Box de informações principais
            doc.setDrawColor(...primaryColor);
            doc.setLineWidth(0.5);
            doc.rect(15, yPos, 180, 35);

            doc.setFont(undefined, 'bold');
            doc.text('NÚMERO DA NF-e:', 20, yPos + 8);
            doc.setFont(undefined, 'normal');
            doc.text(nfe.nfe_number, 70, yPos + 8);

            doc.setFont(undefined, 'bold');
            doc.text('DATA DE EMISSÃO:', 20, yPos + 16);
            doc.setFont(undefined, 'normal');
            doc.text(new Date(nfe.issue_date).toLocaleString('pt-BR'), 70, yPos + 16);

            doc.setFont(undefined, 'bold');
            doc.text('CHAVE DE ACESSO:', 20, yPos + 24);
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.text(this.formatAccessKey(nfe.access_key), 70, yPos + 24);

            yPos += 45;

            // Dados do Motorista
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setFillColor(240, 240, 240);
            doc.rect(15, yPos, 180, 8, 'F');
            doc.text('DADOS DO MOTORISTA', 20, yPos + 6);

            yPos += 12;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Nome: ${nfe.driver_name}`, 20, yPos);
            yPos += 7;
            doc.text(`ID: ${nfe.driver_id}`, 20, yPos);
            yPos += 7;
            doc.text(`Veículo: ${nfe.vehicle_type === 'truck' ? 'Caminhão 🚚' : 'Ônibus 🚌'}`, 20, yPos);

            yPos += 15;

            // Dados do Transporte
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setFillColor(240, 240, 240);
            doc.rect(15, yPos, 180, 8, 'F');
            doc.text('DADOS DO TRANSPORTE', 20, yPos + 6);

            yPos += 12;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Origem: ${nfe.origin}`, 20, yPos);
            yPos += 7;
            doc.text(`Destino: ${nfe.destination}`, 20, yPos);
            yPos += 7;
            doc.text(`Tipo de Carga: ${nfe.cargo}`, 20, yPos);
            yPos += 7;
            doc.text(`Peso: ${nfe.weight} kg`, 20, yPos);

            yPos += 15;

            // Valores
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setFillColor(240, 240, 240);
            doc.rect(15, yPos, 180, 8, 'F');
            doc.text('VALORES', 20, yPos + 6);

            yPos += 12;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Valor do Frete: R$ ${parseFloat(nfe.value).toFixed(2)}`, 20, yPos);

            yPos += 10;
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...primaryColor);
            doc.text(`TOTAL: R$ ${parseFloat(nfe.value).toFixed(2)}`, 20, yPos);

            // Rodapé
            doc.setTextColor(...textColor);
            doc.setFontSize(8);
            doc.setFont(undefined, 'italic');
            doc.text('Documento gerado eletronicamente pelo sistema GR EXPRESSO', 105, 280, { align: 'center' });
            doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 105, 285, { align: 'center' });

            // Código de barras simulado (linha decorativa)
            doc.setLineWidth(1);
            for (let i = 0; i < 40; i++) {
                if (Math.random() > 0.3) {
                    doc.line(15 + i * 4.5, 265, 15 + i * 4.5, 273);
                }
            }

            // Salvar PDF
            doc.save(`NF-e_${nfe.nfe_number}_GR_EXPRESSO.pdf`);
            showNotification('NF-e baixada com sucesso!', 'success');

        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            showNotification('Erro ao gerar PDF da NF-e', 'error');
        }
    },

    // Formatar chave de acesso
    formatAccessKey(key) {
        return key.match(/.{1,4}/g).join(' ');
    },

    // Listar NF-es do usuário
    getUserNFes(userId) {
        const nfes = JSON.parse(localStorage.getItem('gr_expresso_nfes') || '[]');
        return nfes.filter(nfe => nfe.driver_id === userId);
    },

    // Mostrar modal com lista de NF-es
    showNFeList() {
        const user = Auth.getCurrentUser();
        const nfes = this.getUserNFes(user.id);

        const nfeListHTML = nfes.length === 0 ? 
            '<p class="text-gray-500 text-center py-8">Nenhuma NF-e disponível</p>' :
            nfes.map(nfe => `
                <div class="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                    <div>
                        <div class="font-bold text-lg">NF-e ${nfe.nfe_number}</div>
                        <div class="text-sm text-gray-600">${nfe.origin} → ${nfe.destination}</div>
                        <div class="text-sm text-gray-500">${new Date(nfe.issue_date).toLocaleDateString('pt-BR')}</div>
                        <div class="text-sm font-semibold text-green-600 mt-1">R$ ${parseFloat(nfe.value).toFixed(2)}</div>
                    </div>
                    <button onclick="NFe.generatePDF(${nfe.id})" class="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Baixar
                    </button>
                </div>
            `).join('');

        const modal = `
            <div id="nfe-list-modal" class="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto fade-in">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold">Minhas NF-e Disponíveis</h3>
                        <button onclick="closeNFeListModal()" class="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="space-y-3">
                        ${nfeListHTML}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modals-container').innerHTML = modal;
    }
};

function closeNFeListModal() {
    document.getElementById('modals-container').innerHTML = '';
}
