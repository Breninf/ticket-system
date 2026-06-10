# 🚀 Sistema Web de Tickets (Help Desk) - Produção K8s

Sistema completo de suporte técnico para gerenciamento de chamados, operando em arquitetura distribuída de microsserviços e orquestrado nativamente em cluster Kubernetes.

---

## 📌 Descrição

Este projeto é um MVP (Produto Mínimo Viável) integrado de Help Desk. Ele conta com uma interface em React, API em Node.js com regras de segurança ativas e persistência de dados persistentes em banco relacional, além de centralização de telemetria de logs.

---

## 🧱 Estrutura do Projeto

```text
/.github/workflows   → CI Automatizado (GitHub Actions em menos de 50s)
/charts/ticket-system → Pacotes de implantação Helm (Templates K8s)
/backend
  /prisma            → Esquema de banco de dados e migrações do Prisma
  /src               → API Express com CORS e Autenticação JWT ativa
  /tests             → Testes de integração automatizados com Jest
  Dockerfile
/frontend
  /src/pages         → Telas de Login, Cadastro e Dashboard em React (v7)
  Dockerfile
README.md
```

---

## ⚙️ Tecnologias Utilizadas

### Interface (Frontend)
- React com Vite
- Hooks nativos e estados protegidos
- Estilização inline dinâmica

### API (Backend)
- Node.js e Express
- Prisma ORM (Prisma Client)
- Segurança de rede com middleware CORS agressivo
- Autenticação e tokens síncronos JWT

### Banco de Dados e Observabilidade
- PostgreSQL 17 relacional
- Estrutura de Views SQL para compatibilidade de consultas
- Servidor central de Logs Syslog-ng com volumes persistentes

### DevOps e Orquestração
- Docker e Docker Desktop (WSL2)
- Minikube (Cluster local do Kubernetes)
- Helm Charts para gerenciamento de pacotes e ciclos de vida

---

## 🧪 Testes e CI/CD

O projeto conta com automação completa de testes integrados no backend.

### Executar testes locais:
```bash
cd backend
npm test
```

### Integração Contínua (CI)
O GitHub Actions executa toda a suíte de testes de forma automatizada a cada modificação subida nas branches de desenvolvimento, validando o código em menos de 50 segundos.

---

## 🐳 Como Executar o Projeto no Kubernetes

### Pré-requisitos
- Docker Desktop ativo (WSL2 no Windows)
- Minikube instalado
- Helm CLI configurado

### 1. Iniciar o Cluster Local
```bash
minikube start
```

### 2. Gerar as Imagens no Docker do Host
```bash
docker build -t ticket-system-backend:v2 ./backend
docker build -t ticket-system-frontend:v7 ./frontend
```

### 3. Injetar as Imagens no Cluster
```bash
minikube image load ticket-system-backend:v2
minikube image load ticket-system-frontend:v7
```

### 4. Instalar a Arquitetura via Helm
```bash
helm install meu-sistema ./charts/ticket-system/
```

### 5. Aplicar as Tabelas do Banco de Dados (Migrations)
```bash
kubectl exec <nome-do-pod-backend> -- npx prisma migrate deploy
```

---

## 🔌 Roteamento de Redes para Demonstração Local

Devido ao isolamento de rede do driver do Docker no Windows, execute os comandos em abas separadas do terminal para abrir os túneis de acesso:

### 🖥️ Acesso ao Frontend (Site)
```bash
minikube service frontend-service --url
```
*Acesse o endereço gerado (ex: http://127.0.0.1:64742) em uma **janela anônima** do navegador.*

### 🔌 Túnel de Dados da API (Porta 3000)
```bash
kubectl port-forward svc/backend-service 3000:3000
```
*Mantém o canal aberto para o navegador conseguir entregar os dados para o cluster.*

### 🕵️‍♂️ Monitoramento de Logs ao Vivo
```bash
kubectl logs deployment/ticket-backend -f
```

---

## 🎫 Funcionalidades Concluídas

### 🔐 Fluxo do Usuário
- **Criação de Conta**: Registro de novos usuários com armazenamento criptografado no banco de dados.
- **Autenticação**: Login protegido com geração de token de sessão JWT.
- **Interface Segura**: Ocultação estrutural de dados e alertas de acesso negado para tentativas de invasão por URL.
- **Painel de Chamados**: Abertura de novos chamados técnicos e listagem em tempo real puxada diretamente do PostgreSQL.

---

## 🎯 Conclusão do MVP
O projeto atingiu com sucesso os critérios técnicos de DevOps, orquestração e integração fullstack. Todas as quatro máquinas virtuais operam de forma interconectada e estável em ambiente Kubernetes de produção.
