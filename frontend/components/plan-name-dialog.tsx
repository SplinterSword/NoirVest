"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PlanNameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (planName: string) => void
  defaultName?: string
}

export function PlanNameDialog({ open, onOpenChange, onSave, defaultName }: PlanNameDialogProps) {
  const [planName, setPlanName] = useState(defaultName || `Investment Plan - ${new Date().toLocaleDateString()}`)

  const handleSave = () => {
    if (planName.trim()) {
      onSave(planName.trim())
      onOpenChange(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-white/20">
        <DialogHeader>
          <DialogTitle>Save Investment Plan</DialogTitle>
          <DialogDescription className="text-gray-400">
            Give your investment plan a memorable name to easily find it later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="plan-name">Plan Name</Label>
            <Input
              id="plan-name"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-white/5 border-white/20"
              placeholder="Enter plan name..."
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/20 hover:bg-white/10 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!planName.trim()}
            className="bg-primary hover:bg-primary/90 text-black"
          >
            Save Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
