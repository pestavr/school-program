import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, email, phone, subject } = body

    const teacher = await prisma.teacher.update({
      where: { id },
      data: { name, email, phone, subject }
    })

    return NextResponse.json(teacher)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update teacher" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await prisma.teacher.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Teacher deleted" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 }
    )
  }
}
