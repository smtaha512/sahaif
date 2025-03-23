const task = `
  ++localId,
  id,
  name,
  startedAt,
  endedAt,
  createdAt,
  updatedAt
`;

/**
 * Represents the TasksDatabase, which extends the Dexie library to manage
 * IndexedDB storage for tasks and drafts.
 *
 * @typedef {import("https://unpkg.com/dexie/dist/dexie.js").Dexie} Dexie
 * @extends Dexie
 *
 * @class TasksDatabase
 * @constructor
 * Initializes the database with a name "TasksDatabase" and defines the schema
 * for version 1, including two object stores: `tasks` and `draft`.
 */
export class TasksDatabase extends Dexie {
  constructor() {
    super("TasksDatabase");

    this.version(1).stores({
      tasks: task,
      draft: task,
    });
  }
}
