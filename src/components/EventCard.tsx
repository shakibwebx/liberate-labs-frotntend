import { useState } from "react";
import { archiveEvent, deleteEvent } from "../api/events";
import type { IEvent } from "../types/event";

interface EventCardProps {
  event: IEvent;
  onUpdate: () => void;
  onError?: (error: string) => void;
}

export default function EventCard({ event, onUpdate, onError }: EventCardProps) {
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const handleArchive = async () => {
    try {
      setLoading(true);
      setActionError("");
      await archiveEvent(event.id);
      onUpdate(); // Refresh the events list
    } catch (err: any) {
      const errorMessage = err.message || "Failed to archive event";
      setActionError(errorMessage);
      if (onError) onError(errorMessage);
      console.error('Archive error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      setLoading(true);
      setActionError("");
      await deleteEvent(event.id);
      onUpdate(); // Refresh the events list
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete event";
      setActionError(errorMessage);
      if (onError) onError(errorMessage);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Work":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Personal":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Other":
        return "bg-slate-50 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`border border-slate-200 rounded-xl p-6 transition-all duration-200 ${
      event.archived 
        ? 'bg-slate-50 opacity-70' 
        : 'bg-white hover:shadow-md hover:border-slate-300'
    }`}>
      
      {/* Error Display */}
      {actionError && (
        <div className="mb-4 flex items-start gap-3 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
          <div className="w-4 h-4 rounded-full bg-red-200 flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 bg-red-600 rounded-full m-1"></div>
          </div>
          <span className="flex-1">{actionError}</span>
          <button
            onClick={() => setActionError("")}
            className="text-red-600 hover:text-red-800 font-medium ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Event Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className={`text-xl font-semibold mb-2 ${
            event.archived ? 'text-slate-500 line-through' : 'text-slate-900'
          }`}>
            {event.title}
          </h3>
          
          {/* Category Badge */}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
            getCategoryColor(event.category)
          }`}>
            {event.category}
          </span>
        </div>

        {/* Status Badge */}
        {event.archived && (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full border border-amber-200">
            Archived
          </span>
        )}
      </div>

      {/* Date and Time */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-medium">{formatDate(event.date)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-medium">{formatTime(event.time)}</span>
        </div>
      </div>

      {/* Notes */}
      {event.notes && (
        <div className="mb-5">
          <p className={`text-sm leading-relaxed ${
            event.archived ? 'text-slate-500' : 'text-slate-600'
          }`}>
            {event.notes}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2 border-t border-slate-100">
        {!event.archived && (
          <button
            onClick={handleArchive}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-amber-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Archiving..." : "Archive"}
          </button>
        )}
        
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}