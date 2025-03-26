"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, FileText, Home, Settings, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import { useLanguage } from "./language-provider"
import { LanguageSwitcher } from "./language-switcher"

export function MainNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { language } = useLanguage()

  const translations = {
    en: {
      home: "Home",
      courses: "Courses",
      documents: "CLO Documents",
      users: "Users",
      settings: "Settings",
    },
    th: {
      home: "หน้าหลัก",
      courses: "รายวิชา",
      documents: "เอกสาร มคอ.3",
      users: "ผู้ใช้งาน",
      settings: "ตั้งค่า",
    },
  }

  const t = translations[language]

  const routes = [
    {
      href: "/",
      label: t.home,
      icon: <Home className="mr-2 h-4 w-4" />,
      active: pathname === "/",
    },
    {
      href: "/courses",
      label: t.courses,
      icon: <BookOpen className="mr-2 h-4 w-4" />,
      active: pathname.startsWith("/courses"),
    },
    {
      href: "/documents",
      label: t.documents,
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname.startsWith("/documents"),
    },
  ]

  // Admin-only routes
  if (session?.user?.role === "admin") {
    routes.push({
      href: "/admin/users",
      label: t.users,
      icon: <Users className="mr-2 h-4 w-4" />,
      active: pathname.startsWith("/admin/users"),
    })
  }

  routes.push({
    href: "/settings",
    label: t.settings,
    icon: <Settings className="mr-2 h-4 w-4" />,
    active: pathname.startsWith("/settings"),
  })

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {route.icon}
          {route.label}
        </Link>
      ))}
      <div className="ml-auto">
        <LanguageSwitcher />
      </div>
    </nav>
  )
}

