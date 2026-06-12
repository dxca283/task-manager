const priorityMap = {
  urgent: 1,
  high: 2,
  medium: 3,
  normal: 4,
  low: 5,
};

const normalizeTask = (task, minCreatedAt) => {
  return {
    id: task._id.toString(),

    title: task.title,

    // createdAt -> arrivalTime (relative time in hours from earliest task)
    arrivalTime:
      (new Date(task.createdAt).getTime() - minCreatedAt) / (1000 * 60 * 60),

    // estimatedHours -> burstTime
    burstTime: task.estimatedHours,

    // string -> number
    priority: priorityMap[task.priority] || 4,

    stage: task.stage,
  };
};

export default normalizeTask;
