"use client"

import { useEffect, useState } from "react"

interface Teacher {
  id: string
  name: string
  email?: string
  phone?: string
  subject?: string
}

export default function TeachersManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "" })

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/teachers")
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      console.error("Failed to fetch teachers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingTeacher ? `/api/teachers/${editingTeacher.id}` : "/api/teachers"
      const method = editingTeacher ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchTeachers()
        setShowForm(false)
        setEditingTeacher(null)
        setFormData({ name: "", email: "", phone: "", subject: "" })
      }
    } catch (error) {
      console.error("Failed to save teacher:", error)
    }
  }

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      name: teacher.name,
      email: teacher.email || "",
      phone: teacher.phone || "",
      subject: teacher.subject || ""
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον καθηγητή;")) return

    try {
      await fetch(`/api/teachers/${id}`, { method: "DELETE" })
      await fetchTeachers()
    } catch (error) {
      console.error("Failed to delete teacher:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Φόρτωση...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Καθηγητές</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingTeacher(null)
            setFormData({ name: "", email: "", phone: "", subject: "" })
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {showForm ? "Ακύρωση" : "+ Νέος Καθηγητής"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingTeacher ? "Επεξεργασία Καθηγητή" : "Νέος Καθηγητής"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Όνομα *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Τηλέφωνο
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ειδικότητα
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              {editingTeacher ? "Ενημέρωση" : "Δημιουργία"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Όνομα
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Τηλέφωνο
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ειδικότητα
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ενέργειες
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {teacher.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {teacher.email || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {teacher.phone || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {teacher.subject || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(teacher)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Επεξεργασία
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Διαγραφή
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {teachers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Δεν υπάρχουν καθηγητές
          </div>
        )}
      </div>
    </div>
  )
}
