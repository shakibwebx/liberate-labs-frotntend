import { useState } from "react";

interface Event {
  id: number;
  title: string;
  category: "Work" | "Personal" | "Other";
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:mm
  notes?: string;
  archived: boolean;
}

interface EventCardProps {
  event: Event;
  onUpdate: () => void;
  onError?: (error: string) => void;
}

// Mock API (for demo only)
const archiveEvent = async (id: number) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (Math.random() > 0.8) throw new Error("Network error");
  // Use the id parameter to avoid unused variable error
  return { success: true, archivedId: id };
};

const deleteEvent = async (id: number) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (Math.random() > 0.8) throw new Error("Failed to delete");
  // Use the id parameter to avoid unused variable error
  return { success: true, deletedId: id };
};

export default function EventCard({ event, onUpdate, onError }: EventCardProps) {
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const handleArchive = async () => {
    try {
      setLoading(true);
      setActionError("");
      await archiveEvent(event.id);
      onUpdate();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to archive event";
      setActionError(message);
      onError?.(message);
      console.error("Archive error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      setLoading(true);
      setActionError("");
      await deleteEvent(event.id);
      onUpdate();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete event";
      setActionError(message);
      onError?.(message);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryStyles = (category: Event["category"]) => {
    const styles = {
      Work: {
        badge: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "💼",
        gradient: "from-blue-500 to-blue-600",
      },
      Personal: {
        badge: "bg-green-100 text-green-800 border-green-200",
        icon: "🏠",
        gradient: "from-green-500 to-green-600",
      },
      Other: {
        badge: "bg-purple-100 text-purple-800 border-purple-200",
        icon: "📌",
        gradient: "from-purple-500 to-purple-600",
      },
    };

    return styles[category] ?? {
      badge: "bg-gray-100 text-gray-800 border-gray-200",
      icon: "📋",
      gradient: "from-gray-500 to-gray-600",
    };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isUpcoming = () => {
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    return eventDateTime > new Date();
  };

  const categoryStyles = getCategoryStyles(event.category);

  return (
    <div className={`relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
      event.archived ? "bg-gradient-to-br from-gray-50 to-gray-100 opacity-80" : "bg-white"
    }`}>
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryStyles.gradient}`} />

      {actionError && (
        <div className="m-4 mb-0 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚠️</span> {actionError}
          </div>
          <button onClick={() => setActionError("")} className="text-red-500 hover:text-red-700 text-lg leading-none">
            ×
          </button>
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`text-xl font-bold ${event.archived ? "text-gray-500 line-through" : "text-gray-900"}`}>
                {event.title}
              </h3>
              <div className="flex items-center gap-2">
                {event.archived && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-200">
                    📦 Archived
                  </span>
                )}
                {!event.archived && isUpcoming() && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-200 animate-pulse">
                    ⏰ Upcoming
                  </span>
                )}
              </div>
            </div>

            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${categoryStyles.badge}`}>
              <span>{categoryStyles.icon}</span> {event.category}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              📅
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Date</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(event.date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              🕒
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Time</p>
              <p className="text-sm font-semibold text-gray-900">{formatTime(event.time)}</p>
            </div>
          </div>
        </div>

        {event.notes && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border-l-4 border-gray-300">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Notes</p>
            <p className={`text-sm leading-relaxed ${event.archived ? "text-gray-500" : "text-gray-700"}`}>
              {event.notes}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          {!event.archived && (
            <button
              onClick={handleArchive}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-white text-sm font-medium rounded-xl hover:bg-yellow-600 disabled:bg-yellow-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "📦 Archive"
              )}
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "🗑️ Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
