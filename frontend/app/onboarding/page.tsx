"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight } from "lucide-react"

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

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

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

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!user) return

    setLoading(true)
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...profile,
        email: user.email,
        name: user.displayName,
        createdAt: new Date(),
        onboardingCompleted: true,
      })

      toast({
        title: "Profile saved successfully!",
        description: "Redirecting to your dashboard...",
      })

      setTimeout(() => router.push("/dashboard"), 1500)
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error saving profile",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
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

            <div>
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <Select onValueChange={(value) => handleInputChange("employmentStatus", value)}>
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
        )

      case 2:
        return (
          <div className="space-y-6">
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

            <div>
              <Label htmlFor="investmentHorizon">Investment Time Horizon</Label>
              <Select onValueChange={(value) => handleInputChange("investmentHorizon", value)}>
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
              <Select onValueChange={(value) => handleInputChange("investmentExperience", value)}>
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

            <div>
              <Label htmlFor="investmentGoals">Investment Goals</Label>
              <Textarea
                id="investmentGoals"
                placeholder="Describe your financial goals (e.g., retirement, house down payment, children's education...)"
                value={profile.investmentGoals}
                onChange={(e) => handleInputChange("investmentGoals", e.target.value)}
                className="bg-white/5 border-white/20 min-h-[100px]"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
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
            </div>

            <div>
              <Label htmlFor="emergencyFund">Emergency Fund Status</Label>
              <Select onValueChange={(value) => handleInputChange("emergencyFund", value)}>
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
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Review Your Information</h3>
              <p className="text-gray-400 mb-6">Please review your details before proceeding</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Annual Salary:</span>
                  <span>${profile.salary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Age:</span>
                  <span>{profile.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Savings:</span>
                  <span>${profile.currentSavings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly Investment:</span>
                  <span>${profile.monthlyInvestment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk Tolerance:</span>
                  <span>{profile.riskTolerance}/10</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Horizon:</span>
                  <span className="capitalize">{profile.investmentHorizon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="capitalize">{profile.investmentExperience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dependents:</span>
                  <span>{profile.dependents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Debt:</span>
                  <span>${profile.debtAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Emergency Fund:</span>
                  <span className="capitalize">{profile.emergencyFund}</span>
                </div>
              </div>
            </div>

            {profile.investmentGoals && (
              <div>
                <span className="text-gray-400 text-sm">Investment Goals:</span>
                <p className="text-sm mt-1 p-3 bg-white/5 rounded-lg">{profile.investmentGoals}</p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">
              <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
              <p className="text-gray-400 text-base font-normal">
                Help us create personalized investment recommendations for you
              </p>
            </CardTitle>

            {/* Progress Bar */}
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${step <= currentStep ? "bg-primary" : "bg-white/20"}`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-white/20 hover:bg-white/10 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button onClick={nextStep} className="bg-primary hover:bg-primary/90 text-black">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} className="bg-primary hover:bg-primary/90 text-black">
                  {loading ? "Saving..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
