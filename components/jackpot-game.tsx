'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import { Users, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ParticleBackground } from './particle-background'

interface JackpotPlayer {
  id: number
  username: string
  avatar: string
  value: string
  percentage: string
  betValue: number
}

interface JackpotGameProps {
  players: JackpotPlayer[]
  onDeleteUser?: (userId: number) => void
}

type GameState = 'waiting' | 'countdown' | 'spinning' | 'finished'

export function JackpotGame({ players, onDeleteUser }: JackpotGameProps) {
  const [gameState, setGameState] = useState<GameState>(
    players.length === 0 ? 'waiting' : 'countdown'
  )
  const [timeLeft, setTimeLeft] = useState(7)
  const [currentPot, setCurrentPot] = useState('0.00')
  const [winner, setWinner] = useState<JackpotPlayer | null>(null)
  const [spinOffset, setSpinOffset] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winnerCardTwist, setWinnerCardTwist] = useState(false)
  const [arrowOffset, setArrowOffset] = useState(0)
  const [cardsForwardOffset, setCardsForwardOffset] = useState(0)
  const [showWinnerHighlight, setShowWinnerHighlight] = useState(false)
  const spinContainerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (players.length === 0) {
      setGameState('waiting')
    } else if (gameState === 'waiting') {
      setGameState('countdown')
      setTimeLeft(7)
    }
  }, [players.length, gameState])

  useEffect(() => {
    const total = players.reduce((sum, player) => sum + player.betValue, 0)
    setCurrentPot(total.toFixed(2))
  }, [players])

  useEffect(() => {
    if (gameState === 'countdown' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (gameState === 'countdown' && timeLeft === 0) {
      startSpinning()
    }
  }, [gameState, timeLeft])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX)
    setScrollLeft(currentTranslate)
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grabbing'
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()

    const x = e.pageX
    const walk = (x - startX) * 1
    setCurrentTranslate(scrollLeft + walk)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab'
    }
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp()
    }
  }

  const startSpinning = () => {
    setGameState('spinning')
    setIsSpinning(true)
    setWinnerCardTwist(false)
    setCardsForwardOffset(0)
    setShowWinnerHighlight(false)

    const getTileWidth = () => {
      const screenWidth = window.innerWidth
      if (screenWidth >= 1280) return 196 + 12 // xl: w-[196px] + gap-3 (12px)
      if (screenWidth >= 1024) return 180 + 12 // lg: w-[180px] + gap-3 (12px)
      if (screenWidth >= 768) return 168 + 12 // md: w-[168px] + gap-3 (12px)
      if (screenWidth >= 640) return 156 + 12 // sm: w-[156px] + gap-3 (12px)
      return 144 + 12 // default: w-[144px] + gap-3 (12px)
    }

    const tileWidth = getTileWidth()
    const containerWidth = spinContainerRef.current?.offsetWidth || 800

    const centerOffset = containerWidth / 2 - tileWidth / 2

    const repetitions = 12
    const totalSpins = 8 + Math.random() * 4

    const targetPlayerIndex = Math.floor(Math.random() * players.length)
    const randomWinner = players[targetPlayerIndex]
    setWinner(randomWinner)

    const winnerTileIndex =
      targetPlayerIndex + players.length * (repetitions - 1)
    const winnerTilePosition = winnerTileIndex * tileWidth
    const finalPosition = -(winnerTilePosition - centerOffset)

    let startTime: number
    const totalDuration = 8000
    const fastSpinDuration = 6000
    const slowSpinDuration = 2000

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / totalDuration, 1)

      let easedProgress

      if (elapsed < fastSpinDuration) {
        const fastProgress = elapsed / fastSpinDuration
        easedProgress = fastProgress * 0.9
      } else {
        const slowProgress = (elapsed - fastSpinDuration) / slowSpinDuration
        const easeOut = 1 - Math.pow(1 - slowProgress, 4)
        easedProgress = 0.9 + easeOut * 0.1
      }

      const currentOffset = finalPosition * easedProgress

      let forwardOffset = 0
      if (progress > 0.85 && progress <= 0.95) {
        const forwardProgress = (progress - 0.85) / 0.1
        const easeInOut = 0.5 * (1 - Math.cos(Math.PI * forwardProgress))
        forwardOffset = 30 * easeInOut
      } else if (progress > 0.95 && progress <= 0.98) {
        const backwardProgress = (progress - 0.95) / 0.03
        const easeOut = 1 - Math.pow(1 - backwardProgress, 3)
        forwardOffset = 30 - 35 * easeOut // From 30px to -5px smoothly
      } else if (progress > 0.98) {
        forwardOffset = -5
      }

      setSpinOffset(currentOffset)
      setCardsForwardOffset(forwardOffset)

      if (progress > 0.96 && !winnerCardTwist) {
        setWinnerCardTwist(true)
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsSpinning(false)
        setShowWinnerHighlight(true)
        setTimeout(() => {
          setCardsForwardOffset(-3) // Very subtle final adjustment
        }, 200)
        setTimeout(() => setGameState('finished'), 1500)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  const resetGame = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setGameState(players.length === 0 ? 'waiting' : 'countdown')
    setTimeLeft(7)
    setWinner(null)
    setSpinOffset(0)
    setIsSpinning(false)
    setWinnerCardTwist(false)
    setCardsForwardOffset(0)
    setShowWinnerHighlight(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  const createInfiniteTiles = () => {
    const baseColors = [
      '#B87744', // Brown/orange
      '#4A90E2', // Blue
      '#7B68EE', // Purple
      '#32CD32', // Green
      '#FF6347', // Red/orange
    ]

    const repetitions = 12
    const infiniteTiles = []

    for (let rep = 0; rep < repetitions; rep++) {
      players.forEach((player, index) => {
        infiniteTiles.push({
          ...player,
          id: `${player.id}-${rep}-${index}`,
          originalIndex: index,
          bgColor: baseColors[index % baseColors.length],
        })
      })
    }

    return infiniteTiles
  }

  const gridAvatars = players.map((player, index) => ({
    ...player,
    bgColor: [
      '#B87744', // Brown/orange
      '#4A90E2', // Blue
      '#7B68EE', // Purple
      '#32CD32', // Green
      '#FF6347', // Red/orange
    ][index % 5],
  }))

  const playerCards = players.map((player, index) => ({
    id: player.id,
    username: player.username,
    value: player.value,
    percentage: player.percentage,
    avatar: '/images/cartoon-avatar.jpeg',
    itemName: 'Item Name',
    itemValue: '$104.50',
    bgColor: [
      '#B87744', // Brown/orange
      '#4A90E2', // Blue
      '#7B68EE', // Purple
      '#32CD32', // Green
      '#FF6347', // Red/orange
    ][index % 5],
  }))

  if (gameState === 'waiting') {
    return (
      <div className="flex-1 bg-[#14151a] p-3 sm:p-4 lg:p-6 overflow-y-auto">
        <div className="border border-gray-700/30 bg-[#1a1b23] mb-4 sm:mb-6 min-h-[200px] sm:min-h-[300px] lg:min-h-[400px]">
          {/* Empty game area when waiting */}
        </div>

        <div className="bg-[#3f70e4] text-white py-4 text-lg sm:text-xl font-medium w-full text-center mb-4 sm:mb-6">
          Waiting for players...
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-[#1a1b23] p-4 text-center border border-gray-700/30">
            <div className="text-gray-400 text-xs sm:text-sm mb-2">
              Current Pot
            </div>
            <div className="text-lg sm:text-xl font-bold text-white">$0.00</div>
          </div>
          <div className="bg-[#1a1b23] p-4 text-center border border-gray-700/30">
            <div className="text-gray-400 text-xs sm:text-sm mb-2">Items</div>
            <div className="text-lg sm:text-xl font-bold text-white">0</div>
          </div>
          <div className="bg-[#1a1b23] p-4 text-center border border-gray-700/30">
            <div className="text-gray-400 text-xs sm:text-sm mb-2">
              Your Wager
            </div>
            <div className="text-lg sm:text-xl font-bold text-white">$0.00</div>
          </div>
          <div className="bg-[#1a1b23] p-4 text-center border border-gray-700/30">
            <div className="text-gray-400 text-xs sm:text-sm mb-2">
              Your Chance
            </div>
            <div className="text-lg sm:text-xl font-bold text-white">0.00%</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            <span>Round #25128</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>0 Players</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#14151a] p-3 sm:p-4 lg:p-6">
      {gameState === 'countdown' && (
        <div className="mb-6 p-6 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="relative overflow-hidden">
            <div
              ref={sliderRef}
              className="flex items-center gap-3 py-6 px-4 cursor-grab select-none transition-transform duration-200 ease-out"
              style={{
                transform: `translateX(${currentTranslate}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {gridAvatars.map((tile) => (
                <div
                  key={tile.id}
                  className={`relative rounded-[4px] p-4 flex-shrink-0 w-[196px] h-[246px] flex flex-col items-center justify-center border border-white/10 transition-transform duration-1000 overflow-hidden`}
                  style={{
                    userSelect: 'none',
                  }}
                >
                  <ParticleBackground color={tile.bgColor} />
                  <img
                    src={tile.avatar || '/placeholder.svg'}
                    alt={tile.username}
                    className="relative z-10 w-[164px]  h-[164px] object-cover mb-2 pointer-events-none rounded-[3px]"
                    draggable={false}
                  />
                  <div className="relative z-10 text-white text-sm font-bold text-center truncate w-full px-1 pointer-events-none">
                    {tile.username}
                  </div>
                  <div className="relative z-10 text-white/90 text-sm font-semibold mt-1 pointer-events-none">
                    {tile.percentage}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(gameState === 'spinning' || gameState === 'finished') && (
        <div className="min-h-[140px] sm:min-h-[160px] mb-4 sm:mb-6 relative overflow-hidden bg-[#1a1b23]">
          {!showWinnerHighlight && gameState !== 'finished' && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-white drop-shadow-lg"></div>
            </div>
          )}

          <div
            ref={spinContainerRef}
            className="flex items-center gap-3 py-6 px-4 will-change-transform"
            style={{
              transform: `translateX(${spinOffset + cardsForwardOffset}px)`,
              transition: isSpinning
                ? 'none'
                : 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            {createInfiniteTiles().map((tile) => {
              const isWinnerTile =
                winner &&
                tile.originalIndex ===
                  players.findIndex((p) => p.id === winner.id)
              const shouldAnimate =
                isWinnerTile && winnerCardTwist && !isSpinning
              const shouldBlur = showWinnerHighlight && !isWinnerTile

              return (
                <div
                  key={tile.id}
                  className={`relative p-4 flex-shrink-0 w-[144px] sm:w-[156px] md:w-[168px] lg:w-[180px] xl:w-[196px] 
                    h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] xl:h-[246px] 
                    flex flex-col items-center justify-center transition-all duration-500 overflow-hidden rounded-[4px]
                    ${
                      shouldAnimate
                        ? 'scale-110 shadow-2xl shadow-yellow-400/60 z-10'
                        : ''
                    }
                    ${shouldBlur ? 'blur-sm opacity-50' : ''}
                  `}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: shouldAnimate
                      ? 'rotateY(720deg) scale(1.1)'
                      : 'none',
                    transition: shouldAnimate
                      ? 'transform 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      : 'filter 0.5s ease-out, opacity 0.5s ease-out',
                  }}
                >
                  <ParticleBackground color={tile.bgColor} />
                  <img
                    src={tile.avatar || '/placeholder.svg'}
                    alt={tile.username}
                    className="relative z-10 w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px] xl:w-[164px] h-[100px] sm:h-[120px] md:h-[140px] lg:h-[160px] xl:h-[164px] object-cover mb-2 rounded-[3px]"
                  />
                  <div className="relative z-10 text-white text-xs sm:text-sm font-bold text-center truncate w-full px-1">
                    {tile.username}
                  </div>
                  <div className="relative z-10 text-white/90 text-xs font-medium">
                    {tile.percentage}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="absolute top-0 left-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full bg-gradient-to-r from-[#1a1b23] to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 right-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full bg-gradient-to-l from-[#1a1b23] to-transparent pointer-events-none z-10"></div>
        </div>
      )}

      {gameState === 'countdown' && (
        <div className="mb-4 h-[46px] sm:mb-6">
          <div className="bg-[#1a1b23] relative flex items-center gap-4 h-12">
            <div className="flex-1 bg-[#2a2a39] h-full flex items-center">
              <div
                className="relative transition-all duration-1000 h-full overflow-hidden"
                style={{ width: `${((7 - timeLeft) / 7) * 100}%` }}
              >
                <ParticleBackground color="#3f70e4" />
              </div>
            </div>

            <div className="text-white absolute top-0 left-0 z-10 w-full flex items-center justify-center h-full text-xl sm:text-2xl font-bold min-w-[80px] text-center">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      )}

      {gameState === 'spinning' && (
        <div className="mb-4 h-[46px] sm:mb-6">
          <div className="bg-[#1a1b23] relative flex items-center gap-4 h-12">
            <div className="flex-1 h-full flex items-center">
              <div className="bg-[#1B1B23] w-full h-full animate-pulse" />
            </div>

            <div
              className="text-white absolute top-0 left-0 z-10 w-full flex items-center justify-center h-full font-bold min-w-[80px] text-center"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              Spinning...
            </div>
          </div>
        </div>
      )}

      {gameState === 'finished' && winner && (
        <div className="text-center mb-4 sm:mb-6 bg-[#1a1b23] p-6">
          <div className="text-lg sm:text-xl text-white mb-4">
            🎉 <span className="text-[#eec45c] font-bold">User won</span>{' '}
            <span className="text-[#eec45c] font-bold">${currentPot}</span> with
            a chance of{' '}
            <span className="text-[#3f70e4] font-bold">
              {winner.percentage}
            </span>{' '}
            🎉
          </div>
          <button
            onClick={resetGame}
            className="bg-[#3f70e4] hover:bg-[#3f70e4]/80 text-white px-8 py-3 font-medium transition-colors duration-200 rounded-[3px]"
          >
            Start New Round
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-[#1a1b23] p-4 text-center">
          <div className="text-[#ffffff]/80 font-semibold text-[14px] sm:text-sm mb-2">
            Current Pot
          </div>
          <div className="text-lg sm:text-xl font-bold text-white">
            ${currentPot}
          </div>
        </div>
        <div className="bg-[#1a1b23] p-4 text-center">
          <div className="text-[#ffffff]/80 font-semibold text-[14px] sm:text-sm mb-2">
            Items
          </div>
          <div className="text-lg sm:text-xl font-bold text-white">
            {players.length}
          </div>
        </div>
        <div className="bg-[#1a1b23] p-4 text-center">
          <div className="text-[#ffffff]/80 font-semibold text-[14px] sm:text-sm mb-2">
            Your Wager
          </div>
          <div className="text-lg sm:text-xl font-bold text-white">
            {players.length > 0 ? '$57.60' : '$0.00'}
          </div>
        </div>
        <div className="bg-[#1a1b23] p-4 text-center">
          <div className="text-[#ffffff]/80 font-semibold text-[14px] sm:text-sm mb-2">
            Your Chance
          </div>
          <div className="text-lg sm:text-xl font-bold text-white">
            {players.length > 0 ? '25.59%' : '0.00%'}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 gap-2 sm:gap-0">
        <div className="flex text-neutral-400 font-bold items-center gap-2">
          Round<span className="text-white">#25128</span>
        </div>
        <div className="flex text-white items-center">
          <User className="w-[20px] font-semibold h-[20px] sm:w-4 sm:h-4" />
          <span className="mr-2 font-semibold text-[16px]">
            {players.length}
          </span>
          <span className="text-neutral-500 text-[16px]">Players</span>
        </div>
      </div>

      {players.length > 0 && (
        <div className="space-y-2 mb-4 sm:mb-6">
          {playerCards.map((player) => (
            <div
              key={`card-${player.id}`}
              className="relative p-3 sm:p-4 flex items-center justify-between overflow-hidden"
            >
              <ParticleBackground color={player.bgColor} />
              <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                <img
                  src={player.avatar || '/placeholder.svg'}
                  alt={player.username}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-[3px]"
                />
                <div className="text-white font-semibold text-[16px] sm:text-base">
                  {player.username}
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-4 w-[70%] justify-evenly sm:gap-6">
                <div className="text-start font-semibold text-[#FFFFFF] lg:text-[16px]">
                  <div className="  sm:text-base ">
                    {player.itemName}
                  </div>
                  <div className=" sm:text-sm">
                    {player.itemValue}
                  </div>
                </div>
                <div className="text-white font-medium text-sm sm:text-base min-w-[60px] text-right">
                  {player.percentage}
                </div>
                {onDeleteUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteUser(player.id)}
                    className="text-red-600 hover:text-red-300 cursor-pointer hover:bg-red-400/20 p-2 bg-red-400/10 border border-red-800/30 flex-shrink-0"
                    title="Delete user"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {gameState === 'countdown' && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-400 gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-600 flex-shrink-0"></div>
            <span className="truncate">Hashed Seed: aa87bcfb24496e24...</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-600 flex-shrink-0"></div>
            <span>EOS Block: Waiting</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes winnerTwist {
          0% {
            transform: rotateY(0deg) scale(1.1);
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
          }
          100% {
            transform: rotateY(720deg) scale(1.1);
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.8);
          }
        }
      `}</style>
    </div>
  )
}
