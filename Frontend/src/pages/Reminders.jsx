import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  deleteDoc,
  updateDoc,
  doc,
  where
} from "firebase/firestore";
import { format, isAfter } from "date-fns";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

const Reminders = () => {
  const { user } = useAuth();
  const [reminderId, setReminderId] = useState(null);
  const [email, setEmail] = useState(user?.email || "");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Doctor Appointment");
  const [events, setEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const fetchReminders = async () => {
    const q = query(collection(db, "reminders"), where("user", "==", user?.email));
    const snapshot = await getDocs(q);
    const now = new Date();

    const fetched = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: `${data.category}: ${data.title}`,
        rawTitle: data.title,
        rawCategory: data.category,
        start: data.date,
        rawDate: data.date,
      };
    });

    setEvents(fetched);

    const upcomingReminders = fetched
      .filter((item) => isAfter(new Date(item.rawDate), now))
      .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
    setUpcoming(upcomingReminders.slice(0, 5));
  };

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      fetchReminders();
    }
  }, [user]);

  const showToast = (msg, icon = "success") => {
    Swal.fire({
      toast: true,
      icon,
      title: msg,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  };

  const handleAddReminder = async () => {
    if (!email || !title || !date || !category) {
      return showToast("All fields are required!", "error");
    }

    const reminder = {
      user: email,
      title,
      date,
      category,
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, "reminders"), reminder);

      await fetch("https://gmail-reminder-api-production.up.railway.app/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "Dog360 - Pet Reminder",
          text: `Reminder for your ${category.toLowerCase()}: ${title} on ${new Date(date).toLocaleString()}`
        }),
      });

      showToast("Reminder added & email sent!");
      setTitle("");
      setDate("");
      setCategory("Doctor Appointment");
      fetchReminders();
    } catch (err) {
      console.error(err);
      showToast("Error adding reminder", "error");
    }
  };

  const handleDeleteReminder = async () => {
    if (!reminderId) return;
    try {
      await deleteDoc(doc(db, "reminders", reminderId));

      await fetch("https://gmail-reminder-api-production.up.railway.app/delete-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminderId }),
      });

      setReminderId(null);
      setTitle("");
      setDate("");
      setCategory("Doctor Appointment");
      showToast("Reminder deleted!");
      fetchReminders();
    } catch (err) {
      console.error(err);
      showToast("Error deleting reminder", "error");
    }
  };

  const handleUpdateReminder = async () => {
    if (!reminderId) return;
    try {
      await updateDoc(doc(db, "reminders", reminderId), {
        title,
        date,
        category,
      });

      await fetch("https://gmail-reminder-api-production.up.railway.app/update-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reminderId,
          updatedTitle: title,
          updatedDate: date,
          updatedCategory: category
        }),
      });

      setReminderId(null);
      setTitle("");
      setDate("");
      setCategory("Doctor Appointment");
      showToast("Reminder updated!");
      fetchReminders();
    } catch (err) {
      console.error(err);
      showToast("Error updating reminder", "error");
    }
  };

  const handleEventClick = ({ event }) => {
    const selected = events.find(
      (e) => e.title === event.title && new Date(e.start).getTime() === new Date(event.start).getTime()
    );
    if (selected) {
      setReminderId(selected.id);
      setTitle(selected.rawTitle);
      setCategory(selected.rawCategory);
      setDate(format(new Date(selected.rawDate), "yyyy-MM-dd'T'HH:mm"));
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">📅 Pet Reminders</h2>

      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
        {/* Left: Form + Calendar */}
        <div className="w-full lg:w-[65%]">
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 text-sm max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              {reminderId ? "Update Reminder" : "Add New Reminder"}
            </h3>

            <input
              type="email"
              value={email}
              disabled
              className="mb-2 w-full px-3 py-2 border rounded-md text-gray-500 bg-gray-100 text-sm"
            />
            <input
              type="text"
              placeholder="Reminder Title"
              className="mb-2 w-full px-3 py-2 border rounded-md text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="datetime-local"
              className="mb-2 w-full px-3 py-2 border rounded-md text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <select
              className="mb-3 w-full px-3 py-2 border rounded-md text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Doctor Appointment</option>
              <option>Vaccination</option>
              <option>Medication</option>
              <option>Grooming</option>
            </select>

            {reminderId ? (
              <>
                <button
                  onClick={handleUpdateReminder}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600 w-full mb-2 text-sm"
                >
                  Update Reminder
                </button>
                <button
                  onClick={handleDeleteReminder}
                  className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 w-full text-sm"
                >
                  Delete Reminder
                </button>
              </>
            ) : (
              <button
                onClick={handleAddReminder}
                className="bg-rose-500 text-white px-4 py-2 rounded-md font-medium hover:bg-rose-600 w-full text-sm"
              >
                Add Reminder + Email
              </button>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev today next",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              eventClick={handleEventClick}
              events={events}
              height="600px"
            />
          </div>
        </div>

        {/* Right: Upcoming */}
        <div className="w-full lg:w-[30%] bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📋 Upcoming</h3>
          {upcoming.length === 0 ? (
            <p className="text-gray-500">No upcoming reminders</p>
          ) : (
            <ul className="space-y-3 text-left">
              {upcoming.map((item, i) => (
                <li key={i} className="border-l-4 border-rose-400 pl-3">
                  <p className="font-medium">{item.rawCategory}</p>
                  <p className="text-sm text-gray-700">{item.rawTitle}</p>
                  <p className="text-xs text-gray-500">{new Date(item.rawDate).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminders;
