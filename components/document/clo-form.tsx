"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function CLOForm({ document, setDocument }) {
  const { language } = useLanguage()
  const [clos, setClos] = useState(document.clos || [])

  const translations = {
    en: {
      title: "Course Learning Outcomes",
      add: "Add CLO",
      number: "Number",
      descriptionEn: "Description (English)",
      descriptionTh: "Description (Thai)",
      bloomLevel: "Bloom's Taxonomy Level",
      actions: "Actions",
      delete: "Delete",
      bloomLevels: {
        remember: "Remember",
        understand: "Understand",
        apply: "Apply",
        analyze: "Analyze",
        evaluate: "Evaluate",
        create: "Create",
      },
      noClos: "No CLOs defined yet. Add your first CLO.",
    },
    th: {
      title: "ผลลัพธ์การเรียนรู้ของรายวิชา",
      add: "เพิ่ม CLO",
      number: "ลำดับ",
      descriptionEn: "คำอธิบาย (ภาษาอังกฤษ)",
      descriptionTh: "คำอธิบาย (ภาษาไทย)",
      bloomLevel: "ระดับการเรียนรู้ตามแนวคิดของบลูม",
      actions: "การกระทำ",
      delete: "ลบ",
      bloomLevels: {
        remember: "จำ",
        understand: "เข้าใจ",
        apply: "ประยุกต์ใช้",
        analyze: "วิเคราะห์",
        evaluate: "ประเมินค่า",
        create: "สร้างสรรค์",
      },
      noClos: "ยังไม่มี CLO ที่กำหนด เพิ่ม CLO แรกของคุณ",
    },
  }

  const t = translations[language]

  const bloomLevels = [
    { value: "remember", label: t.bloomLevels.remember },
    { value: "understand", label: t.bloomLevels.understand },
    { value: "apply", label: t.bloomLevels.apply },
    { value: "analyze", label: t.bloomLevels.analyze },
    { value: "evaluate", label: t.bloomLevels.evaluate },
    { value: "create", label: t.bloomLevels.create },
  ]

  const handleAddClo = () => {
    const newClo = {
      id: `temp-${Date.now()}`,
      number: clos.length + 1,
      descriptionEn: "",
      descriptionTh: "",
      bloomLevel: "understand",
    }

    const updatedClos = [...clos, newClo]
    setClos(updatedClos)
    updateDocument(updatedClos)
  }

  const handleDeleteClo = (index) => {
    const updatedClos = clos
      .filter((_, i) => i !== index)
      .map((clo, i) => ({
        ...clo,
        number: i + 1,
      }))

    setClos(updatedClos)
    updateDocument(updatedClos)
  }

  const handleChangeClo = (index, field, value) => {
    const updatedClos = [...clos]
    updatedClos[index] = {
      ...updatedClos[index],
      [field]: value,
    }

    setClos(updatedClos)
    updateDocument(updatedClos)
  }

  const updateDocument = (updatedClos) => {
    setDocument({
      ...document,
      clos: updatedClos,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t.title}</h3>
        <Button onClick={handleAddClo}>
          <Plus className="mr-2 h-4 w-4" /> {t.add}
        </Button>
      </div>

      {clos.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">{t.noClos}</p>
          <Button onClick={handleAddClo} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> {t.add}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {clos.map((clo, index) => (
            <Card key={clo.id || index}>
              <CardHeader>
                <CardTitle className="text-base">CLO {clo.number}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`clo-${index}-number`}>{t.number}</Label>
                    <Input
                      id={`clo-${index}-number`}
                      type="number"
                      min="1"
                      value={clo.number}
                      onChange={(e) => handleChangeClo(index, "number", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`clo-${index}-bloom`}>{t.bloomLevel}</Label>
                    <Select
                      value={clo.bloomLevel}
                      onValueChange={(value) => handleChangeClo(index, "bloomLevel", value)}
                    >
                      <SelectTrigger id={`clo-${index}-bloom`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bloomLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`clo-${index}-desc-en`}>{t.descriptionEn}</Label>
                  <Textarea
                    id={`clo-${index}-desc-en`}
                    value={clo.descriptionEn}
                    onChange={(e) => handleChangeClo(index, "descriptionEn", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`clo-${index}-desc-th`}>{t.descriptionTh}</Label>
                  <Textarea
                    id={`clo-${index}-desc-th`}
                    value={clo.descriptionTh}
                    onChange={(e) => handleChangeClo(index, "descriptionTh", e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClo(index)}>
                  <Trash className="mr-2 h-4 w-4" /> {t.delete}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

