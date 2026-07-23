import express from 'express';
import Avocat from '../models/Avocat';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const avocats = await Avocat.find();
    res.json(avocats);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const avocat = new Avocat(req.body);
  try {
    const newAvocat = await avocat.save();
    res.status(201).json(newAvocat);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedAvocat = await Avocat.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedAvocat) return res.status(404).json({ message: 'Avocat not found' });
    res.json(updatedAvocat);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Avocat.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ message: 'Avocat not found' });
    res.json({ message: 'Avocat deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
