const express = require('express');
const nodemailer = require('nodemailer');
const welcomeTemplate = require('./emailTemplates/welcomeTemplate');
require('dotenv').config();

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-welcome-email', async (req, res) => {
  const { email, name, role } = req.body;

  try {
    await transporter.sendMail({
      from: `"MRI Analysis" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to MRI Analysis!',
      html: welcomeTemplate(name, role),
    });

    res.status(200).json({ message: 'Email sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Email service running on port ${PORT}`));
