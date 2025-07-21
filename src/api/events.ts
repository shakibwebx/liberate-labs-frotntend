import axios from "axios";
import type { IEvent } from "../types/event";

const API_URL = "https://event-shcedule-server.vercel.app/api"; // adjust if your backend URL differs

export const getEvents = async () => {
  const res = await axios.get(`${API_URL}/events`);
  console.log('API Response:', res.data); // Debug log
  
  // Your backend returns { success: boolean, message: string, data: IEvent[] }
  if (res.data.success && Array.isArray(res.data.data)) {
    return res.data.data;
  }
  
  throw new Error(res.data.message || 'Failed to fetch events');
};

export const createEvent = async (eventData: Omit<IEvent, "id" | "category" | "archived">) => {
  const res = await axios.post(`${API_URL}/events`, eventData);
  
  // Your backend returns { success: boolean, message: string, data: IEvent }
  if (res.data.success) {
    return res.data.data;
  }
  
  throw new Error(res.data.message || 'Failed to create event');
};

export const archiveEvent = async (id: string) => {
  const res = await axios.put(`${API_URL}/events/${id}`);
  
  // Your backend returns { success: boolean, message: string, data: IEvent }
  if (res.data.success) {
    return res.data.data;
  }
  
  throw new Error(res.data.message || 'Failed to archive event');
};

export const deleteEvent = async (id: string) => {
  const res = await axios.delete(`${API_URL}/events/${id}`);
  
  // Your backend returns { success: boolean, message: string, data: IEvent }
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to delete event');
  }
};