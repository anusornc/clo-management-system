"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLanguage } from "@/components/language-provider"

export function PLOMappingForm({ document, setDocument }) {
  const { language } = useLanguage()
  const [plos, setPlos] = useState([])
  const [mappings, setMappings] = useState(document.cloPlomappings || [])

  const translations = {
    en: {
      title: "CLO to PLO Mapping",
      clo: "Course Learning Outcome",
      plo: "Program Learning Outcome",
      strength: "Strength",
      strengthLevels: {
        none: "None",
        low: "Low",
        medium: "Medium",
        high: "High",
      },
      noClos: "No CLOs defined yet. Please define CLOs first.",
      noPlos: "No PLOs available. Please contact the administrator.",
    },
    th: {
      title: "การเชื่อมโยง CLO กับ PLO",
      clo: "ผลลัพธ์การเรียนรู้ของรายวิชา",
      plo: "ผลลัพธ์การเรียนรู้ของหลักสูตร",
      strength: "ความเข้มข้น",
      strengthLevels: {
        none: "ไม่มี",
        low: "ต่ำ",
        medium: "ปานกลาง",
        high: "สูง",
      },
      noClos: "ยังไม่มี CLO ที่กำหนด กรุณากำหนด CLO ก่อน",
      noPlos: "ไม่มี PLO ที่ใช้ได้ กรุณาติดต่อผู้ดูแลระบบ",
    },
  }

  const t = translations[language]

  const strengthLevels = [
    { value: "none", label: t.strengthLevels.none },
    { value: "low", label: t.strengthLevels.low },
    { value: "medium", label: t.strengthLevels.medium },
    { value: "high", label: t.strengthLevels.high },
  ]

  useEffect(() => {
    async function fetchPLOs() {
      try {
        const response = await fetch("/api/plos")
        if (!response.ok) {
          throw new Error("Failed to fetch PLOs")
        }
        const data = await response.json()
        setPlos(data)

        // Initialize mappings if they don't exist
        if (!document.cloPlomappings || document.cloPlomappings.length === 0) {
          const initialMappings = []
          document.clos.forEach((clo) => {
            data.forEach((plo) => {
              initialMappings.push({
                cloId: clo.id,
                ploId: plo.id,
                strength: "none",
              })
            })
          })
          setMappings(initialMappings)
          updateDocument(initialMappings)
        }
      } catch (error) {
        console.error("Error fetching PLOs:", error)
      }
    }

    if (document.clos && document.clos.length > 0) {
      fetchPLOs()
    }
  }, [document.clos])

  const handleChangeMapping = (cloId, ploId, strength) => {
    const updatedMappings = mappings.map((mapping) => {
      if (mapping.cloId === cloId && mapping.ploId === ploId) {
        return { ...mapping, strength }
      }
      return mapping
    })

    setMappings(updatedMappings)
    updateDocument(updatedMappings)
  }

  const updateDocument = (updatedMappings) => {
    setDocument({
      ...document,
      cloPlomappings: updatedMappings,
    })
  }

  const getMappingStrength = (cloId, ploId) => {
    const mapping = mappings.find((m) => m.cloId === cloId && m.ploId === ploId)
    return mapping ? mapping.strength : "none"
  }

  if (!document.clos || document.clos.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">{t.noClos}</p>
      </div>
    )
  }

  if (plos.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">{t.noPlos}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{t.title}</h3>

      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">{t.clo}</TableHead>
              {plos.map((plo) => (
                <TableHead key={plo.id}>{language === "en" ? plo.codeEn : plo.codeTh}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {document.clos.map((clo) => (
              <TableRow key={clo.id}>
                <TableCell className="font-medium">CLO {clo.number}</TableCell>
                {plos.map((plo) => (
                  <TableCell key={`${clo.id}-${plo.id}`}>
                    <Select
                      value={getMappingStrength(clo.id, plo.id)}
                      onValueChange={(value) => handleChangeMapping(clo.id, plo.id, value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {strengthLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

