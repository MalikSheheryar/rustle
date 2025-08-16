"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddUser: (user: any) => void
}

export function AddUserDialog({ open, onOpenChange, onAddUser }: AddUserDialogProps) {
  const [formData, setFormData] = useState({
    username: "",
    value: "",
    percentage: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const randomValues = ["$52.26", "$71.50", "$104.90", "$156.75", "$89.30", "$234.50"]
    const randomPercentages = ["26.25%", "1.25%", "28.35%", "15.60%", "8.90%", "19.65%"]

    const newUser = {
      id: Date.now(),
      username: formData.username || `Player${Date.now().toString().slice(-3)}`,
      avatar: "/images/cartoon-avatar.jpeg", // Always use cartoon avatar
      value: formData.value || randomValues[Math.floor(Math.random() * randomValues.length)],
      percentage: formData.percentage || randomPercentages[Math.floor(Math.random() * randomPercentages.length)],
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      message: "Betting my house now wish me luck please",
      hasFlag: true,
      items: [],
    }

    onAddUser(newUser)
    setFormData({ username: "", value: "", percentage: "" })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1b1b23] border-[#2a2a39] text-white">
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
              placeholder="Enter username (optional)"
              className="bg-[#14151a] border-[#2a2a39] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Bet Value</Label>
            <Input
              id="value"
              value={formData.value}
              onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
              placeholder="e.g. $104.90 (optional - random if empty)"
              className="bg-[#14151a] border-[#2a2a39] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="percentage">Win Percentage</Label>
            <Input
              id="percentage"
              value={formData.percentage}
              onChange={(e) => setFormData((prev) => ({ ...prev, percentage: e.target.value }))}
              placeholder="e.g. 28.35% (optional - random if empty)"
              className="bg-[#14151a] border-[#2a2a39] text-white"
            />
          </div>
          <div className="bg-[#14151a] border border-[#2a2a39] rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <img src="/images/cartoon-avatar.jpeg" alt="Avatar Preview" className="w-8 h-8 rounded" />
              <span className="text-sm text-gray-300">Avatar Preview</span>
            </div>
            <p className="text-xs text-gray-500">All players will use the cartoon avatar</p>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-[#3f70e4] hover:bg-[#3f70e4]/80 flex-1">
              Add Player
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#2a2a39] text-black hover:text-white hover:bg-[#2a2a39]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
