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
    const { name, description } = body

    const location = await prisma.location.update({
      where: { id },
      data: { name, description }
    })

    return NextResponse.json(location)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update location" },
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
    await prisma.location.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Location deleted" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    )
  }
}
