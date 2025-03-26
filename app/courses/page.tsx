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

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const courses = await db.course.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Courses</h1>
          <Button asChild>
            <Link href="/courses/new">
              <Plus className="mr-2 h-4 w-4" /> Add Course
            </Link>
          </Button>
        </div>

        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  )
}

