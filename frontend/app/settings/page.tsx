"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { Navigation } from "@/components/navigation"
import { Save, ArrowLeft } from "lucide-react"

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
}

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState<UserProfile>({
    salary: "",
    age: "",
    riskTolerance: 5,
    investmentGoals: "",
    currentSavings: "",
    investmentHorizon: "",
    monthlyInvestment: "",
    employmentStatus: "",
    dependents: "",
    debtAmount: "",
    emergencyFund: "",
    investmentExperience: "",
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile
          setProfile(userData)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [user])

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...profile,
        email: user.email,
        name: user.displayName,
        updatedAt: new Date(),
        onboardingCompleted: true,
      })

      toast({
        title: "Profile updated successfully!",
        description: "Your changes have been saved.",
      })

      // Redirect to dashboard after successful save
      setTimeout(() => router.push("/dashboard"), 1500)
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error saving profile",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-white/20 hover:bg-white/10 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
            <p className="text-gray-400">Update your financial information and investment preferences</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Personal Information */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="salary">Annual Salary ($)</Label>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="75000"
                    value={profile.salary}
                    onChange={(e) => handleInputChange("salary", e.target.value)}
                    className="bg-white/5 border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="30"
                    value={profile.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="bg-white/5 border-white/20"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dependents">Number of Dependents</Label>
                  <Input
                    id="dependents"
                    type="number"
                    placeholder="0"
                    value={profile.dependents}
                    onChange={(e) => handleInputChange("dependents", e.target.value)}
                    className="bg-white/5 border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <Select
                    onValueChange={(value) => handleInputChange("employmentStatus", value)}
                    value={profile.employmentStatus}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20">
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time Employee</SelectItem>
                      <SelectItem value="part-time">Part-time Employee</SelectItem>
                      <SelectItem value="self-employed">Self-employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="currentSavings">Current Savings ($)</Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    placeholder="25000"
                    value={profile.currentSavings}
                    onChange={(e) => handleInputChange("currentSavings", e.target.value)}
                    className="bg-white/5 border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyInvestment">Monthly Investment Budget ($)</Label>
                  <Input
                    id="monthlyInvestment"
                    type="number"
                    placeholder="1000"
                    value={profile.monthlyInvestment}
                    onChange={(e) => handleInputChange("monthlyInvestment", e.target.value)}
                    className="bg-white/5 border-white/20"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="debtAmount">Total Debt Amount ($)</Label>
                  <Input
                    id="debtAmount"
                    type="number"
                    placeholder="5000"
                    value={profile.debtAmount}
                    onChange={(e) => handleInputChange("debtAmount", e.target.value)}
                    className="bg-white/5 border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyFund">Emergency Fund Status</Label>
                  <Select
                    onValueChange={(value) => handleInputChange("emergencyFund", value)}
                    value={profile.emergencyFund}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20">
                      <SelectValue placeholder="Select emergency fund status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No emergency fund</SelectItem>
                      <SelectItem value="partial">1-3 months expenses</SelectItem>
                      <SelectItem value="adequate">3-6 months expenses</SelectItem>
                      <SelectItem value="excellent">6+ months expenses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Preferences */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Investment Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Risk Tolerance (1 = Conservative, 10 = Aggressive)</Label>
                <div className="mt-4">
                  <Slider
                    value={[profile.riskTolerance]}
                    onValueChange={(value) => handleInputChange("riskTolerance", value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>Conservative</span>
                    <span className="text-primary font-semibold">{profile.riskTolerance}</span>
                    <span>Aggressive</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="investmentHorizon">Investment Time Horizon</Label>
                  <Select
                    onValueChange={(value) => handleInputChange("investmentHorizon", value)}
                    value={profile.investmentHorizon}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20">
                      <SelectValue placeholder="Select time horizon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short-term (1-3 years)</SelectItem>
                      <SelectItem value="medium">Medium-term (3-7 years)</SelectItem>
                      <SelectItem value="long">Long-term (7+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="investmentExperience">Investment Experience</Label>
                  <Select
                    onValueChange={(value) => handleInputChange("investmentExperience", value)}
                    value={profile.investmentExperience}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="investmentGoals">Investment Goals</Label>
                <Textarea
                  id="investmentGoals"
                  placeholder="Describe your financial goals (e.g., retirement, house down payment, children's education...)"
                  value={profile.investmentGoals}
                  onChange={(e) => handleInputChange("investmentGoals", e.target.value)}
                  className="bg-white/5 border-white/20 min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-black px-8 py-3 text-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
