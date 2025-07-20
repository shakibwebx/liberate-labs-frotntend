import { useState } from "react";
import { createEvent } from "../api/events";

interface Props {
  onEventCreated: () => void;
}

export default function EventForm({ onEventCreated }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return alert("Please fill in all required fields.");
    try {
      await createEvent({ title, date, time, notes });
      setTitle("");
      setDate("");
      setTime("");
      setNotes("");
      onEventCreated();
    } catch (error) {
      console.error(error);
      alert("Failed to create event.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 w-full max-w-lg mx-auto space-y-5"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">📅 Create New Event</h2>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Title<span className="text-red-500">*</span></label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Date<span className="text-red-500">*</span></label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Time<span className="text-red-500">*</span></label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes (optional)"
          rows={4}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
      >
        ➕ Create Event
      </button>
    </form>
  );
}
