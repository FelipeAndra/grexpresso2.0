# 🚚 GR EXPRESSO - Sistema de Gestão de Transportes

> **Transportando confiança, conectando destinos.**

Sistema completo de gestão de fretes para Euro Truck Simulator 2, com dashboard para motoristas, painel administrativo, chat em tempo real, sistema de manutenção e geração automática de NF-e.

---

## 📋 Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração do Supabase](#configuração-do-supabase)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Usar](#como-usar)
- [Integração ETS2](#integração-ets2)
- [Futuras Melhorias](#futuras-melhorias)

---

## ✨ Funcionalidades

### **Para Motoristas:**
- ✅ Login e cadastro com escolha de veículo (Caminhão/Ônibus)
- ✅ Dashboard completo com estatísticas em tempo real
- ✅ Iniciar fretes personalizados
- ✅ Aceitar contratos semanais de empresas parceiras
- ✅ Sistema de pontos e ranking
- ✅ Geração automática de NF-e em PDF
- ✅ Chat em tempo real com outros motoristas
- ✅ Sistema de manutenção de veículos
- ✅ Controle de custos de combustível
- ✅ Histórico completo de fretes
- ✅ Sistema de avaliação (rating)
- ✅ Notificações em tempo real

### **Para Administradores:**
- ✅ Painel administrativo completo
- ✅ Gerenciamento de motoristas
- ✅ Gerenciamento de empresas parceiras
- ✅ Controle de cargas disponíveis
- ✅ Visualização de fretes ativos
- ✅ Gráficos e estatísticas
- ✅ Ranking de motoristas

### **Recursos Avançados:**
- ✅ Integração simulada com Euro Truck Simulator 2
- ✅ Sistema de multas e danos
- ✅ Cancelamento de fretes com penalidade
- ✅ Modo offline com localStorage
- ✅ Design responsivo
- ✅ Animações e transições suaves

---

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Estilização:** Tailwind CSS
- **Gráficos:** Chart.js
- **Ícones:** Lucide Icons
- **Geração de PDF:** jsPDF
- **Banco de Dados:** Supabase (PostgreSQL)
- **Fallback:** LocalStorage

---

## 📦 Instalação

### **1. Clone ou baixe os arquivos**

Organize os arquivos na seguinte estrutura:

```
gr-expresso/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── admin.js
│   ├── freight.js
│   ├── chat.js
│   ├── maintenance.js
│   ├── nfe-generator.js
│   └── supabase-config.js
└── database-setup.sql
```

### **2. Abra no navegador**

Simplesmente abra o arquivo `index.html` no seu navegador favorito.

**⚠️ Nota:** Para melhor experiência, use um servidor local:

```bash
# Usando Python 3
python -m http.server 8000

# Usando Node.js (http-server)
npx http-server
```

Acesse: `http://localhost:8000`

---

## 🔧 Configuração do Supabase

### **Passo 1: Criar conta no Supabase**

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto

### **Passo 2: Configurar banco de dados**

1. No painel do Supabase, vá em **SQL Editor**
2. Copie todo o conteúdo do arquivo `database-setup.sql`
3. Cole e execute no SQL Editor
4. Verifique se todas as tabelas foram criadas

### **Passo 3: Obter credenciais**

1. Vá em **Settings** → **API**
2. Copie:
   - **URL** (Project URL)
   - **anon public** (API Key)

### **Passo 4: Configurar o sistema**

Abra o arquivo `js/supabase-config.js` e substitua:

```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-aqui';
```

---

## 📁 Estrutura do Projeto

```
📂 gr-expresso/
│
├── 📄 index.html                 # Página principal
│
├── 📂 css/
│   └── 📄 styles.css            # Estilos customizados
│
├── 📂 js/
│   ├── 📄 app.js                # Inicialização e controle principal
│   ├── 📄 auth.js               # Sistema de autenticação
│   ├── 📄 dashboard.js          # Dashboard do motorista
│   ├── 📄 admin.js              # Painel administrativo
│   ├── 📄 freight.js            # Gestão de fretes
│   ├── 📄 chat.js               # Sistema de chat
│   ├── 📄 maintenance.js        # Manutenção e combustível
│   ├── 📄 nfe-generator.js      # Gerador de NF-e
│   └── 📄 supabase-config.js    # Configuração do banco
│
└── 📄 database-setup.sql        # Scripts SQL para Supabase
```

---

## 🚀 Como Usar

### **Acesso Rápido (Modo Demo)**

**Login como Admin:**
- Na tela de login, clique em "Acesso Administrativo"
- Será redirecionado para o painel admin

**Cadastro como Motorista:**
1. Clique em "Cadastro"
2. Preencha: Nome, Email, Senha
3. Escolha o tipo de veículo (Caminhão ou Ônibus)
4. Clique em "Cadastrar"
5. Faça login com suas credenciais

### **Dashboard do Motorista**

**Iniciar Frete:**
1. Clique em "Novo Frete"
2. Preencha origem, destino, carga, peso e valor
3. Clique em "Iniciar Frete e Gerar NF-e"
4. A NF-e será gerada automaticamente

**Aceitar Contrato Semanal:**
1. Veja as empresas parceiras na parte inferior
2. Clique em "Aceitar Contrato"
3. Personalize o destino se necessário
4. Confirme para iniciar o frete com bônus de +25 pontos

**Gerenciar Manutenção:**
1. Clique em "Manutenção"
2. Registre manutenções ou abastecimentos
3. Veja seu histórico completo

**Chat:**
1. Clique no ícone de chat no topo
2. Digite sua mensagem
3. Pressione Enter ou clique em "Enviar"

**Baixar NF-e:**
1. Clique em "Minhas NF-e"
2. Escolha a nota fiscal
3. Clique em "Baixar" para gerar o PDF

### **Painel Administrativo**

**Adicionar Empresa:**
1. Clique em "Adicionar Empresa"
2. Preencha nome, cidade e número de cargas
3. Confirme

**Gerenciar Cargas:**
- Altere o número diretamente no campo de cada empresa
- As alterações são salvas automaticamente

**Visualizar Estatísticas:**
- Veja gráficos de ganhos e distribuição de veículos
- Acompanhe fretes ativos em tempo real
- Confira o ranking completo de motoristas

---

## 🎮 Integração ETS2

### **Simulador Mock (Incluído)**

O sistema inclui um simulador mock que gera eventos automaticamente:
- Danos aleatórios (colisões, pneus, motor)
- Multas (excesso de velocidade, sinais)
- Consumo de combustível

### **Integração Real (Futura)**

Para integrar com Euro Truck Simulator 2:

1. **Instalar plugin/mod no ETS2**
2. **Conectar via WebSocket**
3. **Ativar integração no sistema**

```javascript
// No console do navegador
connectETS2();
```

**Eventos sincronizados:**
- Danos ao veículo
- Multas de trânsito
- Consumo de combustível
- Distância percorrida
- Cancelamento de cargas

---

## 🔮 Futuras Melhorias

### **Em Desenvolvimento:**
- [ ] Sistema de conquistas e badges
- [ ] Marketplace de cargas
- [ ] Modo multiplayer cooperativo
- [ ] Integração com API de rotas reais (Google Maps)
- [ ] Sistema de frota (múltiplos veículos)
- [ ] Relatórios financeiros detalhados
- [ ] App mobile (React Native)
- [ ] Sistema de seguros
- [ ] Clima e condições das estradas
- [ ] Sistema de empréstimos e financiamentos

### **Integrações Planejadas:**
- [ ] WhatsApp Business (notificações)
- [ ] Telegram Bot
- [ ] Discord Webhook
- [ ] API REST completa
- [ ] Export para Excel/CSV

---

## 🎨 Personalização

### **Cores do Sistema:**

```css
:root {
    --primary-color: #0F766E;      /* Teal */
    --primary-dark: #115E59;
    --primary-light: #14B8A6;
    --accent-color: #9DFF00;       /* Verde Limão */
    --success-color: #10B981;
    --danger-color: #EF4444;
    --warning-color: #F59E0B;
}
```

Edite em `css/styles.css` para personalizar.

### **Logo:**

Substitua a logo no header de `index.html`:

```html
<div class="text-4xl font-bold text-teal-700 mb-2">
    <img src="assets/logo.png" alt="GR EXPRESSO">
</div>
```

---

## 🐛 Solução de Problemas

### **NF-e não está sendo gerada?**
- Verifique se o jsPDF foi carregado corretamente
- Abra o Console (F12) e veja se há erros

### **Dados não estão salvando?**
- Se Supabase não estiver configurado, o sistema usa localStorage
- Verifique as credenciais no `supabase-config.js`

### **Chat não está funcionando?**
- Verifique a conexão com o banco de dados
- Em modo local, as mensagens ficam apenas na sessão

### **Gráficos não aparecem?**
- Certifique-se de que Chart.js foi carregado
- Verifique se há dados de motoristas cadastrados

---

## 📞 Suporte

Para dúvidas ou sugestões:
- 📧 Email: suporte@grexpresso.com
- 💬 Discord: [GR EXPRESSO Community](#)
- 🐛 Issues: [GitHub Issues](#)

---

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

## 🙏 Créditos

Desenvolvido com ❤️ para a comunidade Euro Truck Simulator 2

**Tecnologias utilizadas:**
- [Tailwind CSS](https://tailwindcss.com)
- [Chart.js](https://chartjs.org)
- [Lucide Icons](https://lucide.dev)
- [jsPDF](https://github.com/parallax/jsPDF)
- [Supabase](https://supabase.com)

---

## 🚀 Deploy

### **Opções de Deploy:**

**1. Netlify (Recomendado)**
```bash
# Arraste a pasta para netlify.com/drop
```

**2. Vercel**
```bash
vercel --prod
```

**3. GitHub Pages**
```bash
# Commit e push para GitHub
# Habilitar Pages nas configurações
```

**4. Servidor Próprio**
```bash
# Upload via FTP para seu servidor
```

---

## 📊 Status do Projeto

🟢 **Ativo** - Em constante desenvolvimento

**Última atualização:** Novembro 2024  
**Versão:** 1.0.0

---

**Boas viagens! 🚚💨**
