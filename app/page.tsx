'use client'

import { useState } from 'react'
import { Menu, X, Users, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LiveChat } from '@/components/live-chat'
import { JackpotGame } from '@/components/jackpot-game'
import { WinnersSidebar } from '@/components/winners-sidebar'
import Image from 'next/image'

import { AddUserDialog } from '@/components/add-user-dialog'

const initialPlayers = [
  {
    id: 1,
    username: 'James',
    avatar: '/images/cartoon-avatar.jpeg',
    items: [],
    value: '$104.90',
    percentage: '25.35%',
    betValue: 104.9,
  },
  {
    id: 2,
    username: 'SufferGFX',
    avatar: '/images/cartoon-avatar.jpeg',
    items: [],
    value: '$89.50',
    percentage: '21.60%',
    betValue: 89.5,
  },
  {
    id: 3,
    username: 'ImBob',
    avatar: '/images/cartoon-avatar.jpeg',
    items: [],
    value: '$76.20',
    percentage: '18.40%',
    betValue: 76.2,
  },
  {
    id: 4,
    username: 'Beanie',
    avatar: '/images/cartoon-avatar.jpeg',
    items: [],
    value: '$65.80',
    percentage: '15.90%',
    betValue: 65.8,
  },
  {
    id: 5,
    username: 'Brad',
    avatar: '/images/cartoon-avatar.jpeg',
    items: [],
    value: '$77.70',
    percentage: '18.75%',
    betValue: 77.7,
  },
]

export default function RustleGamingInterface() {
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [players, setPlayers] = useState(initialPlayers)
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [showMobileWinners, setShowMobileWinners] = useState(false)
  const [activeTab, setActiveTab] = useState('jackpot')

  const handleAddUser = (newUser: any) => {
    setPlayers((prev) => [
      ...prev,
      {
        id: Date.now(), // Use timestamp for unique ID
        username: newUser.username,
        avatar: '/images/cartoon-avatar.jpeg',
        items: newUser.items || [],
        value: newUser.value || '$104.90',
        percentage: newUser.percentage || '28.35%',
        betValue: newUser.betValue || 104.9,
      },
    ])
  }

  const handleDeleteUser = (userId: number) => {
    setPlayers((prev) => prev.filter((player) => player.id !== userId))
  }

  return (
    <div className="min-h-screen bg-[#14151a] text-white flex flex-col lg:flex-row">
      {/* Left Sidebar - Desktop */}
      <div className="hidden lg:flex w-80 bg-[#1b1b23] border-r border-[#2a2a39] flex-col">
        <div className=" border-b border-[#2a2a39] overflow-hidden">
          <div className="flex items-center justify-center  gap-3">
            <Image
              src="/images/logoparticle.jpg"
              alt="Logo"
              width={270}
              height={270}
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex-1">
          <LiveChat
            onAddUser={() => setShowAddUserDialog(true)}
            players={players}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1   pl-2 flex flex-col min-w-0">
        <div className="bg-[#14151a] border-b border-[#2a2a39]/30 px-2 sm:px-4 py-1">
          <nav className="flex items-center justify-start gap-3 font-semibold sm:gap-6 text-[12px] text-gray-500 overflow-x-auto">
            <a
              href="#"
              className="hover:text-gray-300 transition-colors whitespace-nowrap"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-gray-300 transition-colors whitespace-nowrap"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-gray-300 transition-colors whitespace-nowrap"
            >
              Provably Fair
            </a>
            <a
              href="#"
              className="hover:text-gray-300 transition-colors whitespace-nowrap"
            >
              Support
            </a>
            <div className="flex items-center gap-1">
              <Image
                src="/images/x.png"
                alt="Twitter/X"
                width={12}
                height={12}
                className="object-contain"
              />
              <Image
                src="/images/dis.png"
                alt="Discord"
                width={12}
                height={12}
                className="object-contain"
              />
            </div>
          </nav>
        </div>

        <header className="  bg-[#1b1b23]  flex-shrink-0 px-3 sm:px-4 lg:px-6 pt-4">
          <div className="flex items-center justify-between ">
            {/* Mobile Menu & Logo */}
            <div className="flex items-center gap-3 lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileChat(!showMobileChat)}
                className="p-2"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#3f70e4] rounded transform rotate-45"></div>
                <span className="text-base sm:text-lg font-bold">Rustle</span>
              </div>
            </div>

            {/* Desktop Game Tabs */}
            <div className="hidden  lg:flex items-end gap-8">
              <button
                onClick={() => setActiveTab('jackpot')}
                className={`flex flex-col items-center gap-2 pb-2 relative group ${
                  activeTab === 'jackpot' ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <div className="flex  items-center gap-3">
                  <img
                    src="/images/jackpot-icon.svg"
                    alt="Jackpot"
                    className="w-[41px] h-[41px]"
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-white text-[16px]">
                      Jackpot
                    </span>
                    <span className="text-blue-400 font-semibold text-[14px]">
                      $519.50
                    </span>
                  </div>
                </div>
                {activeTab === 'jackpot' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3f70e4]"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('coinflip')}
                className={`flex flex-col items-center gap-2 pb-2 relative group ${
                  activeTab === 'coinflip' ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/images/coinflip-icon.svg"
                    alt="Coinflip"
                    className="w-[41px] h-[41px]"
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-white text-[16px]">
                      Coinflip
                    </span>
                    <span className="text-red-500 font-semibold text-[14px]">
                      $519.50
                    </span>
                  </div>
                </div>
                {activeTab === 'coinflip' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d33838]"></div>
                )}
              </button>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/images/cartoon-avatar.jpeg"
                alt="User"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded"
              />
              <div className="hidden sm:flex items-center gap-1">
                <span className="font-bold text-[16px]">Username</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileWinners(!showMobileWinners)}
                className="p-2 lg:hidden ml-1"
              >
                <Users className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex lg:hidden px-3 sm:px-4 pb-3 sm:pb-4 gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('jackpot')}
              className="flex items-center gap-2 pb-2 relative flex-1 min-w-0"
            >
              <img
                src="/images/jackpot-icon.png"
                alt="Jackpot"
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              />
              <div className="flex flex-col items-start min-w-0">
                <span className="font-medium text-xs sm:text-sm truncate">
                  Jackpot
                </span>
                <span className="text-[#eec45c] text-xs">$519.50</span>
              </div>
              {activeTab === 'jackpot' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3f70e4]"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('coinflip')}
              className="flex items-center gap-2 pb-2 relative flex-1 min-w-0"
            >
              <img
                src="/images/coinflip-icon.png"
                alt="Coinflip"
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              />
              <div className="flex flex-col items-start min-w-0">
                <span className="font-medium text-xs sm:text-sm truncate">
                  Coinflip
                </span>
                <span className="text-[#eec45c] text-xs">$519.50</span>
              </div>
              {activeTab === 'coinflip' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d33838]"></div>
              )}
            </button>
          </div>
        </header>

        {/* Main Game Area */}
        <div className="flex flex-1  min-h-0">
          {/* Game Content */}
          <div className="flex-1  flex flex-col min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 lg:p-6 bg-[#14151a]   gap-3 sm:gap-0">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={
                      activeTab === 'jackpot'
                        ? '/images/jackpot-icon.png'
                        : '/images/coinflip-icon.png'
                    }
                    alt={activeTab}
                    className="w-6 h-6 sm:w-[36px] sm:h-[36px] flex-shrink-0"
                  />
                  <h1 className="text-xl sm:text-2xl font-extrabold capitalize">
                    {activeTab}
                  </h1>
                </div>
                <p className="text-gray-400 text-sm sm:text-[16px] font-semibold">
                  All for the pot, and the pot for one
                </p>
              </div>
              <button
  className="relative bg-[url('/images/deposit.svg')] bg-cover bg-center rounded-sm hover:opacity-80 cursor-pointer sm:px-10 py-2 text-sm sm:text-base w-[164px] sm:w-auto text-white"
>
  Deposit
</button>

            </div>

            {/* Game Area */}
            <div className="flex-1 min-h-0">
              <JackpotGame players={players} onDeleteUser={handleDeleteUser} />
            </div>
          </div>

          {/* Right Sidebar - Winners (Desktop) */}
          <div className="hidden lg:flex  w-50  bg-[#14151a]">
            <WinnersSidebar />
          </div>
        </div>
      </div>

      {showMobileChat && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileChat(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-[#1b1b23] border-r border-[#2a2a39] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#2a2a39]">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#3f70e4] rounded transform rotate-45"></div>
                <span className="text-lg font-bold">Rustle</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileChat(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 min-h-0">
              <LiveChat
                onAddUser={() => setShowAddUserDialog(true)}
                players={players}
              />
            </div>
          </div>
        </div>
      )}

      {showMobileWinners && (
        <div className="fixed border inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileWinners(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#1b1b23] border-l border-[#2a2a39] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#2a2a39]">
              <h2 className="font-semibold">Winners</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileWinners(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1  bg-black min-h-0 overflow-hidden">
              <WinnersSidebar />
            </div>
          </div>
        </div>
      )}

      <AddUserDialog
        open={showAddUserDialog}
        onOpenChange={setShowAddUserDialog}
        onAddUser={handleAddUser}
      />
    </div>
  )
}
