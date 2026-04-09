import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Settings, HelpCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Hand, Menu, X, Keyboard } from 'lucide-react';
import { useSnakeGame, GRID_SIZE } from '../hooks/useSnakeGame';
import { useSettings, FoodType } from '../hooks/useSettings';
import { translations } from '../utils/i18n';
import '../styles/SnakeGame.css';

const FoodIcon = ({ type }: { type: FoodType }) => {
  if (type === 'apple') {
    return (
      <svg width="85%" height="85%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21C15.5 21 18 18.5 18 15C18 11.5 15.5 9 12 9C8.5 9 6 11.5 6 15C6 18.5 8.5 21 12 21Z" fill="url(#appleGrad)"/>
        <path d="M12 9C12 6 14 4 16 4C16 7 14 9 12 9Z" fill="#4ade80"/>
        <defs>
          <radialGradient id="appleGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f87171"/>
            <stop offset="100%" stopColor="#991b1b"/>
          </radialGradient>
        </defs>
      </svg>
    );
  }
  if (type === 'mouse') {
    return (
      <svg width="85%" height="85%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 14C16 17.3137 13.3137 20 10 20C6.68629 20 4 17.3137 4 14C4 10.6863 6.68629 8 10 8C13.3137 8 16 10.6863 16 14Z" fill="url(#mouseGrad)"/>
        <path d="M16 14C19 14 21 15 22 17" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="13" cy="11" r="2.5" fill="#d1d5db"/>
        <circle cx="13" cy="17" r="2.5" fill="#d1d5db"/>
        <circle cx="5" cy="14" r="1.5" fill="#111827"/>
        <defs>
          <radialGradient id="mouseGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9ca3af"/>
            <stop offset="100%" stopColor="#4b5563"/>
          </radialGradient>
        </defs>
      </svg>
    );
  }
  if (type === 'gem') {
    return (
      <svg width="85%" height="85%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 8L12 22L22 8L12 2Z" fill="url(#gemGrad)"/>
        <path d="M12 2L6 8L12 22M12 2L18 8L12 22M2 8H22" stroke="#059669" strokeWidth="0.5"/>
        <defs>
          <linearGradient id="gemGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6ee7b7"/>
            <stop offset="1" stopColor="#047857"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }
  if (type === 'star') {
    return (
      <svg width="85%" height="85%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#starGrad)"/>
        <defs>
          <radialGradient id="starGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde047"/>
            <stop offset="100%" stopColor="#b45309"/>
          </radialGradient>
        </defs>
      </svg>
    );
  }
  return null;
};

export default function SnakeGame() {
  const {
    snake, trail, food, eatEffect, score, gameState, difficulty, setDifficulty, highScore,
    startGame, togglePause, resetToIdle, directionRef, changeDirection
  } = useSnakeGame();
  
  const { language, setLanguage, skin, setSkin, scenario, setScenario, foodType, setFoodType, controlType, setControlType } = useSettings();
  const [activeModal, setActiveModal] = useState<'settings' | 'help' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = translations[language];

  // Swipe detection logic
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (controlType !== 'swipe') return;
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (controlType !== 'swipe' || !touchStartRef.current) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const dx = touchEndX - touchStartRef.current.x;
    const dy = touchEndY - touchStartRef.current.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) changeDirection({ x: dx > 0 ? 1 : -1, y: 0 });
    } else {
      if (Math.abs(dy) > 30) changeDirection({ x: 0, y: dy > 0 ? 1 : -1 });
    }
    touchStartRef.current = null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-950 text-white p-2 md:p-4 overflow-x-hidden">
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-gray-950 flex flex-col p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">{t.menu}</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-800 rounded-full">
                <X size={28} />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setActiveModal('settings'); }}
                className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl text-xl font-bold border border-gray-800"
              >
                <Settings size={28} className="text-emerald-400" /> {t.settings}
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setActiveModal('help'); }}
                className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl text-xl font-bold border border-gray-800"
              >
                <HelpCircle size={28} className="text-emerald-400" /> {t.help}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar: Hamburger + Title */}
      <div className="w-full flex items-center justify-start md:justify-center mb-4 md:mb-6" style={{ maxWidth: 'min(100%, 600px, 65vh)' }}>
        <button 
          className="md:hidden p-2 mr-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
          {t.title}
        </h1>
      </div>
      
      {/* Stats Bar */}
      <div className="flex justify-between items-center w-full mb-4 gap-2" style={{ maxWidth: 'min(100%, 600px, 65vh)' }}>
        <div className="text-base md:text-2xl font-mono bg-gray-900 px-2 md:px-4 py-2 rounded-lg border border-gray-800 flex-1 text-center whitespace-nowrap">
          {t.score}: <span className="text-green-400">{score}</span>
        </div>
        
        <div className="flex gap-2 justify-center">
          <button 
            onClick={() => setActiveModal('help')} 
            disabled={gameState === 'playing'}
            className="hidden md:flex p-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
            title={t.help}
          >
            <HelpCircle size={24} />
          </button>
          <button 
            onClick={() => setActiveModal('settings')} 
            disabled={gameState === 'playing'}
            className="hidden md:flex p-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
            title={t.settings}
          >
            <Settings size={24} />
          </button>
          <button 
            onClick={togglePause} 
            disabled={gameState === 'idle' || gameState === 'gameover'}
            className="p-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
            title={`${t.paused}/${t.resume} (P / Esc)`}
          >
            {gameState === 'paused' ? <Play size={24} /> : <Pause size={24} />}
          </button>
        </div>

        <div className="text-base md:text-2xl font-mono bg-gray-900 px-2 md:px-4 py-2 rounded-lg border border-gray-800 flex-1 text-center whitespace-nowrap">
          {t.highscore}: <span className="text-yellow-400">{highScore}</span>
        </div>
      </div>

      <div
        className={`game-container relative border-4 rounded-lg shadow-2xl overflow-hidden scenario-${scenario} skin-${skin} w-full aspect-square ${controlType === 'swipe' ? 'touch-none' : ''}`}
        style={{ maxWidth: 'min(100%, 600px, 65vh)' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence>
          {gameState !== 'playing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4"
            >
              {gameState === 'idle' && (
                <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                  <div className="flex bg-gray-900 p-1.5 rounded-xl border border-gray-800 shadow-inner w-full justify-between">
                    {(['facil', 'moderado', 'dificil'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-bold capitalize transition-all text-sm md:text-base ${
                          difficulty === level 
                            ? 'bg-emerald-600 text-white shadow-lg transform scale-105' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        {level === 'facil' ? t.easy : level === 'moderado' ? t.medium : t.hard}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full">
                    {/* Mobile Instructions */}
                    <div className="md:hidden flex items-center gap-2 text-gray-300 bg-gray-800/50 p-3 rounded-lg border border-gray-700 w-full justify-center">
                      {controlType === 'swipe' ? <Hand size={20} className="text-emerald-400" /> : <ArrowUp size={20} className="text-emerald-400" />}
                      <span className="text-sm font-medium">
                        {controlType === 'swipe' ? t.tutorialSwipe : t.tutorialDpad}
                      </span>
                    </div>
                    {/* Desktop Instructions */}
                    <div className="hidden md:flex flex-col items-center gap-2 text-gray-300 bg-gray-800/50 p-3 rounded-lg border border-gray-700 w-full justify-center">
                      <div className="flex items-center gap-2">
                        <Keyboard size={20} className="text-emerald-400" />
                        <span className="text-sm font-medium">{t.desktopMove}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pause size={20} className="text-emerald-400" />
                        <span className="text-sm font-medium">{t.desktopPause}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={startGame} 
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-xl md:text-2xl shadow-[0_0_30px_rgba(5,150,105,0.5)] hover:shadow-[0_0_40px_rgba(5,150,105,0.7)] transition-all flex items-center gap-3 transform hover:scale-105 w-full justify-center"
                  >
                    <Play fill="currentColor" size={28} /> {t.start}
                  </button>
                </div>
              )}
              
              {gameState === 'paused' && (
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-8 text-white tracking-widest uppercase">{t.paused}</h2>
                  <button 
                    onClick={togglePause} 
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-2xl shadow-[0_0_30px_rgba(5,150,105,0.5)] transition-all flex items-center gap-3 transform hover:scale-105 mx-auto"
                  >
                    <Play fill="currentColor" size={28} /> {t.resume}
                  </button>
                </div>
              )}
              
              {gameState === 'gameover' && (
                <div className="text-center">
                  <h2 className="text-5xl font-extrabold mb-4 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
                    {t.gameover}
                  </h2>
                  <p className="text-2xl mb-8 text-gray-300 font-mono">
                    {t.score}: <span className="text-white font-bold">{score}</span>
                  </p>
                  <button 
                    onClick={resetToIdle} 
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-2xl shadow-[0_0_30px_rgba(5,150,105,0.5)] transition-all flex items-center gap-3 transform hover:scale-105 mx-auto"
                  >
                    <RotateCcw size={28} /> {t.playAgain}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {snake.map((segment, i) => {
          const isHead = i === 0;
          const isTail = i === snake.length - 1 && snake.length > 1;
          
          let rotation = 0;
          let dx = 0;
          let dy = 0;
          if (isHead) {
            dx = snake.length > 1 ? snake[0].x - snake[1].x : directionRef.current.x;
            dy = snake.length > 1 ? snake[0].y - snake[1].y : directionRef.current.y;
            if (dx === 1) rotation = 0;
            else if (dx === -1) rotation = 180;
            else if (dy === 1) rotation = 90;
            else if (dy === -1) rotation = -90;
          } else if (isTail) {
            dx = snake[i-1].x - segment.x;
            dy = snake[i-1].y - segment.y;
            if (dx === 1) rotation = 0;
            else if (dx === -1) rotation = 180;
            else if (dy === 1) rotation = 90;
            else if (dy === -1) rotation = -90;
          }

          return (
            <div
              key={i}
              className="absolute flex items-center justify-center"
              style={{
                width: `${(1 / GRID_SIZE) * 100}%`,
                height: `${(1 / GRID_SIZE) * 100}%`,
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                transition: 'left 0.1s linear, top 0.1s linear',
                zIndex: isHead ? 10 : (isTail ? 5 : 8)
              }}
            >
              {isHead ? (
                <motion.div 
                  key="snake-head"
                  initial={{ scale: 0.8, x: dx * -5, y: dy * -5, rotate: rotation }}
                  animate={{ scale: 1, x: 0, y: 0, rotate: rotation }}
                  transition={{ type: 'spring', stiffness: 500, damping: 12 }}
                  style={{ width: '120%', height: '120%' }}
                >
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                    <defs>
                      <radialGradient id="headGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="var(--snake-color-1)" />
                        <stop offset="100%" stopColor="var(--snake-color-2)" />
                      </radialGradient>
                    </defs>
                    <path d="M 0 15 C 30 5, 60 5, 80 25 C 100 40, 100 60, 80 75 C 60 95, 30 95, 0 85 Z" fill="url(#headGrad)" />
                    <circle cx="65" cy="25" r="6" fill="black" />
                    <circle cx="65" cy="75" r="6" fill="black" />
                    <circle cx="67" cy="23" r="2" fill="white" />
                    <circle cx="67" cy="73" r="2" fill="white" />
                  </svg>
                </motion.div>
              ) : isTail ? (
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: `rotate(${rotation}deg)` }}>
                  <defs>
                    <radialGradient id="tailGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="var(--snake-color-1)" />
                      <stop offset="100%" stopColor="var(--snake-color-2)" />
                    </radialGradient>
                  </defs>
                  <path d="M 100 15 Q 0 50 100 85 Z" fill="url(#tailGrad)" />
                </svg>
              ) : (
                <div
                  className="snake-segment"
                  style={{
                    width: '85%',
                    height: '85%',
                    borderRadius: '8px',
                  }}
                />
              )}
            </div>
          );
        })}
        
        <motion.div
          key={`food-${food.x}-${food.y}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="absolute flex items-center justify-center drop-shadow-lg"
          style={{
            width: `${(1 / GRID_SIZE) * 100}%`,
            height: `${(1 / GRID_SIZE) * 100}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
          }}
        >
          <FoodIcon type={foodType} />
        </motion.div>

        <AnimatePresence>
          {eatEffect && (
            <motion.div
              key={`effect-${eatEffect.id}`}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute flex items-center justify-center pointer-events-none z-10"
              style={{
                width: `${(1 / GRID_SIZE) * 100}%`,
                height: `${(1 / GRID_SIZE) * 100}%`,
                left: `${(eatEffect.x / GRID_SIZE) * 100}%`,
                top: `${(eatEffect.y / GRID_SIZE) * 100}%`,
              }}
            >
              <div className="w-full h-full rounded-full bg-white/60 blur-[2px]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile D-Pad */}
      {controlType === 'dpad' && (
        <div className="md:hidden mt-4 grid grid-cols-3 gap-2 w-48 mx-auto">
          <div />
          <button onClick={() => changeDirection({x: 0, y: -1})} className="bg-gray-800/80 active:bg-gray-700 p-4 rounded-xl flex items-center justify-center border border-gray-700 shadow-lg"><ArrowUp size={28} /></button>
          <div />
          <button onClick={() => changeDirection({x: -1, y: 0})} className="bg-gray-800/80 active:bg-gray-700 p-4 rounded-xl flex items-center justify-center border border-gray-700 shadow-lg"><ArrowLeft size={28} /></button>
          <button onClick={() => changeDirection({x: 0, y: 1})} className="bg-gray-800/80 active:bg-gray-700 p-4 rounded-xl flex items-center justify-center border border-gray-700 shadow-lg"><ArrowDown size={28} /></button>
          <button onClick={() => changeDirection({x: 1, y: 0})} className="bg-gray-800/80 active:bg-gray-700 p-4 rounded-xl flex items-center justify-center border border-gray-700 shadow-lg"><ArrowRight size={28} /></button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-500">
        {t.footerMessage}{' '}
        <a
          href="https://github.com/emersonfreitas"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
        >
          Emerson Freitas
        </a>
      </footer>

      {/* Global Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 md:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveModal(null);
            }}
          >
            {activeModal === 'help' && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col w-full h-full md:h-auto md:max-w-md bg-gray-950 md:bg-gray-900 p-6 md:rounded-2xl md:border md:border-gray-700 shadow-2xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                  <HelpCircle className="text-emerald-400" /> {t.help}
                </h2>
                <div className="text-gray-300 text-sm space-y-4 mb-6">
                  <p>{t.rulesText}</p>
                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <p className="font-bold text-white mb-2">{t.desktop}</p>
                    <p>{t.desktopMove}</p>
                    <p>{t.desktopPause}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <p className="font-bold text-white mb-2">{t.mobile}</p>
                    <p>{t.mobileInstruct}</p>
                  </div>
                  <div className="text-center pt-4 border-t border-gray-800">
                    <p className="text-gray-400">
                      {t.createdBy}{' '}
                      <a 
                        href="https://github.com/emersonfreitas/cadosnake" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                      >
                        Emerson Freitas
                      </a>
                    </p>
                  </div>
                </div>
                <div className="mt-auto md:mt-0 pt-4">
                  <button onClick={() => setActiveModal(null)} className="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-bold transition-colors border border-gray-700">
                    {t.close}
                  </button>
                </div>
              </motion.div>
            )}

            {activeModal === 'settings' && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col w-full h-full md:h-auto md:max-w-md bg-gray-950 md:bg-gray-900 p-6 md:rounded-2xl md:border md:border-gray-700 shadow-2xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                  <Settings className="text-emerald-400" /> {t.settings}
                </h2>
                
                <div className="flex flex-col gap-5 w-full">
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-400 font-medium">{t.language}</label>
                    <select value={language} onChange={e => setLanguage(e.target.value as any)} className="bg-gray-800 text-white p-3 rounded-xl border border-gray-700 outline-none focus:border-emerald-500">
                      <option value="pt">Português (BR)</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-400 font-medium">{t.skin}</label>
                    <select value={skin} onChange={e => setSkin(e.target.value as any)} className="bg-gray-800 text-white p-3 rounded-xl border border-gray-700 outline-none focus:border-emerald-500">
                      <option value="green">{t.skins.green}</option>
                      <option value="blue">{t.skins.blue}</option>
                      <option value="purple">{t.skins.purple}</option>
                      <option value="gold">{t.skins.gold}</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-400 font-medium">{t.scenario}</label>
                    <select value={scenario} onChange={e => setScenario(e.target.value as any)} className="bg-gray-800 text-white p-3 rounded-xl border border-gray-700 outline-none focus:border-emerald-500">
                      <option value="dark">{t.scenarios.dark}</option>
                      <option value="forest">{t.scenarios.forest}</option>
                      <option value="desert">{t.scenarios.desert}</option>
                      <option value="ocean">{t.scenarios.ocean}</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-400 font-medium">{t.food}</label>
                    <select value={foodType} onChange={e => setFoodType(e.target.value as any)} className="bg-gray-800 text-white p-3 rounded-xl border border-gray-700 outline-none focus:border-emerald-500">
                      <option value="apple">{t.foods.apple}</option>
                      <option value="mouse">{t.foods.mouse}</option>
                      <option value="gem">{t.foods.gem}</option>
                      <option value="star">{t.foods.star}</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2 md:hidden">
                    <label className="text-gray-400 font-medium">{t.controls}</label>
                    <select value={controlType} onChange={e => setControlType(e.target.value as any)} className="bg-gray-800 text-white p-3 rounded-xl border border-gray-700 outline-none focus:border-emerald-500">
                      <option value="swipe">{t.swipe}</option>
                      <option value="dpad">{t.dpad}</option>
                    </select>
                  </div>
                </div>

                <div className="mt-auto md:mt-6 pt-4">
                  <button onClick={() => setActiveModal(null)} className="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-bold transition-colors border border-gray-700">
                    {t.close}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

