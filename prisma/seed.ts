import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
      department: "Administration",
    },
  })

  // Create regular user
  const userPassword = await hash("user123", 10)
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Regular User",
      password: userPassword,
      role: "USER",
      department: "Computer Science",
    },
  })

  // Create sample PLOs
  const plos = await Promise.all([
    prisma.plo.upsert({
      where: { id: "plo-1" },
      update: {},
      create: {
        id: "plo-1",
        codeEn: "PLO1",
        codeTh: "PLO1",
        descriptionEn: "Apply knowledge of computing and mathematics appropriate to the discipline",
        descriptionTh: "ประยุกต์ใช้ความรู้ด้านคอมพิวเตอร์และคณิตศาสตร์ที่เหมาะสมกับสาขาวิชา",
        program: "Computer Science",
      },
    }),
    prisma.plo.upsert({
      where: { id: "plo-2" },
      update: {},
      create: {
        id: "plo-2",
        codeEn: "PLO2",
        codeTh: "PLO2",
        descriptionEn:
          "Analyze a problem, and identify and define the computing requirements appropriate to its solution",
        descriptionTh: "วิเคราะห์ปัญหาและระบุความต้องการทางคอมพิวเตอร์ที่เหมาะสมกับการแก้ปัญหา",
        program: "Computer Science",
      },
    }),
    prisma.plo.upsert({
      where: { id: "plo-3" },
      update: {},
      create: {
        id: "plo-3",
        codeEn: "PLO3",
        codeTh: "PLO3",
        descriptionEn:
          "Design, implement, and evaluate a computer-based system, process, component, or program to meet desired needs",
        descriptionTh: "ออกแบบ พัฒนา และประเมินระบบคอมพิวเตอร์ กระบวนการ องค์ประกอบ หรือโปรแกรมเพื่อตอบสนองความต้องการที่กำหนด",
        program: "Computer Science",
      },
    }),
  ])

  // Create sample course
  const course = await prisma.course.upsert({
    where: { code: "CS101" },
    update: {},
    create: {
      code: "CS101",
      nameEn: "Introduction to Computer Science",
      nameTh: "พื้นฐานวิทยาการคอมพิวเตอร์",
      descriptionEn: "An introduction to the basic concepts of computer science",
      descriptionTh: "แนะนำแนวคิดพื้นฐานของวิทยาการคอมพิวเตอร์",
      credits: 3,
      faculty: "Science",
      department: "Computer Science",
      createdById: admin.id,
    },
  })

  console.log({ admin, user, plos, course })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

