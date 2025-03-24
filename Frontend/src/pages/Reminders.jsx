import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import DatePicker from "react-datepicker";
import { v4 as uuidv4 } from "uuid";
import "react-datepicker/dist/react-datepicker.css";

const Reminders = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    type: "Vaccination",
  });

  const handleAddEvent = () => {
    if (newEvent.title.trim() === "") {
      alert("Please enter an event title!");
      return;
    }

    setEvents([
      ...events,
      { id: uuidv4(), title: `${newEvent.type}: ${newEvent.title}`, start: newEvent.date },
    ]);

    setNewEvent({ title: "", date: new Date(), type: "Vaccination" });
  };

  const handleUpdateEvent = () => {
    if (!selectedEvent) return;
    setEvents(
      events.map((event) =>
        event.id === selectedEvent.id
          ? { ...event, title: `${newEvent.type}: ${newEvent.title}`, start: newEvent.date }
          : event
      )
    );
    setSelectedEvent(null);
    setNewEvent({ title: "", date: new Date(), type: "Vaccination" });
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    setEvents(events.filter((event) => event.id !== selectedEvent.id));
    setSelectedEvent(null);
    setNewEvent({ title: "", date: new Date(), type: "Vaccination" });
  };

  const handleEventClick = (clickInfo) => {
    const selected = events.find((event) => event.id === clickInfo.event.id);
    if (selected) {
      setSelectedEvent(selected);
      setNewEvent({
        title: selected.title.replace(/^(Vaccination|Doctor Appointment|Grooming|Medication): /, ""),
        date: new Date(selected.start),
        type: selected.title.split(":")[0],
      });
    }
  };

  const handleEventDrop = (eventDropInfo) => {
    setEvents(
      events.map((event) =>
        event.id === eventDropInfo.event.id
          ? { ...event, start: eventDropInfo.event.start }
          : event
      )
    );
  };

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center py-10 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📅 Pet Reminders</h2>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <h3 className="text-xl font-semibold text-gray-700">
          {selectedEvent ? "Update Reminder" : "Add New Reminder"}
        </h3>
        <input
          type="text"
          placeholder="Enter reminder (e.g., Vet Visit)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <DatePicker
          selected={newEvent.date}
          onChange={(date) => setNewEvent({ ...newEvent, date })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
        />
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
          value={newEvent.type}
          onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
        >
          <option value="Vaccination">Vaccination</option>
          <option value="Doctor Appointment">Doctor Appointment</option>
          <option value="Grooming">Grooming</option>
          <option value="Medication">Medication</option>
        </select>
        {selectedEvent ? (
          <>
            <button
              onClick={handleUpdateEvent}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg mt-3 transition"
            >
              Update Reminder
            </button>
            <button
              onClick={handleDeleteEvent}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg mt-3 transition"
            >
              Delete Reminder
            </button>
          </>
        ) : (
          <button
            onClick={handleAddEvent}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg mt-3 transition"
          >
            Add Reminder
          </button>
        )}
      </div>

      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          editable
          selectable
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
        />
      </div>
    </div>
  );
};

export default Reminders;