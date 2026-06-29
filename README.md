# AgendaPro

AgendaPro e um sistema de agendamento para profissionais autonomos. A ideia do projeto e demonstrar uma aplicacao com cara de produto real: login demo, dashboard, catalogo de servicos, agenda semanal e fluxo de reserva para clientes.

## Preview

O MVP atual usa `localStorage` para salvar login, servicos e agendamentos no navegador. Isso deixa o fluxo funcional sem exigir banco externo na primeira versao.

## Funcionalidades

- Login demo persistido no navegador
- Dashboard com indicadores de agenda, receita e ocupacao
- Busca por cliente, telefone, servico, dia ou horario
- Cadastro de novos servicos
- Criacao de agendamentos com cliente, telefone, dia, horario e servico
- Alteracao de status do agendamento
- Agenda semanal com horarios livres e ocupados
- Interface responsiva para desktop e celular

## Tecnologias

- Next.js
- React
- TypeScript
- CSS moderno
- Lucide React

## Como rodar localmente

```powershell
npm.cmd install
npm.cmd run dev
```

Depois abra `http://localhost:3000`.

## Proximos passos

- Trocar login demo por autenticacao real
- Criar modelos com Prisma
- Conectar PostgreSQL
- Salvar agendamentos em banco
- Criar testes de componentes
- Publicar na Vercel

## Objetivo de portfolio

Este projeto foi criado para mostrar dominio de interface, organizacao de codigo, pensamento de produto e base para evoluir para um SaaS full-stack.
