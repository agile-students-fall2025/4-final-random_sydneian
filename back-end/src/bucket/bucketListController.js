import BucketListModel from './bucketListModel.js';

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

export default bucketListController;