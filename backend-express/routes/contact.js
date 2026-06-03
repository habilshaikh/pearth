const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ContactMessage } = require('../models');
const { serializeContactMessage } = require('../lib/serializers');

const router = express.Router();

const inquiryUploadsDir = path.join(__dirname, '..', 'uploads', 'inquiries');
if (!fs.existsSync(inquiryUploadsDir)) {
  fs.mkdirSync(inquiryUploadsDir, { recursive: true });
}

const inquiryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, inquiryUploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const inquiryUpload = multer({
  storage: inquiryStorage,
  fileFilter: (req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf' && path.extname(file.originalname).toLowerCase() === '.pdf';
    if (isPdf) {
      return cb(null, true);
    }
    cb(new Error('Only PDF files are allowed'));
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const createTransporter = () => nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// GET /api/contact - Get all messages (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    res.json(messages.map(serializeContactMessage));
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// POST /api/contact - Submit contact form (public)
router.post('/', inquiryUpload.single('drawing'), async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const drawing = req.file;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // ✅ FIX 1: Format match kiya frontend regex se — emoji + path dono save honge
    const drawingPath = drawing
      ? `/uploads/inquiries/${drawing.filename}`
      : null;

    const attachmentNote = drawing
      ? `\n\n📎 *Drawing Attached:* ${drawing.originalname} (${drawingPath})`
      : '';

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message: `${message}${attachmentNote}`,
      drawingName: drawing ? drawing.originalname : '',
      drawingPath: drawingPath || '',
    });

    let emailSent = false;
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your_app_password_here') {
        const transporter = createTransporter();

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `SAI TECH Contact: ${subject || 'New Inquiry'}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject || 'Not provided'}</p>
            <p><strong>Drawing:</strong> ${drawing ? drawing.originalname : 'Not provided'}</p>
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><em>Sent from SAI TECH website contact form</em></p>
          `,
        };

        if (drawing) {
          mailOptions.attachments = [
            {
              filename: drawing.originalname,
              path: drawing.path,
              contentType: 'application/pdf',
            },
          ];
        }

        await transporter.sendMail(mailOptions);
        emailSent = true;
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
    }

    // ✅ FIX 2: Response mein drawing_path bhi bhejo
    res.status(201).json({
      message: 'Message sent successfully',
      emailSent,
      data: {
        id: contactMessage._id.toString(),
        drawing: drawing ? drawing.originalname : null,
        drawing_path: drawingPath,
      },
      drawing: drawing ? drawing.originalname : null,
      drawing_path: drawingPath,
    });
  } catch (error) {
    console.error('Submit contact form error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// PUT /api/contact/:id/read - Mark message as read (admin only)
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(serializeContactMessage(message));
  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE /api/contact/:id - Delete message (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const deletedMessage = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
