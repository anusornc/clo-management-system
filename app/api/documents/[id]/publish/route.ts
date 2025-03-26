import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Update document status to PUBLISHED
    const document = await db.documentVersion.update({
      where: {
        id: params.id,
      },
      data: {
        status: "PUBLISHED",
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error("[DOCUMENT_PUBLISH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

