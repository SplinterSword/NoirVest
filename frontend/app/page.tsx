"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TrendingUp, Shield, Target, BarChart3, AlertCircle, RefreshCw } from "lucide-react"

export default function HomePage() {
  const { user, loading, error } = useAuth()
  const router = useRouter()
  const [signingIn, setSigningIn] = useState(false)

  const makeSession = async (userID: string, sessionId: string, ADK_URL: string) => {
    const session = await fetch(`${ADK_URL}/apps/investment_agent/users/${userID}/sessions/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!session.ok) {
      throw new Error('Failed to create session');
    }

    const session_id = sessionId;
    localStorage.setItem('session_id', session_id);
    console.log(session_id);
  }

  useEffect(() => {
    if (user && !loading) {
      const userID = user?.email || 'u_123';
      localStorage.setItem('userID', userID);
      const sessionId = localStorage.getItem('sessionId') || 's_' + Math.random().toString(36).substr(2, 9);
      const ADK_URL = process.env.NEXT_PUBLIC_AGENT_API_URL || "http://localhost:8000"
      makeSession(userID, sessionId, ADK_URL)
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const handleGoogleSignIn = async () => {
    setSigningIn(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Sign in error:", error)
      setSigningIn(false)
    }
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing application...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
        <Card className="bg-white/5 border-white/10 max-w-md w-full">
          <CardContent className="p-6">
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="border-white/20 hover:bg-white/10 bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            NoirVest
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            AI-powered investment recommendations tailored to your financial goals. Get personalized strategies backed
            by advanced analytics.
          </p>
          <Button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-4 text-lg"
          >
            {signingIn ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: TrendingUp,
              title: "AI-Powered Analysis",
              description: "Advanced algorithms analyze market trends and your financial profile",
            },
            {
              icon: Shield,
              title: "Risk Management",
              description: "Personalized risk assessment based on your tolerance and goals",
            },
            {
              icon: Target,
              title: "Goal-Oriented",
              description: "Investment strategies aligned with your specific financial objectives",
            },
            {
              icon: BarChart3,
              title: "Visual Insights",
              description: "Interactive charts and graphs to track your investment journey",
            },
          ].map((feature, index) => (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Investment Journey?</h2>
          <p className="text-gray-300 mb-8">Join thousands of users who trust our AI-powered recommendations</p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <span>✓ Secure & Private</span>
            <span>✓ No Hidden Fees</span>
            <span>✓ Backed With AI</span>
          </div>
        </div>
      </div>
    </div>
  )
}
