import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BookOpen, FileText, Users } from "lucide-react"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">CLO Management System</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Courses
            </CardTitle>
            <CardDescription>Manage course information and details</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Create, edit, and view course information including course codes, names, descriptions, and credits.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/courses">
                View Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              CLO Documents
            </CardTitle>
            <CardDescription>Manage Course Learning Outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Create and edit CLOs with references to Bloom's Taxonomy, teaching strategies, and PLO mappings.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/documents">
                View Documents <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {session.user.role === "admin" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Manage system users</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Add, edit, and manage user accounts and their permissions within the system.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/admin/users">
                  Manage Users <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

