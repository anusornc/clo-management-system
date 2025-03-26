import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const plos = await db.plo.findMany({
      orderBy: {
        codeEn: "asc",
      },
    })

    return NextResponse.json(plos)
  } catch (error) {
    console.error("[PLOS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

