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
  orderBy,
  deleteDoc,
  updateDoc,
  doc,
  where
} from "firebase/firestore";
import { format } from "date-fns";
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

  const fetchReminders = async () => {
    const q = query(collection(db, "reminders"), where("user", "==", user?.email));
    const snapshot = await getDocs(q);
    const fetched = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: `${data.category}: ${data.title}`,
        start: data.date,
      };
    });
    setEvents(fetched);
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
      const docRef = await addDoc(collection(db, "reminders"), reminder);

      await fetch("https://gmail-reminder-api-production.up.railway.app/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "Dog360 - Pet Reminder",
          text: `This is a reminder for your ${category.toLowerCase()}: ${title} on ${new Date(date).toLocaleString()}`
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
    await deleteDoc(doc(db, "reminders", reminderId));
    setReminderId(null);
    setTitle("");
    setDate("");
    setCategory("Doctor Appointment");
    showToast("Reminder deleted!");
    fetchReminders();
  };

  const handleUpdateReminder = async () => {
    if (!reminderId) return;
    await updateDoc(doc(db, "reminders", reminderId), {
      title,
      date,
      category,
    });
    setReminderId(null);
    setTitle("");
    setDate("");
    setCategory("Doctor Appointment");
    showToast("Reminder updated!");
    fetchReminders();
  };

  const handleEventClick = ({ event }) => {
    const selected = events.find((e) => e.title === event.title && e.start === event.startStr);
    if (selected) {
      const cleanTitle = selected.title.split(": ")[1];
      setReminderId(selected.id);
      setTitle(cleanTitle);
      setCategory(selected.title.split(": ")[0]);
      setDate(format(new Date(selected.start), "yyyy-MM-dd'T'HH:mm"));
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 text-center px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-2">
        📅 Pet Reminders
      </h2>

      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          {reminderId ? "Update Reminder" : "Add New Reminder"}
        </h3>

        <input
          type="email"
          value={email}
          disabled
          className="mb-3 w-full p-2 border rounded-md text-gray-500 bg-gray-100"
        />
        <input
          type="text"
          placeholder="Reminder Title"
          className="mb-3 w-full p-2 border rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="datetime-local"
          className="mb-3 w-full p-2 border rounded-md"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          className="mb-4 w-full p-2 border rounded-md"
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
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 w-full mb-2"
            >
              Update Reminder
            </button>
            <button
              onClick={handleDeleteReminder}
              className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 w-full"
            >
              Delete Reminder
            </button>
          </>
        ) : (
          <button
            onClick={handleAddReminder}
            className="bg-rose-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-600 w-full"
          >
            Add Reminder + Email
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md max-w-4xl mx-auto">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev today next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          height="auto"
          eventClick={handleEventClick}
        />
      </div>
    </div>
  );
};

export default Reminders;
