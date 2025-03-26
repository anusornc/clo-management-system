"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)

  const translations = {
    en: {
      title: "Login",
      description: "Enter your credentials to access your account",
      email: "Email",
      password: "Password",
      loginButton: "Login",
      errorMessage: "Invalid email or password",
    },
    th: {
      title: "เข้าสู่ระบบ",
      description: "กรอกข้อมูลเพื่อเข้าสู่ระบบ",
      email: "อีเมล",
      password: "รหัสผ่าน",
      loginButton: "เข้าสู่ระบบ",
      errorMessage: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    },
  }

  const t = translations[language]

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/"
      })

      if (result?.error) {
        toast({
          variant: "destructive",
          title: t.errorMessage,
        })
        setIsLoading(false)
        return
      }

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        variant: "destructive",
        title: t.errorMessage,
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span className="ml-2">{t.loginButton}...</span>
                </div>
              ) : (
                t.loginButton
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}