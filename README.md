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

### 2. Executar com Docker Compose

```bash
docker-compose up --build
```

### 3. Acessar os serviços

- **API**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/api-docs
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

## Documentação da API

### Swagger UI

A documentação completa da API está disponível através do Swagger UI em:
**http://localhost:3000/api-docs**

#### Recursos do Swagger:

- **Try it out**: Teste todos os endpoints diretamente na documentação
- **Exemplos prontos**: Cada endpoint possui exemplos pré-configurados
- **Schemas detalhados**: Visualize a estrutura completa dos dados
- **Códigos de resposta**: Veja todos os possíveis retornos da API
- **Múltiplos idiomas**: Exemplos em inglês, português, espanhol e francês

#### Endpoints principais:

1. **POST /api/translations** - Criar nova tradução
   - Exemplos: EN→PT, EN→ES, PT→FR
   - Status: pending → processing → completed

2. **GET /api/translations/{id}** - Buscar tradução por ID
   - Exemplo de UUID: `550e8400-e29b-41d4-a716-446655440000`

3. **GET /api/translations** - Listar todas as traduções
   - Paginação: `?page=1&limit=10`
   - Filtro por status: `?status=completed`

4. **POST /api/detect** - Detectar idioma automaticamente
   - Exemplos: Francês, Espanhol, Português, Inglês

5. **GET /api/languages** - Idiomas suportados
   - 12 idiomas disponíveis

6. **GET /api/health/translation** - Status do serviço
   - Verifica database, queue e sistema

### Como usar o "Try it out":

1. Acesse http://localhost:3000/api-docs
2. Clique em qualquer endpoint
3. Clique no botão **"Try it out"**
4. Escolha um exemplo pré-configurado
5. Clique em **"Execute"**
6. Veja a resposta em tempo real!

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
