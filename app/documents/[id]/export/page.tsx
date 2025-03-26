"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-provider"
import { FileDown, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function ExportDocumentPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { language } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [document, setDocument] = useState(null)
  const [exportFormat, setExportFormat] = useState("pdf")

  const translations = {
    en: {
      title: "Export Document",
      description: "Export your CLO document to PDF or Word format",
      format: "Export Format",
      pdf: "PDF",
      word: "Word",
      export: "Export Document",
      back: "Back to Document",
      preview: "Preview",
      loading: "Loading document...",
      exporting: "Exporting document...",
    },
    th: {
      title: "ส่งออกเอกสาร",
      description: "ส่งออกเอกสาร มคอ.3 เป็นรูปแบบ PDF หรือ Word",
      format: "รูปแบบการส่งออก",
      pdf: "PDF",
      word: "Word",
      export: "ส่งออกเอกสาร",
      back: "กลับไปยังเอกสาร",
      preview: "ตัวอย่าง",
      loading: "กำลังโหลดเอกสาร...",
      exporting: "กำลังส่งออกเอกสาร...",
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

  async function handleExport() {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/documents/${params.id}/export?format=${exportFormat}`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Failed to export document")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${document.course.code}_มคอ3.${exportFormat}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Document exported successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to export document",
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
          <Button variant="outline" onClick={() => router.push(`/documents/${params.id}`)}>
            {t.back}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.format}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="format">{t.format}</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger id="format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        {t.pdf}
                      </div>
                    </SelectItem>
                    <SelectItem value="docx">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        {t.word}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleExport} disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="ml-2">{t.exporting}</span>
                  </div>
                ) : (
                  <>
                    <FileDown className="mr-2 h-4 w-4" /> {t.export}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.preview}</CardTitle>
              <CardDescription>Preview of your document</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] overflow-auto border rounded-md p-4">
              <div className="space-y-4">
                <h1 className="text-xl font-bold text-center">
                  {language === "en" ? "Course Specification (มคอ.3)" : "รายละเอียดของรายวิชา (มคอ.3)"}
                </h1>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">{language === "en" ? "Course Information" : "ข้อมูลทั่วไป"}</h2>
                  <p>
                    <span className="font-medium">{language === "en" ? "Course Code: " : "รหัสวิชา: "}</span>
                    {document?.course?.code}
                  </p>
                  <p>
                    <span className="font-medium">{language === "en" ? "Course Name: " : "ชื่อวิชา: "}</span>
                    {language === "en" ? document?.course?.nameEn : document?.course?.nameTh}
                  </p>
                  <p>
                    <span className="font-medium">{language === "en" ? "Credits: " : "หน่วยกิต: "}</span>
                    {document?.course?.credits}
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">
                    {language === "en" ? "Course Learning Outcomes" : "ผลลัพธ์การเรียนรู้ของรายวิชา"}
                  </h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {document?.clos?.map((clo) => (
                      <li key={clo.id}>
                        <span className="font-medium">CLO {clo.number}: </span>
                        {language === "en" ? clo.descriptionEn : clo.descriptionTh}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* More preview sections would go here */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

