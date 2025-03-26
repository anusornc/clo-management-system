import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import Link from "next/link"
import { Plus } from "lucide-react"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">CLO Documents</h1>
          <Button asChild>
            <Link href="/documents/new">
              <Plus className="mr-2 h-4 w-4" /> Create New Document
            </Link>
          </Button>
        </div>

        <DataTable columns={columns} data={documents} />
      </div>
    </div>
  )
}

