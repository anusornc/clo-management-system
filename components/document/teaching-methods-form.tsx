"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"

export function TeachingMethodsForm({ document, setDocument }) {
  const { language } = useLanguage()
  const [methods, setMethods] = useState(document.teachingMethods || [])
  const [mappings, setMappings] = useState(document.cloTeachingMethods || [])

  const translations = {
    en: {
      title: "Teaching Methods",
      method: "Method",
      methodNameEn: "Method Name (English)",
      methodNameTh: "Method Name (Thai)",
      add: "Add Method",
      noClos: "No CLOs defined yet. Please define CLOs first.",
      noMethods: "No teaching methods defined yet. Add your first method.",
    },
    th: {
      title: "วิธีการสอน",
      method: "วิธีการ",
      methodNameEn: "ชื่อวิธีการ (ภาษาอังกฤษ)",
      methodNameTh: "ชื่อวิธีการ (ภาษาไทย)",
      add: "เพิ่มวิธีการ",
      noClos: "ยังไม่มี CLO ที่กำหนด กรุณากำหนด CLO ก่อน",
      noMethods: "ยังไม่มีวิธีการสอนที่กำหนด เพิ่มวิธีการแรกของคุณ",
    },
  }

  const t = translations[language]

  useEffect(() => {
    // Initialize mappings if they don't exist
    if (document.clos && document.clos.length > 0 && methods.length > 0) {
      if (!document.cloTeachingMethods || document.cloTeachingMethods.length === 0) {
        const initialMappings = []
        document.clos.forEach((clo) => {
          methods.forEach((method) => {
            initialMappings.push({
              cloId: clo.id,
              methodId: method.id,
              used: false,
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
          used: false,
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
      [field]: value,
    }

    setMethods(updatedMethods)
    updateDocument(updatedMethods, mappings)
  }

  const handleToggleMapping = (cloId, methodId, used) => {
    const updatedMappings = mappings.map((mapping) => {
      if (mapping.cloId === cloId && mapping.methodId === methodId) {
        return { ...mapping, used }
      }
      return mapping
    })

    setMappings(updatedMappings)
    updateDocument(methods, updatedMappings)
  }

  const updateDocument = (updatedMethods, updatedMappings) => {
    setDocument({
      ...document,
      teachingMethods: updatedMethods,
      cloTeachingMethods: updatedMappings,
    })
  }

  const isMethodUsed = (cloId, methodId) => {
    const mapping = mappings.find((m) => m.cloId === cloId && m.methodId === methodId)
    return mapping ? mapping.used : false
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
              <div key={method.id} className="grid grid-cols-2 gap-4">
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
                      <TableCell key={`${method.id}-${clo.id}`} className="text-center">
                        <Checkbox
                          checked={isMethodUsed(clo.id, method.id)}
                          onCheckedChange={(checked) => handleToggleMapping(clo.id, method.id, checked)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}

