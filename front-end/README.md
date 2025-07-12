# 📋 Visão Geral do Projeto

O **CIn Chat** é uma interface de chat com IA desenvolvida especificamente para o Centro de Informática da UFPE. A aplicação oferece autenticação JWT, gerenciamento de conversas e uma interface moderna similar ao ChatGPT.

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico

- **Frontend:** React 18 + TypeScript + Vite
- **Estilização:** Tailwind CSS + shadcn/ui
- **Autenticação:** JWT (JSON Web Tokens)
- **Gerenciamento de Estado:** React Context API
- **Comunicação:** Fetch API REST
- **Formatação de Datas:** date-fns

### Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── chat/           # Componentes do chat
│   └── ui/             # Componentes base (shadcn/ui)
├── hooks/              # Custom hooks
├── pages/              # Páginas principais
├── types/              # Definições TypeScript
└── lib/                # Utilitários
```

---

## 🔐 Sistema de Autenticação

### Types (`src/types/auth.ts`)

Define as interfaces para o sistema de autenticação:

- **`User`**: Dados do usuário (id, email, name)
- **`AuthState`**: Estado global da autenticação
- **`LoginCredentials`**: Dados para login
- **`RegisterCredentials`**: Dados para registro
- **`ResetPasswordCredentials`**: Dados para redefinir senha

### Hook de Autenticação (`src/hooks/useAuth.tsx`)

**Funcionalidades principais:**

- **Provider Context**: Gerencia o estado global de autenticação
- **Persistência**: Armazena JWT e dados do usuário no localStorage
- **Usuário de Teste**: Email `1@1.com` bypassa autenticação para testes
- **Validação**: Registros requerem email `@cin.ufpe.br`

**Métodos disponíveis:**

- `login(credentials)`: Autentica usuário
- `register(credentials)`: Cria nova conta
- `resetPassword(credentials)`: Altera senha
- `logout()`: Remove dados de sessão
- `deleteAccount()`: Remove conta do servidor

**Fluxo de Autenticação:**

1. Verifica token salvo no localStorage na inicialização
2. Para login normal: `POST /auth` com credenciais
3. Para usuário teste (`1@1.com`): Cria sessão local sem servidor
4. Armazena JWT e dados do usuário localmente
5. Atualiza estado global da aplicação

### Componentes de Autenticação

#### LoginForm (`src/components/auth/LoginForm.tsx`)

- **Função:** Formulário principal de login
- **Recursos:**
  - Campos email/senha com validação
  - Toggle de visibilidade da senha
  - Estados de loading
  - Links para registro e recuperação de senha
- **Comportamento:** Chama `useAuth().login()` no submit

#### RegisterForm (`src/components/auth/RegisterForm.tsx`)

- **Função:** Cadastro de novos usuários
- **Validações:**
  - Email deve terminar com `@cin.ufpe.br`
  - Confirmação de senha obrigatória
- **Comportamento:** Retorna ao login após sucesso

#### ResetPasswordForm (`src/components/auth/ResetPasswordForm.tsx`)

- **Função:** Redefinição de senha
- **Campos:** Email e nova senha
- **Comportamento:** Chama endpoint `PUT /auth`

---

## 💬 Sistema de Chat

### Types (`src/types/chat.ts`)

Define estruturas para o sistema de chat:

- **`Message`**: Mensagem individual (id, conteúdo, autor, timestamp)
- **`Chat`**: Conversa completa com histórico de mensagens
- **`CreateChatRequest`**: Payload para criar nova conversa
- **`SendMessageRequest`**: Payload para enviar mensagem

### Hook de Chat (`src/hooks/useChat.tsx`)

**Estado gerenciado:**

- `chats`: Lista de todas as conversas
- `currentChat`: Conversa ativa
- `loading`: Estado de carregamento

**Métodos disponíveis:**

- `fetchChats()`: `GET /chat` - Lista todas as conversas
- `fetchChat(id)`: `GET /chat/:id` - Carrega conversa específica
- `createChat(request)`: `POST /chat` - Cria nova conversa
- `sendMessage(chatId, request)`: `POST /chat/:id` - Envia mensagem
- `deleteChat(chatId)`: `DELETE /chat/:id` - Remove conversa

### Componentes de Chat

#### ChatSidebar (`src/components/chat/ChatSidebar.tsx`)

- **Função:** Menu lateral com navegação e lista de chats
- **Recursos:**
  - Lista de conversas anteriores
  - Botão para nova conversa
  - Menu do usuário (logout, deletar conta)
  - Responsivo (collapsa em mobile)
  - Confirmação para deletar conversas/conta

**Comportamento:**

- Carrega lista de chats na inicialização
- Permite seleção de chat ativo
- Gerencia estado de visibilidade (desktop/mobile)

#### ChatInterface (`src/components/chat/ChatInterface.tsx`)

- **Função:** Interface principal de conversação
- **Recursos:**
  - Exibição de mensagens com diferenciação visual (usuário/IA)
  - Campo de entrada com suporte a Enter/Shift+Enter
  - Auto-scroll para última mensagem
  - Estados de loading e envio
  - Timestamps formatados em português

**Estados da Interface:**

- **Sem chat selecionado:** Tela de boas-vindas
- **Carregando:** Spinner de loading
- **Chat ativo:** Mensagens + campo de entrada

#### NewChatDialog (`src/components/chat/NewChatDialog.tsx`)

- **Função:** Modal para criar nova conversa
- **Comportamento:**
  - Textarea para pergunta inicial
  - Suporte a Enter (sem Shift) para submit
  - Retorna ID do chat criado
  - Fecha automaticamente após sucesso

---

## 📱 Páginas Principais

### Index (`src/pages/Index.tsx`)

- **Função:** Roteador principal da aplicação
- **Lógica:** Verifica autenticação e direciona para AuthPage ou ChatPage

### AuthPage (`src/pages/AuthPage.tsx`)

- **Função:** Container para fluxo de autenticação
- **Estados:** `'login'`, `'register'`, `'reset'`
- **Navegação:** Controla transições entre formulários

### ChatPage (`src/pages/ChatPage.tsx`)

- **Função:** Interface principal do chat autenticado
- **Componentes:** ChatSidebar + ChatInterface + NewChatDialog
- **Estado:** Gerencia chat ativo e visibilidade da sidebar

---

## 🔄 Fluxo de Dados

### Inicialização da Aplicação

1. Index verifica estado de autenticação
2. Se não autenticado → AuthPage
3. Se autenticado → ChatPage

### Fluxo de Autenticação

1. Usuário insere credenciais em LoginForm
2. `useAuth.login()` faz requisição para servidor
3. Em caso de sucesso, armazena JWT e atualiza estado
4. Index detecta mudança e redireciona para ChatPage

### Fluxo de Chat

1. ChatPage renderiza ChatSidebar que carrega lista de chats
2. Usuário seleciona chat → ChatInterface carrega mensagens
3. Usuário envia mensagem → Atualiza conversa atual
4. Nova conversa → NewChatDialog → Cria chat → Seleciona automaticamente

---

## 🛡️ Tratamento de Erros

### Autenticação

- **401 Unauthorized:** Token inválido → Redirect para login
- **400 Bad Request:** Credenciais inválidas → Toast de erro
- **422 Validation:** Email não `@cin.ufpe.br` → Toast específico

### Chat

- **404 Not Found:** Chat inexistente → Toast + volta para lista
- **401 Unauthorized:** Sessão expirada → Toast + redirect login
- **400/500:** Erros gerais → Toast com mensagem amigável

---

## 🎨 Design System

### Cores Principais

- **Primária:** Vermelho (`bg-red-600`) - Identidade CIn UFPE
- **Secundária:** Cinza (`bg-gray-900`) - Sidebar
- **Fundo:** Gradiente vermelho/cinza (`from-red-50 to-gray-100`)

### Componentes UI (shadcn/ui)

- **Button:** Botões com variantes (primary, ghost, outline)
- **Input/Textarea:** Campos de formulário
- **Card:** Containers para formulários
- **Dialog:** Modais (nova conversa, confirmações)
- **ScrollArea:** Área de mensagens com scroll customizado
- **Toast:** Notificações não-intrusivas

---

## 🔧 Configurações e Variáveis

### Variáveis de Ambiente

- **`VITE_SERVER_PATH`:** URL base da API (padrão: `http://localhost:3001`)

### Usuário de Teste

- **Email:** `1@1.com`
- **Comportamento:** Bypassa autenticação JWT para desenvolvimento

---

## 📡 API Endpoints

### Autenticação (`/auth`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth` | Login (email, password) |
| `POST` | `/auth` + `action=register` | Registro (email, password) |
| `PUT` | `/auth` | Redefinir senha (email, newPassword) |
| `DELETE` | `/auth` | Deletar conta (Authorization: Bearer JWT) |

### Chat (`/chat`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/chat` | Listar conversas do usuário |
| `POST` | `/chat` | Criar nova conversa (question, userData) |
| `GET` | `/chat/:id` | Buscar conversa específica |
| `POST` | `/chat/:id` | Enviar mensagem (message) |
| `DELETE` | `/chat/:id` | Deletar conversa |

---

## 🚀 Funcionalidades Especiais

### Responsividade

- **Desktop:** Sidebar fixa, interface completa
- **Mobile:** Sidebar colapsável, botão hambúrguer
- **Adaptação:** Layout fluido para diferentes tamanhos

### Acessibilidade

- **Keyboard Navigation:** Suporte a Tab/Enter
- **Screen Readers:** Labels apropriados
- **Focus Management:** Estados visuais claros
- **Color Contrast:** Cores com contraste adequado

### Performance

- **Lazy Loading:** Componentes carregados sob demanda
- **Local Storage:** Cache de autenticação
- **Optimistic Updates:** Feedback imediato ao usuário
- **Error Boundaries:** Tratamento robusto de erros