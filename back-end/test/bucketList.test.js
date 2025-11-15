import { expect } from 'chai';
import BucketListModel from '../src/bucket/bucketListModel.js';

describe('BucketList Model', () => {
  
  beforeEach(() => {
    // Clear bucket list before each test
    const items = BucketListModel.getAll();
    items.forEach(item => BucketListModel.delete(item.id));
  });

  describe('create()', () => {
    it('should create a new bucket list item', () => {
      const itemData = {
        title: 'Visit Paris',
        location: 'France',
        description: 'See the Eiffel Tower'
      };
      
      const newItem = BucketListModel.create(itemData);
      
      expect(newItem).to.have.property('id');
      expect(newItem.title).to.equal('Visit Paris');
      expect(newItem.location).to.equal('France');
      expect(newItem.completed).to.equal(false);
    });

    it('should auto-increment IDs', () => {
      const item1 = BucketListModel.create({ title: 'Test 1', location: 'Location 1' });
      const item2 = BucketListModel.create({ title: 'Test 2', location: 'Location 2' });
      
      expect(item2.id).to.be.greaterThan(item1.id);
    });
  });

  describe('getAll()', () => {
    it('should return empty array when no items', () => {
      const items = BucketListModel.getAll();
      expect(items).to.be.an('array');
      expect(items).to.have.length(0);
    });

    it('should return all bucket list items', () => {
      BucketListModel.create({ title: 'Test 1', location: 'Location 1' });
      BucketListModel.create({ title: 'Test 2', location: 'Location 2' });
      
      const items = BucketListModel.getAll();
      expect(items).to.have.length(2);
    });
  });

  describe('getById()', () => {
    it('should return item by ID', () => {
      const created = BucketListModel.create({ title: 'Test', location: 'Location' });
      const found = BucketListModel.getById(created.id);
      
      expect(found).to.deep.equal(created);
    });

    it('should return undefined for non-existent ID', () => {
      const found = BucketListModel.getById(9999);
      expect(found).to.be.undefined;
    });
  });

  describe('update()', () => {
    it('should update an existing item', () => {
      const created = BucketListModel.create({ title: 'Test', location: 'Location' });
      const updated = BucketListModel.update(created.id, { completed: true });
      
      expect(updated.completed).to.equal(true);
      expect(updated.title).to.equal('Test');
    });

    it('should return null for non-existent ID', () => {
      const result = BucketListModel.update(9999, { completed: true });
      expect(result).to.be.null;
    });
  });

  describe('delete()', () => {
    it('should delete an item by ID', () => {
      const created = BucketListModel.create({ title: 'Test', location: 'Location' });
      const deleted = BucketListModel.delete(created.id);
      
      expect(deleted).to.deep.equal(created);
      expect(BucketListModel.getAll()).to.have.length(0);
    });

    it('should return null for non-existent ID', () => {
      const result = BucketListModel.delete(9999);
      expect(result).to.be.null;
    });
  });

});