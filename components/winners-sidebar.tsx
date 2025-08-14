"use client"

import Image from "next/image"

interface Winner {
  id: number
  username: string
  amount: string
  percentage: string
  avatar: string
  color: string
  bgColor: string
  image:string
}

export function WinnersSidebar() {
  const winners: Winner[] = [
    {
      id: 1,
      username: "Username",
      amount: "$52.26",
      percentage: "26.25%",
      avatar: "/images/cartoon-avatar.jpeg",
      color: "text-[#3f70e4]",
      bgColor: "bg-[#3F70E4]",
      image:'/images/crown.png' // Added background color matching text color
    },
    {
      id: 2,
      username: "Username",
      amount: "$71.50",
      percentage: "1.25%",
      avatar: "/images/cartoon-avatar.jpeg",
      color: "text-[#edb441]",
      bgColor: "bg-[#D79737]",
      image:'/images/clover.png' // Added background color matching text color
    },
    {
      id: 3,
      username: "Username",
      amount: "$732.25",
      percentage: "36.72%",
      avatar: "/images/cartoon-avatar.jpeg",
      color: "text-[#ad4d9f]",
      bgColor: "bg-[#AD4D9F]",
       image:'/images/trophy.png' // Added background color matching text color
    },
  ]

  const sections = [
    { title: "Last Winner", icon: "👑", winner: winners[0] },
    { title: "Luckiest Win", icon: "🍀", winner: winners[1] },
    { title: "Biggest Win", icon: "💎", winner: winners[2] },
  ]

  return (
    <div className="w-full max-w-[180px] flex flex-col items-center justify-start   h-full bg-[#14151a] p-3 sm:p-[16px] space-y-4 sm:space-y-6">
      {sections.map((section, index) => (
        <div key={index} className="w-[180px] rounded   bg-[#1B1B23]">
          <div className="flex items-center justify-center py-3 gap-2 mb-2 ">
            {/* <span className="text-[#eec45c] text-sm sm:text-base">{section.icon}</span>
             */}
            <Image src={section.winner.image} alt="logo" width={20} height={20} />
            <span className="font-semibold text-white text-[14px] sm:text-base">{section.title}</span>
          </div>
          <div className="rounded-lg  ">
            <div className="flex flex-col items-center  text-center ">
              <img
                src={section.winner.avatar || "/placeholder.svg"}
                alt={section.winner.username}
                className="w-[60px] h-10 sm:w-[70px] sm:h-[70px] rounded mb-2 object-cover"
              />
              <div className="font-bold mb-4 text-white text-sm sm:text-base">{section.winner.username}</div>
              <div
                className={`font-semibold text-[14px] sm:text-[14px] text-white mb-1 px-[10px] py-[4px] rounded ${section.winner.bgColor}`}
              >
                {section.winner.amount}
              </div>
              <div className="text-[14px] mb-3 font-semibold text-gray-400">{section.winner.percentage}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
