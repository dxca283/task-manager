import normalizeTask from "./normalizeTask.js";

const normalizeTasks = (tasks) => {
  // Find earliest task createdAt time
  const minCreatedAt = Math.min(
    ...tasks.map((task) => new Date(task.createdAt).getTime()),
  );

  return tasks.map((task) => normalizeTask(task, minCreatedAt));
};

export default normalizeTasks;
