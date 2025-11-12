const bucketListItems = [];
let nextId = 1;

const BucketListModel = {
  getAll: () => bucketListItems,
  
  getById: (id) => bucketListItems.find(item => item.id === parseInt(id)),
  
  create: (itemData) => {
    const newItem = {
      id: nextId++,
      title: itemData.title,
      location: itemData.location,
      description: itemData.description,
      image: itemData.image || null,
      completed: false,
      createdAt: new Date().toISOString()
    };
    bucketListItems.push(newItem);
    return newItem;
  },
  
  delete: (id) => {
    const index = bucketListItems.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      return bucketListItems.splice(index, 1)[0];
    }
    return null;
  },
  
  update: (id, updates) => {
    const item = bucketListItems.find(item => item.id === parseInt(id));
    if (item) {
      Object.assign(item, updates);
      return item;
    }
    return null;
  }
};

module.exports = BucketListModel;


const BucketListModel = require('./bucketListModel');

const bucketListController = {
  getAllItems: (req, res) => {
    try {
      const items = BucketListModel.getAll();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch bucket list items' });
    }
  },

  getItemById: (req, res) => {
    try {
      const item = BucketListModel.getById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch item' });
    }
  },

  createItem: (req, res) => {
    try {
      const { title, location, description, image } = req.body;
      
      if (!title || !location) {
        return res.status(400).json({ error: 'Title and location are required' });
      }

      const newItem = BucketListModel.create({ title, location, description, image });
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create item' });
    }
  },

  deleteItem: (req, res) => {
    try {
      const deletedItem = BucketListModel.delete(req.params.id);
      if (!deletedItem) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.status(200).json({ message: 'Item deleted successfully', item: deletedItem });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete item' });
    }
  },

  updateItem: (req, res) => {
    try {
      const updatedItem = BucketListModel.update(req.params.id, req.body);
      if (!updatedItem) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update item' });
    }
  }
};

module.exports = bucketListController;

const express = require('express');
const router = express.Router();
const bucketListController = require('./bucketListController');

// GET all bucket list items
router.get('/', bucketListController.getAllItems);

// GET single bucket list item
router.get('/:id', bucketListController.getItemById);

// POST new bucket list item (triggered when + button is pressed)
router.post('/', bucketListController.createItem);

// DELETE bucket list item
router.delete('/:id', bucketListController.deleteItem);

// PUT/PATCH update bucket list item (e.g., mark as completed)
router.put('/:id', bucketListController.updateItem);

module.exports = router;

// ...existing code...
const bucketListRoutes = require('./bucketlist/bucketListRoutes');

// ...existing code...

app.use('/api/bucketlist', bucketListRoutes);

// ...existing code...