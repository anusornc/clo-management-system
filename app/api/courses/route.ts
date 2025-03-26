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
    const { code, nameEn, nameTh, descriptionEn, descriptionTh, credits, faculty, department } = body

    if (!code || !nameEn || !nameTh || !credits) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const course = await db.course.create({
      data: {
        code,
        nameEn,
        nameTh,
        descriptionEn,
        descriptionTh,
        credits,
        faculty,
        department,
        createdById: session.user.id,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("[COURSES_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const courses = await db.course.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("[COURSES_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

