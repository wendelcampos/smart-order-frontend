<div align="center">

# Smart Order App

Sistema web para gestão de pedidos de restaurante (mesas, garçons, produtos, pedidos e pagamentos).

<br/>

![Stack](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss&logoColor=white) ![Axios](https://img.shields.io/badge/Axios-1-5a29e4)

</div>

## Visão Geral

O Smart Order App é um frontend em React para operação de restaurantes. Ele oferece autenticação, layout com sidebar, rotas protegidas e telas para administrar mesas, garçons, clientes, produtos, pedidos e pagamentos. A comunicação com o backend é feita via API HTTP usando Axios.

## Funcionalidades

- Autenticação com persistência (localStorage) e proteção de rotas
- Layout responsivo com sidebar, tema escuro/claro e componentes reutilizáveis
- Páginas: Dashboard, Mesas, Garçons, Produtos, Pedidos, Pagamentos, Clientes, Usuários
- Fluxo de pagamento com diálogo de opções (PIX, cartão, dinheiro)
- Tabela de itens e totalização com formatação de moeda
- Validação de formulários com React Hook Form + Zod

## Stack Técnica

- React 19 + Vite 7
- TypeScript 5
- React Router 7
- Axios para chamadas HTTP (`src/services/api.ts`)
- TailwindCSS 4 e utilitários (clsx, class-variance-authority, tailwind-merge)
- Radix UI + componentes shadcn (Dialog, Table, Form, etc.)

## Arquitetura e Estrutura de Pastas

```
src/
  components/           # Componentes de UI e composições (layout, dialogs, sidebar, etc.)
    ui/                 # Base de componentes (button, dialog, input, table, etc.)
  contexts/             # Contextos globais (AuthContext)
  dtos/                 # Tipagens de payloads e respostas da API
  hooks/                # Hooks customizados (ex.: useAuth)
  pages/                # Páginas do app (Dashboard, Orders, Payments, ...)
  routes/               # Rotas públicas e privadas
  services/             # Integração com APIs (axios)
  utils/                # Utilitários (formatadores, constantes)
  App.tsx               # Bootstrap dos providers e rotas
  main.tsx              # Ponto de entrada
```

## Requisitos

- Node.js 18+ (recomendado 20+)
- pnpm, npm ou yarn (exemplos abaixo com npm)
- Backend rodando em `http://localhost:3333` ou configurar variável de ambiente

## Configuração

1. Instale as dependências

```bash
npm install
```

2. Configure a URL da API

- Atualmente em `src/services/api.ts` a baseURL está fixa em `http://localhost:3333`.
- Opcional: substitua por variável de ambiente criando um arquivo `.env` na raiz e usando `import.meta.env.VITE_API_URL`.

Exemplo `.env`:

```
VITE_API_URL=http://localhost:3333
```

E ajuste `src/services/api.ts`:

```ts
import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333",
})
```

## Scripts

```bash
# Ambiente de desenvolvimento
npm run dev

# Build de produção
npm run build

# Pré-visualização do build
npm run preview
```

## Fluxo de Autenticação

- O `AuthProvider` (`src/contexts/AuthContext.tsx`) persiste usuário e token no localStorage (`@smart-order:user`, `@smart-order:token`) e configura o header Authorization do Axios.
- As rotas são trocadas conforme `session.user.role` em `src/routes/index.tsx`.

## Pagamentos (Resumo do Fluxo)

- `DialogPayments` busca os itens do pedido em `/payments/:orderId` e exibe a tabela de itens e total.
- `DialogPaymentsOptions` permite escolher o método de pagamento (vide `src/utils/payments.ts`) e envia para `POST /payments` com `{ orderId, paymentType }`.

## Dicas de Desenvolvimento

- Utilize os componentes da pasta `src/components/ui` para manter consistência visual.
- Mantenha DTOs atualizados em `src/dtos` para facilitar tipagem ao consumir a API.
- Para navegar entre páginas, use os paths definidos em `ManagerRoutes`.

## Troubleshooting

- Erros CORS/Network: confirme a URL do backend e se o servidor está ativo.
- 401/403: verifique se o token foi salvo e se `Authorization` está sendo enviado (veja `AuthContext`).
- Tipos `possibly undefined`: adote checagem condicional antes de acessar dados de API e estados opcionais.
- Ambiente Windows com Bash: se scripts travarem, tente usar PowerShell ou CMD, ou ajuste permissões.

## Licença

Este projeto é de uso educacional e/ou interno. Ajuste esta seção conforme a política do seu time (MIT, Apache-2.0, etc.).

## Créditos

- Interface baseada em componentes com Radix UI e estilos utilitários com TailwindCSS.
- Construído com Vite + React + TypeScript.
