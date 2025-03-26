import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const document = await db.documentVersion.findUnique({
      where: {
        id: params.id,
      },
      include: {
        course: true,
        createdBy: {
          select: {
            name: true,
          },
        },
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

    return NextResponse.json(document)
  } catch (error) {
    console.error("[DOCUMENT_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    // Update document version
    const document = await db.documentVersion.update({
      where: {
        id: params.id,
      },
      data: {
        // Update document data
        // This would be a complex update with transactions to handle all the related data
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error("[DOCUMENT_PUT]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Delete document version
    await db.documentVersion.delete({
      where: {
        id: params.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[DOCUMENT_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

