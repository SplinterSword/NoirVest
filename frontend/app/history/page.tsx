"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { collection, query, where, orderBy, getDocs, deleteDoc, doc as firestoreDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Navigation } from "@/components/navigation"
import { Calendar, TrendingUp, Download, Eye, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"

interface SavedRecommendation {
  id: string
  title: string
  createdAt: Date
  recommendation: {
    expectedReturn: number
    riskLevel: string
    assetAllocation: Array<{ name: string; value: number }>
  }
}

export default function HistoryPage() {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<SavedRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [deleteDialog, setDeleteDialog] = useState({ open: false, planId: "", planTitle: "" })

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return

      try {
        const q = query(
          collection(db, "recommendations"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
        )

        const querySnapshot = await getDocs(q)
        const recs: SavedRecommendation[] = []

        querySnapshot.forEach((doc) => {
          recs.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          } as SavedRecommendation)
        })

        setRecommendations(recs)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [user])

  const handleDeletePlan = async () => {
    try {
      await deleteDoc(firestoreDoc(db, "recommendations", deleteDialog.planId))

      // Remove from local state
      setRecommendations((prev) => prev.filter((rec) => rec.id !== deleteDialog.planId))

      toast({
        title: "Plan deleted successfully",
        description: `"${deleteDialog.planTitle}" has been removed from your history.`,
      })
    } catch (error) {
      console.error("Error deleting plan:", error)
      toast({
        title: "Error deleting plan",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Investment History</h1>
          <p className="text-gray-400">Your saved investment recommendations and plans</p>
        </div>

        {recommendations.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">No Saved Recommendations</h2>
              <p className="text-gray-400 mb-6">You haven't saved any investment plans yet.</p>
              <Button onClick={() => (window.location.href = "/dashboard")}>Go to Dashboard</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{rec.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{rec.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{rec.recommendation.expectedReturn.toFixed(1)}% Expected Return</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{rec.recommendation.riskLevel}</Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Asset Allocation</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.recommendation.assetAllocation.map((asset, index) => (
                        <Badge key={index} variant="outline" className="border-white/20">
                          {asset.name}: {asset.value}%
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 hover:bg-white/10 bg-transparent"
                      onClick={() => (window.location.href = `/dashboard?plan=${rec.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/50 hover:bg-red-500/10 bg-transparent text-red-400 hover:text-red-300"
                      onClick={() => setDeleteDialog({ open: true, planId: rec.id, planTitle: rec.title })}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <DeleteConfirmationDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
          onConfirm={handleDeletePlan}
          planName={deleteDialog.planTitle}
        />
      </div>
    </div>
  )
}
