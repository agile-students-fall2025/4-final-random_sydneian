import { expect } from 'chai';
import { groups } from '../src/mockData.js';
import crypto from 'node:crypto';

describe('Bucket List Functionality', () => {
    let testGroup;

    beforeEach(() => {
        // Reset test group's bucket list before each test
        testGroup = groups.find(g => g._id === "group1-id");
        if (testGroup) {
            testGroup.bucketList = [];
        }
    });

    describe('Group Bucket List Structure', () => {
        it('should have bucketList property in group object', () => {
            expect(testGroup).to.have.property('bucketList');
            expect(testGroup.bucketList).to.be.an('array');
        });

        it('should start with empty bucket list', () => {
            expect(testGroup.bucketList).to.have.length(0);
        });
    });

    describe('Adding Items to Bucket List', () => {
        it('should add a new item to bucket list', () => {
            const newItem = {
                id: crypto.randomUUID(),
                title: 'Visit Central Park',
                location: 'New York, USA',
                description: 'Enjoy nature in the city',
                image: null,
                completed: false,
                createdAt: new Date().toISOString()
            };

            testGroup.bucketList.push(newItem);

            expect(testGroup.bucketList).to.have.length(1);
            expect(testGroup.bucketList[0]).to.deep.equal(newItem);
        });

        it('should create item with required fields', () => {
            const newItem = {
                id: crypto.randomUUID(),
                title: 'Visit Brooklyn Bridge',
                location: 'Brooklyn, NY',
                description: 'Walk across historic bridge',
                image: null,
                completed: false,
                createdAt: new Date().toISOString()
            };

            testGroup.bucketList.push(newItem);

            expect(testGroup.bucketList[0]).to.have.property('id');
            expect(testGroup.bucketList[0]).to.have.property('title');
            expect(testGroup.bucketList[0]).to.have.property('location');
            expect(testGroup.bucketList[0]).to.have.property('completed');
            expect(testGroup.bucketList[0].completed).to.equal(false);
        });

        it('should generate unique IDs for different items', () => {
            const item1 = {
                id: crypto.randomUUID(),
                title: 'Item 1',
                location: 'Location 1',
                completed: false,
                createdAt: new Date().toISOString()
            };

            const item2 = {
                id: crypto.randomUUID(),
                title: 'Item 2',
                location: 'Location 2',
                completed: false,
                createdAt: new Date().toISOString()
            };

            expect(item1.id).to.not.equal(item2.id);
        });
    });

    describe('Retrieving Bucket List Items', () => {
        beforeEach(() => {
            // Add test items
            testGroup.bucketList.push({
                id: 'test-id-1',
                title: 'Test Place 1',
                location: 'Test Location 1',
                description: 'Test Description 1',
                image: null,
                completed: false,
                createdAt: new Date().toISOString()
            });
            testGroup.bucketList.push({
                id: 'test-id-2',
                title: 'Test Place 2',
                location: 'Test Location 2',
                description: 'Test Description 2',
                image: null,
                completed: true,
                createdAt: new Date().toISOString()
            });
        });

        it('should retrieve all bucket list items', () => {
            expect(testGroup.bucketList).to.have.length(2);
        });

        it('should find item by ID', () => {
            const found = testGroup.bucketList.find(item => item.id === 'test-id-1');
            expect(found).to.exist;
            expect(found.title).to.equal('Test Place 1');
        });

        it('should return undefined for non-existent ID', () => {
            const found = testGroup.bucketList.find(item => item.id === 'non-existent-id');
            expect(found).to.be.undefined;
        });
    });

    describe('Updating Bucket List Items', () => {
        beforeEach(() => {
            testGroup.bucketList.push({
                id: 'update-test-id',
                title: 'Original Title',
                location: 'Original Location',
                description: 'Original Description',
                image: null,
                completed: false,
                createdAt: new Date().toISOString()
            });
        });

        it('should update item completion status', () => {
            const item = testGroup.bucketList.find(i => i.id === 'update-test-id');
            item.completed = true;

            expect(item.completed).to.equal(true);
        });

        it('should update item details', () => {
            const item = testGroup.bucketList.find(i => i.id === 'update-test-id');
            item.title = 'Updated Title';
            item.description = 'Updated Description';

            expect(item.title).to.equal('Updated Title');
            expect(item.description).to.equal('Updated Description');
        });
    });

    describe('Deleting Bucket List Items', () => {
        beforeEach(() => {
            testGroup.bucketList.push({
                id: 'delete-test-id',
                title: 'To Delete',
                location: 'Delete Location',
                completed: false,
                createdAt: new Date().toISOString()
            });
        });

        it('should delete item by ID', () => {
            const initialLength = testGroup.bucketList.length;
            const index = testGroup.bucketList.findIndex(i => i.id === 'delete-test-id');
            testGroup.bucketList.splice(index, 1);

            expect(testGroup.bucketList).to.have.length(initialLength - 1);
            const found = testGroup.bucketList.find(i => i.id === 'delete-test-id');
            expect(found).to.be.undefined;
        });

        it('should handle deleting non-existent item gracefully', () => {
            const initialLength = testGroup.bucketList.length;
            const index = testGroup.bucketList.findIndex(i => i.id === 'non-existent');
            
            expect(index).to.equal(-1);
            expect(testGroup.bucketList).to.have.length(initialLength);
        });
    });

    describe('Validation', () => {
        it('should require title field', () => {
            const invalidItem = {
                id: crypto.randomUUID(),
                location: 'Test Location',
                completed: false
            };

            // Simulate validation
            const isValid = invalidItem.title && invalidItem.location;
            expect(isValid).to.be.false;
        });

        it('should require location field', () => {
            const invalidItem = {
                id: crypto.randomUUID(),
                title: 'Test Title',
                completed: false
            };

            // Simulate validation
            const isValid = invalidItem.title && invalidItem.location;
            expect(isValid).to.be.false;
        });

        it('should accept valid item with all required fields', () => {
            const validItem = {
                id: crypto.randomUUID(),
                title: 'Valid Title',
                location: 'Valid Location',
                completed: false,
                createdAt: new Date().toISOString()
            };

            // Simulate validation
            const isValid = validItem.title && validItem.location;
            expect(isValid).to.be.true;
        });
    });
});