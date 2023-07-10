import { Router } from 'express';
import { 
    getTags, 
    createTag,
    updateTag,
    deleteTag
    } from '../controllers/tag.controller.js';

const router = Router();

router.get('/', getTags);
router.post('/', createTag);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;