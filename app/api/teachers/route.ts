import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teachers = await prisma.teacher.findMany({
      orderBy: { name: "asc" }
    })

    return NextResponse.json(teachers)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, subject } = body

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const teacher = await prisma.teacher.create({
      data: { name, email, phone, subject }
    })

    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    )
  }
}
