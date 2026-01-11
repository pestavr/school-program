"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import Link from "next/link"

interface Schedule {
  id: string
  teacher: {
    name: string
    subject?: string
  }
  originalTeacher?: {
    name: string
  }
  location: {
    name: string
    description?: string
  } | null
  startTime: string
  endTime: string
  isSubstitute?: boolean
  absenceReason?: string
}

export default function HomePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentSchedules = async () => {
      try {
        const response = await fetch("/api/schedules/current")
        const data = await response.json()
        
        // Check if the response is an array
        if (Array.isArray(data)) {
          setSchedules(data)
        } else {
          console.error("Invalid response format:", data)
          setSchedules([])
        }
      } catch (error) {
        console.error("Failed to fetch schedules:", error)
        setSchedules([])
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentSchedules()
    const interval = setInterval(fetchCurrentSchedules, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const dayNames = ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-gray-800">
              Πειραματικό Γυμνάσιο Πανεπιστημίου Πατρών
            </h1>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-600">
                Πρόγραμμα Εφημεριών
              </h2>
              <Link
                href="/admin"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Current Time Display */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="text-center">
            <h2 className="text-xl text-gray-600 mb-2">
              {dayNames[currentTime.getDay()]}
            </h2>
            <p className="text-4xl font-bold text-blue-600">
              {format(currentTime, "HH:mm:ss")}
            </p>
            <p className="text-gray-500 mt-2">
              {format(currentTime, "dd/MM/yyyy")}
            </p>
          </div>
        </div>

        {/* Current Duties */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Τωρινή Εφημερία
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Φόρτωση...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-xl text-gray-600">
                Δεν υπάρχει προγραμματισμένη εφημερία αυτή τη στιγμή
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {schedule.location ? schedule.location.name : 'Όλοι οι χώροι'}
                      </h3>
                      {schedule.location?.description && (
                        <p className="text-sm text-gray-500">
                          {schedule.location.description}
                        </p>
                      )}
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 ${schedule.isSubstitute ? 'bg-yellow-500' : 'bg-blue-600'} rounded-full flex items-center justify-center text-white font-bold text-lg mr-3`}>
                        {schedule.teacher.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800">
                            {schedule.teacher.name}
                          </p>
                          {schedule.isSubstitute && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">
                              Αναπληρωτής
                            </span>
                          )}
                        </div>
                        {schedule.isSubstitute && schedule.originalTeacher && (
                          <p className="text-xs text-gray-500 mt-1">
                            Αντικαθιστά: {schedule.originalTeacher.name}
                            {schedule.absenceReason && ` (${schedule.absenceReason})`}
                          </p>
                        )}
                        {schedule.teacher.subject && (
                          <p className="text-sm text-gray-600">
                            {schedule.teacher.subject}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
