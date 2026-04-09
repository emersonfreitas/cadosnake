import { useState, useEffect, useCallback, useRef } from 'react';

export const GRID_SIZE = 20;
export const CELL_SIZE = 30;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 5, y: 5 };
const INITIAL_DIRECTION = { x: 1, y: 0 };

export type GameState = 'idle' | 'playing' | 'paused' | 'gameover';
export type Difficulty = 'facil' | 'moderado' | 'dificil';

const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

export const playEatSound = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  // A satisfying "Pop/Bloop" sound
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  // Quick pitch rise for a "pop" effect
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.08);
  
  // Quick volume decay
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
};

export const playGameOverSound = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.5);
};

export const playMoveSound = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(200, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
};

export function useSnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [trail, setTrail] = useState<{x: number, y: number}[]>([]);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [eatEffect, setEatEffect] = useState<{x: number, y: number, id: number} | null>(null);
  const directionRef = useRef(INITIAL_DIRECTION);
  const nextDirectionRef = useRef(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [difficulty, setDifficulty] = useState<Difficulty>('moderado');
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('cadosnake_high_score');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const lastMoveTimeRef = useRef<number>(0);
  const requestRef = useRef<number>();

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setTrail([]);
    setFood({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    });
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameState('playing');
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }, []);

  const resetToIdle = useCallback(() => {
    setGameState('idle');
  }, []);

  const togglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev === 'playing') return 'paused';
      if (prev === 'paused') return 'playing';
      return prev;
    });
  }, []);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      
      directionRef.current = nextDirectionRef.current;
      head.x += directionRef.current.x;
      head.y += directionRef.current.y;

      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameState('gameover');
        setHighScore((prev) => {
          const newHigh = Math.max(prev, score);
          localStorage.setItem('cadosnake_high_score', newHigh.toString());
          return newHigh;
        });
        playGameOverSound();
        return prevSnake;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 1);
        playEatSound();
        setEatEffect({ x: food.x, y: food.y, id: Date.now() });
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
      } else {
        const popped = newSnake.pop();
        if (popped) {
          setTrail(prev => [popped, ...prev].slice(0, 4)); // Keep last 4 positions for trail
        }
      }

      return newSnake;
    });
  }, [food, score]);

  const moveSnakeRef = useRef(moveSnake);
  useEffect(() => { moveSnakeRef.current = moveSnake; }, [moveSnake]);

  const gameLoop = useCallback((time: number) => {
    if (gameState !== 'playing') return;
    
    let speed = 100;
    if (difficulty === 'facil') speed = 150;
    else if (difficulty === 'dificil') speed = 60;

    if (time - lastMoveTimeRef.current >= speed) {
      moveSnakeRef.current();
      lastMoveTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, difficulty]);

  useEffect(() => {
    if (gameState === 'playing') {
      if (!requestRef.current) {
        lastMoveTimeRef.current = performance.now();
      }
      requestRef.current = requestAnimationFrame(gameLoop);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
      }
    };
  }, [gameState, gameLoop]);

  const changeDirection = useCallback((newDir: {x: number, y: number}) => {
    if (gameState !== 'playing') return;
    const { x, y } = directionRef.current;
    if (newDir.x !== 0 && x === 0) {
      nextDirectionRef.current = newDir;
      playMoveSound();
    } else if (newDir.y !== 0 && y === 0) {
      nextDirectionRef.current = newDir;
      playMoveSound();
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
        togglePause();
        return;
      }

      if (gameState !== 'playing') return;

      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          changeDirection({ x: 0, y: -1 });
          break;
        case 'arrowdown':
        case 's':
          changeDirection({ x: 0, y: 1 });
          break;
        case 'arrowleft':
        case 'a':
          changeDirection({ x: -1, y: 0 });
          break;
        case 'arrowright':
        case 'd':
          changeDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, togglePause, changeDirection]);

  return {
    snake, trail, food, eatEffect, score, gameState, difficulty, setDifficulty, highScore,
    startGame, togglePause, resetToIdle, directionRef, changeDirection
  };
}
