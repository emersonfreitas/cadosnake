# CadoSnake 🐍

Um jogo da cobrinha (Snake Game) moderno, altamente customizável e responsivo, construído com React e TypeScript.

[Read in English](README-en.md)

## 🎮 Sobre o Projeto

O CadoSnake é uma recriação do clássico jogo da cobrinha com uma interface moderna, animações fluidas e suporte total a dispositivos móveis. O jogo inclui várias opções de personalização para a aparência da cobra, tipos de alimentos e cenários. Ele também oferece múltiplos níveis de dificuldade e suporta vários idiomas.

## ✨ Funcionalidades

- **Totalmente Responsivo:** Jogue no Desktop ou Mobile com layouts adaptados para aproveitar ao máximo a tela.
- **Controles Mobile:** Suporte a gestos na tela (Swipe) ou botões virtuais (D-Pad).
- **Customização:** Escolha entre diferentes cores de cobra (Skins), cenários (com texturas SVG) e tipos de alimentos.
- **Multilíngue:** Suporte a Português (BR), Inglês, Espanhol e Mandarim.
- **Dificuldades:** Níveis Fácil, Moderado e Difícil que ajustam a velocidade do jogo.
- **Alta Performance:** Movimentação suave sem travamentos, com gerenciamento eficiente de estado.
- **Modais Globais:** Menus de configurações e ajuda com efeito "fog" e fechamento ao clicar fora.

## 🛠️ Tecnologias Utilizadas

- **[React 19](https://react.dev/)** - Biblioteca UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Vite](https://vitejs.dev/)** - Bundler e ambiente de desenvolvimento
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Estilização utilitária
- **[Framer Motion](https://motion.dev/)** - Animações de interface
- **[Lucide React](https://lucide.dev/)** - Ícones

## 🚀 Como Executar Localmente

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse `http://localhost:3000` no seu navegador.

## 🌐 Deploy no GitHub Pages

Este projeto está configurado para ser publicado facilmente no GitHub Pages. O arquivo `vite.config.ts` utiliza `base: './'` para garantir que os caminhos dos assets funcionem corretamente em subdiretórios.

Para fazer o build de produção, execute:

```bash
npm run build
```

A pasta `dist` será gerada e estará pronta para ser hospedada em qualquer servidor estático ou no GitHub Pages.
