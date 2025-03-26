import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import * as docx from "docx"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const url = new URL(req.url)
    const format = url.searchParams.get("format") || "pdf"

    const document = await db.documentVersion.findUnique({
      where: {
        id: params.id,
      },
      include: {
        course: true,
        clos: true,
        teachingMethods: true,
        assessmentMethods: true,
        cloPlomappings: true,
        cloTeachingMethods: true,
        cloAssessmentMethods: true,
      },
    })

    if (!document) {
      return new NextResponse("Document not found", { status: 404 })
    }

    let buffer

    if (format === "docx") {
      // Generate Word document
      buffer = await generateWordDocument(document)
    } else {
      // Generate PDF document
      buffer = await generatePdfDocument(document)
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          format === "docx"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : "application/pdf",
        "Content-Disposition": `attachment; filename="${document.course.code}_มคอ3.${format}"`,
      },
    })
  } catch (error) {
    console.error("[DOCUMENT_EXPORT]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

async function generateWordDocument(document) {
  // Implementation of Word document generation
  // This would use the docx library to create a Word document

  // Placeholder implementation
  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: [
          new docx.Paragraph({
            text: "Course Specification (มคอ.3)",
            heading: docx.HeadingLevel.HEADING_1,
            alignment: docx.AlignmentType.CENTER,
          }),
          new docx.Paragraph({
            text: `Course Code: ${document.course.code}`,
          }),
          new docx.Paragraph({
            text: `Course Name: ${document.course.nameEn}`,
          }),
          // More content would be added here
        ],
      },
    ],
  })

  const buffer = await docx.Packer.toBuffer(doc)
  return buffer
}

async function generatePdfDocument(document) {
  // Implementation of PDF document generation
  // This would use the pdfkit library to create a PDF document

  // Placeholder implementation
  return Buffer.from("PDF content would be generated here")
}

