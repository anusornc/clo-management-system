import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { courseId } = body

    if (!courseId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Check if course exists
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
    })

    if (!course) {
      return new NextResponse("Course not found", { status: 404 })
    }

    // Create a new document version
    const documentVersion = await db.documentVersion.create({
      data: {
        version: 1,
        status: "DRAFT",
        courseId,
        createdById: session.user.id,
      },
    })

    return NextResponse.json(documentVersion)
  } catch (error) {
    console.error("[DOCUMENTS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const documents = await db.documentVersion.findMany({
      include: {
        course: true,
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error("[DOCUMENTS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

