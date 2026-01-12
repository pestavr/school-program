import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Use Greece timezone (Europe/Athens)
    const now = new Date()
    const greekTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Athens' }))
    const currentDay = greekTime.getDay() // 0-6
    const currentTime = greekTime.toTimeString().slice(0, 5) // HH:MM format
    const currentDate = greekTime.toISOString().split('T')[0] // YYYY-MM-DD format

    const schedules = await prisma.schedule.findMany({
      where: {
        dayOfWeek: currentDay,
        startTime: {
          lte: currentTime
        },
        endTime: {
          gte: currentTime
        }
      },
      include: {
        teacher: true,
        location: true
      }
    })

    // Check for absences and substitutions
    const schedulesWithSubstitutes = await Promise.all(
      schedules.map(async (schedule) => {
        const absence = await prisma.absence.findFirst({
          where: {
            teacherId: schedule.teacherId,
            date: currentDate
          },
          include: {
            substitutions: {
              include: {
                substituteTeacher: true
              }
            }
          }
        })

        if (absence && absence.substitutions.length > 0) {
          // Teacher is absent and has a substitute
          return {
            ...schedule,
            originalTeacher: schedule.teacher,
            teacher: absence.substitutions[0].substituteTeacher,
            isSubstitute: true,
            absenceReason: absence.reason
          }
        }

        return {
          ...schedule,
          isSubstitute: false
        }
      })
    )

    return NextResponse.json(schedulesWithSubstitutes)
  } catch (error) {
    console.error('Error fetching current schedules:', error)
    return NextResponse.json(
      { 
        error: "Failed to fetch current schedules",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
