import express from 'express';
import bucketListController from './bucketListController.js';

const router = express.Router();

router.get('/', bucketListController.getAllItems);
router.get('/:id', bucketListController.getItemById);
router.post('/', bucketListController.createItem);
router.delete('/:id', bucketListController.deleteItem);
router.put('/:id', bucketListController.updateItem);

export default router;