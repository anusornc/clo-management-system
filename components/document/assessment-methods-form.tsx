"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function AssessmentMethodsForm({ document, setDocument }) {
  const { language } = useLanguage()
  const [methods, setMethods] = useState(document.assessmentMethods || [])
  const [mappings, setMappings] = useState(document.cloAssessmentMethods || [])

  const translations = {
    en: {
      title: "Assessment Methods",
      method: "Method",
      methodNameEn: "Method Name (English)",
      methodNameTh: "Method Name (Thai)",
      weight: "Weight (%)",
      add: "Add Method",
      noClos: "No CLOs defined yet. Please define CLOs first.",
      noMethods: "No assessment methods defined yet. Add your first method.",
      percentage: "Percentage (%)",
      total: "Total",
    },
    th: {
      title: "วิธีการประเมิน",
      method: "วิธีการ",
      methodNameEn: "ชื่อวิธีการ (ภาษาอังกฤษ)",
      methodNameTh: "ชื่อวิธีการ (ภาษาไทย)",
      weight: "น้ำหนัก (%)",
      add: "เพิ่มวิธีการ",
      noClos: "ยังไม่มี CLO ที่กำหนด กรุณากำหนด CLO ก่อน",
      noMethods: "ยังไม่มีวิธีการประเมินที่กำหนด เพิ่มวิธีการแรกของคุณ",
      percentage: "ร้อยละ (%)",
      total: "รวม",
    },
  }

  const t = translations[language]

  useEffect(() => {
    // Initialize mappings if they don't exist
    if (document.clos && document.clos.length > 0 && methods.length > 0) {
      if (!document.cloAssessmentMethods || document.cloAssessmentMethods.length === 0) {
        const initialMappings = []
        document.clos.forEach((clo) => {
          methods.forEach((method) => {
            initialMappings.push({
              cloId: clo.id,
              methodId: method.id,
              percentage: 0,
            })
          })
        })
        setMappings(initialMappings)
        updateDocument(methods, initialMappings)
      }
    }
  }, [document.clos, methods])

  const handleAddMethod = () => {
    const newMethod = {
      id: `temp-${Date.now()}`,
      nameEn: "",
      nameTh: "",
      weight: 0,
    }

    const updatedMethods = [...methods, newMethod]
    setMethods(updatedMethods)

    // Create mappings for the new method
    if (document.clos && document.clos.length > 0) {
      const newMappings = [...mappings]
      document.clos.forEach((clo) => {
        newMappings.push({
          cloId: clo.id,
          methodId: newMethod.id,
          percentage: 0,
        })
      })
      setMappings(newMappings)
      updateDocument(updatedMethods, newMappings)
    } else {
      updateDocument(updatedMethods, mappings)
    }
  }

  const handleChangeMethod = (index, field, value) => {
    const updatedMethods = [...methods]
    updatedMethods[index] = {
      ...updatedMethods[index],
      [field]: field === "weight" ? Number.parseFloat(value) : value,
    }

    setMethods(updatedMethods)
    updateDocument(updatedMethods, mappings)
  }

  const handleChangeMapping = (cloId, methodId, percentage) => {
    const updatedMappings = mappings.map((mapping) => {
      if (mapping.cloId === cloId && mapping.methodId === methodId) {
        return { ...mapping, percentage: Number.parseFloat(percentage) }
      }
      return mapping
    })

    setMappings(updatedMappings)
    updateDocument(methods, updatedMappings)
  }

  const updateDocument = (updatedMethods, updatedMappings) => {
    setDocument({
      ...document,
      assessmentMethods: updatedMethods,
      cloAssessmentMethods: updatedMappings,
    })
  }

  const getMappingPercentage = (cloId, methodId) => {
    const mapping = mappings.find((m) => m.cloId === cloId && m.methodId === methodId)
    return mapping ? mapping.percentage : 0
  }

  const getTotalPercentageForClo = (cloId) => {
    return mappings.filter((m) => m.cloId === cloId).reduce((sum, mapping) => sum + mapping.percentage, 0)
  }

  if (!document.clos || document.clos.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">{t.noClos}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t.title}</h3>
        <Button onClick={handleAddMethod}>
          <Plus className="mr-2 h-4 w-4" /> {t.add}
        </Button>
      </div>

      {methods.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">{t.noMethods}</p>
          <Button onClick={handleAddMethod} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> {t.add}
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {methods.map((method, index) => (
              <div key={method.id} className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`method-${index}-en`}>{t.methodNameEn}</Label>
                  <Input
                    id={`method-${index}-en`}
                    value={method.nameEn}
                    onChange={(e) => handleChangeMethod(index, "nameEn", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`method-${index}-th`}>{t.methodNameTh}</Label>
                  <Input
                    id={`method-${index}-th`}
                    value={method.nameTh}
                    onChange={(e) => handleChangeMethod(index, "nameTh", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`method-${index}-weight`}>{t.weight}</Label>
                  <Input
                    id={`method-${index}-weight`}
                    type="number"
                    min="0"
                    max="100"
                    value={method.weight}
                    onChange={(e) => handleChangeMethod(index, "weight", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border rounded-md overflow-auto mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">{t.method}</TableHead>
                  {document.clos.map((clo) => (
                    <TableHead key={clo.id}>CLO {clo.number}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {methods.map((method) => (
                  <TableRow key={method.id}>
                    <TableCell className="font-medium">{language === "en" ? method.nameEn : method.nameTh}</TableCell>
                    {document.clos.map((clo) => (
                      <TableCell key={`${method.id}-${clo.id}`}>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={getMappingPercentage(clo.id, method.id)}
                          onChange={(e) => handleChangeMapping(clo.id, method.id, e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-bold">{t.total}</TableCell>
                  {document.clos.map((clo) => (
                    <TableCell key={`total-${clo.id}`} className="font-bold">
                      {getTotalPercentageForClo(clo.id)}%
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}

