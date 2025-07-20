import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import ErrorBoundary from "./components/ErrorBoundary";
import EventList from "./components/EventList";
import EventForm from "./components/EventForm";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
              <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Event Manager
                </h1>
                <p className="text-gray-600 mb-4">
                  Manage your work, personal, and other events
                </p>

                <Link to="/create">
                  <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all">
                    ➕ Add New Event
                  </button>
                </Link>
              </header>

              <main>
                <Routes>
                  <Route path="/" element={<EventList />} />
                  <Route path="/create" element={<EventForm onEventCreated={() => window.location.href = "/"} />} />
                </Routes>
              </main>
            </div>
          </div>
        </NotificationProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
