"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc, addDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { TrendingUp, Shield, Target, Download, Lightbulb, Settings, AlertCircle, RefreshCw } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { PlanNameDialog } from "@/components/plan-name-dialog"

interface UserProfile {
  salary: string
  age: string
  riskTolerance: number
  investmentGoals: string
  currentSavings: string
  investmentHorizon: string
  monthlyInvestment: string
  employmentStatus: string
  dependents: string
  debtAmount: string
  emergencyFund: string
  investmentExperience: string
  email?: string
  name?: string
}

interface AssetAllocation {
  ticker: string
  name: string
  type: 'Stock' | 'Bond' | 'ETF' | 'Mutual Fund' | 'Index Fund' | 'Crypto' | 'Commodity'
  weight: number
  color: string
  sector?: string
  exchange?: string
}

interface InvestmentRecommendation {
  assetAllocation: AssetAllocation[]
  projectedGrowth: Array<{ year: number; value: number }>
  riskAnalysis: Array<{ category: string; score: number }>
  explanation: string
  expectedReturn: number
  riskLevel: string
}

export default function DashboardPage() {
  const { user, loading: authLoading, error: authError } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [recommendation, setRecommendation] = useState<InvestmentRecommendation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = searchParams.get("plan")
  const { toast } = useToast()
  const [showPlanDialog, setShowPlanDialog] = useState(false)

  const fetchUserData = async () => {
    if (authLoading) return

    if (authError || !user) {
      router.push("/")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Set timeout for data fetching
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 15000))

      const fetchPromise = async () => {
        if (planId) {
          // Load specific plan from URL parameter
          const planDoc = await getDoc(doc(db, "recommendations", planId))
          if (planDoc.exists()) {
            const planData = planDoc.data()
            setRecommendation(planData.recommendation)
            const userDoc = await getDoc(doc(db, "users", user.uid))
            if (userDoc.exists()) {
              const userData = userDoc.data() as UserProfile
              setProfile(userData)
              setEditedProfile(userData)
            }
          } else {
            throw new Error("Investment plan not found")
          }
        } else {
          // Normal flow - load user profile first
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile
            setProfile(userData)
            setEditedProfile(userData)

            // Check for existing recommendations
            const q = query(
              collection(db, "recommendations"),
              where("userId", "==", user.uid),
              orderBy("createdAt", "desc"),
              limit(1),
            )

            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
              // Use the latest existing recommendation
              const latestRec = querySnapshot.docs[0].data()
              setRecommendation(latestRec.recommendation)
            } else {
              // No existing plans, generate a new one
              const aiRecommendation = generateAIRecommendation(userData)
              setRecommendation(aiRecommendation)
            }
          } else {
            router.push("/onboarding")
            return
          }
        }
      }

      await Promise.race([fetchPromise(), timeoutPromise])
    } catch (error) {
      console.error("Error fetching user data:", error)
      setError(error instanceof Error ? error.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [user, authLoading, authError, planId, router])

  const generateAIRecommendation = (profile: UserProfile): InvestmentRecommendation => {
    const riskLevel = profile.riskTolerance
    const age = Number.parseInt(profile.age)

    let stocks, bonds, reits, commodities

    if (riskLevel <= 3) {
      stocks = 30 + riskLevel * 5
      bonds = 50 - riskLevel * 3
      reits = 15
      commodities = 5
    } else if (riskLevel <= 7) {
      stocks = 50 + riskLevel * 5
      bonds = 35 - riskLevel * 2
      reits = 10
      commodities = 5
    } else {
      stocks = 70 + riskLevel * 3
      bonds = 15 - (riskLevel - 7)
      reits = 10
      commodities = 5 + (riskLevel - 7)
    }

    const assetAllocation: AssetAllocation[] = [
      { 
        ticker: "VTI",
        name: "Vanguard Total Stock Market ETF",
        type: "ETF",
        weight: stocks,
        color: "#22c55e",
        sector: "Diversified",
        exchange: "NYSE"
      },
      { 
        ticker: "BND",
        name: "Vanguard Total Bond Market ETF",
        type: "Bond",
        weight: bonds,
        color: "#3b82f6",
        sector: "Fixed Income",
        exchange: "NASDAQ"
      },
      { 
        ticker: "VNQ",
        name: "Vanguard Real Estate ETF",
        type: "ETF",
        weight: reits,
        color: "#f59e0b",
        sector: "Real Estate",
        exchange: "NYSE"
      },
      { 
        ticker: "GSG",
        name: "iShares S&P GSCI Commodity-Indexed Trust",
        type: "Commodity",
        weight: commodities,
        color: "#ef4444",
        sector: "Commodities",
        exchange: "NYSE"
      }
    ]

    const baseReturn = 0.07 + riskLevel * 0.01
    const projectedGrowth = Array.from({ length: 11 }, (_, i) => ({
      year: i,
      value: Number.parseInt(profile.currentSavings) * Math.pow(1 + baseReturn, i),
    }))

    const riskAnalysis = [
      { category: "Market Risk", score: riskLevel * 10 },
      { category: "Inflation Risk", score: Math.max(20, 100 - riskLevel * 8) },
      { category: "Liquidity Risk", score: riskLevel * 6 },
      { category: "Credit Risk", score: bonds * 0.8 },
    ]

    const explanation = `Based on your risk tolerance of ${riskLevel}/10 and investment goals, we recommend a ${
      riskLevel <= 3 ? "conservative" : riskLevel <= 7 ? "balanced" : "aggressive"
    } portfolio. This allocation balances growth potential with risk management, considering your age of ${age} and investment horizon. The ${stocks}% stock allocation provides growth potential, while ${bonds}% in bonds offers stability. REITs and commodities add diversification to protect against inflation.`

    return {
      assetAllocation,
      projectedGrowth,
      riskAnalysis,
      explanation,
      expectedReturn: baseReturn * 100,
      riskLevel: riskLevel <= 3 ? "Conservative" : riskLevel <= 7 ? "Moderate" : "Aggressive",
    }
  }

  const saveRecommendation = async (planName: string) => {
    if (!user || !recommendation) return

    try {
      await addDoc(collection(db, "recommendations"), {
        userId: user.uid,
        recommendation,
        createdAt: new Date(),
        title: planName,
      })

      toast({
        title: "Investment plan saved successfully!",
        description: `"${planName}" has been added to your history.`,
      })
    } catch (error) {
      console.error("Error saving recommendation:", error)
      toast({
        title: "Error saving plan",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleProfileUpdate = async () => {
    if (!user || !editedProfile) return

    try {
      await setDoc(doc(db, "users", user.uid), {
        ...editedProfile,
        email: user.email,
        name: user.displayName,
        updatedAt: new Date(),
        onboardingCompleted: true,
      })

      setProfile(editedProfile)
      const newRecommendation = generateAIRecommendation(editedProfile)
      setRecommendation(newRecommendation)
      setEditMode(false)

      toast({
        title: "Profile updated successfully!",
        description: "Your investment recommendations have been refreshed.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error updating profile",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const generateNewPlan = () => {
    if (!profile) return

    const newRecommendation = generateAIRecommendation(profile)
    setRecommendation(newRecommendation)

    toast({
      title: "New plan generated!",
      description: "A fresh investment recommendation has been created based on your current profile.",
    })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || authError) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-white/5 border-white/10 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Alert className="border-red-500/50 bg-red-500/10 mb-6">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  {error || authError || "An unexpected error occurred"}
                </AlertDescription>
              </Alert>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-white/20 hover:bg-white/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
                <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/90 text-black">
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!profile || !recommendation) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
              <p className="text-gray-400 mb-6">Please complete your onboarding to see personalized recommendations.</p>
              <Button onClick={() => router.push("/onboarding")}>Complete Profile</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Investment Dashboard</h1>
            <p className="text-gray-400">Your personalized AI-driven investment recommendations</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setEditMode(!editMode)}
            className="border-white/20 hover:bg-white/10 bg-transparent"
          >
            <Settings className="w-4 h-4 mr-2" />
            {editMode ? "Cancel Edit" : "Edit Goals"}
          </Button>
        </div>

        {/* Edit Profile Section */}
        {editMode && editedProfile && (
          <Card className="bg-white/5 border-white/10 mb-8">
            <CardHeader>
              <CardTitle>Edit Your Financial Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="edit-salary">Annual Salary ($)</Label>
                  <Input
                    id="edit-salary"
                    type="number"
                    value={editedProfile.salary}
                    onChange={(e) => setEditedProfile({ ...editedProfile, salary: e.target.value })}
                    className="bg-white/5 border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-currentSavings">Current Savings ($)</Label>
                  <Input
                    id="edit-currentSavings"
                    type="number"
                    value={editedProfile.currentSavings}
                    onChange={(e) => setEditedProfile({ ...editedProfile, currentSavings: e.target.value })}
                    className="bg-white/5 border-white/20"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="edit-monthlyInvestment">Monthly Investment Budget ($)</Label>
                  <Input
                    id="edit-monthlyInvestment"
                    type="number"
                    value={editedProfile.monthlyInvestment}
                    onChange={(e) => setEditedProfile({ ...editedProfile, monthlyInvestment: e.target.value })}
                    className="bg-white/5 border-white/20"
                  />
                </div>
                <div>
                  <Label>Risk Tolerance (1-10)</Label>
                  <Slider
                    value={[editedProfile.riskTolerance]}
                    onValueChange={(value) => setEditedProfile({ ...editedProfile, riskTolerance: value[0] })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full mt-2"
                  />
                  <div className="text-center text-primary font-semibold mt-1">{editedProfile.riskTolerance}</div>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-investmentGoals">Investment Goals</Label>
                <Textarea
                  id="edit-investmentGoals"
                  value={editedProfile.investmentGoals}
                  onChange={(e) => setEditedProfile({ ...editedProfile, investmentGoals: e.target.value })}
                  className="bg-white/5 border-white/20 min-h-[100px]"
                  placeholder="Describe your updated financial goals..."
                />
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleProfileUpdate} className="bg-primary hover:bg-primary/90 text-black">
                  Update Profile & Generate New Plan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditMode(false)
                    setEditedProfile(profile)
                  }}
                  className="border-white/20 hover:bg-white/10 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10 chart-container">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Expected Annual Return</p>
                  <p className="text-2xl font-bold text-primary">{recommendation.expectedReturn.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 chart-container">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Risk Level</p>
                  <p className="text-2xl font-bold">{recommendation.riskLevel}</p>
                </div>
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 chart-container">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Portfolio Value</p>
                  <p className="text-2xl font-bold">${Number.parseInt(profile.currentSavings).toLocaleString()}</p>
                </div>
                <Target className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="allocation" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
            <TabsTrigger value="growth">Projected Growth</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="explanation">Why This Plan?</TabsTrigger>
          </TabsList>

          <TabsContent value="allocation">
            <Card className="bg-white/5 border-white/10 chart-container">
              <CardHeader>
                <CardTitle>Recommended Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={recommendation.assetAllocation}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="weight"
                          label={({ name, weight }) => `${name}: ${weight}%`}
                        >
                          {recommendation.assetAllocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    {recommendation.assetAllocation.map((asset, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }} />
                          <span className="font-medium">{asset.name}</span>
                        </div>
                        <Badge variant="secondary">{asset.weight}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth">
            <Card className="bg-white/5 border-white/10 chart-container">
              <CardHeader>
                <CardTitle>10-Year Projected Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={recommendation.projectedGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="year" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
                        labelFormatter={(label) => `Year ${label}`}
                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk">
            <Card className="bg-white/5 border-white/10 chart-container">
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recommendation.riskAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="category" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                      <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="explanation">
            <Card className="bg-white/5 border-white/10 chart-container">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <span>Why This Plan?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg">{recommendation.explanation}</p>

                  <div className="mt-8 grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">Key Benefits</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Diversified across multiple asset classes</li>
                        <li>• Aligned with your risk tolerance</li>
                        <li>• Optimized for your investment timeline</li>
                        <li>• Regular rebalancing recommended</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg">
                      <h4 className="font-semibold text-yellow-400 mb-2">Important Notes</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Past performance doesn't guarantee future results</li>
                        <li>• Consider tax implications</li>
                        <li>• Review and adjust annually</li>
                        <li>• Consult a financial advisor for complex situations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center space-x-4 mt-8">
          <Button
            onClick={generateNewPlan}
            variant="outline"
            className="border-white/20 hover:bg-white/10 bg-transparent"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Generate New Plan
          </Button>
          <Button onClick={() => setShowPlanDialog(true)} className="bg-primary hover:bg-primary/90 text-black">
            Save This Plan
          </Button>
          <Button variant="outline" className="border-white/20 hover:bg-white/10 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        <PlanNameDialog
          open={showPlanDialog}
          onOpenChange={setShowPlanDialog}
          onSave={saveRecommendation}
          defaultName={`Investment Plan - ${new Date().toLocaleDateString()}`}
        />
      </div>
    </div>
  )
}
