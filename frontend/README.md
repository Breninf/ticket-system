# 💻 Frontend - Guia de Desenvolvimento

Este é o frontend da nossa aplicação, desenvolvido com **React**, **TypeScript** e **Vite**. 

Este guia rápido serve para ajudar a rodar o projeto e entender como organizar o código daqui para frente.

---

## 🚀 Como Rodar o Projeto

1. Abra o terminal na raiz do monorepo e entre na pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências necessárias:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. No terminal vai aparecer um link. Clique nele ou acesse no seu navegador:
   * [http://localhost:5173](http://localhost:5173)

---

## 📁 Estrutura de Arquivos

O projeto foi iniciado recentemente. Abaixo está o mapa dos arquivos atuais e as pastas que **nós vamos criar** à medida que desenvolvermos as telas:

```text
frontend/
  ├── public/           # Arquivos estáticos (ícones, robôs de busca)
  ├── src/              # Onde vamos passar 99% do nosso tempo
  │     ├── assets/     # Imagens e mídias do projeto (ex: hero.png)
  │     ├── components/ # Componentes que se repetem (Botões, Inputs, Cards)
  │     ├── pages/      # Cada tela do nosso sistema (Login, Dashboard)
  │     ├── routes/     # Configuração das rotas do app
  │     ├── App.tsx     # Componente principal (renderiza nossa aplicação)
  │     └── main.tsx    # Ponto de entrada que liga o React ao HTML
  ├── index.html        # Página HTML única do app
  └── package.json      # Lista de dependências e comandos/scripts do projeto
```
---

## 🧠 Como Trabalhar no Projeto (Padrão)

Para mantermos o código organizado e fácil de entender, vamos seguir estas regras simples:

### 1. Criando uma Tela (Page)
Sempre que criar uma tela nova, faça uma pasta para ela dentro de `src/pages/` com um arquivo `index.tsx`.
* **Exemplo**: `src/pages/Home/index.tsx`
```tsx
export function Home() {
  return <h1>Essa é a nossa página Inicial</h1>;
}
```

### 2. Onde colocar os Componentes?
* **Componente Global (Reutilizável)**: Se o componente vai ser usado em mais de uma tela (ex: um botão padrão), ele fica em `src/components/`.
* **Componente Local**: Se o componente só existe e só importa para uma tela específica, ele fica dentro da pasta daquela tela. 
  * **Exemplo**: `src/pages/Home/components/CardDeBoasVindas.tsx`

---

## 👥 Padrão de Trabalho no Git

Antes de começar a programar qualquer tarefa, siga este fluxo:

1. Garanta que está na branch principal e atualizado.
2. Crie uma nova branch para a sua tarefa usando o padrão:
   ```bash
   git checkout -b feature/nome-da-sua-tarefa
   ```
3. Mantenha o código limpo e com nomes de variáveis em inglês.

---

## 🎯 Nossos Próximos Passos no Front

- [ ] Criar a estrutura inicial de pastas (`pages`, `components`, `routes`)
- [ ] Configurar as rotas do app (instalar React Router)
- [ ] Criar a tela de Login
- [ ] Criar a tela de Dashboard
- [ ] Integrar os dados com o nosso Backend