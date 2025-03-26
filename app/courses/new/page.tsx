"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"

export default function NewCoursePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)

  const translations = {
    en: {
      title: "Add New Course",
      description: "Create a new course in the system",
      courseCode: "Course Code",
      courseNameEn: "Course Name (English)",
      courseNameTh: "Course Name (Thai)",
      credits: "Credits",
      faculty: "Faculty",
      department: "Department",
      descriptionEn: "Description (English)",
      descriptionTh: "Description (Thai)",
      cancel: "Cancel",
      create: "Create Course",
      success: "Course created successfully",
      error: "Failed to create course",
    },
    th: {
      title: "เพิ่มรายวิชาใหม่",
      description: "สร้างรายวิชาใหม่ในระบบ",
      courseCode: "รหัสวิชา",
      courseNameEn: "ชื่อวิชา (ภาษาอังกฤษ)",
      courseNameTh: "ชื่อวิชา (ภาษาไทย)",
      credits: "หน่วยกิต",
      faculty: "คณะ",
      department: "ภาควิชา",
      descriptionEn: "คำอธิบายรายวิชา (ภาษาอังกฤษ)",
      descriptionTh: "คำอธิบายรายวิชา (ภาษาไทย)",
      cancel: "ยกเลิก",
      create: "สร้างรายวิชา",
      success: "สร้างรายวิชาสำเร็จ",
      error: "ไม่สามารถสร้างรายวิชาได้",
    },
  }

  const t = translations[language]

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: formData.get("code"),
          nameEn: formData.get("nameEn"),
          nameTh: formData.get("nameTh"),
          descriptionEn: formData.get("descriptionEn"),
          descriptionTh: formData.get("descriptionTh"),
          credits: Number.parseInt(formData.get("credits") as string),
          faculty: formData.get("faculty"),
          department: formData.get("department"),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create course")
      }

      toast({
        title: t.success,
      })

      router.push("/courses")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">{t.courseCode}</Label>
                  <Input id="code" name="code" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">{t.credits}</Label>
                  <Input id="credits" name="credits" type="number" min="1" max="12" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameEn">{t.courseNameEn}</Label>
                <Input id="nameEn" name="nameEn" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameTh">{t.courseNameTh}</Label>
                <Input id="nameTh" name="nameTh" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty">{t.faculty}</Label>
                  <Input id="faculty" name="faculty" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">{t.department}</Label>
                  <Input id="department" name="department" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionEn">{t.descriptionEn}</Label>
                <Textarea id="descriptionEn" name="descriptionEn" rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionTh">{t.descriptionTh}</Label>
                <Textarea id="descriptionTh" name="descriptionTh" rows={3} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                {t.cancel}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="ml-2">{t.create}...</span>
                  </div>
                ) : (
                  t.create
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

