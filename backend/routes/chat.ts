import express from 'express';
import Message from '../models/Message';

const router = express.Router();

// GET message history
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new message
router.post('/', async (req, res) => {
  const message = new Message(req.body);
  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
