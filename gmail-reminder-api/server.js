const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Setup CORS to allow frontend URL
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // allow both dev ports
  methods: ["GET", "POST"],
}));

app.use(express.json());

app.post("/send-reminder", async (req, res) => {
  const { to, subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Dog360 Reminders <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Email sending failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Gmail Reminder API is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
