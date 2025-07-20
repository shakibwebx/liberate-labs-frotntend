import { useEffect, useState } from "react";
import { getEvents } from "../api/events";
import type { IEvent } from "../types/event";
import EventCard from "./EventCard";


type CategoryFilter = "all" | "Work" | "Personal" | "Other";

export default function EventList() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getEvents();

      if (!Array.isArray(data)) {
        throw new Error("Invalid event data format received.");
      }

      setEvents(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch events.";
      console.error("Fetch error:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events once on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Update filtered events when filter or events change
  useEffect(() => {
    if (categoryFilter === "all") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter((event) => event.category === categoryFilter)
      );
    }
  }, [events, categoryFilter]);

  const handleCategoryChange = (category: CategoryFilter) => {
    setCategoryFilter(category);
  };

  const availableCategories = ["Work", "Personal", "Other"] as CategoryFilter[];

  const categoryIcons: Record<CategoryFilter, string> = {
    all: "📊",
    Work: "💼",
    Personal: "🏠",
    Other: "📌",
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading your events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <span className="text-2xl text-red-600">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
        <button
          onClick={fetchEvents}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <span className="mr-2">🔄</span>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🏷️</span>
          <h3 className="text-lg font-semibold text-gray-900">Filter by Category</h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {(["all", ...availableCategories] as CategoryFilter[]).map((category) => {
            const count =
              category === "all"
                ? events.length
                : events.filter((event) => event.category === category).length;

            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:-translate-y-1 ${
                  categoryFilter === category
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{categoryIcons[category]}</span>
                  {category === "all" ? "All Events" : category}
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      categoryFilter === category ? "bg-white/20" : "bg-gray-200"
                    }`}
                  >
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {filteredEvents.length === 0 && events.length > 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              No events found for "{categoryFilter}" category. Try selecting a different category.
            </p>
          </div>
        )}

        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Start organizing your schedule by creating your first event using the form above.
            </p>
          </div>
        )}

        {filteredEvents.length > 0 && (
          <div className="grid gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onUpdate={fetchEvents}
                onError={(err) => setError(err)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
