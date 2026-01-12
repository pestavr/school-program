"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"

interface Teacher {
  id: string
  name: string
}

interface Substitution {
  id: string
  substituteTeacher: Teacher
  notes?: string
}

interface Absence {
  id: string
  teacherId: string
  date: string
  reason?: string
  teacher: Teacher
  substitutions: Substitution[]
}

export default function AbsencesManagement() {
  const [absences, setAbsences] = useState<Absence[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [showAbsenceForm, setShowAbsenceForm] = useState(false)
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null)
  const [absenceFormData, setAbsenceFormData] = useState({
    teacherId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    reason: ""
  })
  const [substitutionFormData, setSubstitutionFormData] = useState({
    substituteTeacherId: "",
    notes: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [absencesRes, teachersRes] = await Promise.all([
        fetch("/api/absences"),
        fetch("/api/teachers")
      ])

      const [absencesData, teachersData] = await Promise.all([
        absencesRes.json(),
        teachersRes.json()
      ])

      setAbsences(absencesData)
      setTeachers(teachersData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAbsenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/absences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(absenceFormData)
      })

      if (response.ok) {
        await fetchData()
        setShowAbsenceForm(false)
        setAbsenceFormData({
          teacherId: "",
          date: format(new Date(), "yyyy-MM-dd"),
          reason: ""
        })
      }
    } catch (error) {
      console.error("Failed to create absence:", error)
    }
  }

  const handleSubstitutionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedAbsence) return

    try {
      const response = await fetch("/api/substitutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          absenceId: selectedAbsence.id,
          ...substitutionFormData
        })
      })

      if (response.ok) {
        await fetchData()
        setSelectedAbsence(null)
        setSubstitutionFormData({
          substituteTeacherId: "",
          notes: ""
        })
      }
    } catch (error) {
      console.error("Failed to create substitution:", error)
    }
  }

  const handleDeleteAbsence = async (id: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτήν την απουσία;")) return

    try {
      await fetch(`/api/absences/${id}`, { method: "DELETE" })
      await fetchData()
    } catch (error) {
      console.error("Failed to delete absence:", error)
    }
  }

  const handleDeleteSubstitution = async (id: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να αφαιρέσετε αυτήν την αναπλήρωση;")) return

    try {
      await fetch(`/api/substitutions/${id}`, { method: "DELETE" })
      await fetchData()
    } catch (error) {
      console.error("Failed to delete substitution:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Φόρτωση...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Απουσίες & Αναπληρωτές</h2>
        <button
          onClick={() => {
            setShowAbsenceForm(!showAbsenceForm)
            setAbsenceFormData({
              teacherId: "",
              date: format(new Date(), "yyyy-MM-dd"),
              reason: ""
            })
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {showAbsenceForm ? "Ακύρωση" : "+ Νέα Απουσία"}
        </button>
      </div>

      {showAbsenceForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Καταχώριση Απουσίας</h3>
          <form onSubmit={handleAbsenceSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Καθηγητής *
              </label>
              <select
                required
                value={absenceFormData.teacherId}
                onChange={(e) => setAbsenceFormData({ ...absenceFormData, teacherId: e.target.value })}
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
                Ημερομηνία *
              </label>
              <input
                type="date"
                required
                value={absenceFormData.date}
                onChange={(e) => setAbsenceFormData({ ...absenceFormData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Αιτία
              </label>
              <input
                type="text"
                value={absenceFormData.reason}
                onChange={(e) => setAbsenceFormData({ ...absenceFormData, reason: e.target.value })}
                placeholder="π.χ. Ασθένεια, Προσωπικοί λόγοι"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Καταχώριση Απουσίας
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {absences.map((absence) => (
          <div key={absence.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {absence.teacher.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Ημερομηνία: {format(new Date(absence.date), "dd/MM/yyyy")}
                </p>
                {absence.reason && (
                  <p className="text-sm text-gray-600">
                    Αιτία: {absence.reason}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDeleteAbsence(absence.id)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Διαγραφή
              </button>
            </div>

            {absence.substitutions.length > 0 ? (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Καθορισμένος Αναπληρωτής:</h4>
                {absence.substitutions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between bg-green-50 p-3 rounded">
                    <div>
                      <p className="font-medium text-green-800">{sub.substituteTeacher.name}</p>
                      {sub.notes && <p className="text-sm text-green-700">{sub.notes}</p>}
                    </div>
                    <button
                      onClick={() => handleDeleteSubstitution(sub.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Αφαίρεση
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 border-t pt-4">
                <div className="bg-blue-50 p-3 rounded mb-3">
                  <p className="text-sm text-blue-800">
                    ℹ️ Αυτόματα θα ανατεθεί αναπληρωτής. Μπορείτε να επιλέξετε συγκεκριμένο αναπληρωτή αν θέλετε.
                  </p>
                </div>
                {selectedAbsence?.id === absence.id ? (
                  <form onSubmit={handleSubstitutionSubmit} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Επιλέξτε Συγκεκριμένο Αναπληρωτή (Προαιρετικό)
                      </label>
                      <select
                        required
                        value={substitutionFormData.substituteTeacherId}
                        onChange={(e) =>
                          setSubstitutionFormData({ ...substitutionFormData, substituteTeacherId: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      >
                        <option value="">Επιλέξτε καθηγητή</option>
                        {teachers
                          .filter((t) => t.id !== absence.teacherId)
                          .map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Σημειώσεις
                      </label>
                      <input
                        type="text"
                        value={substitutionFormData.notes}
                        onChange={(e) =>
                          setSubstitutionFormData({ ...substitutionFormData, notes: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                      >
                        Ορισμός Αναπληρωτή
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAbsence(null)
                          setSubstitutionFormData({ substituteTeacherId: "", notes: "" })
                        }}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition"
                      >
                        Ακύρωση
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setSelectedAbsence(absence)}
                    className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
                  >
                    Επιλογή Συγκεκριμένου Αναπληρωτή
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {absences.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">Δεν υπάρχουν καταχωρημένες απουσίες</p>
        </div>
      )}
    </div>
  )
}
