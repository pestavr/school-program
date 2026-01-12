import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Use Greece timezone (Europe/Athens)
    const now = new Date()
    
    // Get components in Greek timezone
    const greekTimeString = now.toLocaleString('en-US', { 
      timeZone: 'Europe/Athens',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short'
    })
    
    // Parse the Greek time components
    const greekDate = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Athens' }))
    const currentDay = greekDate.getDay() // 0-6
    
    // Get time in HH:MM format
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Athens',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    const currentTime = timeFormatter.format(now) // HH:MM format
    
    // Get date in YYYY-MM-DD format
    const dateFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Athens'
    })
    const currentDate = dateFormatter.format(now) // YYYY-MM-DD format

    const schedules = await prisma.schedule.findMany({
      where: {
        dayOfWeek: currentDay,
        startTime: {
          lte: currentTime
        },
        endTime: {
          gte: currentTime
        },
        isSubstitutional: false // Exclude substitutional teachers from regular display
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
