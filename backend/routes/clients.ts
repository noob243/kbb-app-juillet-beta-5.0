import express from 'express';
import Client from '../models/Client';

const router = express.Router();

// GET all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new client
router.post('/', async (req, res) => {
  const client = new Client(req.body);
  try {
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a client
router.put('/:id', async (req, res) => {
  try {
    const updatedClient = await Client.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedClient) return res.status(404).json({ message: 'Client not found' });
    res.json(updatedClient);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a client
router.delete('/:id', async (req, res) => {
  try {
    const result = await Client.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
