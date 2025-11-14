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

export default BucketListModel;