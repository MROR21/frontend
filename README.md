# 🎨 Desafio Root - Client (Frontend)

Interface web moderna desenvolvida em **React** para interação com a API de gerenciamento de tarefas.

### 🛠️ Tecnologias Utilizadas
* **Framework:** React (Vite)
* **Gerenciamento de Estado:** Zustand
* **Consumo de API:** Axios
* **Estilização:** CSS3 / Módulos

### 🚀 Como Rodar o Projeto
1. **Instalação e Configuração:**
   ```bash
   # Instalar dependências
   npm install

   # Criar arquivo de ambiente (exemplo)
   # Conteúdo: VITE_API_URL=http://localhost:5000
   touch .env

   # Rodar em modo de desenvolvimento
    npm run dev

    Funcionalidades e Regras:
    - Autenticação: Login integrado com persistência de token.
    - CRUD de Tarefas: Listagem, criação, edição e exclusão.
    - Estado Global: Gerenciamento centralizado via Zustand Store.