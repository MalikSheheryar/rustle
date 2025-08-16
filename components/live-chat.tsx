"use client"

import { useState, useEffect } from "react"
import { User, Plus, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatMessage {
  id: number
  username: string
  timestamp: string
  message: string
  avatar: string
  hasFlag?: boolean
}

interface LiveChatProps {
  onAddUser: () => void
  players: any[]
}

export function LiveChat({ onAddUser, players }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    if (players.length > 0) {
      const playerMessages = players.map((player, index) => ({
        id: Date.now() + index,
        username: player.username,
        timestamp: "10:17",
        message: "Betting my house now wish me luck please",
        avatar: "/images/cartoon-avatar.jpeg",
        hasFlag: true,
      }))
      setMessages(playerMessages.reverse()) // Newest first
    }
  }, [players])

  return (
    <div className="h-[100vh] sticky top-0 bottom-0 bg-[#1B1B23] flex flex-col">
      {/* Header */}
    
      <div className="p-3 sm:p-4 border-b border-[#2a2a39] bg-[#282834] flex-shrink-0 border-t-[#14151A] border-t-2 -mt-1 ">
        <div className="flex items-center justify-between ">
          <div className="flex w-full items-center  justify-between gap-2 sm:gap-3 ">
            <span className="font-bold text-white text-sm sm:text-[20px] sm:text-base">Live Chat</span>
            <div className="bg-[#3f70e4] text-white h-[32px] w-[63px] text-[16px] font-semibold flex justify-center text-center items-center gap-1 rounded-[2px]">
              <User className="w-[20px] h-[20px] "  />
            
              <span className="mt-1">{players.length}</span>
            </div>
          </div>
          <Button onClick={onAddUser} size="sm" className="border-[#3f70e4] border-1 bg-[#282834] transition-all ease-in-out duration-300 ml-2 hover:bg-[#3f70e4]/80 h-6 w-6 p-0">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto">
        <div className="p-3 sm:p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500 text-sm">No messages yet...</div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2 sm:gap-3">
                  <img
                    src={msg.avatar || "/placeholder.svg"}
                    alt="User"
                    className="w-6 h-6 sm:w-[38px] sm:h-[38px] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">{msg.username}</span>
                      <span className="text-xs text-gray-500 flex-shrink-0">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 break-words">
                      {msg.message}
                      {msg.hasFlag && <span className="ml-1">🏠</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-3 sm:p-4 flex-shrink-0  ">
        <div className="relative"> 
          <input
            type="text"
            placeholder="Write here"
            className="w-full bg-[#14151a] rounded-[3px] outline-none border-none  px-3 py-3 text-xs sm:text-sm placeholder-gray-500 text-white pr-10"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
            
              <Smile strokeWidth={'3px'} className="w-4 h-4 text-gray-400" />
           
          </button>
        </div>
      </div>
    </div>
  )
}
