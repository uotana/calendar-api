import { Router } from 'express';
import { 
    getTags, 
    getTagById,
    createTag,
    updateTag,
    deleteTag
    } from '../controllers/tag.controller.js';

const router = Router();

router.get('/', getTags);
router.get('/:tag_id', getTagById);
router.post('/', createTag);
router.put('/:tag_id', updateTag);
router.delete('/:tag_id', deleteTag);

export default router;