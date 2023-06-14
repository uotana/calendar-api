import { Router } from 'express';
import {
     createCalendar,
     getCalendarById,
     getCalendarByUserId,
     getCalendars
} from '../controllers/calendar.controller';

const router = Router();

router.get('/', getCalendars);
router.get('/:calendar_id', getCalendarById);
router.get('/:user_id', getCalendarByUserId);
router.post('/', createCalendar);

export default router;