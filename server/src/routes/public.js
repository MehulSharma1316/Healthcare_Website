import { Router } from "express";
import Test from "../models/Test.js";
import Package from "../models/Package.js";
import Booking from "../models/Booking.js";
import Poster from "../models/Poster.js";

const router = Router();

// Fetch active tests with optional category filter
router.get("/tests", async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { active: true };
    if (category) filter.category = category;
    const tests = await Test.find(filter).sort({ name: 1 });
    res.json(tests);
  } catch (err) {
    next(err);
  }
});

// Fetch active packages
router.get("/packages", async (_req, res, next) => {
  try {
    const packages = await Package.find({ active: true }).sort({ name: 1 });
    res.json(packages);
  } catch (err) {
    next(err);
  }
});

// Fetch strictly popular active packages
router.get("/packages/popular", async (_req, res, next) => {
  try {
    const packages = await Package.find({ active: true, isPopular: true }).limit(3).sort({ name: 1 });
    res.json(packages);
  } catch (err) {
    next(err);
  }
});

// Create a booking
router.post("/booking", async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

// Fetch active posters
router.get("/posters", async (_req, res, next) => {
  try {
    const posters = await Poster.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json(posters);
  } catch (err) {
    next(err);
  }
});

export default router;
