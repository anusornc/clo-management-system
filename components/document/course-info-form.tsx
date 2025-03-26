"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/components/language-provider"

export function CourseInfoForm({ document, setDocument }) {
  const { language } = useLanguage()

  const translations = {
    en: {
      courseCode: "Course Code",
      courseNameEn: "Course Name (English)",
      courseNameTh: "Course Name (Thai)",
      credits: "Credits",
      faculty: "Faculty",
      department: "Department",
      descriptionEn: "Description (English)",
      descriptionTh: "Description (Thai)",
      prerequisites: "Prerequisites",
      corequisites: "Corequisites",
    },
    th: {
      courseCode: "รหัสวิชา",
      courseNameEn: "ชื่อวิชา (ภาษาอังกฤษ)",
      courseNameTh: "ชื่อวิชา (ภาษาไทย)",
      credits: "หน่วยกิต",
      faculty: "คณะ",
      department: "ภาควิชา",
      descriptionEn: "คำอธิบายรายวิชา (ภาษาอังกฤษ)",
      descriptionTh: "คำอธิบายรายวิชา (ภาษาไทย)",
      prerequisites: "วิชาที่ต้องเรียนมาก่อน",
      corequisites: "วิชาที่ต้องเรียนควบคู่",
    },
  }

  const t = translations[language]

  const handleChange = (field, value) => {
    setDocument({
      ...document,
      course: {
        ...document.course,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">{t.courseCode}</Label>
          <Input id="code" value={document.course.code || ""} onChange={(e) => handleChange("code", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="credits">{t.credits}</Label>
          <Input
            id="credits"
            type="number"
            min="1"
            max="12"
            value={document.course.credits || ""}
            onChange={(e) => handleChange("credits", Number.parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nameEn">{t.courseNameEn}</Label>
        <Input
          id="nameEn"
          value={document.course.nameEn || ""}
          onChange={(e) => handleChange("nameEn", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nameTh">{t.courseNameTh}</Label>
        <Input
          id="nameTh"
          value={document.course.nameTh || ""}
          onChange={(e) => handleChange("nameTh", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="faculty">{t.faculty}</Label>
          <Input
            id="faculty"
            value={document.course.faculty || ""}
            onChange={(e) => handleChange("faculty", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">{t.department}</Label>
          <Input
            id="department"
            value={document.course.department || ""}
            onChange={(e) => handleChange("department", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descriptionEn">{t.descriptionEn}</Label>
        <Textarea
          id="descriptionEn"
          rows={3}
          value={document.course.descriptionEn || ""}
          onChange={(e) => handleChange("descriptionEn", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descriptionTh">{t.descriptionTh}</Label>
        <Textarea
          id="descriptionTh"
          rows={3}
          value={document.course.descriptionTh || ""}
          onChange={(e) => handleChange("descriptionTh", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prerequisites">{t.prerequisites}</Label>
          <Input
            id="prerequisites"
            value={document.course.prerequisites || ""}
            onChange={(e) => handleChange("prerequisites", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="corequisites">{t.corequisites}</Label>
          <Input
            id="corequisites"
            value={document.course.corequisites || ""}
            onChange={(e) => handleChange("corequisites", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

