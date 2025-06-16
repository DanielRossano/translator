# Translation Service

Um serviço de tradução baseado em microserviços utilizando Node.js, Express, RabbitMQ e LibreTranslate.

Este projeto implementa uma arquitetura de microserviços simples com dois serviços principais:

- **Translation API**: API REST para receber solicitações de tradução
- **Translation Worker**: Worker que processa as traduções em background

### Tecnologias Utilizadas

- **Node.js 18+**: Runtime JavaScript
- **Express.js**: Framework web para a API REST
- **RabbitMQ**: Message broker para comunicação entre serviços
- **PostgreSQL**: Banco de dados relacional
- **TypeORM**: ORM para Node.js e TypeScript
- **LibreTranslate**: Serviço de tradução
- **Docker & Docker Compose**: Containerização e orquestração
- **Swagger**: Documentação da API

## Como Executar

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- Conta no Google Cloud com Translation API habilitada (opcional)

### 1. Clonar o repositório

```bash
git clone <https://github.com/DanielRossano/translator.git>
cd translator-1
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. Executar com Docker Compose

```bash
# Construir e iniciar todos os serviços
npm run start:dev

# Ou diretamente com docker-compose
docker-compose up --build
```

### 4. Acessar os serviços

- **API**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/api-docs
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

##  API Endpoints

### Criar uma tradução

```http
POST /api/translations
Content-Type: application/json

{
  "text": "Hello, world!",
  "sourceLang": "en",
  "targetLang": "pt"
}
```

### Obter uma tradução

```http
GET /api/translations/{id}
```

### Listar traduções

```http
GET /api/translations?page=1&limit=10
```

### Health Check

```http
GET /health
```
