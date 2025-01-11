// dexieDB.js
import Dexie from 'dexie';

const db = new Dexie('ChatroomDB');

db.version(1).stores({
  messages: '++id,text', // Auto-incrementing id and text field
});

export const saveMessage = async (message) => {
  await db.messages.add(message);
};

export const getMessages = async () => {
  return await db.messages.toArray();
};

export const clearMessages = async () => {
  await db.messages.clear(); // Clear all messages from the Dexie database
};
