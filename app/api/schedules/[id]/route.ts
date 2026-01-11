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
    const { teacherId, locationId, isSubstitutional, dayOfWeek, startTime, endTime } = body

    // Location is required only if not substitutional
    if (!isSubstitutional && !locationId) {
      return NextResponse.json(
        { error: "Location is required for non-substitutional schedules" },
        { status: 400 }
      )
    }

    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        teacherId,
        locationId: isSubstitutional ? null : locationId,
        dayOfWeek,
        startTime,
        endTime
      },
      include: {
        teacher: true,
        location: true
      }
    })

    return NextResponse.json(schedule)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update schedule" },
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
    await prisma.schedule.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Schedule deleted" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete schedule" },
      { status: 500 }
    )
  }
}
