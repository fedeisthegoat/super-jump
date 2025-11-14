
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, RotateCcw, Play, Heart, Coins, Star, ShoppingBag, Zap, TrendingUp, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MarioGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready'); // ready, playing, gameOver, won, levelComplete
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalCoins, setTotalCoins] = useState(0); // New state for total coins across levels
  const [showShop, setShowShop] = useState(false); // New state to toggle shop visibility
  const [currentSkin, setCurrentSkin] = useState('mario'); // New state for selected player skin
  const gameLoopRef = useRef(null);
  const keysRef = useRef({});
  const animationFrameRef = useRef(0); // Added for player animation

  // Powerups state
  const [powerups, setPowerups] = useState({
    extraLife: 0, // Consumable, handled immediately
    speedBoost: false, // Upgrade
    superJump: false, // Upgrade
    shield: 0, // Consumable, count
    doubleCoins: false // Upgrade
  });

  // Skins
  const skins = {
    mario: {
      name: 'Mario',
      color: '#FF0000', // Shirt/Pants
      hatColor: '#8B0000', // Hat
      faceColor: '#FFE4C4', // Face
      overallColor: '#0000FF', // Overalls
      buttonColor: '#FFD700', // Gold for buttons
      shoeColor: '#8B4513', // Brown for shoes
      cost: 0,
      description: 'Der klassische Held!'
    },
    luigi: {
      name: 'Luigi',
      color: '#00FF00', // Shirt/Pants
      hatColor: '#006400', // Hat
      faceColor: '#FFE4C4', // Face
      overallColor: '#0000CD', // Overalls
      buttonColor: '#FFD700',
      shoeColor: '#8B4513',
      cost: 100,
      description: 'Marios grüner Bruder'
    },
    peach: {
      name: 'Peach',
      color: '#FFB6C1', // Dress
      hatColor: '#FFD700', // Crown/Hair
      faceColor: '#FFE4C4', // Face
      overallColor: '#FF69B4', // Dress accent
      buttonColor: '#FFFFFF', // White for dress buttons/accents
      shoeColor: '#FF1493', // Deep pink for shoes
      cost: 150,
      description: 'Die elegante Prinzessin'
    },
    toad: {
      name: 'Toad',
      color: '#FF0000', // Vest/Body
      hatColor: '#FFFFFF', // Mushroom cap
      faceColor: '#FFE4C4', // Face
      overallColor: '#4169E1', // Pants
      buttonColor: '#FFD700',
      shoeColor: '#8B4513',
      cost: 120,
      description: 'Der treue Pilz-Begleiter'
    },
    wario: {
      name: 'Wario',
      color: '#FFFF00', // Shirt
      hatColor: '#8B8B00', // Hat
      faceColor: '#FFE4C4', // Face
      overallColor: '#800080', // Overalls
      buttonColor: '#FFFFFF',
      shoeColor: '#228B22', // Dark green shoes
      cost: 200,
      description: 'Der böse Doppelgänger'
    },
    waluigi: {
      name: 'Waluigi',
      color: '#9400D3', // Shirt
      hatColor: '#4B0082', // Hat
      faceColor: '#FFE4C4', // Face
      overallColor: '#000000', // Overalls
      buttonColor: '#FFD700',
      shoeColor: '#8B4500', // Dark brown shoes
      cost: 200,
      description: 'Luigis mysteriöser Rivale'
    }
  };

  const [ownedSkins, setOwnedSkins] = useState(['mario']); // Initialize with Mario

  // Shop items
  const shopItems = [
    {
      id: 'extraLife',
      name: 'Extra Leben',
      description: 'Gibt dir ein zusätzliches Leben',
      icon: Heart,
      cost: 50,
      color: 'bg-red-500',
      type: 'consumable'
    },
    {
      id: 'speedBoost',
      name: 'Geschwindigkeits-Boost',
      description: 'Bewege dich 50% schneller',
      icon: Zap,
      cost: 100,
      color: 'bg-yellow-500',
      type: 'upgrade'
    },
    {
      id: 'superJump',
      name: 'Super Sprung',
      description: 'Springe viel höher',
      icon: TrendingUp,
      cost: 150,
      color: 'bg-blue-500',
      type: 'upgrade'
    },
    {
      id: 'shield',
      name: 'Schutzschild',
      description: 'Schützt vor einem Treffer',
      icon: ShoppingBag, // Using ShoppingBag as a generic shield icon here, if no better alternative
      cost: 80,
      color: 'bg-purple-500',
      type: 'consumable'
    },
    {
      id: 'doubleCoins',
      name: 'Doppelte Münzen',
      description: 'Verdopple alle Münzen',
      icon: Coins,
      cost: 200,
      color: 'bg-green-500',
      type: 'upgrade'
    }
  ];

  // Game constants with powerup modifications
  const GRAVITY = 0.6;
  const JUMP_FORCE = powerups.superJump ? -20 : -15; // JUMP_FORCE now depends on superJump powerup
  const MOVE_SPEED = powerups.speedBoost ? 7.5 : 5; // MOVE_SPEED now depends on speedBoost powerup

  // Clouds data - different for each level
  const cloudsRef = useRef([
    { x: 100, y: 50, size: 60, speed: 0.2 },
    { x: 300, y: 100, size: 80, speed: 0.15 },
    { x: 500, y: 70, size: 70, speed: 0.25 },
    { x: 700, y: 120, size: 90, speed: 0.18 },
    { x: 150, y: 180, size: 65, speed: 0.22 },
    { x: 450, y: 40, size: 75, speed: 0.2 }
  ]);

  // Level configurations
  const levels = {
    1: {
      name: "Grüne Hügel",
      platforms: [
        { x: 0, y: 550, width: 800, height: 50, color: '#8B4513', hasGrass: true },
        { x: 200, y: 450, width: 150, height: 20, color: '#228B22', hasGrass: true },
        { x: 400, y: 350, width: 150, height: 20, color: '#228B22', hasGrass: true },
        { x: 600, y: 250, width: 150, height: 20, color: '#228B22', hasGrass: true },
        { x: 300, y: 200, width: 200, height: 20, color: '#228B22', hasGrass: true, moving: true, velocityX: 1.5, minX: 250, maxX: 500 },
        { x: 100, y: 150, width: 150, height: 20, color: '#228B22', hasGrass: true },
      ],
      coins: [
        { x: 250, y: 400, size: 20, collected: false },
        { x: 450, y: 300, size: 20, collected: false },
        { x: 650, y: 200, size: 20, collected: false },
        { x: 400, y: 150, size: 20, collected: false },
        { x: 150, y: 100, size: 20, collected: false },
      ],
      diamonds: [
        { x: 350, y: 160, size: 25, collected: false },
        { x: 550, y: 210, size: 25, collected: false },
      ],
      enemies: [
        { x: 400, y: 310, width: 30, height: 30, velocityX: 2, color: '#8B0000', minX: 400, maxX: 550, defeated: false },
        { x: 200, y: 410, width: 30, height: 30, velocityX: 2, color: '#8B0000', minX: 200, maxX: 350, defeated: false },
      ],
      trees: [
        { x: 50, y: 490 }, // y = 550 (ground) - 60 (tree height)
        { x: 500, y: 490 },
        { x: 700, y: 490 },
      ],
      goal: { x: 150, y: 100, width: 50, height: 50 },
      bgColor: '#87CEEB'
    },
    2: {
      name: "Wüsten-Canyon",
      platforms: [
        { x: 0, y: 550, width: 800, height: 50, color: '#D2691E', hasGrass: false },
        { x: 100, y: 480, width: 100, height: 20, color: '#DEB887', hasGrass: false },
        { x: 300, y: 420, width: 80, height: 20, color: '#DEB887', hasGrass: false, moving: true, velocityX: 2, minX: 250, maxX: 400 },
        { x: 500, y: 360, width: 100, height: 20, color: '#DEB887', hasGrass: false },
        { x: 650, y: 300, width: 80, height: 20, color: '#DEB887', hasGrass: false },
        { x: 550, y: 220, width: 120, height: 20, color: '#DEB887', hasGrass: false },
        { x: 350, y: 180, width: 100, height: 20, color: '#DEB887', hasGrass: false },
        { x: 150, y: 120, width: 120, height: 20, color: '#DEB887', hasGrass: false },
      ],
      coins: [
        { x: 150, y: 440, size: 20, collected: false },
        { x: 340, y: 380, size: 20, collected: false },
        { x: 550, y: 320, size: 20, collected: false },
        { x: 690, y: 260, size: 20, collected: false },
        { x: 600, y: 180, size: 20, collected: false },
        { x: 400, y: 140, size: 20, collected: false },
        { x: 200, y: 80, size: 20, collected: false },
      ],
      diamonds: [
        { x: 600, y: 180, size: 25, collected: false },
        { x: 200, y: 40, size: 25, collected: false },
      ],
      enemies: [
        { x: 300, y: 380, width: 30, height: 30, velocityX: 2.5, color: '#8B4500', minX: 300, maxX: 380, defeated: false },
        { x: 500, y: 320, width: 30, height: 30, velocityX: 2.5, color: '#8B4500', minX: 500, maxX: 600, defeated: false },
        { x: 350, y: 140, width: 30, height: 30, velocityX: 2, color: '#8B4500', minX: 350, maxX: 450, defeated: false },
      ],
      trees: [
        { x: 30, y: 490, type: 'cactus' }, // y = 550 (ground) - 60 (tree height)
        { x: 600, y: 490, type: 'cactus' },
        { x: 750, y: 490, type: 'cactus' },
      ],
      goal: { x: 180, y: 60, width: 50, height: 60 },
      bgColor: '#FFE4B5'
    },
    3: {
      name: "Schneeberg",
      platforms: [
        { x: 0, y: 550, width: 800, height: 50, color: '#4682B4', hasGrass: false },
        { x: 650, y: 480, width: 150, height: 20, color: '#E0FFFF', hasGrass: false },
        { x: 450, y: 420, width: 120, height: 20, color: '#E0FFFF', hasGrass: false },
        { x: 200, y: 380, width: 100, height: 20, color: '#E0FFFF', hasGrass: false, moving: true, velocityX: 1.8, minX: 150, maxX: 350 },
        { x: 50, y: 320, width: 120, height: 20, color: '#E0FFFF', hasGrass: false },
        { x: 250, y: 260, width: 100, height: 20, color: '#E0FFFF', hasGrass: false },
        { x: 450, y: 200, width: 120, height: 20, color: '#E0FFFF', hasGrass: false },
        { x: 650, y: 150, width: 120, height: 20, color: '#E0FFFF', hasGrass: false },
        { x: 450, y: 80, width: 150, height: 20, color: '#E0FFFF', hasGrass: false },
      ],
      coins: [
        { x: 700, y: 440, size: 20, collected: false },
        { x: 500, y: 380, size: 20, collected: false },
        { x: 250, y: 340, size: 20, collected: false },
        { x: 100, y: 280, size: 20, collected: false },
        { x: 300, y: 220, size: 20, collected: false },
        { x: 500, y: 160, size: 20, collected: false },
        { x: 700, y: 110, size: 20, collected: false },
        { x: 525, y: 40, size: 20, collected: false },
      ],
      diamonds: [
        { x: 100, y: 240, size: 25, collected: false },
        { x: 700, y: 70, size: 25, collected: false },
      ],
      enemies: [
        { x: 650, y: 440, width: 30, height: 30, velocityX: 3, color: '#1E90FF', minX: 650, maxX: 800, defeated: false },
        { x: 450, y: 380, width: 30, height: 30, velocityX: 2.5, color: '#1E90FF', minX: 450, maxX: 570, defeated: false },
        { x: 250, y: 220, width: 30, height: 30, velocityX: 2.5, color: '#1E90FF', minX: 250, maxX: 350, defeated: false },
        { x: 450, y: 160, width: 30, height: 30, velocityX: 3, color: '#1E90FF', minX: 450, maxX: 570, defeated: false },
      ],
      trees: [
        { x: 300, y: 490, type: 'pine' }, // y = 550 (ground) - 60 (tree height)
        { x: 550, y: 490, type: 'pine' },
        { x: 100, y: 490, type: 'pine' },
      ],
      goal: { x: 500, y: 20, width: 50, height: 60 },
      bgColor: '#B0E0E6'
    },
    4: {
      name: "Lava-Festung",
      platforms: [
        { x: 0, y: 550, width: 150, height: 50, color: '#8B0000', hasGrass: false },
        { x: 650, y: 550, width: 150, height: 50, color: '#8B0000', hasGrass: false },
        { x: 200, y: 480, width: 80, height: 15, color: '#B22222', hasGrass: false },
        { x: 350, y: 430, width: 80, height: 15, color: '#B22222', hasGrass: false, moving: true, velocityX: 2.5, minX: 300, maxX: 500 },
        { x: 520, y: 480, width: 80, height: 15, color: '#B22222', hasGrass: false },
        { x: 100, y: 400, width: 100, height: 15, color: '#B22222', hasGrass: false },
        { x: 300, y: 340, width: 80, height: 15, color: '#B22222', hasGrass: false },
        { x: 500, y: 380, width: 100, height: 15, color: '#B22222', hasGrass: false },
        { x: 650, y: 320, width: 100, height: 15, color: '#B22222', hasGrass: false },
        { x: 450, y: 260, width: 120, height: 15, color: '#B22222', hasGrass: false },
        { x: 250, y: 200, width: 100, height: 15, color: '#B22222', hasGrass: false },
        { x: 500, y: 140, width: 100, height: 15, color: '#B22222', hasGrass: false },
        { x: 300, y: 80, width: 150, height: 15, color: '#B22222', hasGrass: false },
      ],
      coins: [
        { x: 240, y: 440, size: 20, collected: false },
        { x: 390, y: 390, size: 20, collected: false },
        { x: 150, y: 360, size: 20, collected: false },
        { x: 340, y: 300, size: 20, collected: false },
        { x: 550, y: 340, size: 20, collected: false },
        { x: 700, y: 280, size: 20, collected: false },
        { x: 500, y: 220, size: 20, collected: false },
        { x: 300, y: 160, size: 20, collected: false },
        { x: 550, y: 100, size: 20, collected: false },
        { x: 375, y: 40, size: 20, collected: false },
      ],
      diamonds: [
        { x: 150, y: 320, size: 25, collected: false },
        { x: 700, y: 240, size: 25, collected: false },
      ],
      enemies: [
        { x: 200, y: 440, width: 30, height: 30, velocityX: 3, color: '#FF4500', minX: 200, maxX: 280, defeated: false },
        { x: 350, y: 390, width: 30, height: 30, velocityX: 3, color: '#FF4500', minX: 350, maxX: 430, defeated: false },
        { x: 300, y: 300, width: 30, height: 30, velocityX: 3.5, color: '#FF4500', minX: 300, maxX: 380, defeated: false },
        { x: 500, y: 340, width: 30, height: 30, velocityX: 3.5, color: '#FF4500', minX: 500, maxX: 600, defeated: false },
        { x: 450, y: 220, width: 30, height: 30, velocityX: 3, color: '#FF4500', minX: 450, maxX: 570, defeated: false },
        { x: 300, y: 40, width: 30, height: 30, velocityX: 4, color: '#FF4500', minX: 300, maxX: 450, defeated: false },
      ],
      trees: [
        { x: 50, y: 490, type: 'dead' }, // y = 550 (ground) - 60 (tree height)
        { x: 700, y: 490, type: 'dead' },
      ],
      goal: { x: 350, y: 20, width: 50, height: 60 },
      bgColor: '#2F1B1B'
    },
    5: {
      name: "Wolken-Himmel",
      platforms: [
        { x: 0, y: 550, width: 200, height: 50, color: '#E6E6FA', hasGrass: false },
        { x: 250, y: 500, width: 120, height: 20, color: '#FFFFFF', hasGrass: false, moving: true, velocityX: 2, minX: 200, maxX: 400 },
        { x: 500, y: 450, width: 150, height: 20, color: '#FFFFFF', hasGrass: false },
        { x: 300, y: 390, width: 100, height: 20, color: '#FFFFFF', hasGrass: false, moving: true, velocityX: -2.5, minX: 250, maxX: 450 },
        { x: 100, y: 330, width: 120, height: 20, color: '#FFFFFF', hasGrass: false },
        { x: 450, y: 270, width: 130, height: 20, color: '#FFFFFF', hasGrass: false },
        { x: 200, y: 210, width: 150, height: 20, color: '#FFFFFF', hasGrass: false, moving: true, velocityX: 2, minX: 150, maxX: 350 },
        { x: 550, y: 150, width: 120, height: 20, color: '#FFFFFF', hasGrass: false },
        { x: 350, y: 90, width: 100, height: 20, color: '#FFFFFF', hasGrass: false },
        { x: 100, y: 50, width: 150, height: 20, color: '#FFFFFF', hasGrass: false },
      ],
      coins: [
        { x: 310, y: 460, size: 20, collected: false },
        { x: 575, y: 410, size: 20, collected: false },
        { x: 375, y: 350, size: 20, collected: false },
        { x: 160, y: 290, size: 20, collected: false },
        { x: 515, y: 230, size: 20, collected: false },
        { x: 275, y: 170, size: 20, collected: false },
        { x: 610, y: 110, size: 20, collected: false },
        { x: 400, y: 50, size: 20, collected: false },
        { x: 175, y: 10, size: 20, collected: false },
      ],
      diamonds: [
        { x: 160, y: 250, size: 25, collected: false },
        { x: 610, y: 70, size: 25, collected: false },
      ],
      enemies: [
        { x: 500, y: 410, width: 30, height: 30, velocityX: 2.5, color: '#9370DB', minX: 500, maxX: 650, defeated: false },
        { x: 300, y: 350, width: 30, height: 30, velocityX: 3, color: '#9370DB', minX: 300, maxX: 400, defeated: false },
        { x: 100, y: 290, width: 30, height: 30, velocityX: 2.5, color: '#9370DB', minX: 100, maxX: 220, defeated: false },
        { x: 450, y: 230, width: 30, height: 30, velocityX: 3, color: '#9370DB', minX: 450, maxX: 580, defeated: false },
        { x: 200, y: 170, width: 30, height: 30, velocityX: 2.5, color: '#9370DB', minX: 200, maxX: 330, defeated: false },
      ],
      trees: [],
      goal: { x: 125, y: -10, width: 50, height: 60 },
      bgColor: '#87CEFA'
    },
    6: {
      name: "Dschungel-Tempel",
      platforms: [
        { x: 0, y: 550, width: 800, height: 50, color: '#654321', hasGrass: false },
        { x: 100, y: 480, width: 120, height: 20, color: '#8B7355', hasGrass: false },
        { x: 300, y: 420, width: 100, height: 20, color: '#8B7355', hasGrass: false },
        { x: 500, y: 380, width: 150, height: 20, color: '#8B7355', hasGrass: false, moving: true, velocityX: 2, minX: 450, maxX: 600 },
        { x: 150, y: 320, width: 120, height: 20, color: '#8B7355', hasGrass: false },
        { x: 400, y: 260, width: 130, height: 20, color: '#8B7355', hasGrass: false },
        { x: 650, y: 220, width: 120, height: 20, color: '#8B7355', hasGrass: false },
        { x: 450, y: 160, width: 100, height: 20, color: '#8B7355', hasGrass: false },
        { x: 200, y: 120, width: 150, height: 20, color: '#8B7355', hasGrass: false, moving: true, velocityX: -2, minX: 150, maxX: 350 },
        { x: 550, y: 60, width: 120, height: 20, color: '#8B7355', hasGrass: false },
      ],
      coins: [
        { x: 160, y: 440, size: 20, collected: false },
        { x: 350, y: 380, size: 20, collected: false },
        { x: 575, y: 340, size: 20, collected: false },
        { x: 210, y: 280, size: 20, collected: false },
        { x: 465, y: 220, size: 20, collected: false },
        { x: 710, y: 180, size: 20, collected: false },
        { x: 500, y: 120, size: 20, collected: false },
        { x: 275, y: 80, size: 20, collected: false },
        { x: 610, y: 20, size: 20, collected: false },
      ],
      diamonds: [
        { x: 210, y: 240, size: 25, collected: false },
        { x: 710, y: 140, size: 25, collected: false },
      ],
      enemies: [
        { x: 100, y: 440, width: 30, height: 30, velocityX: 3, color: '#228B22', minX: 100, maxX: 220, defeated: false },
        { x: 300, y: 380, width: 30, height: 30, velocityX: 2.5, color: '#228B22', minX: 300, maxX: 400, defeated: false },
        { x: 500, y: 340, width: 30, height: 30, velocityX: 3.5, color: '#228B22', minX: 500, maxX: 630, defeated: false },
        { x: 150, y: 280, width: 30, height: 30, velocityX: 3, color: '#228B22', minX: 150, maxX: 270, defeated: false },
        { x: 400, y: 220, width: 30, height: 30, velocityX: 3.5, color: '#228B22', minX: 400, maxX: 530, defeated: false },
        { x: 200, y: 80, width: 30, height: 30, velocityX: 3, color: '#228B22', minX: 200, maxX: 330, defeated: false },
      ],
      trees: [
        { x: 50, y: 490 },
        { x: 400, y: 490 },
        { x: 700, y: 490 },
      ],
      goal: { x: 600, y: 0, width: 50, height: 60 },
      bgColor: '#3CB371'
    },
    7: {
      name: "Geister-Schloss",
      platforms: [
        { x: 0, y: 550, width: 200, height: 50, color: '#483D8B', hasGrass: false },
        { x: 600, y: 550, width: 200, height: 50, color: '#483D8B', hasGrass: false },
        { x: 250, y: 480, width: 100, height: 15, color: '#6A5ACD', hasGrass: false, moving: true, velocityX: 3, minX: 200, maxX: 400 },
        { x: 450, y: 480, width: 100, height: 15, color: '#6A5ACD', hasGrass: false, moving: true, velocityX: -3, minX: 400, maxX: 600 },
        { x: 150, y: 410, width: 120, height: 15, color: '#6A5ACD', hasGrass: false },
        { x: 530, y: 410, width: 120, height: 15, color: '#6A5ACD', hasGrass: false },
        { x: 350, y: 340, width: 100, height: 15, color: '#6A5ACD', hasGrass: false, moving: true, velocityX: 2.5, minX: 300, maxX: 500 },
        { x: 100, y: 280, width: 120, height: 15, color: '#6A5ACD', hasGrass: false },
        { x: 580, y: 280, width: 120, height: 15, color: '#6A5ACD', hasGrass: false },
        { x: 300, y: 210, width: 200, height: 15, color: '#6A5ACD', hasGrass: false },
        { x: 150, y: 150, width: 100, height: 15, color: '#6A5ACD', hasGrass: false },
        { x: 550, y: 150, width: 100, height: 15, color: '#6A5ACD', hasGrass: false },
        { x: 350, y: 80, width: 100, height: 15, color: '#6A5ACD', hasGrass: false },
      ],
      coins: [
        { x: 300, y: 440, size: 20, collected: false },
        { x: 500, y: 440, size: 20, collected: false },
        { x: 210, y: 370, size: 20, collected: false },
        { x: 590, y: 370, size: 20, collected: false },
        { x: 400, y: 300, size: 20, collected: false },
        { x: 160, y: 240, size: 20, collected: false },
        { x: 640, y: 240, size: 20, collected: false },
        { x: 400, y: 170, size: 20, collected: false },
        { x: 200, y: 110, size: 20, collected: false },
        { x: 600, y: 110, size: 20, collected: false },
        { x: 400, y: 40, size: 20, collected: false },
      ],
      diamonds: [
        { x: 160, y: 200, size: 25, collected: false },
        { x: 640, y: 200, size: 25, collected: false },
      ],
      enemies: [
        { x: 250, y: 440, width: 30, height: 30, velocityX: 3.5, color: '#8B008B', minX: 250, maxX: 350, defeated: false },
        { x: 450, y: 440, width: 30, height: 30, velocityX: 3.5, color: '#8B008B', minX: 450, maxX: 550, defeated: false },
        { x: 150, y: 370, width: 30, height: 30, velocityX: 3, color: '#8B008B', minX: 150, maxX: 270, defeated: false },
        { x: 530, y: 370, width: 30, height: 30, velocityX: 3, color: '#8B008B', minX: 530, maxX: 650, defeated: false },
        { x: 350, y: 300, width: 30, height: 30, velocityX: 4, color: '#8B008B', minX: 350, maxX: 430, defeated: false },
        { x: 100, y: 240, width: 30, height: 30, velocityX: 3.5, color: '#8B008B', minX: 100, maxX: 220, defeated: false },
        { x: 580, y: 240, width: 30, height: 30, velocityX: 3.5, color: '#8B008B', minX: 580, maxX: 700, defeated: false },
        { x: 350, y: 40, width: 30, height: 30, velocityX: 4, color: '#8B008B', minX: 350, maxX: 450, defeated: false },
      ],
      trees: [],
      goal: { x: 375, y: 20, width: 50, height: 60 },
      bgColor: '#191970'
    },
    8: {
      name: "Regenbogen-Finale",
      platforms: [
        { x: 0, y: 550, width: 150, height: 50, color: '#FF0000', hasGrass: false },
        { x: 650, y: 550, width: 150, height: 50, color: '#9400D3', hasGrass: false },
        { x: 200, y: 490, width: 80, height: 15, color: '#FF7F00', hasGrass: false, moving: true, velocityX: 3.5, minX: 150, maxX: 350 },
        { x: 520, y: 490, width: 80, height: 15, color: '#FFFF00', hasGrass: false, moving: true, velocityX: -3.5, minX: 450, maxX: 650 },
        { x: 100, y: 420, width: 100, height: 15, color: '#00FF00', hasGrass: false },
        { x: 600, y: 420, width: 100, height: 15, color: '#0000FF', hasGrass: false },
        { x: 350, y: 370, width: 100, height: 15, color: '#4B0082', hasGrass: false, moving: true, velocityX: 3, minX: 300, maxX: 500 },
        { x: 150, y: 310, width: 120, height: 15, color: '#9400D3', hasGrass: false },
        { x: 530, y: 310, width: 120, height: 15, color: '#FF0000', hasGrass: false },
        { x: 300, y: 240, width: 200, height: 15, color: '#FF7F00', hasGrass: false, moving: true, velocityX: -2.5, minX: 250, maxX: 450 },
        { x: 100, y: 180, width: 100, height: 15, color: '#FFFF00', hasGrass: false },
        { x: 600, y: 180, width: 100, height: 15, color: '#00FF00', hasGrass: false },
        { x: 350, y: 120, width: 100, height: 15, color: '#0000FF', hasGrass: false, moving: true, velocityX: 3.5, minX: 300, maxX: 500 },
        { x: 200, y: 60, width: 120, height: 15, color: '#4B0082', hasGrass: false },
        { x: 480, y: 60, width: 120, height: 15, color: '#9400D3', hasGrass: false },
        { x: 350, y: 10, width: 100, height: 15, color: '#FF0000', hasGrass: false },
      ],
      coins: [
        { x: 240, y: 450, size: 20, collected: false },
        { x: 560, y: 450, size: 20, collected: false },
        { x: 150, y: 380, size: 20, collected: false },
        { x: 650, y: 380, size: 20, collected: false },
        { x: 400, y: 330, size: 20, collected: false },
        { x: 210, y: 270, size: 20, collected: false },
        { x: 590, y: 270, size: 20, collected: false },
        { x: 400, y: 200, size: 20, collected: false },
        { x: 150, y: 140, size: 20, collected: false },
        { x: 650, y: 140, size: 20, collected: false },
        { x: 400, y: 80, size: 20, collected: false },
        { x: 260, y: 20, size: 20, collected: false },
        { x: 540, y: 20, size: 20, collected: false },
      ],
      diamonds: [
        { x: 150, y: 100, size: 25, collected: false },
        { x: 650, y: 100, size: 25, collected: false },
      ],
      enemies: [
        { x: 200, y: 450, width: 30, height: 30, velocityX: 4, color: '#FF1493', minX: 200, maxX: 320, defeated: false },
        { x: 520, y: 450, width: 30, height: 30, velocityX: 4, color: '#FF1493', minX: 520, maxX: 620, defeated: false },
        { x: 100, y: 380, width: 30, height: 30, velocityX: 3.5, color: '#FF1493', minX: 100, maxX: 200, defeated: false },
        { x: 600, y: 380, width: 30, height: 30, velocityX: 3.5, color: '#FF1493', minX: 600, maxX: 700, defeated: false },
        { x: 350, y: 330, width: 30, height: 30, velocityX: 4.5, color: '#FF1493', minX: 350, maxX: 470, defeated: false },
        { x: 150, y: 270, width: 30, height: 30, velocityX: 4, color: '#FF1493', minX: 150, maxX: 270, defeated: false },
        { x: 530, y: 270, width: 30, height: 30, velocityX: 4, color: '#FF1493', minX: 530, maxX: 650, defeated: false },
        { x: 300, y: 200, width: 30, height: 30, velocityX: 4.5, color: '#FF1493', minX: 300, maxX: 480, defeated: false },
        { x: 100, y: 140, width: 30, height: 30, velocityX: 3.5, color: '#FF1493', minX: 100, maxX: 200, defeated: false },
        { x: 600, y: 140, width: 30, height: 30, velocityX: 3.5, color: '#FF1493', minX: 600, maxX: 700, defeated: false },
        { x: 350, y: 80, width: 30, height: 30, velocityX: 5, color: '#FF1493', minX: 350, maxX: 470, defeated: false },
      ],
      trees: [],
      goal: { x: 375, y: -40, width: 50, height: 50 },
      bgColor: '#FF69B4'
    },
    9: {
      name: "Unterwasser-Höhle",
      platforms: [
        { x: 0, y: 550, width: 180, height: 50, color: '#1E3A5F', hasGrass: false },
        { x: 620, y: 550, width: 180, height: 50, color: '#1E3A5F', hasGrass: false },
        { x: 230, y: 490, width: 110, height: 18, color: '#2E5A8F', hasGrass: false, moving: true, velocityX: 2.8, minX: 180, maxX: 400 },
        { x: 460, y: 490, width: 110, height: 18, color: '#2E5A8F', hasGrass: false, moving: true, velocityX: -2.8, minX: 420, maxX: 640 },
        { x: 130, y: 420, width: 140, height: 18, color: '#2E5A8F', hasGrass: false },
        { x: 530, y: 420, width: 140, height: 18, color: '#2E5A8F', hasGrass: false },
        { x: 320, y: 350, width: 160, height: 18, color: '#2E5A8F', hasGrass: false, moving: true, velocityX: 3, minX: 270, maxX: 480 },
        { x: 80, y: 280, width: 130, height: 18, color: '#2E5A8F', hasGrass: false },
        { x: 590, y: 280, width: 130, height: 18, color: '#2E5A8F', hasGrass: false },
        { x: 280, y: 210, width: 240, height: 18, color: '#2E5A8F', hasGrass: false, moving: true, velocityX: -2.5, minX: 230, maxX: 430 },
        { x: 150, y: 140, width: 130, height: 18, color: '#2E5A8F', hasGrass: false },
        { x: 520, y: 140, width: 130, height: 18, color: '#2E5A8F', hasGrass: false },
        { x: 350, y: 70, width: 100, height: 18, color: '#2E5A8F', hasGrass: false },
      ],
      coins: [
        { x: 285, y: 450, size: 20, collected: false },
        { x: 515, y: 450, size: 20, collected: false },
        { x: 200, y: 380, size: 20, collected: false },
        { x: 600, y: 380, size: 20, collected: false },
        { x: 390, y: 310, size: 20, collected: false },
        { x: 145, y: 240, size: 20, collected: false },
        { x: 655, y: 240, size: 20, collected: false },
        { x: 390, y: 170, size: 20, collected: false },
        { x: 215, y: 100, size: 20, collected: false },
        { x: 585, y: 100, size: 20, collected: false },
        { x: 400, y: 30, size: 20, collected: false },
      ],
      diamonds: [
        { x: 145, y: 200, size: 25, collected: false },
        { x: 655, y: 200, size: 25, collected: false },
      ],
      enemies: [
        { x: 230, y: 450, width: 30, height: 30, velocityX: 3.5, color: '#00CED1', minX: 230, maxX: 370, defeated: false },
        { x: 460, y: 450, width: 30, height: 30, velocityX: 3.5, color: '#00CED1', minX: 460, maxX: 600, defeated: false },
        { x: 130, y: 380, width: 30, height: 30, velocityX: 3.8, color: '#00CED1', minX: 130, maxX: 270, defeated: false },
        { x: 530, y: 380, width: 30, height: 30, velocityX: 3.8, color: '#00CED1', minX: 530, maxX: 670, defeated: false },
        { x: 320, y: 310, width: 30, height: 30, velocityX: 4.2, color: '#00CED1', minX: 320, maxX: 460, defeated: false },
        { x: 80, y: 240, width: 30, height: 30, velocityX: 3.8, color: '#00CED1', minX: 80, maxX: 210, defeated: false },
        { x: 590, y: 240, width: 30, height: 30, velocityX: 3.8, color: '#00CED1', minX: 590, maxX: 720, defeated: false },
        { x: 280, y: 170, width: 30, height: 30, velocityX: 4.5, color: '#00CED1', minX: 280, maxX: 500, defeated: false },
        { x: 150, y: 100, width: 30, height: 30, velocityX: 3.8, color: '#00CED1', minX: 150, maxX: 280, defeated: false },
        { x: 520, y: 100, width: 30, height: 30, velocityX: 3.8, color: '#00CED1', minX: 520, maxX: 650, defeated: false },
      ],
      trees: [],
      goal: { x: 375, y: 10, width: 50, height: 60 },
      bgColor: '#0A1929'
    },
    10: {
      name: "Kristall-Mine",
      platforms: [
        { x: 0, y: 550, width: 200, height: 50, color: '#4A4A4A', hasGrass: false },
        { x: 600, y: 550, width: 200, height: 50, color: '#4A4A4A', hasGrass: false },
        { x: 250, y: 480, width: 90, height: 18, color: '#6A6A6A', hasGrass: false, moving: true, velocityX: 3.2, minX: 200, maxX: 420 },
        { x: 460, y: 480, width: 90, height: 18, color: '#6A6A6A', hasGrass: false, moving: true, velocityX: -3.2, minX: 380, maxX: 600 },
        { x: 140, y: 410, width: 130, height: 18, color: '#6A6A6A', hasGrass: false },
        { x: 530, y: 410, width: 130, height: 18, color: '#6A6A6A', hasGrass: false },
        { x: 330, y: 340, width: 140, height: 18, color: '#6A6A6A', hasGrass: false, moving: true, velocityX: 3.5, minX: 280, maxX: 480 },
        { x: 100, y: 270, width: 120, height: 18, color: '#6A6A6A', hasGrass: false },
        { x: 580, y: 270, width: 120, height: 18, color: '#6A6A6A', hasGrass: false },
        { x: 300, y: 200, width: 200, height: 18, color: '#6A6A6A', hasGrass: false, moving: true, velocityX: -3, minX: 250, maxX: 450 },
        { x: 150, y: 130, width: 120, height: 18, color: '#6A6A6A', hasGrass: false },
        { x: 530, y: 130, width: 120, height: 18, color: '#6A6A6A', hasGrass: false },
        { x: 340, y: 60, width: 120, height: 18, color: '#6A6A6A', hasGrass: false },
      ],
      coins: [
        { x: 300, y: 440, size: 20, collected: false },
        { x: 500, y: 440, size: 20, collected: false },
        { x: 205, y: 370, size: 20, collected: false },
        { x: 595, y: 370, size: 20, collected: false },
        { x: 400, y: 300, size: 20, collected: false },
        { x: 160, y: 230, size: 20, collected: false },
        { x: 640, y: 230, size: 20, collected: false },
        { x: 400, y: 160, size: 20, collected: false },
        { x: 210, y: 90, size: 20, collected: false },
        { x: 590, y: 90, size: 20, collected: false },
        { x: 400, y: 20, size: 20, collected: false },
      ],
      diamonds: [
        { x: 160, y: 190, size: 25, collected: false },
        { x: 640, y: 190, size: 25, collected: false },
      ],
      enemies: [
        { x: 250, y: 440, width: 30, height: 30, velocityX: 4, color: '#7B68EE', minX: 250, maxX: 390, defeated: false },
        { x: 460, y: 440, width: 30, height: 30, velocityX: 4, color: '#7B68EE', minX: 460, maxX: 570, defeated: false },
        { x: 140, y: 370, width: 30, height: 30, velocityX: 4.2, color: '#7B68EE', minX: 140, maxX: 270, defeated: false },
        { x: 530, y: 370, width: 30, height: 30, velocityX: 4.2, color: '#7B68EE', minX: 530, maxX: 660, defeated: false },
        { x: 330, y: 300, width: 30, height: 30, velocityX: 4.8, color: '#7B68EE', minX: 330, maxX: 450, defeated: false },
        { x: 100, y: 230, width: 30, height: 30, velocityX: 4.2, color: '#7B68EE', minX: 100, maxX: 220, defeated: false },
        { x: 580, y: 230, width: 30, height: 30, velocityX: 4.2, color: '#7B68EE', minX: 580, maxX: 700, defeated: false },
        { x: 300, y: 160, width: 30, height: 30, velocityX: 4.8, color: '#7B68EE', minX: 300, maxX: 480, defeated: false },
        { x: 150, y: 90, width: 30, height: 30, velocityX: 4.2, color: '#7B68EE', minX: 150, maxX: 270, defeated: false },
        { x: 530, y: 90, width: 30, height: 30, velocityX: 4.2, color: '#7B68EE', minX: 530, maxX: 650, defeated: false },
        { x: 340, y: 20, width: 30, height: 30, velocityX: 5, color: '#7B68EE', minX: 340, maxX: 440, defeated: false },
      ],
      trees: [],
      goal: { x: 370, y: 0, width: 60, height: 60 },
      bgColor: '#2C2C54'
    },
    11: {
      name: "Weltraum-Station",
      platforms: [
        { x: 0, y: 550, width: 160, height: 50, color: '#2F4F4F', hasGrass: false },
        { x: 640, y: 550, width: 160, height: 50, color: '#2F4F4F', hasGrass: false },
        { x: 210, y: 490, width: 85, height: 15, color: '#708090', hasGrass: false, moving: true, velocityX: 3.8, minX: 160, maxX: 400 },
        { x: 505, y: 490, width: 85, height: 15, color: '#708090', hasGrass: false, moving: true, velocityX: -3.8, minX: 400, maxX: 640 },
        { x: 120, y: 420, width: 120, height: 15, color: '#708090', hasGrass: false, moving: true, velocityX: 2.5, minX: 80, maxX: 280 },
        { x: 560, y: 420, width: 120, height: 15, color: '#708090', hasGrass: false, moving: true, velocityX: -2.5, minX: 520, maxX: 720 },
        { x: 340, y: 350, width: 120, height: 15, color: '#708090', hasGrass: false, moving: true, velocityX: 4, minX: 290, maxX: 490 },
        { x: 90, y: 280, width: 110, height: 15, color: '#708090', hasGrass: false },
        { x: 600, y: 280, width: 110, height: 15, color: '#708090', hasGrass: false },
        { x: 310, y: 210, width: 180, height: 15, color: '#708090', hasGrass: false, moving: true, velocityX: -3.5, minX: 260, maxX: 460 },
        { x: 140, y: 140, width: 110, height: 15, color: '#708090', hasGrass: false },
        { x: 550, y: 140, width: 110, height: 15, color: '#708090', hasGrass: false },
        { x: 350, y: 70, width: 100, height: 15, color: '#708090', hasGrass: false, moving: true, velocityX: 3.5, minX: 300, maxX: 500 },
        { x: 220, y: 10, width: 360, height: 15, color: '#708090', hasGrass: false },
      ],
      coins: [
        { x: 252, y: 450, size: 20, collected: false },
        { x: 547, y: 450, size: 20, collected: false },
        { x: 180, y: 380, size: 20, collected: false },
        { x: 620, y: 380, size: 20, collected: false },
        { x: 400, y: 310, size: 20, collected: false },
        { x: 145, y: 240, size: 20, collected: false },
        { x: 655, y: 240, size: 20, collected: false },
        { x: 400, y: 170, size: 20, collected: false },
        { x: 195, y: 100, size: 20, collected: false },
        { x: 605, y: 100, size: 20, collected: false },
        { x: 400, y: 30, size: 20, collected: false },
        { x: 290, y: -30, size: 20, collected: false },
        { x: 510, y: -30, size: 20, collected: false },
      ],
      diamonds: [
        { x: 145, y: 200, size: 25, collected: false },
        { x: 655, y: 200, size: 25, collected: false },
      ],
      enemies: [
        { x: 210, y: 450, width: 30, height: 30, velocityX: 4.5, color: '#00FF7F', minX: 210, maxX: 365, defeated: false },
        { x: 505, y: 450, width: 30, height: 30, velocityX: 4.5, color: '#00FF7F', minX: 505, maxX: 560, defeated: false },
        { x: 120, y: 380, width: 30, height: 30, velocityX: 4.8, color: '#00FF7F', minX: 120, maxX: 210, defeated: false },
        { x: 560, y: 380, width: 30, height: 30, velocityX: 4.8, color: '#00FF7F', minX: 560, maxX: 650, defeated: false },
        { x: 340, y: 310, width: 30, height: 30, velocityX: 5.2, color: '#00FF7F', minX: 340, maxX: 440, defeated: false },
        { x: 90, y: 240, width: 30, height: 30, velocityX: 4.5, color: '#00FF7F', minX: 90, maxX: 200, defeated: false },
        { x: 600, y: 240, width: 30, height: 30, velocityX: 4.5, color: '#00FF7F', minX: 600, maxX: 710, defeated: false },
        { x: 310, y: 170, width: 30, height: 30, velocityX: 5.5, color: '#00FF7F', minX: 310, maxX: 470, defeated: false },
        { x: 140, y: 100, width: 30, height: 30, velocityX: 4.8, color: '#00FF7F', minX: 140, maxX: 250, defeated: false },
        { x: 550, y: 100, width: 30, height: 30, velocityX: 4.8, color: '#00FF7F', minX: 550, maxX: 660, defeated: false },
        { x: 350, y: 30, width: 30, height: 30, velocityX: 5.8, color: '#00FF7F', minX: 350, maxX: 430, defeated: false },
        { x: 220, y: -30, width: 30, height: 30, velocityX: 6, color: '#00FF7F', minX: 220, maxX: 580, defeated: false },
      ],
      trees: [],
      goal: { x: 375, y: -50, width: 50, height: 60 },
      bgColor: '#0C0C1E'
    },
    12: {
      name: "Pilz-Königreich - Boss Kampf",
      platforms: [
        { x: 0, y: 550, width: 800, height: 50, color: '#DC143C', hasGrass: false },
        { x: 100, y: 450, width: 120, height: 20, color: '#FF6347', hasGrass: false },
        { x: 580, y: 450, width: 120, height: 20, color: '#FF6347', hasGrass: false },
        { x: 300, y: 380, width: 200, height: 20, color: '#FF6347', hasGrass: false },
        { x: 150, y: 280, width: 150, height: 20, color: '#FF6347', hasGrass: false },
        { x: 500, y: 280, width: 150, height: 20, color: '#FF6347', hasGrass: false },
        { x: 350, y: 180, width: 100, height: 20, color: '#FF6347', hasGrass: false },
      ],
      coins: [
        { x: 160, y: 410, size: 20, collected: false },
        { x: 640, y: 410, size: 20, collected: false },
        { x: 400, y: 340, size: 20, collected: false },
        { x: 220, y: 240, size: 20, collected: false },
        { x: 580, y: 240, size: 20, collected: false },
        { x: 400, y: 140, size: 20, collected: false },
      ],
      diamonds: [
        { x: 220, y: 240, size: 25, collected: false },
        { x: 580, y: 240, size: 25, collected: false },
      ],
      enemies: [],
      trees: [],
      boss: {
        x: 600,
        y: 400,
        width: 80,
        height: 100,
        velocityX: -4,
        health: 10,
        maxHealth: 10,
        minX: 100,
        maxX: 700,
        fireballTimer: 0,
        fireballCooldown: 60, // Frames between fireballs
        defeated: false
      },
      fireballs: [],
      goal: { x: 350, y: 120, width: 50, height: 60 },
      bgColor: '#FFB6C1',
      isBossLevel: true
    }
  };

  // Game state ref
  const gameRef = useRef({
    player: {
      x: 100,
      y: 300,
      width: 40,
      height: 50, // Updated height
      velocityY: 0,
      velocityX: 0,
      isJumping: false,
      skin: 'mario', // Initialize with default mario skin
      direction: 'right',
      hasShield: false, // New player property for shield
      isHit: false, // New property for hit state
      hitTimer: 0, // Timer for hit animation
      invincible: false, // Invincibility frames after hit
      invincibleTimer: 0 // Timer for invincibility
    },
    platforms: [],
    coins: [],
    diamonds: [], // New gameRef property for diamonds
    enemies: [],
    trees: [],
    boss: null, // New boss object
    fireballs: [], // New fireballs array
    goal: {}
  });

  const drawSun = (ctx) => {
    const sunX = 700;
    const sunY = 80;
    const sunRadius = 35;
    
    // Pulsierender Effekt
    const pulse = Math.sin(Date.now() / 1000) * 3;
    
    // Sonnenstrahlen
    ctx.strokeStyle = '#FDB813';
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * Math.PI / 180;
      const startX = sunX + Math.cos(angle) * (sunRadius + 5);
      const startY = sunY + Math.sin(angle) * (sunRadius + 5);
      const endX = sunX + Math.cos(angle) * (sunRadius + 15 + pulse);
      const endY = sunY + Math.sin(angle) * (sunRadius + 15 + pulse);
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    // Äußerer Schein
    const gradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius + 20);
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius + 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Hauptkörper der Sonne
    const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
    sunGradient.addColorStop(0, '#FFFF99');
    sunGradient.addColorStop(0.6, '#FFD700');
    sunGradient.addColorStop(1, '#FFA500');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(sunX - 10, sunY - 10, 15, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawCloud = (ctx, x, y, size) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // Draw multiple circles to form a cloud
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y, size * 0.6, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.2, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y - size * 0.3, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawPeachCastle = (ctx) => {
    // Zeichne Peachs Schloss im Hintergrund - auf dem Boden
    const castleX = 550;
    const castleY = 430; // Adjusted to be on the ground (550 - 120 = 430)
    
    // Hauptturm (Mitte)
    const mainTowerGradient = ctx.createLinearGradient(castleX + 50, castleY, castleX + 50, castleY + 150);
    mainTowerGradient.addColorStop(0, '#FFB6D9');
    mainTowerGradient.addColorStop(1, '#FF8AC9');
    ctx.fillStyle = mainTowerGradient;
    ctx.fillRect(castleX + 30, castleY + 50, 40, 100);
    
    // Linker Turm
    const leftTowerGradient = ctx.createLinearGradient(castleX - 10, castleY + 30, castleX - 10, castleY + 130);
    leftTowerGradient.addColorStop(0, '#FFC4E1');
    leftTowerGradient.addColorStop(1, '#FFA6D5');
    ctx.fillStyle = leftTowerGradient;
    ctx.fillRect(castleX - 10, castleY + 70, 30, 80);
    
    // Rechter Turm
    const rightTowerGradient = ctx.createLinearGradient(castleX + 80, castleY + 30, castleX + 80, castleY + 130);
    rightTowerGradient.addColorStop(0, '#FFC4E1');
    rightTowerGradient.addColorStop(1, '#FFA6D5');
    ctx.fillStyle = rightTowerGradient;
    ctx.fillRect(castleX + 80, castleY + 70, 30, 80);
    
    // Fenster - Hauptturm
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(castleX + 42, castleY + 70, 8, 12);
    ctx.fillRect(castleX + 52, castleY + 70, 8, 12);
    ctx.fillRect(castleX + 42, castleY + 95, 8, 12);
    ctx.fillRect(castleX + 52, castleY + 95, 8, 12);
    ctx.fillRect(castleX + 47, castleY + 120, 8, 12);
    
    // Fenster - Linker Turm
    ctx.fillRect(castleX - 2, castleY + 85, 6, 10);
    ctx.fillRect(castleX - 2, castleY + 110, 6, 10);
    
    // Fenster - Rechter Turm
    ctx.fillRect(castleX + 88, castleY + 85, 6, 10);
    ctx.fillRect(castleX + 88, castleY + 110, 6, 10);
    
    // Türdach/Spitze - Hauptturm
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.moveTo(castleX + 50, castleY + 20);
    ctx.lineTo(castleX + 25, castleY + 50);
    ctx.lineTo(castleX + 75, castleY + 50);
    ctx.closePath();
    ctx.fill();
    
    // Goldene Kugel auf Hauptturm
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(castleX + 50, castleY + 18, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Türdach/Spitze - Linker Turm
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.moveTo(castleX + 5, castleY + 50);
    ctx.lineTo(castleX - 15, castleY + 70);
    ctx.lineTo(castleX + 25, castleY + 70);
    ctx.closePath();
    ctx.fill();
    
    // Türdach/Spitze - Rechter Turm
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.moveTo(castleX + 95, castleY + 50);
    ctx.lineTo(castleX + 75, castleY + 70);
    ctx.lineTo(castleX + 115, castleY + 70);
    ctx.closePath();
    ctx.fill();
    
    // Eingangstor
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(castleX + 42, castleY + 130, 16, 20);
    
    // Türgriff
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(castleX + 47, castleY + 140, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Flaggen auf den Türmen
    const flagWave = Math.sin(Date.now() / 500) * 3;
    
    // Flagge Hauptturm
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(castleX + 50, castleY + 18);
    ctx.lineTo(castleX + 50, castleY + 5);
    ctx.stroke();
    
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.moveTo(castleX + 50, castleY + 5);
    ctx.lineTo(castleX + 65 + flagWave, castleY + 8);
    ctx.lineTo(castleX + 50, castleY + 11);
    ctx.closePath();
    ctx.fill();
    
    // Flagge Linker Turm
    ctx.beginPath();
    ctx.moveTo(castleX + 5, castleY + 50);
    ctx.lineTo(castleX + 5, castleY + 40);
    ctx.stroke();
    
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.moveTo(castleX + 5, castleY + 40);
    ctx.lineTo(castleX + 17 + flagWave * 0.8, castleY + 42);
    ctx.lineTo(castleX + 5, castleY + 44);
    ctx.closePath();
    ctx.fill();
    
    // Flagge Rechter Turm
    ctx.strokeStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(castleX + 95, castleY + 50);
    ctx.lineTo(castleX + 95, castleY + 40);
    ctx.stroke();
    
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.moveTo(castleX + 95, castleY + 40);
    ctx.lineTo(castleX + 107 + flagWave * 0.8, castleY + 42);
    ctx.lineTo(castleX + 95, castleY + 44);
    ctx.closePath();
    ctx.fill();
    
    // Herzen als Dekoration auf den Türmen
    const drawHeart = (x, y, size) => {
      ctx.fillStyle = '#FF69B4';
      ctx.beginPath();
      ctx.arc(x - size/4, y, size/4, Math.PI, 0, false);
      ctx.arc(x + size/4, y, size/4, Math.PI, 0, false);
      ctx.lineTo(x + size/2, y + size/2);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size/2, y + size/2);
      ctx.closePath();
      ctx.fill();
    };
    
    drawHeart(castleX + 50, castleY + 55, 8);
  };

  const drawHouse = (ctx, x, y, houseColor, roofColor) => {
    // Haupthaus
    const houseGradient = ctx.createLinearGradient(x, y + 30, x, y + 60);
    houseGradient.addColorStop(0, houseColor);
    houseGradient.addColorStop(1, houseColor + 'DD'); // Slightly darker at bottom
    ctx.fillStyle = houseGradient;
    ctx.fillRect(x, y + 30, 40, 30);
    
    // Dach
    ctx.fillStyle = roofColor;
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 15);
    ctx.lineTo(x - 5, y + 30);
    ctx.lineTo(x + 45, y + 30);
    ctx.closePath();
    ctx.fill();
    
    // Dach-Outline für mehr Tiefe
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 15);
    ctx.lineTo(x - 5, y + 30);
    ctx.lineTo(x + 45, y + 30);
    ctx.closePath();
    ctx.stroke();
    
    // Tür
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + 14, y + 45, 12, 15);
    
    // Türgriff
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x + 22, y + 52, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Fenster
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(x + 6, y + 38, 8, 8);
    ctx.fillRect(x + 26, y + 38, 8, 8);
    
    // Fensterrahmen
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 6, y + 38, 8, 8);
    ctx.strokeRect(x + 26, y + 38, 8, 8);
    
    // Fensterkreuz
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 38);
    ctx.lineTo(x + 10, y + 46);
    ctx.moveTo(x + 6, y + 42);
    ctx.lineTo(x + 14, y + 42);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x + 30, y + 38);
    ctx.lineTo(x + 30, y + 46);
    ctx.moveTo(x + 26, y + 42);
    ctx.lineTo(x + 34, y + 42);
    ctx.stroke();
    
    // Schornstein
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + 28, y + 20, 6, 12);
    
    // Rauch aus Schornstein
    const smokeOffset = Date.now() / 500;
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.beginPath();
    ctx.arc(x + 31 + Math.sin(smokeOffset) * 2, y + 15, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 31 + Math.sin(smokeOffset + 1) * 3, y + 10, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 31 + Math.sin(smokeOffset + 2) * 2, y + 5, 3, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawGrass = (ctx, x, y, width) => {
    // Verschiedene Grüntöne für natürlicheres Aussehen (statisch)
    const greenShades = [
      '#1B5E20', '#2E7D32', '#388E3C', '#43A047', 
      '#4CAF50', '#66BB6A', '#81C784'
    ];
    
    // Grashalme dichter machen (alle 4px)
    for (let i = 0; i < width; i += 4) {
      const grassX = x + i;
      
      // Seed for consistent pseudo-randomness based on position
      const seed = (x + i) * 0.12345; 
      
      // Zufällige Höhe für jeden Grashalm (6-12 Pixel) - aber konsistent
      const baseHeight = 6 + (Math.sin(seed) * 0.5 + 0.5) * 6;
      const grassHeight = baseHeight; // No time-based animation
      
      // Zufällige Dicke (1-3 Pixel) - aber konsistent
      const thickness = 1 + (Math.sin(seed * 1.3) * 0.5 + 0.5) * 2;
      
      // Zufälliger Grünton - aber konsistent
      const colorIndex = Math.floor((Math.sin(seed * 0.7) * 0.5 + 0.5) * greenShades.length);
      const color = greenShades[colorIndex];
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      
      // Hauptgrashalm mit leichter statischer Kurve
      const curve = (Math.sin(seed * 0.5) * 0.5 + 0.5) * 2 - 1; // Pseudo-random curve direction
      
      ctx.beginPath();
      ctx.moveTo(grassX, y);
      ctx.quadraticCurveTo(
        grassX + curve * 0.5,
        y - grassHeight * 0.6,
        grassX + curve,
        y - grassHeight
      );
      ctx.stroke();
      
      // Gelegentlich zusätzliche dünnere Halme hinzufügen
      if ((Math.sin(seed * 2.1) * 0.5 + 0.5) > 0.6) {
        const offset = (Math.sin(seed * 1.7) * 0.5 + 0.5) * 3 - 1.5;
        const secondHeight = grassHeight * (0.7 + (Math.sin(seed * 3.3) * 0.5 + 0.5) * 0.3);
        const secondColorIndex = Math.floor((Math.sin(seed * 1.9) * 0.5 + 0.5) * greenShades.length);
        const secondColor = greenShades[secondColorIndex];
        
        ctx.strokeStyle = secondColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(grassX + offset, y);
        ctx.quadraticCurveTo(
          grassX + offset - curve * 0.3,
          y - secondHeight * 0.5,
          grassX + offset - curve * 0.5,
          y - secondHeight
        );
        ctx.stroke();
      }
      
      // Kleine Grasspitzen für Details
      if ((Math.sin(seed * 2.7) * 0.5 + 0.5) > 0.7) {
        ctx.strokeStyle = greenShades[greenShades.length - 1]; // Hellstes Grün für Spitzen
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(grassX + curve, y - grassHeight);
        ctx.lineTo(grassX + curve - 1, y - grassHeight - 2);
        ctx.moveTo(grassX + curve, y - grassHeight);
        ctx.lineTo(grassX + curve + 1, y - grassHeight - 2);
        ctx.stroke();
      }
    }
    
    // Kleine Blumen hinzufügen (gelegentlich) - statisch
    for (let i = 0; i < width; i += 30) {
      const flowerSeed = (x + i) * 0.05789;
      if ((Math.sin(flowerSeed) * 0.5 + 0.5) > 0.7) {
        const flowerX = x + i + (Math.sin(flowerSeed * 1.5) * 0.5 + 0.5) * 15;
        const flowerY = y - 8 - (Math.sin(flowerSeed * 2.1) * 0.5 + 0.5) * 4;
        
        // Blumenstiel
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(flowerX, y);
        ctx.lineTo(flowerX, flowerY);
        ctx.stroke();
        
        // Blütenblätter
        const petalColors = ['#FFEB3B', '#FFF176', '#FFD54F', '#FF8A80', '#FF80AB'];
        const petalColorIndex = Math.floor((Math.sin(flowerSeed * 3.7) * 0.5 + 0.5) * petalColors.length);
        const petalColor = petalColors[petalColorIndex];
        ctx.fillStyle = petalColor;
        
        for (let j = 0; j < 5; j++) {
          const angle = (j * 72) * Math.PI / 180;
          const petalX = flowerX + Math.cos(angle) * 2;
          const petalY = flowerY + Math.sin(angle) * 2;
          ctx.beginPath();
          ctx.arc(petalX, petalY, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Blütenmitte
        ctx.fillStyle = '#FFA726';
        ctx.beginPath();
        ctx.arc(flowerX, flowerY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawDiamond = (ctx, x, y, size) => {
    const time = Date.now() / 300;
    const pulse = Math.sin(time) * 3;
    const rotation = time % (Math.PI * 2);
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    // Äußerer Glanz
    const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, size + pulse + 8);
    outerGlow.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
    outerGlow.addColorStop(0.5, 'rgba(0, 200, 255, 0.4)');
    outerGlow.addColorStop(1, 'rgba(0, 150, 255, 0)');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(0, 0, size + pulse + 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Diamant Form
    const gradient = ctx.createLinearGradient(-size, -size, size, size);
    gradient.addColorStop(0, '#00FFFF');
    gradient.addColorStop(0.3, '#00DDFF');
    gradient.addColorStop(0.5, '#FFFFFF');
    gradient.addColorStop(0.7, '#00DDFF');
    gradient.addColorStop(1, '#00AAFF');
    ctx.fillStyle = gradient;
    
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.6, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.6, 0);
    ctx.closePath();
    ctx.fill();
    
    // Innere Facetten
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.moveTo(-size * 0.6, 0);
    ctx.lineTo(size * 0.6, 0);
    ctx.stroke();
    
    // Highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(-size * 0.3, -size * 0.3, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(size * 0.2, size * 0.2, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    // Rand
    ctx.strokeStyle = '#0099CC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.6, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.6, 0);
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
  };

  const drawGoomba = (ctx, enemy) => {
    const x = enemy.x;
    const y = enemy.y;
    const w = enemy.width;
    const h = enemy.height;
    
    // Sanfte Animation
    const time = Date.now() / 200;
    const walkCycle = Math.floor(time) % 2;
    const bounce = Math.sin(time * Math.PI) * 1.5; // Sanfter Hüpf-Effekt
    
    // Bewegungsrichtung
    const direction = enemy.velocityX > 0 ? 1 : -1;
    
    ctx.save();
    
    // Schatten unter dem Goomba
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + h + 2, w/2, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Füße - klein und niedlich
    ctx.fillStyle = '#8B4513';
    // Linker Fuß
    ctx.beginPath();
    ctx.ellipse(x + 8, y + h - 2 + (walkCycle === 0 ? 1 : 0) - bounce, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Rechter Fuß
    ctx.beginPath();
    ctx.ellipse(x + w - 8, y + h - 2 + (walkCycle === 1 ? 1 : 0) - bounce, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Körper - kompakt und rund
    const bodyGradient = ctx.createRadialGradient(
      x + w/2, y + 15 - bounce, 2,
      x + w/2, y + 15 - bounce, w/2
    );
    bodyGradient.addColorStop(0, '#DEB887');
    bodyGradient.addColorStop(0.7, '#CD853F');
    bodyGradient.addColorStop(1, '#A0522D');
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + 15 - bounce, w/2 - 3, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Körper-Outline
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + 15 - bounce, w/2 - 3, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Pilzkappe - kompakter
    const capGradient = ctx.createRadialGradient(
      x + w/2, y + 8 - bounce, 2,
      x + w/2, y + 8 - bounce, w/2 + 2
    );
    capGradient.addColorStop(0, '#CD853F');
    capGradient.addColorStop(0.5, '#A0522D');
    capGradient.addColorStop(1, '#8B4513');
    ctx.fillStyle = capGradient;
    
    // Kappe (runde Pilzform)
    ctx.beginPath();
    ctx.arc(x + w/2, y + 8 - bounce, w/2 + 2, Math.PI, 0, true);
    ctx.quadraticCurveTo(x + w/2, y + 13 - bounce, x, y + 13 - bounce);
    ctx.closePath();
    ctx.fill();
    
    // Kappe Outline
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x + w/2, y + 8 - bounce, w/2 + 2, Math.PI, 0, true);
    ctx.stroke();
    
    // Kleine Punkte auf der Kappe
    ctx.fillStyle = 'rgba(101, 67, 33, 0.5)';
    ctx.beginPath();
    ctx.arc(x + 10, y + 6 - bounce, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w - 10, y + 7 - bounce, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w/2, y + 4 - bounce, 1, 0, Math.PI * 2);
    ctx.fill();
    
    // Highlight auf Kappe
    ctx.fillStyle = 'rgba(205, 133, 63, 0.6)';
    ctx.beginPath();
    ctx.ellipse(x + w/2 - 4, y + 6 - bounce, 4, 3, -0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Trennlinie zwischen Kappe und Körper
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 13 - bounce);
    ctx.lineTo(x + w - 4, y + 13 - bounce);
    ctx.stroke();
    
    // Kleine, niedliche Augen
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x + 10, y + 14 - bounce, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w - 10, y + 14 - bounce, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Kleine weiße Glanzpunkte
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x + 10.5, y + 13.5 - bounce, 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w - 9.5, y + 13.5 - bounce, 0.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Freundliche kleine Augenbrauen
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 11 - bounce);
    ctx.lineTo(x + 12, y + 11.5 - bounce);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + w - 8, y + 11 - bounce);
    ctx.lineTo(x + w - 12, y + 11.5 - bounce);
    ctx.stroke();
    
    // Kleiner, freundlicher Mund
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x + w/2, y + 17 - bounce, 2, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
    
    // Kleine rosige Wangen
    ctx.fillStyle = 'rgba(255, 182, 193, 0.5)';
    ctx.beginPath();
    ctx.ellipse(x + 7, y + 16 - bounce, 2.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w - 7, y + 16 - bounce, 2.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const drawBowser = (ctx, boss) => {
    const x = boss.x;
    const y = boss.y;
    const w = boss.width;
    const h = boss.height;
    
    // Animation
    const time = Date.now() / 300;
    const breathe = Math.sin(time) * 3;
    const direction = boss.velocityX > 0 ? 1 : -1;
    
    ctx.save();
    
    // Schatten
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + h + 5, w/2 + 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Schwanz
    ctx.strokeStyle = '#8B4500';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + w/2, y + h - 20);
    ctx.quadraticCurveTo(
      x + w + 20 * direction,
      y + h - 40 + Math.sin(time * 2) * 10,
      x + w + 30 * direction,
      y + h - 60
    );
    ctx.stroke();
    
    // Stacheln auf Schwanz
    ctx.fillStyle = '#FFD700';
    for (let i = 0; i < 3; i++) {
      const tailX = x + w/2 + (15 + i * 10) * direction;
      const tailY = y + h - 30 - i * 10 + Math.sin(time * 2 + i) * 5;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(tailX - 6, tailY + 8);
      ctx.lineTo(tailX + 6, tailY + 8);
      ctx.closePath();
      ctx.fill();
    }
    
    // Füße/Beine
    ctx.fillStyle = '#8B4500';
    // Linkes Bein
    ctx.beginPath();
    ctx.ellipse(x + 15, y + h - 15, 15, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    // Rechtes Bein
    ctx.beginPath();
    ctx.ellipse(x + w - 15, y + h - 15, 15, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Krallen
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x + 15 + i * 5 - 7, y + h - 5);
      ctx.lineTo(x + 15 + i * 5 - 7, y + h + 3);
      ctx.lineTo(x + 15 + i * 5 - 5, y + h - 5);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(x + w - 15 + i * 5 - 7, y + h - 5);
      ctx.lineTo(x + w - 15 + i * 5 - 7, y + h + 3);
      ctx.lineTo(x + w - 15 + i * 5 - 5, y + h - 5);
      ctx.closePath();
      ctx.fill();
    }
    
    // Körper
    const bodyGradient = ctx.createRadialGradient(
      x + w/2, y + h/2, 5,
      x + w/2, y + h/2, w/2
    );
    bodyGradient.addColorStop(0, '#FF8C00');
    bodyGradient.addColorStop(0.7, '#FF6500');
    bodyGradient.addColorStop(1, '#CC5200');
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + h/2 + breathe, w/2 - 5, h/2 - 20, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Panzerstacheln
    ctx.fillStyle = '#FFD700';
    const spikes = [
      { x: w/2 - 20, y: h/2 - 15 },
      { x: w/2, y: h/2 - 20 },
      { x: w/2 + 20, y: h/2 - 15 }
    ];
    spikes.forEach(spike => {
      ctx.beginPath();
      ctx.moveTo(x + spike.x, y + spike.y + breathe);
      ctx.lineTo(x + spike.x - 8, y + spike.y + 15 + breathe);
      ctx.lineTo(x + spike.x + 8, y + spike.y + 15 + breathe);
      ctx.closePath();
      ctx.fill();
    });
    
    // Panzer-Outline
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + h/2 + breathe, w/2 - 5, h/2 - 20, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Kopf
    const headGradient = ctx.createRadialGradient(
      x + w/2, y + 25, 5,
      x + w/2, y + 25, 30
    );
    headGradient.addColorStop(0, '#9ACD32');
    headGradient.addColorStop(0.7, '#7CB342');
    headGradient.addColorStop(1, '#558B2F');
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.arc(x + w/2, y + 25, 28, 0, Math.PI * 2);
    ctx.fill();
    
    // Hörner
    ctx.fillStyle = '#FFD700';
    // Linkes Horn
    ctx.beginPath();
    ctx.moveTo(x + w/2 - 25, y + 15);
    ctx.lineTo(x + w/2 - 30, y + 5);
    ctx.lineTo(x + w/2 - 20, y + 18);
    ctx.closePath();
    ctx.fill();
    // Rechtes Horn
    ctx.beginPath();
    ctx.moveTo(x + w/2 + 25, y + 15);
    ctx.lineTo(x + w/2 + 30, y + 5);
    ctx.lineTo(x + w/2 + 20, y + 18);
    ctx.closePath();
    ctx.fill();
    
    // Augen (böse)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(x + w/2 - 12, y + 20, 8, 10, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w/2 + 12, y + 20, 8, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupillen
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(x + w/2 - 12 + direction * 2, y + 22, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w/2 + 12 + direction * 2, y + 22, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Böse Augenbrauen
    ctx.strokeStyle = '#2F4F2F';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + w/2 - 20, y + 12);
    ctx.lineTo(x + w/2 - 8, y + 16);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + w/2 + 20, y + 12);
    ctx.lineTo(x + w/2 + 8, y + 16);
    ctx.stroke();
    
    // Schnauze
    ctx.fillStyle = '#C5E1A5';
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + 35, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Nasenlöcher
    ctx.fillStyle = '#2F4F2F';
    ctx.beginPath();
    ctx.ellipse(x + w/2 - 6, y + 33, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w/2 + 6, y + 33, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Mund (böses Grinsen)
    ctx.strokeStyle = '#2F4F2F';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + w/2, y + 42, 12, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
    
    // Zähne
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(x + w/2 - 10 + i * 5, y + 42);
      ctx.lineTo(x + w/2 - 12 + i * 5, y + 47);
      ctx.lineTo(x + w/2 - 8 + i * 5, y + 47);
      ctx.closePath();
      ctx.fill();
    }
    
    // Arme
    ctx.fillStyle = '#8B4500';
    // Linker Arm
    ctx.beginPath();
    ctx.ellipse(x + 8, y + h/2 + 10 + breathe, 12, 20, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Rechter Arm
    ctx.beginPath();
    ctx.ellipse(x + w - 8, y + h/2 + 10 + breathe, 12, 20, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Krallen an Händen
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x + 8 + i * 4 - 4, y + h/2 + 25 + breathe);
      ctx.lineTo(x + 8 + i * 4 - 4, y + h/2 + 32 + breathe);
      ctx.lineTo(x + 8 + i * 4 - 2, y + h/2 + 25 + breathe);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(x + w - 8 + i * 4 - 4, y + h/2 + 25 + breathe);
      ctx.lineTo(x + w - 8 + i * 4 - 4, y + h/2 + 32 + breathe);
      ctx.lineTo(x + w - 8 + i * 4 - 2, y + h/2 + 25 + breathe);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
    
    // Health Bar
    const healthBarWidth = 150;
    const healthBarHeight = 12;
    const healthBarX = x + w/2 - healthBarWidth/2;
    const healthBarY = y - 20;
    
    // Hintergrund
    ctx.fillStyle = '#330000';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    // Health
    const healthPercentage = boss.health / boss.maxHealth;
    const healthColor = healthPercentage > 0.5 ? '#00FF00' : healthPercentage > 0.25 ? '#FFFF00' : '#FF0000';
    ctx.fillStyle = healthColor;
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercentage, healthBarHeight);
    
    // Border
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    // Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`BOWSER ${boss.health}/${boss.maxHealth}`, x + w/2, healthBarY + healthBarHeight/2);
  };

  const drawFireball = (ctx, fireball) => {
    const time = Date.now() / 100;
    const flameSize = fireball.size + Math.sin(time + fireball.x) * 2;
    
    // Outer glow
    const glowGradient = ctx.createRadialGradient(
      fireball.x, fireball.y, 0,
      fireball.x, fireball.y, flameSize + 8
    );
    glowGradient.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
    glowGradient.addColorStop(0.5, 'rgba(255, 50, 0, 0.4)');
    glowGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(fireball.x, fireball.y, flameSize + 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Main fireball
    const fireballGradient = ctx.createRadialGradient(
      fireball.x, fireball.y, 0,
      fireball.x, fireball.y, flameSize
    );
    fireballGradient.addColorStop(0, '#FFFF00');
    fireballGradient.addColorStop(0.3, '#FF8800');
    fireballGradient.addColorStop(0.7, '#FF0000');
    fireballGradient.addColorStop(1, '#8B0000');
    ctx.fillStyle = fireballGradient;
    ctx.beginPath();
    ctx.arc(fireball.x, fireball.y, flameSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Fire trail
    for (let i = 1; i < 4; i++) {
      const trailX = fireball.x - fireball.velocityX * i * 3;
      const trailY = fireball.y - fireball.velocityY * i * 3;
      const trailSize = flameSize * (1 - i * 0.2);
      const trailAlpha = 0.5 - i * 0.1;
      
      ctx.fillStyle = `rgba(255, ${100 - i * 20}, 0, ${trailAlpha})`;
      ctx.beginPath();
      ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Function to draw player based on selected skin
  const drawPlayer = (ctx, player) => {
    const skin = skins[player.skin] || skins.mario; // Fallback to Mario if skin not found
    const x = player.x;
    const y = player.y;
    const w = player.width;
    const h = player.height;
    
    // Animation for running - faster animation cycle
    const runCycle = Math.floor(animationFrameRef.current / 4) % 4; // 0, 1, 2, 3 for faster running animation
    const isMoving = Math.abs(player.velocityX) > 0.1;
    
    // Running effect - more pronounced leg movement
    const legOffset = isMoving ? (runCycle === 0 || runCycle === 2 ? 0 : (runCycle === 1 ? 3 : -3)) : 0;
    const armSwing = isMoving ? (runCycle < 2 ? 4 : -4) : 0;
    
    // Body lean when running
    const bodyLean = isMoving ? (player.direction === 'right' ? 1 : -1) : 0;
    
    // Squash & Stretch beim Springen/Landen
    let squashX = 1;
    let squashY = 1;
    let landingOffset = 0;
    
    if (player.isJumping) {
      if (player.velocityY < -5) {
        // Beim Abstoßen - Strecken (vertikal gedehnt)
        squashX = 0.85;
        squashY = 1.15;
      } else if (player.velocityY > 5) {
        // Beim Fallen - leicht zusammengedrückt
        squashX = 1.1;
        squashY = 0.9;
      }
    } else if (!player.isJumping && Math.abs(player.velocityY) < 0.1) {
      // Kurz nach Landung - Squash-Effekt
      const timeSinceLanding = animationFrameRef.current % 10;
      if (timeSinceLanding < 5) {
        const squashAmount = (5 - timeSinceLanding) / 5;
        squashX = 1 + squashAmount * 0.2;
        squashY = 1 - squashAmount * 0.15;
        landingOffset = squashAmount * 3;
      }
    }
    
    // Hit-Animation - Zurückprallen und Blinken
    let hitRotation = 0;
    let hitOffsetX = 0;
    let hitOffsetY = 0;
    let hitAlpha = 1;
    
    if (player.isHit && player.hitTimer > 0) {
      // Rotation beim Treffer
      hitRotation = Math.sin(player.hitTimer * 0.5) * 0.3;
      // Zurückprallen
      hitOffsetX = Math.cos(player.hitTimer * 0.8) * (player.hitTimer * 0.5);
      hitOffsetY = -Math.abs(Math.sin(player.hitTimer * 0.6)) * 10;
    }
    
    // Blinken während Invincibility
    if (player.invincible) {
      hitAlpha = Math.floor(player.invincibleTimer / 5) % 2 === 0 ? 1 : 0.3;
    }
    
    ctx.save();
    ctx.globalAlpha = hitAlpha;
    
    // Transformation für Squash & Stretch und Hit
    ctx.translate(x + w/2 + hitOffsetX, y + h - landingOffset + hitOffsetY);
    ctx.rotate(hitRotation);
    ctx.scale(squashX, squashY);
    ctx.translate(-(x + w/2), -(y + h - landingOffset));
    
    // Schuhe/Füße - more dynamic during running
    ctx.fillStyle = skin.shoeColor;
    if (isMoving) {
      // Linker Fuß - pumping motion
      ctx.beginPath();
      ctx.ellipse(x + 8 + bodyLean, y + h - 3 + (runCycle % 2 === 0 ? 0 : -2), 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Rechter Fuß - opposite animation
      ctx.beginPath();
      ctx.ellipse(x + w - 8 + bodyLean, y + h - 3 + (runCycle % 2 === 1 ? 0 : -2), 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(x + 8, y + h - 3, 5, 0, Math.PI * 2); // Simpler Kreis für Füße
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + w - 8, y + h - 3, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Beine (Overalls) - with running animation
    ctx.fillStyle = skin.overallColor;
    ctx.beginPath();
    ctx.roundRect(x + 8 + bodyLean, y + h - 20 + Math.abs(legOffset) * 0.3, 10, 18, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(x + w - 18 + bodyLean, y + h - 20 + Math.abs(legOffset) * 0.3, 10, 18, 3);
    ctx.fill();
    
    // Körper (Shirt) - with slight lean
    ctx.fillStyle = skin.color;
    ctx.beginPath();
    ctx.roundRect(x + 5 + bodyLean, y + 20, w - 10, 18, 5);
    ctx.fill();
    
    // Hände - with more dynamic arm swing
    ctx.fillStyle = skin.faceColor;
    if (isMoving) {
      // Linker Arm - pumping motion
      ctx.beginPath();
      ctx.arc(x + 3 + bodyLean, y + 25 + armSwing, 5, 0, Math.PI * 2);
      ctx.fill();
      // Rechter Arm - opposite pumping
      ctx.beginPath();
      ctx.arc(x + w - 3 + bodyLean, y + 25 - armSwing, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(x + 3, y + 25, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + w - 3, y + 25, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Overall Träger
    ctx.fillStyle = skin.overallColor;
    ctx.fillRect(x + 12 + bodyLean, y + 20, 5, 15);
    ctx.fillRect(x + w - 17 + bodyLean, y + 20, 5, 15);
    
    // Knöpfe
    ctx.fillStyle = skin.buttonColor;
    ctx.beginPath();
    ctx.arc(x + 14 + bodyLean, y + 23, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w - 14 + bodyLean, y + 23, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Kopf/Gesicht - slight bobbing when running
    const headBob = isMoving ? Math.sin(runCycle * Math.PI / 2) * 1 : 0;
    ctx.fillStyle = skin.faceColor;
    ctx.beginPath();
    ctx.arc(x + w / 2 + bodyLean, y + 12 + headBob, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Hut
    ctx.fillStyle = skin.hatColor;
    ctx.beginPath();
    ctx.ellipse(x + w / 2 + bodyLean, y + 5 + headBob, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = skin.color;
    ctx.beginPath();
    ctx.arc(x + w / 2 + bodyLean, y + 8 + headBob, 10, 0, Math.PI);
    ctx.fill();
    
    // Hutschirm
    ctx.fillStyle = skin.hatColor;
    ctx.beginPath();
    ctx.ellipse(x + w / 2 + bodyLean, y + 8 + headBob, 13, 4, 0, 0, Math.PI);
    ctx.fill();
    
    // Logo auf Hut (M, L, P, T, W)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const initial = skin.name.charAt(0);
    ctx.fillText(initial, x + w / 2 + bodyLean, y + 6 + headBob);
    
    // Augen
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x + w / 2 - 4 + bodyLean, y + 12 + headBob, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w / 2 + 4 + bodyLean, y + 12 + headBob, 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Weiße Pupillen-highlights
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x + w / 2 - 4 + 1 + bodyLean, y + 12 - 1 + headBob, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w / 2 + 4 + 1 + bodyLean, y + 12 - 1 + headBob, 1, 0, Math.PI * 2);
    ctx.fill();
    
    // Nase
    ctx.fillStyle = skin.faceColor;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 2;
    ctx.beginPath();
    ctx.ellipse(x + w / 2 + bodyLean, y + 15 + headBob, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Schnurrbart
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(x + w / 2 - 5 + bodyLean, y + 17 + headBob, 5, 3, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w / 2 + 5 + bodyLean, y + 17 + headBob, 5, 3, 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    
    // Draw shield if active (außerhalb der Transformation)
    if (player.hasShield) {
      const shimmer = Math.sin(Date.now() / 200) * 0.3 + 0.7;
      ctx.strokeStyle = `rgba(0, 255, 255, ${shimmer})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x + w / 2 + hitOffsetX, y + h / 2 + hitOffsetY, 28, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.strokeStyle = `rgba(0, 200, 255, ${shimmer * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + w / 2 + hitOffsetX, y + h / 2 + hitOffsetY, 32, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Speed lines when moving fast (optional visual effect)
    if (isMoving && Math.abs(player.velocityX) > 6) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      const lineDirection = player.direction === 'right' ? -1 : 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x + (player.direction === 'right' ? 0 : w) + lineDirection * (10 + i * 5), y + 20 + i * 8);
        ctx.lineTo(x + (player.direction === 'right' ? 0 : w) + lineDirection * (20 + i * 5), y + 20 + i * 8);
        ctx.stroke();
      }
    }
  };

  const drawTree = (ctx, x, y, type = 'normal') => {
    // All trees are designed to be around 60px tall, with 'y' being the top point
    if (type === 'cactus') {
      // Kaktus für Wüste
      ctx.fillStyle = '#228B22'; // Dark green
      ctx.fillRect(x + 15, y, 10, 60); // Main trunk (40px wide, 60px high)
      ctx.fillRect(x + 5, y + 20, 10, 20); // Left arm
      ctx.fillRect(x + 25, y + 15, 10, 25); // Right arm
      
      // Stacheln
      ctx.strokeStyle = '#006400'; // Even darker green
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        // Main trunk spines
        ctx.beginPath();
        ctx.moveTo(x + 15, y + i * 8);
        ctx.lineTo(x + 12, y + i * 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 25, y + i * 8);
        ctx.lineTo(x + 28, y + i * 8);
        ctx.stroke();
        // Left arm spines
        if (i < 3) {
          ctx.beginPath();
          ctx.moveTo(x + 15, y + 20 + i * 8);
          ctx.lineTo(x + 18, y + 20 + i * 8);
          ctx.stroke();
        }
        // Right arm spines
        if (i < 4) {
          ctx.beginPath();
          ctx.moveTo(x + 25, y + 15 + i * 8);
          ctx.lineTo(x + 22, y + 15 + i * 8);
          ctx.stroke();
        }
      }
    } else if (type === 'pine') {
      // Tannenbaum für Schnee
      ctx.fillStyle = '#8B4513'; // Brown trunk
      ctx.fillRect(x + 15, y + 40, 8, 20); // Trunk (adjusted x for centering with new leaves)
      
      ctx.fillStyle = '#0F5F0F'; // Dark green for leaves
      ctx.beginPath();
      ctx.moveTo(x + 19, y); // Top peak
      ctx.lineTo(x + 5, y + 25); // Bottom-left of top layer
      ctx.lineTo(x + 33, y + 25); // Bottom-right of top layer
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(x + 19, y + 15); // Peak of middle layer
      ctx.lineTo(x + 8, y + 35); // Bottom-left of middle layer
      ctx.lineTo(x + 30, y + 35); // Bottom-right of middle layer
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x + 19, y + 28); // Peak of bottom layer
      ctx.lineTo(x + 11, y + 45); // Bottom-left of bottom layer
      ctx.lineTo(x + 27, y + 45); // Bottom-right of bottom layer
      ctx.closePath();
      ctx.fill();
      
      // Schnee auf Baum
      ctx.fillStyle = '#FFFFFF'; // White snow
      ctx.beginPath();
      ctx.arc(x + 19, y, 5, 0, Math.PI * 2); // Top snow cap
      ctx.arc(x + 5, y + 25, 4, 0, Math.PI * 2); // Snow on left branch
      ctx.arc(x + 33, y + 25, 4, 0, Math.PI * 2); // Snow on right branch
      ctx.fill();
    } else if (type === 'dead') {
      // Toter Baum für Lava-Level (60px high)
      ctx.strokeStyle = '#2F2F2F'; // Dark grey/brown
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x + 20, y + 60); // Base of trunk
      ctx.lineTo(x + 20, y + 20); // Top of trunk
      ctx.stroke();
      
      ctx.lineWidth = 3;
      // Branches
      ctx.beginPath();
      ctx.moveTo(x + 20, y + 30);
      ctx.lineTo(x + 10, y + 25);
      ctx.moveTo(x + 20, y + 40);
      ctx.lineTo(x + 30, y + 35);
      ctx.stroke();
    } else {
      // Normaler Baum (default for Level 1) (60px high)
      ctx.fillStyle = '#8B4513'; // Brown trunk
      ctx.fillRect(x + 15, y + 30, 10, 30); // Trunk
      
      ctx.fillStyle = '#228B22'; // Green leaves
      // Bottom layer of leaves
      ctx.beginPath();
      ctx.arc(x + 20, y + 30, 20, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#1E7B1E'; // Slightly different green for depth
      ctx.beginPath();
      ctx.arc(x + 10, y + 25, 15, 0, Math.PI * 2);
      ctx.arc(x + 30, y + 25, 15, 0, Math.PI * 2);
      ctx.arc(x + 20, y + 15, 18, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Function to handle buying skins from the shop
  const buySkin = (skinId) => {
    const skin = skins[skinId];
    if (!skin) return;

    if (!ownedSkins.includes(skinId)) {
      if (totalCoins >= skin.cost) {
        setTotalCoins(prev => prev - skin.cost);
        setOwnedSkins(prev => [...prev, skinId]);
        setCurrentSkin(skinId);
        // Update the player's skin in gameRef immediately if playing
        if (gameRef.current.player) {
          gameRef.current.player.skin = skinId;
        }
      }
    } else {
      // If already owned, just select it
      setCurrentSkin(skinId);
      // Update the player's skin in gameRef immediately if playing
      if (gameRef.current.player) {
        gameRef.current.player.skin = skinId;
      }
    }
  };

  // Function to handle buying items from the shop
  const buyItem = (item) => {
    if (totalCoins >= item.cost) {
      setTotalCoins(prev => prev - item.cost);
      
      if (item.id === 'extraLife') {
        setLives(prev => prev + 1);
      } else if (item.id === 'shield') {
        setPowerups(prev => ({ ...prev, shield: prev.shield + 1 }));
        // Ensure player shield status is updated if they are currently playing
        if (gameRef.current.player) {
          gameRef.current.player.hasShield = true;
        }
      } else {
        // For upgrade type powerups, set them to true
        setPowerups(prev => ({ ...prev, [item.id]: true }));
      }
    }
  };

  const loadLevel = (levelNum) => {
    const level = levels[levelNum];
    gameRef.current = {
      player: {
        x: 100,
        y: 300,
        width: 40,
        height: 50, // Updated height
        velocityY: 0,
        velocityX: 0,
        isJumping: false,
        skin: currentSkin, // Set current skin
        direction: 'right',
        hasShield: powerups.shield > 0, // Initialize player shield status based on powerups state
        isHit: false,
        hitTimer: 0,
        invincible: false,
        invincibleTimer: 0
      },
      platforms: JSON.parse(JSON.stringify(level.platforms)),
      coins: JSON.parse(JSON.stringify(level.coins)),
      diamonds: JSON.parse(JSON.stringify(level.diamonds)),
      enemies: JSON.parse(JSON.stringify(level.enemies)),
      trees: JSON.parse(JSON.stringify(level.trees || [])), // Include trees
      boss: level.boss ? JSON.parse(JSON.stringify(level.boss)) : null, // Initialize boss
      fireballs: [], // Initialize fireballs array for current level
      goal: { ...level.goal }
    };
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key] = true;
      if ((e.key === ' ' || e.key === 'ArrowUp') && gameState === 'playing') {
        e.preventDefault();
        jump();
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  const jump = () => {
    const player = gameRef.current.player;
    if (!player.isJumping) {
      player.velocityY = powerups.superJump ? -20 : -15; // Use direct conditional for JUMP_FORCE
      player.isJumping = true;
    }
  };

  const startGame = () => {
    // Reset powerups and total coins when starting a new game (except for owned skins)
    setPowerups({
      extraLife: 0,
      speedBoost: false,
      superJump: false,
      shield: 0,
      doubleCoins: false
    });
    setTotalCoins(0); // Reset total coins
    loadLevel(1);
    setScore(0);
    setLives(3);
    setCurrentLevel(1);
    setGameState('playing');
    setShowShop(false); // Hide shop when starting game
  };

  const nextLevel = () => {
    const next = currentLevel + 1;
    if (next <= Object.keys(levels).length) { // Updated to total levels count
      loadLevel(next);
      setCurrentLevel(next);
      setGameState('playing');
      setShowShop(false); // Hide shop after selecting next level
    } else {
      setGameState('won');
      setShowShop(false); // Hide shop after winning
    }
  };

  const restartLevel = () => {
    loadLevel(currentLevel);
    setGameState('playing');
    setShowShop(false); // Hide shop when restarting level
  };

  const gameLoop = () => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const game = gameRef.current;
    const player = game.player;
    const level = levels[currentLevel];

    animationFrameRef.current++;
    
    // Update hit timer
    if (player.isHit && player.hitTimer > 0) {
      player.hitTimer--;
      if (player.hitTimer === 0) {
        player.isHit = false;
      }
    }
    
    // Update invincibility timer
    if (player.invincible && player.invincibleTimer > 0) {
      player.invincibleTimer--;
      if (player.invincibleTimer === 0) {
        player.invincible = false;
      }
    }

    // Clear canvas with level-specific background
    ctx.fillStyle = level.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw houses and Peach's Castle in background (only in level 1)
    if (currentLevel === 1) {
      drawHouse(ctx, 80, 490, '#FFE4E1', '#DC143C');
      drawHouse(ctx, 150, 490, '#F0E68C', '#DAA520');
      drawHouse(ctx, 350, 490, '#E6E6FA', '#9370DB');
      drawHouse(ctx, 420, 490, '#FFDAB9', '#D2691E');
      
      drawPeachCastle(ctx);
    }

    // Draw Sun and Clouds only for certain levels (excluding boss level 12)
    if (currentLevel !== 4 && currentLevel !== 7 && currentLevel !== 8 && currentLevel !== 9 && currentLevel !== 10 && currentLevel !== 11 && currentLevel !== 12) {
      drawSun(ctx);
      cloudsRef.current.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > canvas.width + cloud.size) {
          cloud.x = -cloud.size;
        }
        drawCloud(ctx, cloud.x, cloud.y, cloud.size);
      });
    }

    // Add background details based on level
    if (currentLevel === 4) {
      // Lava effect at bottom
      ctx.fillStyle = '#FF4500';
      for (let i = 0; i < 20; i++) {
        const x = (Date.now() / 50 + i * 40) % canvas.width;
        ctx.beginPath();
        ctx.arc(x, 580, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw trees (behind everything else)
    game.trees.forEach(tree => {
      drawTree(ctx, tree.x, tree.y, tree.type);
    });

    // Handle player movement
    const moveSpeed = powerups.speedBoost ? 7.5 : 5; // Use direct conditional for MOVE_SPEED
    player.velocityX = 0;
    if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
      player.velocityX = -moveSpeed;
      player.direction = 'left';
    }
    if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
      player.velocityX = moveSpeed;
      player.direction = 'right';
    }

    // Apply gravity
    player.velocityY += GRAVITY;
    player.y += player.velocityY;
    player.x += player.velocityX;

    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Update moving platforms
    game.platforms.forEach(platform => {
      if (platform.moving) {
        platform.x += platform.velocityX;
        if (platform.x <= platform.minX || platform.x + platform.width >= platform.maxX) {
          platform.velocityX *= -1;
        }
      }
    });

    // Check platform collisions (including moving platforms)
    let onGround = false;
    let onMovingPlatform = null; // Track if player is on a moving platform
    game.platforms.forEach(platform => {
      if (
        player.x < platform.x + platform.width &&
        player.x + player.width > platform.x &&
        player.y + player.height > platform.y &&
        player.y + player.height < platform.y + platform.height &&
        player.velocityY >= 0 // Only land if moving downwards or stationary
      ) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.isJumping = false;
        onGround = true;
        if (platform.moving) {
          onMovingPlatform = platform;
        }
      }
    });

    // Move player with moving platform
    if (onMovingPlatform) {
      player.x += onMovingPlatform.velocityX;
      // Keep player within bounds when moving with platform
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    }

    // Check if fell off
    if (player.y > canvas.height) {
      // If player has a shield, consume it instead of losing a life
      if (player.hasShield) {
        player.hasShield = false; // Player loses shield
        setPowerups(prev => ({ ...prev, shield: Math.max(0, prev.shield - 1) }));
        // Player is respawned without losing a life
        player.x = 100;
        player.y = 300;
        player.velocityY = 0;
        // Also trigger hit/invincible states when shield saves from falling
        player.isHit = true;
        player.hitTimer = 20;
        player.invincible = true;
        player.invincibleTimer = 100;
      } else {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState('gameOver');
          } else {
            player.x = 100;
            player.y = 300;
            player.velocityY = 0;
            // Trigger hit animation
            player.isHit = true;
            player.hitTimer = 20;
            player.invincible = true;
            player.invincibleTimer = 100;
          }
          return newLives;
        });
      }
    }

    // Draw platforms
    game.platforms.forEach(platform => {
      ctx.fillStyle = platform.color;
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      
      // Add visual indicator for moving platforms
      if (platform.moving) {
        ctx.strokeStyle = '#FFD700'; // Gold color for moving platform border
        ctx.lineWidth = 3;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
      } else {
        ctx.strokeStyle = (currentLevel === 4 || currentLevel === 7 || currentLevel === 8 || currentLevel === 9 || currentLevel === 10 || currentLevel === 11 || currentLevel === 12) ? '#8B0000' : '#2F4F2F';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
      }

      // Draw grass on platforms if applicable
      if (platform.hasGrass && currentLevel === 1) { // Only draw grass for level 1
        drawGrass(ctx, platform.x, platform.y, platform.width);
      }
    });

    // Update and draw boss
    if (game.boss && !game.boss.defeated) {
      const boss = game.boss;
      
      // Move boss
      boss.x += boss.velocityX;
      if (boss.x <= boss.minX || boss.x + boss.width >= boss.maxX) {
        boss.velocityX *= -1;
      }
      
      // Shoot fireballs
      boss.fireballTimer++;
      if (boss.fireballTimer >= boss.fireballCooldown) {
        boss.fireballTimer = 0;
        // Shoot fireball towards player from Bowser's mouth area
        const fireOriginX = boss.x + boss.width / 2 + (boss.velocityX > 0 ? 30 : -30); // Offset based on boss direction
        const fireOriginY = boss.y + 40; // Mouth level
        
        const angle = Math.atan2(player.y + player.height/2 - fireOriginY, player.x + player.width/2 - fireOriginX);
        game.fireballs.push({
          x: fireOriginX,
          y: fireOriginY,
          velocityX: Math.cos(angle) * 5, // Faster fireballs
          velocityY: Math.sin(angle) * 5,
          size: 15
        });
      }
      
      // Draw boss
      drawBowser(ctx, boss);
      
      // Check collision with player (jump on boss)
      if (
        player.x < boss.x + boss.width &&
        player.x + player.width > boss.x &&
        player.y < boss.y + boss.height &&
        player.y + player.height > boss.y
      ) {
        const isJumpingOnBoss = player.velocityY > 0 && 
                                player.y + player.height - 20 < boss.y + boss.height / 2; // Hitbox for jumping on head
        
        if (isJumpingOnBoss && !player.invincible) {
          // Hit boss
          boss.health--;
          
          // Give coins
          const coinBonus = powerups.doubleCoins ? 20 : 10;
          setScore(prev => prev + coinBonus);
          setTotalCoins(prev => prev + coinBonus);
          
          // Bounce player
          player.velocityY = -12;
          player.isJumping = true;
          player.invincible = true;
          player.invincibleTimer = 30; // Short invincibility after hitting boss
          
          // Check if boss defeated
          if (boss.health <= 0) {
            boss.defeated = true;
            // Big coin bonus for defeating boss
            const bonusCoins = powerups.doubleCoins ? 200 : 100;
            setScore(prev => prev + bonusCoins);
            setTotalCoins(prev => prev + bonusCoins);
          }
        } else if (!isJumpingOnBoss && !player.invincible) {
          // Player hit by boss (side collision or from below)
          if (player.hasShield) {
            player.hasShield = false;
            setPowerups(prev => ({ ...prev, shield: Math.max(0, prev.shield - 1) }));
            player.isHit = true;
            player.hitTimer = 20;
            player.invincible = true;
            player.invincibleTimer = 100;
          } else {
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setGameState('gameOver');
              } else {
                player.x = 100;
                player.y = 300;
                player.velocityY = 0;
                player.isHit = true;
                player.hitTimer = 20;
                player.invincible = true;
                player.invincibleTimer = 100;
              }
              return newLives;
            });
          }
        }
      }
    }
    
    // Update and draw fireballs
    game.fireballs = game.fireballs.filter(fireball => {
      fireball.x += fireball.velocityX;
      fireball.y += fireball.velocityY;
      
      // Remove if off screen
      if (fireball.x < -50 || fireball.x > canvas.width + 50 || 
          fireball.y < -50 || fireball.y > canvas.height + 50) {
        return false;
      }
      
      // Check collision with player
      const dist = Math.sqrt(
        Math.pow(player.x + player.width/2 - fireball.x, 2) +
        Math.pow(player.y + player.height/2 - fireball.y, 2)
      );
      
      if (dist < player.width/2 + fireball.size && !player.invincible) {
        // Player hit by fireball
        if (player.hasShield) {
          player.hasShield = false;
          setPowerups(prev => ({ ...prev, shield: Math.max(0, prev.shield - 1) }));
          player.isHit = true;
          player.hitTimer = 20;
          player.invincible = true;
          player.invincibleTimer = 100;
        } else {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameState('gameOver');
            } else {
              player.x = 100;
              player.y = 300;
              player.velocityY = 0;
              player.isHit = true;
              player.hitTimer = 20;
              player.invincible = true;
              player.invincibleTimer = 100;
            }
            return newLives;
          });
        }
        return false; // Remove fireball
      }
      
      drawFireball(ctx, fireball);
      return true;
    });

    // Update and draw enemies
    game.enemies.forEach((enemy, index) => {
      enemy.x += enemy.velocityX;
      
      // Bounce enemies within their bounds
      if (enemy.x <= enemy.minX || enemy.x + enemy.width >= enemy.maxX) {
        enemy.velocityX *= -1;
      }

      // Skip drawing and collision if enemy is defeated
      if (enemy.defeated) return;

      // Draw Goomba instead of simple rectangle
      drawGoomba(ctx, enemy);

      // Check collision with player
      if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
      ) {
        // Check if player is jumping on enemy from above
        const isJumpingOnEnemy = player.velocityY > 0 && 
                                 player.y + player.height - 10 < enemy.y + enemy.height / 2;
        
        if (isJumpingOnEnemy) {
          // Player jumped on enemy - defeat enemy
          enemy.defeated = true;
          
          // Give 3 coins
          const coinBonus = powerups.doubleCoins ? 6 : 3; // 6 if double coins is active
          setScore(prev => prev + coinBonus);
          setTotalCoins(prev => prev + coinBonus);
          
          // Bounce player up
          player.velocityY = -10;
          player.isJumping = true;
          
        } else if (!player.invincible) {
          // Side/bottom collision - player gets hit
          // If player has a shield, consume it instead of losing a life
          if (player.hasShield) {
            player.hasShield = false; // Player loses shield
            setPowerups(prev => ({ ...prev, shield: Math.max(0, prev.shield - 1) }));
            // Trigger hit animation
            player.isHit = true;
            player.hitTimer = 20;
            player.invincible = true;
            player.invincibleTimer = 100;
          } else {
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setGameState('gameOver');
              } else {
                player.x = 100;
                player.y = 300;
                player.velocityY = 0;
                // Trigger hit animation
                player.isHit = true;
                player.hitTimer = 20;
                player.invincible = true;
                player.invincibleTimer = 100;
              }
              return newLives;
            });
          }
        }
      }
    });

    // Draw and check coins
    game.coins.forEach(coin => {
      if (!coin.collected) {
        const time = Date.now() / 200;
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.size / 2 + Math.sin(time) * 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.size / 2, 0, Math.PI * 2);
        ctx.stroke();

        // Check collision
        const dist = Math.sqrt(
          Math.pow(player.x + player.width / 2 - coin.x, 2) +
          Math.pow(player.y + player.height / 2 - coin.y, 2)
        );
        if (dist < player.width / 2 + coin.size / 2) {
          coin.collected = true;
          const coinValue = powerups.doubleCoins ? 20 : 10;
          setScore(prev => prev + coinValue);
          setTotalCoins(prev => prev + coinValue); // Add to total coins
        }
      }
    });

    // Draw and check diamonds
    game.diamonds.forEach(diamond => {
      if (!diamond.collected) {
        drawDiamond(ctx, diamond.x, diamond.y, diamond.size / 2);

        // Check collision
        const dist = Math.sqrt(
          Math.pow(player.x + player.width / 2 - diamond.x, 2) +
          Math.pow(player.y + player.height / 2 - diamond.y, 2)
        );
        if (dist < player.width / 2 + diamond.size / 2) {
          diamond.collected = true;
          const diamondValue = powerups.doubleCoins ? 200 : 100;
          setScore(prev => prev + diamondValue);
          setTotalCoins(prev => prev + diamondValue);
        }
      }
    });

    // Draw goal (flag) - only if boss is defeated or no boss in level
    if (!game.boss || game.boss.defeated) {
      const goal = game.goal;
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(goal.x, goal.y, 10, goal.height);
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.moveTo(goal.x + 10, goal.y);
      ctx.lineTo(goal.x + 40, goal.y + 15);
      ctx.lineTo(goal.x + 10, goal.y + 30);
      ctx.closePath();
      ctx.fill();

      // Check if reached goal
      if (
        player.x < goal.x + goal.width &&
        player.x + player.width > goal.x &&
        player.y < goal.y + goal.height &&
        player.y + player.height > goal.y
      ) {
        setGameState('levelComplete');
      }
    } else {
      // Draw message: "Besiege Bowser!" above the goal location
      const goal = game.goal;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(goal.x - 20, goal.y - 10, 90, 30);
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Besiege', goal.x + 25, goal.y + 5);
      ctx.fillText('Bowser!', goal.x + 25, goal.y + 17);
    }

    // Draw player using the new drawPlayer function
    drawPlayer(ctx, player);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      loadLevel(currentLevel); // Ensure level data is reloaded with potentially updated powerups or skin
      gameRef.current.player.hasShield = powerups.shield > 0; // Re-sync shield status
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, currentLevel, powerups, currentSkin]); // Add currentSkin to dependency array

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-green-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
            🍄 Super Jump Game 🍄
          </h1>
          <p className="text-white text-lg drop-shadow">
            Springe auf die Plattformen und erreiche die Flagge!
          </p>
        </div>

        <Card className="shadow-2xl border-4 border-yellow-400 mb-4">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-90">Level</p>
                  <p className="text-2xl font-bold">{currentLevel}/{Object.keys(levels).length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Coins className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-90">Münzen</p>
                  <p className="text-2xl font-bold">{totalCoins}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6" />
                <div>
                  <p className="text-sm opacity-90">Leben</p>
                  <p className="text-2xl font-bold">{lives}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-100 text-red-600"
                onClick={() => setShowShop(!showShop)}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop
              </Button>
            </div>
            {gameState === 'playing' && (
              <div className="mt-3 text-center flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                <p className="text-lg font-semibold">
                  {skins[currentSkin].name} • {levels[currentLevel].name}
                </p>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="p-6 bg-white">
            {showShop ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">🛒 Shop</h2>
                  <Button variant="outline" onClick={() => setShowShop(false)}>
                    Zurück
                  </Button>
                </div>
                
                <Tabs defaultValue="powerups" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="powerups">Power-Ups</TabsTrigger>
                    <TabsTrigger value="skins">Charaktere</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="powerups" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {shopItems.map(item => {
                        const Icon = item.icon;
                        const canBuy = totalCoins >= item.cost;
                        const isOwned = item.type === 'upgrade' && powerups[item.id];
                        
                        return (
                          <Card key={item.id} className={`${isOwned ? 'bg-green-50 border-green-400' : ''}`}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`${item.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold">{item.name}</h3>
                                    {isOwned && <Badge className="mt-1">Gekauft</Badge>}
                                    {item.id === 'shield' && powerups.shield > 0 && (
                                      <Badge className="mt-1">{powerups.shield}x</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1 text-yellow-600 font-bold">
                                  <Coins className="w-5 h-5" />
                                  {item.cost}
                                </div>
                                <Button
                                  onClick={() => buyItem(item)}
                                  disabled={!canBuy || (isOwned && item.type === 'upgrade')}
                                  size="sm"
                                  className={canBuy ? 'bg-green-500 hover:bg-green-600' : ''}
                                >
                                  {isOwned && item.type === 'upgrade' ? 'Besessen' : 'Kaufen'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    
                    <Card className="bg-blue-50 border-blue-400">
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-2">Aktive Power-Ups:</h3>
                        <div className="flex flex-wrap gap-2">
                          {powerups.speedBoost && <Badge className="bg-yellow-500">⚡ Geschwindigkeits-Boost</Badge>}
                          {powerups.superJump && <Badge className="bg-blue-500">🚀 Super Sprung</Badge>}
                          {powerups.shield > 0 && <Badge className="bg-purple-500">🛡️ Schild ({powerups.shield})</Badge>}
                          {powerups.doubleCoins && <Badge className="bg-green-500">💰 Doppelte Münzen</Badge>}
                          {!powerups.speedBoost && !powerups.superJump && powerups.shield === 0 && !powerups.doubleCoins && (
                            <p className="text-gray-500 text-sm">Keine aktiven Power-Ups</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="skins" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(skins).map(([skinId, skin]) => {
                        const isOwned = ownedSkins.includes(skinId);
                        const isActive = currentSkin === skinId;
                        const canBuy = totalCoins >= skin.cost;
                        
                        return (
                          <Card 
                            key={skinId} 
                            className={`${isActive ? 'border-4 border-green-500' : ''} ${isOwned && !isActive ? 'bg-green-50' : ''}`}
                          >
                            <CardHeader className="p-4">
                              <div className="text-center">
                                {/* Character preview with basic shape */}
                                <div className="w-20 h-20 mx-auto mb-2 relative border-2 border-gray-200 rounded-lg" style={{ backgroundColor: '#87CEEB' }}>
                                  <div 
                                    style={{ 
                                      width: '30px', 
                                      height: '30px',
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      backgroundColor: skin.color,
                                      border: `3px solid ${skin.hatColor}`,
                                      borderRadius: '50%'
                                    }}
                                  />
                                </div>
                                <h3 className="font-bold text-lg">{skin.name}</h3>
                                {isActive && <Badge className="mt-1 bg-green-500">Aktiv</Badge>}
                                {isOwned && !isActive && <Badge className="mt-1" variant="outline">Besessen</Badge>}
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-xs text-gray-600 mb-3 text-center">{skin.description}</p>
                              {skin.cost === 0 ? (
                                <Button 
                                  onClick={() => buySkin(skinId)}
                                  className="w-full"
                                  variant={isActive ? "outline" : "default"}
                                  disabled={isActive}
                                >
                                  {isActive ? 'Ausgewählt' : 'Auswählen'}
                                </Button>
                              ) : isOwned ? (
                                <Button 
                                  onClick={() => buySkin(skinId)}
                                  className="w-full"
                                  variant={isActive ? "outline" : "default"}
                                  disabled={isActive}
                                >
                                  {isActive ? 'Ausgewählt' : 'Auswählen'}
                                </Button>
                              ) : (
                                <div>
                                  <div className="flex items-center justify-center gap-1 text-yellow-600 font-bold mb-2">
                                    <Coins className="w-4 h-4" />
                                    {skin.cost}
                                  </div>
                                  <Button
                                    onClick={() => buySkin(skinId)}
                                    disabled={!canBuy}
                                    className="w-full"
                                  >
                                    Kaufen
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full border-4 border-blue-500 rounded-lg shadow-inner bg-sky-200"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                
                {gameState === 'ready' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-lg">
                    <div className="text-center space-y-6 p-8">
                      <h2 className="text-4xl font-bold text-white mb-4">
                        Bereit zum Springen?
                      </h2>
                      <div className="text-white space-y-2 mb-6">
                        <p className="text-lg">🎮 Steuerung:</p>
                        <p>← → oder A/D = Bewegen</p>
                        <p>LEERTASTE oder ↑ = Springen</p>
                        <p className="text-yellow-300 mt-4">🪙 Sammle Münzen für den Shop!
                        </p>
                        <p className="text-red-300">⚠️ Vermeide die Gegner!
                        </p>
                        <p className="text-green-300 mt-2">🏆 {Object.keys(levels).length} Level zu meistern!</p>
                        <p className="text-purple-300 mt-2">👤 Schalte neue Charaktere frei!</p>
                      </div>
                      <Button
                        onClick={startGame}
                        size="lg"
                        className="bg-green-500 hover:bg-green-600 text-white text-xl px-8 py-6"
                      >
                        <Play className="w-6 h-6 mr-2" />
                        Spiel Starten
                      </Button>
                    </div>
                  </div>
                )}

                {gameState === 'levelComplete' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
                    <div className="text-center space-y-6 p-8">
                      <Star className="w-24 h-24 text-yellow-400 mx-auto animate-bounce" />
                      <h2 className="text-5xl font-bold text-yellow-400 mb-4">
                        Level Geschafft! 🎉
                      </h2>
                      <p className="text-white text-xl">
                        Level {currentLevel}: {levels[currentLevel].name}
                      </p>
                      <p className="text-white text-2xl">
                        Punkte: {score}
                      </p>
                      {currentLevel < Object.keys(levels).length ? (
                        <div className="space-y-3">
                          <Button
                            onClick={nextLevel}
                            size="lg"
                            className="bg-green-500 hover:bg-green-600 text-white text-xl px-8 py-6 w-full"
                          >
                            <Star className="w-6 h-6 mr-2" />
                            Nächstes Level
                          </Button>
                          <Button
                            onClick={() => setShowShop(true)}
                            size="lg"
                            variant="outline"
                            className="text-xl px-8 py-6 w-full bg-white text-red-600 hover:bg-gray-100"
                          >
                            <ShoppingBag className="w-6 h-6 mr-2" />
                            Shop Besuchen
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-yellow-300 text-3xl font-bold">
                            Alle Level Geschafft! 🏆
                          </p>
                          <Button
                            onClick={startGame}
                            size="lg"
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xl px-8 py-6"
                          >
                            <RotateCcw className="w-6 h-6 mr-2" />
                            Von Vorne Beginnen
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {gameState === 'gameOver' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
                    <div className="text-center space-y-6 p-8">
                      <h2 className="text-5xl font-bold text-red-500 mb-4">
                        Game Over!
                      </h2>
                      <p className="text-white text-xl">
                        Level {currentLevel}: {levels[currentLevel].name}
                      </p>
                      <p className="text-white text-2xl">
                        Punkte: {score}
                      </p>
                      <div className="flex gap-4 justify-center flex-wrap">
                        <Button
                          onClick={restartLevel}
                          size="lg"
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-8 py-6"
                        >
                          <RotateCcw className="w-6 h-6 mr-2" />
                          Level Wiederholen
                        </Button>
                        <Button
                          onClick={startGame}
                          size="lg"
                          variant="outline"
                          className="text-xl px-8 py-6 text-red-600 hover:bg-gray-100"
                        >
                          Neu Starten
                        </Button>
                        <Button
                          onClick={() => setShowShop(true)}
                          size="lg"
                          className="bg-purple-500 hover:bg-purple-600 text-white text-xl px-8 py-6"
                        >
                          <ShoppingBag className="w-6 h-6 mr-2" />
                          Shop
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {gameState === 'won' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
                    <div className="text-center space-y-6 p-8">
                      <Trophy className="w-24 h-24 text-yellow-400 mx-auto animate-bounce" />
                      <h2 className="text-5xl font-bold text-yellow-400 mb-4">
                        Alle Level Gemeistert! 🎉
                      </h2>
                      <p className="text-white text-3xl">
                        Endpunkte: {score}
                      </p>
                      <p className="text-yellow-300 text-2xl">
                        Gesammelte Münzen: {totalCoins}
                      </p>
                      <Button
                        onClick={startGame}
                        size="lg"
                        className="bg-green-500 hover:bg-green-600 text-white text-xl px-8 py-6"
                      >
                        <RotateCcw className="w-6 h-6 mr-2" />
                        Nochmal Spielen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {!showShop && ( // Hide level cards when shop is open
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(levels).map(([num, level]) => (
              <Card 
                key={num}
                className={`bg-white bg-opacity-90 shadow-lg ${
                  parseInt(num) === currentLevel ? 'border-4 border-yellow-400' : ''
                }`}
              >
                <CardContent className="p-4 text-center">
                  <p className="font-bold text-lg mb-1">Level {num}</p>
                  <p className="text-sm text-gray-600">{level.name}</p>
                  <div className="mt-2 flex justify-center gap-2">
                    <span className="text-xs bg-red-100 px-2 py-1 rounded">
                      {level.enemies.length} 👾
                    </span>
                    <span className="text-xs bg-yellow-100 px-2 py-1 rounded">
                      {level.coins.length} 🪙
                    </span>
                    <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                      {level.diamonds.length} 💎
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

