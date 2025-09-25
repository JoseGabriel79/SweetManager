# 📱 DuzeApp - Sweet Manager
## Documentação Completa do Projeto

---

## 🎯 **Visão Geral do Projeto**

O **DuzeApp** é um aplicativo móvel desenvolvido em React Native com Expo, projetado para gerenciar uma confeitaria ou doceria. O sistema permite o cadastro de usuários, gestão de produtos, controle de estoque e visualização de clientes, oferecendo uma solução completa para pequenos negócios do setor alimentício.

### **Arquitetura do Sistema**
- **Frontend**: React Native com Expo
- **Backend**: Node.js com Express
- **Banco de Dados**: PostgreSQL (hospedado no Railway)
- **Storage**: Supabase Storage (para imagens)
- **Deploy**: Railway (backend)

---

## 🏗️ **Estrutura do Projeto**

```
duzeapp-main/
├── 📱 Frontend (React Native)
│   ├── components/          # Componentes da aplicação
│   ├── imagens/            # Assets de imagem
│   ├── App.js              # Componente principal
│   ├── index.js            # Ponto de entrada
│   ├── package.json        # Dependências do frontend
│   └── app.json            # Configurações do Expo
│
├── 🖥️ Backend (Node.js)
│   ├── server.js           # Servidor Express
│   ├── db.js              # Configuração do banco
│   ├── package.json       # Dependências do backend
│   ├── .env               # Variáveis de ambiente
│   └── railway.toml       # Configuração do Railway
│
└── 📁 Assets
    └── assets/            # Ícones e splash screens
```

---

## 🎨 **Frontend - React Native**

### **Componentes Principais**

#### **1. App.js** - Componente Raiz
- **Função**: Ponto de entrada da aplicação
- **Responsabilidades**:
  - Configuração da navegação principal
  - Gerenciamento do estado global do usuário
  - Carregamento de fontes personalizadas

#### **2. AppNavigator.js** - Sistema de Navegação
- **Função**: Gerencia a navegação entre telas
- **Responsabilidades**:
  - Tab Navigator para navegação principal
  - Stack Navigator para telas secundárias
  - Controle de acesso baseado em autenticação

#### **3. LoginScreen.js** - Tela de Login
- **Função**: Autenticação de usuários
- **Funcionalidades**:
  - Formulário de login (email/senha)
  - Validação de credenciais
  - Navegação para tela de registro
  - Feedback visual de carregamento

#### **4. RegisterScreen.js** - Tela de Cadastro
- **Função**: Registro de novos usuários
- **Funcionalidades**:
  - Formulário completo de cadastro
  - Upload de foto de perfil via Expo ImagePicker
  - Validação de dados
  - Integração com Supabase Storage
  - Criptografia de senha

#### **5. HomeScreen.js** - Tela Principal
- **Função**: Dashboard principal do aplicativo
- **Funcionalidades**:
  - Exibição do perfil do usuário
  - Cards de navegação para funcionalidades
  - Interface responsiva
  - Carregamento dinâmico de dados do usuário

#### **6. HomeStack.js** - Navegação Interna
- **Função**: Stack Navigator para telas internas
- **Responsabilidades**:
  - Navegação entre módulos do sistema
  - Configuração de headers personalizados
  - Passagem de dados entre telas

#### **7. VitrineScreen.js** - Painel de Controle
- **Função**: Visualização e gestão de produtos
- **Funcionalidades**:
  - Listagem de produtos cadastrados
  - Modais para visualização detalhada
  - Operações CRUD (Create, Read, Update, Delete)
  - Interface responsiva com FlatList

#### **8. CadastrarProdutosScreen.js** - Cadastro de Produtos
- **Função**: Formulário para novos produtos
- **Funcionalidades**:
  - Campos: nome, preço, estoque, descrição
  - Validação de dados obrigatórios
  - Integração com API do backend
  - Feedback de sucesso/erro

#### **9. ClientesScreen.js** - Gestão de Clientes
- **Função**: Visualização de clientes cadastrados
- **Funcionalidades**:
  - Listagem de clientes
  - Informações de contato
  - Interface de gestão

#### **10. EstoqueScreen.js** - Controle de Estoque
- **Função**: Gestão de inventário
- **Status**: Tela placeholder (em desenvolvimento)

#### **11. CardsHome.js** - Componente de Navegação
- **Função**: Cards clicáveis para navegação
- **Funcionalidades**:
  - Design responsivo
  - Navegação programática
  - Estilização moderna com sombras

---

## 🖥️ **Backend - Node.js + Express**

### **Arquitetura do Servidor**

#### **server.js** - Servidor Principal
- **Framework**: Express.js
- **Middlewares**:
  - CORS para requisições cross-origin
  - Multer para upload de arquivos
  - Express.json() para parsing JSON

### **Endpoints da API**

#### **1. Usuários**
```javascript
POST /usuario - Cadastro de usuário
├── Validação de dados
├── Criptografia de senha (bcrypt)
├── Upload de imagem (Supabase)
├── Compressão de imagem (Sharp)
└── Inserção no PostgreSQL
```

#### **2. Produtos**
```javascript
POST /produto - Cadastro de produto
├── Validação de campos obrigatórios
├── Inserção no banco de dados
└── Retorno do ID gerado

GET /produtos - Listagem de produtos
├── Consulta no PostgreSQL
└── Retorno de todos os produtos
```

#### **3. Clientes**
```javascript
GET /clientes - Listagem de clientes
├── Consulta no PostgreSQL
└── Retorno de dados dos usuários
```

### **Integração com Supabase**
- **Storage**: Upload de imagens de perfil
- **Configuração**: Bucket "usuarios"
- **Processamento**: Compressão com Sharp (800x600, 80% qualidade)
- **Segurança**: Service Role Key para acesso completo

### **Banco de Dados PostgreSQL**

#### **Tabela: usuarios**
```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    imagemperfil TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Tabela: produtos**
```sql
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INTEGER NOT NULL,
    descricao TEXT,
    imagem VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 **Tecnologias e Dependências**

### **Frontend (React Native)**
- **React Native**: Framework principal
- **Expo**: Plataforma de desenvolvimento
- **React Navigation**: Sistema de navegação
- **Expo Image Picker**: Seleção de imagens
- **Axios**: Cliente HTTP
- **React Native Paper**: Componentes UI

### **Backend (Node.js)**
- **Express**: Framework web
- **PostgreSQL (pg)**: Driver do banco
- **Supabase**: Storage e autenticação
- **Multer**: Upload de arquivos
- **Sharp**: Processamento de imagens
- **bcrypt**: Criptografia de senhas
- **CORS**: Middleware para CORS
- **dotenv**: Variáveis de ambiente

---

## 🚀 **Funcionalidades Implementadas**

### ✅ **Completas**
1. **Sistema de Autenticação**
   - Login com email/senha
   - Cadastro de usuários
   - Criptografia de senhas

2. **Gestão de Usuários**
   - Upload de foto de perfil
   - Armazenamento no Supabase
   - Compressão automática de imagens

3. **Gestão de Produtos**
   - Cadastro de produtos
   - Listagem de produtos
   - Campos: nome, preço, estoque, descrição

4. **Interface de Usuário**
   - Design moderno e responsivo
   - Navegação intuitiva
   - Feedback visual

### 🔄 **Em Desenvolvimento**
1. **Controle de Estoque**
   - Tela placeholder criada
   - Funcionalidades pendentes

2. **Gestão Avançada de Produtos**
   - Upload de imagens de produtos
   - Edição e exclusão
   - Categorização

---

## 🔐 **Segurança**

### **Medidas Implementadas**
1. **Criptografia de Senhas**: bcrypt com salt
2. **Validação de Dados**: Sanitização de inputs
3. **CORS Configurado**: Controle de origem das requisições
4. **SSL/TLS**: Conexões seguras com banco
5. **Variáveis de Ambiente**: Credenciais protegidas

---

## 🌐 **Deploy e Infraestrutura**

### **Backend (Railway)**
- **URL**: https://nodejs-production-43c7.up.railway.app
- **Banco**: PostgreSQL gerenciado
- **Variáveis de Ambiente**: Configuradas no Railway

### **Storage (Supabase)**
- **Bucket**: usuarios
- **Política**: Acesso público para leitura
- **Compressão**: Automática via Sharp

---

## 📱 **Fluxo de Uso da Aplicação**

### **1. Primeiro Acesso**
```
Tela de Login → Cadastro → Upload de Foto → Home
```

### **2. Uso Regular**
```
Login → Home → Seleção de Módulo → Funcionalidade Específica
```

### **3. Gestão de Produtos**
```
Home → Cadastrar Produtos → Preenchimento → Salvamento
Home → Painel de Controle → Visualização → Gestão
```

---

## 🎨 **Design e UX**

### **Paleta de Cores**
- **Primária**: #196496 (Azul)
- **Secundária**: #51AFF9 (Azul claro)
- **Background**: #E9F1FE (Azul muito claro)
- **Texto**: #042136 (Azul escuro)

### **Tipografia**
- **Fontes**: Inter, Poppins
- **Tamanhos**: Responsivos baseados no dispositivo

### **Componentes**
- **Cards**: Sombras e bordas arredondadas
- **Botões**: Estados visuais claros
- **Inputs**: Validação visual
- **Modais**: Animações suaves

---

## 🔮 **Próximos Passos**

### **Funcionalidades Planejadas**
1. **Sistema de Pedidos**
2. **Relatórios e Analytics**
3. **Notificações Push**
4. **Integração com Pagamentos**
5. **Sistema de Delivery**
6. **Dashboard Administrativo Web**

### **Melhorias Técnicas**
1. **Testes Automatizados**
2. **CI/CD Pipeline**
3. **Monitoramento de Performance**
4. **Cache Redis**
5. **API Rate Limiting**

---

## 📞 **Suporte e Manutenção**

### **Logs e Monitoramento**
- **Backend**: Logs detalhados no Railway
- **Frontend**: Error Boundaries implementados
- **Banco**: Queries otimizadas

### **Backup e Recuperação**
- **Banco**: Backups automáticos no Railway
- **Storage**: Redundância no Supabase
- **Código**: Versionamento no Git

---

**Desenvolvido com ❤️ para facilitar a gestão de confeitarias e docerias**

*Última atualização: Janeiro 2025*