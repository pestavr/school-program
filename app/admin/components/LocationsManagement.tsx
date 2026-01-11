"use client"

import { useEffect, useState } from "react"

interface Location {
  id: string
  name: string
  description?: string
}

export default function LocationsManagement() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/locations")
      const data = await response.json()
      setLocations(data)
    } catch (error) {
      console.error("Failed to fetch locations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingLocation ? `/api/locations/${editingLocation.id}` : "/api/locations"
      const method = editingLocation ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchLocations()
        setShowForm(false)
        setEditingLocation(null)
        setFormData({ name: "", description: "" })
      }
    } catch (error) {
      console.error("Failed to save location:", error)
    }
  }

  const handleEdit = (location: Location) => {
    setEditingLocation(location)
    setFormData({
      name: location.name,
      description: location.description || ""
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον χώρο;")) return

    try {
      await fetch(`/api/locations/${id}`, { method: "DELETE" })
      await fetchLocations()
    } catch (error) {
      console.error("Failed to delete location:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Φόρτωση...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Χώροι Εφημεριών</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingLocation(null)
            setFormData({ name: "", description: "" })
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {showForm ? "Ακύρωση" : "+ Νέος Χώρος"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingLocation ? "Επεξεργασία Χώρου" : "Νέος Χώρος"}
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
                Περιγραφή
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              {editingLocation ? "Ενημέρωση" : "Δημιουργία"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <div key={location.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {location.name}
            </h3>
            {location.description && (
              <p className="text-sm text-gray-600 mb-4">{location.description}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(location)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
              >
                Επεξεργασία
              </button>
              <button
                onClick={() => handleDelete(location.id)}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
              >
                Διαγραφή
              </button>
            </div>
          </div>
        ))}
      </div>
      {locations.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">Δεν υπάρχουν χώροι εφημεριών</p>
        </div>
      )}
    </div>
  )
}
