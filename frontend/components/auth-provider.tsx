"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        setError("Authentication service is taking longer than expected. Please refresh the page.")
        setLoading(false)
      }
    }, 10000) // 10 seconds timeout

    let unsubscribe: (() => void) | undefined

    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setUser(user)
          setLoading(false)
          setError(null)
          clearTimeout(loadingTimeout)
        },
        (error) => {
          console.error("Auth state change error:", error)
          setError("Authentication error occurred. Please refresh the page.")
          setLoading(false)
          clearTimeout(loadingTimeout)
        },
      )
    } catch (error) {
      console.error("Firebase auth initialization error:", error)
      setError("Failed to initialize authentication. Please check your internet connection.")
      setLoading(false)
      clearTimeout(loadingTimeout)
    }

    return () => {
      clearTimeout(loadingTimeout)
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [loading])

  return <AuthContext.Provider value={{ user, loading, error }}>{children}</AuthContext.Provider>
}
