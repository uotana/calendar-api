import { Router } from 'express';
import {
     createEvent,
     deleteEvent,
     getEventById,
     getEvents,
     getEventsByTagId,
     updateEvent
} from '../controllers/event.controller.js';

const router = Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.get('/tag/:id', getEventsByTagId);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;