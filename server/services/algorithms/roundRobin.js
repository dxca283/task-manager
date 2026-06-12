import calculateMetrics from "../calculateMetrics.js";
import Queue from "../dataStructures/Queue.js";

const roundToTwo = (num) => Math.round(num * 100) / 100;

const roundRobin = (tasks, quantum) => {
  if (!tasks || tasks.length === 0) {
    return {
      algorithm: "Round Robin",
      quantum,
      gantt: [],
      tasks: [],
      metrics: {},
    };
  }

  if (quantum <= 0) {
    throw new Error("Quantum must be greater than 0");
  }

  // Sort tasks by arrival time
  const sortedTasks = [...tasks]
    .sort((a, b) => a.arrivalTime - b.arrivalTime)
    .map((task) => ({
      ...task,
      remainingTime: task.burstTime,
      finishTime: 0,
      turnaroundTime: 0,
      waitingTime: 0,
    }));

  const gantt = [];
  // Circular Queue behavior using custom Queue data structure for O(1) operations
  const readyQueue = new Queue();

  let currentTime = 0;
  let completed = 0;
  let taskIndex = 0;

  const n = sortedTasks.length;

  // Add first arriving tasks
  while (taskIndex < n && sortedTasks[taskIndex].arrivalTime <= currentTime) {
    readyQueue.enqueue(taskIndex);
    taskIndex++;
  }

  while (completed < n) {
    // If CPU idle
    if (readyQueue.isEmpty()) {
      currentTime = sortedTasks[taskIndex].arrivalTime;

      readyQueue.enqueue(taskIndex);
      taskIndex++;
    }

    const currentTaskIndex = readyQueue.dequeue();
    const task = sortedTasks[currentTaskIndex];

    const executeTime = Math.min(quantum, task.remainingTime);

    const startTime = currentTime;

    currentTime += executeTime;

    task.remainingTime -= executeTime;

    // Save gantt chart
    gantt.push({
      taskId: task.id,
      startTime: roundToTwo(startTime),
      endTime: roundToTwo(currentTime),
    });

    // Add newly arrived tasks
    while (taskIndex < n && sortedTasks[taskIndex].arrivalTime <= currentTime) {
      readyQueue.enqueue(taskIndex);
      taskIndex++;
    }

    // If task still has burst left
    if (task.remainingTime > 0) {
      readyQueue.enqueue(currentTaskIndex);
    } else {
      // Task completed
      completed++;

      task.finishTime = roundToTwo(currentTime);

      task.turnaroundTime = roundToTwo(task.finishTime - task.arrivalTime);

      task.waitingTime = roundToTwo(task.turnaroundTime - task.burstTime);
    }
  }

  // Round all values in sortedTasks
  const finalTasks = sortedTasks.map((task) => ({
    ...task,
    arrivalTime: roundToTwo(task.arrivalTime),
    startTime: roundToTwo(task.startTime || 0),
    finishTime: roundToTwo(task.finishTime),
    waitingTime: roundToTwo(task.waitingTime),
    turnaroundTime: roundToTwo(task.turnaroundTime),
  }));

  const metrics = calculateMetrics(finalTasks);

  return {
    algorithm: "Round Robin",
    quantum,
    gantt,
    metrics,
    tasks: finalTasks,
  };
};

export default roundRobin;
