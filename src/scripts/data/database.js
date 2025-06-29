import { openDB } from 'idb';

const DATABASE_NAME = 'storyfati';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'saved-reports';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    }
  },
});

export const StoryIDB = {
  async getAll() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async get(id) {
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async put(story) {
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  async delete(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};
