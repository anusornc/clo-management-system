"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseInfoForm } from "@/components/document/course-info-form"
import { CLOForm } from "@/components/document/clo-form"
import { PLOMappingForm } from "@/components/document/plo-mapping-form"
import { TeachingMethodsForm } from "@/components/document/teaching-methods-form"
import { AssessmentMethodsForm } from "@/components/document/assessment-methods-form"

export default function EditDocumentPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { language } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [document, setDocument] = useState(null)
  const [activeTab, setActiveTab] = useState("course-info")

  const translations = {
    en: {
      title: "Edit CLO Document",
      description: "Edit the Course Learning Outcomes document",
      courseInfo: "Course Info",
      clos: "CLOs",
      ploMapping: "PLO Mapping",
      teachingMethods: "Teaching Methods",
      assessmentMethods: "Assessment Methods",
      save: "Save Changes",
      publish: "Publish",
      back: "Back to Documents",
      success: "Document saved successfully",
      error: "Failed to save document",
      loading: "Loading document...",
    },
    th: {
      title: "แก้ไขเอกสาร มคอ.3",
      description: "แก้ไขเอกสารผลลัพธ์การเรียนรู้ของรายวิชา",
      courseInfo: "ข้อมูลรายวิชา",
      clos: "CLOs",
      ploMapping: "การเชื่อมโยง PLO",
      teachingMethods: "วิธีการสอน",
      assessmentMethods: "วิธีการประเมิน",
      save: "บันทึกการเปลี่ยนแปลง",
      publish: "เผยแพร่",
      back: "กลับไปยังรายการเอกสาร",
      success: "บันทึกเอกสารสำเร็จ",
      error: "ไม่สามารถบันทึกเอกสารได้",
      loading: "กำลังโหลดเอกสาร...",
    },
  }

  const t = translations[language]

  useEffect(() => {
    async function fetchDocument() {
      try {
        const response = await fetch(`/api/documents/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch document")
        }
        const data = await response.json()
        setDocument(data)
      } catch (error) {
        console.error("Error fetching document:", error)
        toast({
          variant: "destructive",
          title: "Failed to load document",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocument()
  }, [params.id, toast])

  async function handleSave() {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/documents/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(document),
      })

      if (!response.ok) {
        throw new Error("Failed to save document")
      }

      toast({
        title: t.success,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePublish() {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/documents/${params.id}/publish`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to publish document")
      }

      toast({
        title: "Document published successfully",
      })

      router.push("/documents")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to publish document",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto py-10 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4">{t.loading}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="text-muted-foreground">
              {document?.course?.code} - {language === "en" ? document?.course?.nameEn : document?.course?.nameTh}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => router.push("/documents")}>
              {t.back}
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {t.save}
            </Button>
            <Button variant="default" onClick={handlePublish} disabled={isLoading}>
              {t.publish}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="course-info">{t.courseInfo}</TabsTrigger>
            <TabsTrigger value="clos">{t.clos}</TabsTrigger>
            <TabsTrigger value="plo-mapping">{t.ploMapping}</TabsTrigger>
            <TabsTrigger value="teaching-methods">{t.teachingMethods}</TabsTrigger>
            <TabsTrigger value="assessment-methods">{t.assessmentMethods}</TabsTrigger>
          </TabsList>
          <TabsContent value="course-info">
            <Card>
              <CardHeader>
                <CardTitle>{t.courseInfo}</CardTitle>
                <CardDescription>Basic information about the course</CardDescription>
              </CardHeader>
              <CardContent>
                <CourseInfoForm document={document} setDocument={setDocument} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="clos">
            <Card>
              <CardHeader>
                <CardTitle>{t.clos}</CardTitle>
                <CardDescription>Define Course Learning Outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <CLOForm document={document} setDocument={setDocument} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="plo-mapping">
            <Card>
              <CardHeader>
                <CardTitle>{t.ploMapping}</CardTitle>
                <CardDescription>Map CLOs to Program Learning Outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <PLOMappingForm document={document} setDocument={setDocument} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="teaching-methods">
            <Card>
              <CardHeader>
                <CardTitle>{t.teachingMethods}</CardTitle>
                <CardDescription>Define teaching methods for each CLO</CardDescription>
              </CardHeader>
              <CardContent>
                <TeachingMethodsForm document={document} setDocument={setDocument} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="assessment-methods">
            <Card>
              <CardHeader>
                <CardTitle>{t.assessmentMethods}</CardTitle>
                <CardDescription>Define assessment methods for each CLO</CardDescription>
              </CardHeader>
              <CardContent>
                <AssessmentMethodsForm document={document} setDocument={setDocument} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

