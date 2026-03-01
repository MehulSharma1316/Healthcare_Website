import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Test from "../models/Test.js";
import Package from "../models/Package.js";
import Booking from "../models/Booking.js";
import Admin from "../models/Admin.js";
import Poster from "../models/Poster.js";
import { auth } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await admin.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "12h" });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

// Tests CRUD
router.get("/tests", auth, async (_req, res, next) => {
  try {
    const items = await Test.find().sort({ name: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post("/tests", auth, async (req, res, next) => {
  try {
    const created = await Test.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put("/tests/:id", auth, async (req, res, next) => {
  try {
    const updated = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/tests/:id", auth, async (req, res, next) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// Packages CRUD
router.get("/packages", auth, async (_req, res, next) => {
  try {
    const items = await Package.find().sort({ name: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post("/packages", auth, async (req, res, next) => {
  try {
    if (req.body.isPopular) {
      const popularCount = await Package.countDocuments({ isPopular: true });
      if (popularCount >= 3) {
        return res.status(400).json({ message: "Maximum 3 popular packages allowed." });
      }
    }
    const created = await Package.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put("/packages/:id", auth, async (req, res, next) => {
  try {
    if (req.body.isPopular) {
      const popularCount = await Package.countDocuments({ isPopular: true, _id: { $ne: req.params.id } });
      if (popularCount >= 3) {
        return res.status(400).json({ message: "Maximum 3 popular packages allowed." });
      }
    }
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/packages/:id", auth, async (req, res, next) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// Bookings view
router.get("/bookings", auth, async (_req, res, next) => {
  try {
    const items = await Booking.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Posters CRUD
router.get("/posters", auth, async (_req, res, next) => {
  try {
    const items = await Poster.find().populate("packageId", "name").sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post("/posters", auth, async (req, res, next) => {
  try {
    const created = await Poster.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put("/posters/:id", auth, async (req, res, next) => {
  try {
    const updated = await Poster.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/posters/:id", auth, async (req, res, next) => {
  try {
    await Poster.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post("/posters/upload", auth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

export default router;
