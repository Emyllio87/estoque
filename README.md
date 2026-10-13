# Estoque - Sistema Simples de Controle de Estoque

Sistema web para controle de produtos e movimentações de estoque.

## Stack

- **Backend:** Spring Boot 3.3, Java 21, PostgreSQL 16, Flyway
- **Frontend:** React 18, Vite, TypeScript, Bootstrap 5
- **Infra:** Docker Compose

## Como rodar

### Pré-requisitos
- Docker e Docker Compose
- Java 21 (desenvolvimento local backend)
- Node.js 20+ (desenvolvimento local frontend)

### Com Docker (recomendado)
```bash
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

### Desenvolvimento local

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Funcionalidades

- **Produtos:** CRUD completo (código, nome, descrição, unidade, quantidade atual/mínima, preço custo/venda, ativo/inativo)
- **Dashboard:** Visão geral com cards de totais, produtos com estoque baixo, valor total do estoque
- **Movimentações:** Entrada, Saída e Ajuste de estoque com validação de estoque insuficiente
- **Filtros:** Busca por nome, filtro por produto nas movimentações
- **Responsivo:** Mobile-first com Bootstrap 5

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/produtos` | Listar todos (opcional: `?nome=`) |
| GET | `/api/produtos/ativos` | Listar apenas ativos |
| GET | `/api/produtos/{id}` | Buscar por ID |
| GET | `/api/produtos/codigo/{codigo}` | Buscar por código |
| POST | `/api/produtos` | Criar produto |
| PUT | `/api/produtos/{id}` | Atualizar produto |
| DELETE | `/api/produtos/{id}` | Excluir produto |
| PATCH | `/api/produtos/{id}/estoque` | Ajustar estoque direto |
| GET | `/api/movimentacoes` | Listar (opcional: `?produtoId=&inicio=&fim=`) |
| POST | `/api/movimentacoes/entrada` | Registrar entrada |
| POST | `/api/movimentacoes/saida` | Registrar saída |
| POST | `/api/movimentacoes/ajuste` | Registrar ajuste |

## Estrutura do projeto

```
estoque/
├── backend/
│   ├── src/main/java/br/com/estoque/
│   │   ├── produto/        # Entity, Repository, DTO, Service, Controller
│   │   ├── movimentacao/   # Entity, Repository, DTO, Service, Controller
│   │   └── comum/          # Exceptions, GlobalExceptionHandler
│   ├── src/main/resources/
│   │   └── db/migration/   # Flyway V1__init_schema.sql
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── pages/          # Dashboard, Produtos, ProdutoForm, Movimentacoes
│   │   ├── components/     # Layout
│   │   ├── services/       # api.ts
│   │   └── types/          # TypeScript interfaces
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Testes

```bash
# Backend
cd backend && ./mvnw test
./mvnw verify  # com cobertura (mín 80%)

# Frontend
cd frontend && npm test
npm run lint
```

## Banco de dados

Tabelas criadas via Flyway:
- `produto` - cadastro de produtos
- `movimentacao` - histórico de entradas/saídas/ajustes

## Licença

Uso interno.