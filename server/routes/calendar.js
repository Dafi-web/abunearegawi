const express = require('express');
const { body, validationResult } = require('express-validator');
const CalendarEvent = require('../models/CalendarEvent');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all calendar events
router.get('/', async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};
    
    if (start && end) {
      filter.start = { $gte: new Date(start) };
      filter.end = { $lte: new Date(end) };
    }
    
    const events = await CalendarEvent.find(filter)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .sort({ start: 1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create calendar event (admin only)
router.post('/', adminAuth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('start').isISO8601().withMessage('Valid start date is required'),
  body('end').isISO8601().withMessage('Valid end date is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = new CalendarEvent({
      ...req.body,
      createdBy: req.user._id,
    });
    await event.save();
    await event.populate('createdBy', 'name email');
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update calendar event (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const event = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete calendar event (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const event = await CalendarEvent.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join event (authenticated users)
router.post('/:id/join', auth, async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.attendees.includes(req.user._id)) {
      event.attendees.push(req.user._id);
      await event.save();
    }

    await event.populate('attendees', 'name email');
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


