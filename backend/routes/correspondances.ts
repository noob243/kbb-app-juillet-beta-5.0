import express from 'express';
import Correspondance from '../models/Correspondance';
const router = express.Router();

router.get('/', async (req, res) => {
  try { res.json(await Correspondance.find().sort({ date: -1 })); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.status(201).json(await new Correspondance(req.body).save()); }
  catch (err: any) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Correspondance.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err: any) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Correspondance.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

export default router;
