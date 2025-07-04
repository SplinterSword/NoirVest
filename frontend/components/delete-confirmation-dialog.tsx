"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  planName: string
}

export function DeleteConfirmationDialog({ open, onOpenChange, onConfirm, planName }: DeleteConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span>Delete Investment Plan</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to delete <span className="font-semibold text-white">"{planName}"</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/20 hover:bg-white/10 bg-transparent"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-red-600 hover:bg-red-700 text-white">
            Delete Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
