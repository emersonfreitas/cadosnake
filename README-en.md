# CadoSnake 🐍

A modern, highly customizable, and responsive Snake Game built with React and TypeScript.

[Leia em Português](README.md)

## 🎮 About the Project

CadoSnake is a recreation of the classic Snake game featuring a modern interface, fluid animations, and full mobile support. The game includes various customization options for the snake's appearance, food types, and backgrounds. It also offers multiple difficulty levels and supports multiple languages.

## ✨ Features

- **Fully Responsive:** Play on Desktop or Mobile with layouts adapted to maximize screen space.
- **Mobile Controls:** Support for screen gestures (Swipe) or virtual buttons (D-Pad).
- **Customization:** Choose between different snake colors (Skins), scenarios (with SVG textures), and food types.
- **Multilingual:** Supports English, Portuguese (BR), Spanish, and Mandarin.
- **Difficulties:** Easy, Medium, and Hard levels that adjust the game speed.
- **High Performance:** Smooth movement without lag, with efficient state management.
- **Global Modals:** Settings and help menus with a "fog" effect and click-outside-to-close functionality.

## 🛠️ Tech Stack

- **[React 19](https://react.dev/)** - UI Library
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing
- **[Vite](https://vitejs.dev/)** - Bundler and dev environment
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://motion.dev/)** - UI Animations
- **[Lucide React](https://lucide.dev/)** - Icons

## 🚀 How to Run Locally

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access `http://localhost:3000` in your browser.

## 🌐 GitHub Pages Deployment

This project is configured to be easily published on GitHub Pages. The `vite.config.ts` file uses `base: './'` to ensure asset paths work correctly in subdirectories.

To create a production build, run:

```bash
npm run build
```

The `dist` folder will be generated and ready to be hosted on any static server or GitHub Pages.
