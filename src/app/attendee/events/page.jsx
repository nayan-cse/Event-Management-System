"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { fetchWithAuth } from "@/app/utils/api";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetchWithAuth("/api/v1/attendee/events");
        const data = await response.json();
        if (response.ok) {
          setEvents(data.events);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar role="attendee" />
      <main className="flex-grow">
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Events</h1>

            {/* Events Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              {events.length === 0 ? (
                <p>No events found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="border p-4 rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-gray-600">{event.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date_time).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventsPage;
