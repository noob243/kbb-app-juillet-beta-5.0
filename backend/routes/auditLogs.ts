import express from 'express';
import AuditLog from '../models/AuditLog';
const router = express.Router();

router.get('/', async (req, res) => {
  try { res.json(await AuditLog.find().sort({ timestamp: -1 })); }
  catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try { res.status(201).json(await new AuditLog(req.body).save()); }
  catch (err: any) { res.status(400).json({ message: err.message }); }
});

export default router;
