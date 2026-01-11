import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

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
    await prisma.absence.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Absence deleted" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete absence" },
      { status: 500 }
    )
  }
}
