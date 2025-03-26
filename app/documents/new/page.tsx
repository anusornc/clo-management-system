"use client"

import Link from "next/link"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function NewDocumentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(searchParams.get("courseId") || "")

  const translations = {
    en: {
      title: "Create New CLO Document",
      description: "Select a course to create a new CLO document",
      course: "Course",
      selectCourse: "Select a course",
      cancel: "Cancel",
      create: "Create Document",
      success: "Document created successfully",
      error: "Failed to create document",
      loading: "Loading courses...",
      noCourses: "No courses found. Please create a course first.",
    },
    th: {
      title: "สร้างเอกสาร มคอ.3 ใหม่",
      description: "เลือกรายวิชาเพื่อสร้างเอกสาร มคอ.3 ใหม่",
      course: "รายวิชา",
      selectCourse: "เลือกรายวิชา",
      cancel: "ยกเลิก",
      create: "สร้างเอกสาร",
      success: "สร้างเอกสารสำเร็จ",
      error: "ไม่สามารถสร้างเอกสารได้",
      loading: "กำลังโหลดรายวิชา...",
      noCourses: "ไม่พบรายวิชา กรุณาสร้างรายวิชาก่อน",
    },
  }

  const t = translations[language]

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/courses")
        if (!response.ok) {
          throw new Error("Failed to fetch courses")
        }
        const data = await response.json()
        setCourses(data)
      } catch (error) {
        console.error("Error fetching courses:", error)
        toast({
          variant: "destructive",
          title: "Failed to load courses",
        })
      }
    }

    fetchCourses()
  }, [toast])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    if (!selectedCourse) {
      toast({
        variant: "destructive",
        title: "Please select a course",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: selectedCourse,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create document")
      }

      const data = await response.json()

      toast({
        title: t.success,
      })

      router.push(`/documents/${data.id}/edit`)
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
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course">{t.course}</Label>
                {courses.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">{t.noCourses}</p>
                    <Button asChild className="mt-4">
                      <Link href="/courses/new">Create Course</Link>
                    </Button>
                  </div>
                ) : (
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectCourse} />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.code} - {language === "en" ? course.nameEn : course.nameTh}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                {t.cancel}
              </Button>
              <Button type="submit" disabled={isLoading || courses.length === 0}>
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

