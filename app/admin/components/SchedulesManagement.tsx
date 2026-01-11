"use client"

import { useEffect, useState } from "react"

interface Teacher {
  id: string
  name: string
}

interface Location {
  id: string
  name: string
}

interface Schedule {
  id: string
  teacherId: string
  locationId: string | null
  isSubstitutional: boolean
  dayOfWeek: number
  startTime: string
  endTime: string
  teacher: Teacher
  location: Location | null
}

const DAYS = [
  { value: 1, label: "Δευτέρα" },
  { value: 2, label: "Τρίτη" },
  { value: 3, label: "Τετάρτη" },
  { value: 4, label: "Πέμπτη" },
  { value: 5, label: "Παρασκευή" },
  { value: 6, label: "Σάββατο" },
  { value: 0, label: "Κυριακή" }
]

const SHIFTS = [
  { value: 'A', label: 'Α΄ Βάρδια (08:00 - 11:00)', startTime: '08:00', endTime: '11:00' },
  { value: 'B', label: 'Β΄ Βάρδια (11:00 - 14:00)', startTime: '11:00', endTime: '14:00' }
]

export default function SchedulesManagement() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [formData, setFormData] = useState({
    teacherId: "",
    locationId: "",
    isSubstitutional: false,
    dayOfWeek: 1,
    shift: ""
  })

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [schedulesRes, teachersRes, locationsRes] = await Promise.all([
        fetch("/api/schedules"),
        fetch("/api/teachers"),
        fetch("/api/locations")
      ])

      const [schedulesData, teachersData, locationsData] = await Promise.all([
        schedulesRes.json(),
        teachersRes.json(),
        locationsRes.json()
      ])

      setSchedules(schedulesData)
      setTeachers(teachersData)
      setLocations(locationsData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingSchedule ? `/api/schedules/${editingSchedule.id}` : "/api/schedules"
      const method = editingSchedule ? "PUT" : "POST"

      // Convert shift to actual times
      const selectedShift = SHIFTS.find(s => s.value === formData.shift)
      if (!selectedShift) return

      const dataToSend = {
        teacherId: formData.teacherId,
        locationId: formData.locationId,
        isSubstitutional: formData.isSubstitutional,
        dayOfWeek: formData.dayOfWeek,
        startTime: selectedShift.startTime,
        endTime: selectedShift.endTime
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      })

      if (response.ok) {
        await fetchAll()
        setShowForm(false)
        setEditingSchedule(null)
        setFormData({
          teacherId: "",
          locationId: "",
          isSubstitutional: false,
          dayOfWeek: 1,
          shift: ""
        })
      }
    } catch (error) {
      console.error("Failed to save schedule:", error)
    }
  }

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    // Convert times to shift
    const shift = SHIFTS.find(s => s.startTime === schedule.startTime && s.endTime === schedule.endTime)?.value || ""
    setFormData({
      teacherId: schedule.teacherId,
      locationId: schedule.locationId || "",
      isSubstitutional: schedule.isSubstitutional,
      dayOfWeek: schedule.dayOfWeek,
      shift: shift
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το πρόγραμμα;")) return

    try {
      await fetch(`/api/schedules/${id}`, { method: "DELETE" })
      await fetchAll()
    } catch (error) {
      console.error("Failed to delete schedule:", error)
    }
  }

  const getGroupedSchedules = () => {
    const grouped: { [key: number]: Schedule[] } = {}
    schedules.forEach((schedule) => {
      if (!grouped[schedule.dayOfWeek]) {
        grouped[schedule.dayOfWeek] = []
      }
      grouped[schedule.dayOfWeek].push(schedule)
    })
    return grouped
  }

  if (loading) {
    return <div className="text-center py-12">Φόρτωση...</div>
  }

  const groupedSchedules = getGroupedSchedules()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Πρόγραμμα Εφημεριών</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingSchedule(null)
            setFormData({
              teacherId: "",
              locationId: "",
              isSubstitutional: false,
              dayOfWeek: 1,
              shift: ""
            })
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {showForm ? "Ακύρωση" : "+ Νέο Πρόγραμμα"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingSchedule ? "Επεξεργασία Προγράμματος" : "Νέο Πρόγραμμα"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Καθηγητής *
                </label>
                <select
                  required
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="">Επιλέξτε καθηγητή</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Χώρος {!formData.isSubstitutional && '*'}
                </label>
                <select
                  required={!formData.isSubstitutional}
                  value={formData.locationId}
                  onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                  disabled={formData.isSubstitutional}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Επιλέξτε χώρο</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                {formData.isSubstitutional && (
                  <p className="text-xs text-gray-500 mt-1">Αναπληρωτές καλύπτουν όλους τους χώρους</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isSubstitutional"
                checked={formData.isSubstitutional}
                onChange={(e) => {
                  const isChecked = e.target.checked
                  setFormData({ 
                    ...formData, 
                    isSubstitutional: isChecked,
                    locationId: isChecked ? "" : formData.locationId
                  })
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isSubstitutional" className="text-sm font-medium text-gray-700">
                Ο καθηγητής είναι αναπληρωτής
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ημέρα *
              </label>
              <select
                required
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                {DAYS.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Βάρδια *
              </label>
              <select
                required
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="">Επιλέξτε βάρδια</option>
                {SHIFTS.map((shift) => (
                  <option key={shift.value} value={shift.value}>
                    {shift.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              {editingSchedule ? "Ενημέρωση" : "Δημιουργία"}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {DAYS.map((day) => {
          const daySchedules = groupedSchedules[day.value] || []
          if (daySchedules.length === 0) return null

          return (
            <div key={day.value} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 text-white px-6 py-3">
                <h3 className="text-lg font-semibold">{day.label}</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {daySchedules
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((schedule) => (
                    <div key={schedule.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                              {schedule.startTime} - {schedule.endTime}
                            </span>
                            <span className="font-semibold text-gray-800">
                              {schedule.teacher.name}
                            </span>
                            {schedule.isSubstitutional && (
                              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                Αναπληρωτής
                              </span>
                            )}
                            <span className="text-gray-600">→</span>
                            <span className="text-gray-800">{schedule.location ? schedule.location.name : 'Όλοι οι χώροι'}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(schedule)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                          >
                            Επεξεργασία
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                          >
                            Διαγραφή
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )
        })}
      </div>

      {schedules.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">Δεν υπάρχουν προγράμματα εφημεριών</p>
        </div>
      )}
    </div>
  )
}
