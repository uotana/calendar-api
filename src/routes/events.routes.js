import { Router } from 'express';
import {
     createEvent,
     deleteEvent,
     getEventById,
     getEvents,
     getEventsByCalendarId,
     updateEvent
} from '../controllers/event.controller';

const router = Router();

router.get('/', getEvents);
router.get('/:event_id', getEventById);
router.get('/:calendar_id', getEventsByCalendarId)
router.post('/', createEvent);
router.put('/:event_id', updateEvent);
router.delete('/:event_id', deleteEvent);

export default router;