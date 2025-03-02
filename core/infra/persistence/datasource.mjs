export class TasksDatabase extends Dexie {
  constructor() {
    super("TasksDatabase");

    this.version(1).stores({
      tasks: `
        ++localId,
        id,
        name,
        startedAt,
        endedAt,
        createdAt,
        updatedAt
      `,
    });
  }
}
