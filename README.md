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
- **MyMemory**: Serviço de tradução adicional
- **Docker & Docker Compose**: Containerização e orquestração
- **Swagger**: Documentação da API

## Como Executar

### 1. Clonar o repositório

```bash
git clone <https://github.com/DanielRossano/translator.git>
cd translator-1
```

### 2. Executar com Docker Compose

```bash
docker-compose up --build
```

### 3. Acessar os serviços

- **API**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/api-docs
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

### Swagger UI

A documentação completa da API está disponível através do Swagger UI em:
**http://localhost:3000/api-docs**
