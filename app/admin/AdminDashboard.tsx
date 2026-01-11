"use client"

import { signOut } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import TeachersManagement from "@/app/admin/components/TeachersManagement"
import LocationsManagement from "@/app/admin/components/LocationsManagement"
import SchedulesManagement from "@/app/admin/components/SchedulesManagement"
import AbsencesManagement from "@/app/admin/components/AbsencesManagement"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"teachers" | "locations" | "schedules" | "absences">("schedules")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Πειραματικό Γυμνάσιο Πανεπιστημίου Πατρών
              </h1>
              <p className="text-sm text-gray-600 mt-1">Admin Panel - Διαχείριση Προγράμματος</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/"
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                Προβολή Προγράμματος
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Αποσύνδεση
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("schedules")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === "schedules"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Πρόγραμμα Εφημεριών
            </button>
            <button
              onClick={() => setActiveTab("absences")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === "absences"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Απουσίες & Αναπληρωτές
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === "teachers"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Καθηγητές
            </button>
            <button
              onClick={() => setActiveTab("locations")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === "locations"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Χώροι Εφημεριών
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "teachers" && <TeachersManagement />}
        {activeTab === "locations" && <LocationsManagement />}
        {activeTab === "schedules" && <SchedulesManagement />}
        {activeTab === "absences" && <AbsencesManagement />}
      </div>
    </div>
  )
}
