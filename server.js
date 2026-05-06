const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/feedbackDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const Feedback = mongoose.model("Feedback", {
  message: String,
  time: String
});

/* EMAIL */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bhaibhai11192766@gmail.com",
    pass: "ytyq ozcg pyke elgx"
  }
});

let otp = "";
let role = "";

/* SEND OTP */
app.post("/send-otp", (req, res) => {
  const { email, role: userRole } = req.body;

  role = userRole;

  otp = Math.floor(100000 + Math.random() * 900000).toString();

  console.log("OTP:", otp);

  transporter.sendMail({
    from: "YOUR_EMAIL",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`
  });

  res.send("OTP sent");
});

/* VERIFY OTP */
app.post("/verify-otp", (req, res) => {
  const { otp: userOtp } = req.body;

  if(userOtp === otp){
    if(role === "student"){
      res.json({ success: true, redirect: "student.html" });
    } else {
      res.json({ success: true, redirect: "teacher.html" });
    }
  } else {
    res.json({ success: false });
  }
});

/* SAVE FEEDBACK */
app.post("/feedback", async (req, res) => {
  await Feedback.create({
    message: req.body.message,
    time: new Date().toLocaleString()
  });

  res.send("Saved");
});

/* GET FEEDBACK */
app.get("/feedback", async (req, res) => {
  const data = await Feedback.find();
  res.json(data);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});