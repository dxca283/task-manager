import calculateMetrics from "../calculateMetrics.js";
import PriorityQueue from "../dataStructures/PriorityQueue.js";

const roundToTwo = (num) => Math.round(num * 100) / 100;

const priority = (tasks) => {
  const sortedTasks = [...tasks].sort((a, b) => a.arrivalTime - b.arrivalTime);

  // Priority Queue for O(log n) enqueue/dequeue based on priority (lower value = higher priority)
  const readyQueue = new PriorityQueue((a, b) => a.priority - b.priority); 
  const gantt = []; // Gantt chart representation
  const result = []; // Final processed tasks

  let currentTime = 0; // Current time in the simulation
  let taskIndex = 0; // Index to track tasks in the sorted list

  while (taskIndex < sortedTasks.length || !readyQueue.isEmpty()) {
    // Enqueue tasks that have arrived by the current time
    while (
      taskIndex < sortedTasks.length &&
      sortedTasks[taskIndex].arrivalTime <= currentTime
    ) {
      readyQueue.enqueue(sortedTasks[taskIndex]);
      taskIndex++;
    }

    if (readyQueue.isEmpty()) {
      // If no tasks are ready, CPU is idle, move to the next task arrival time
      currentTime = sortedTasks[taskIndex].arrivalTime;
      continue;
    }

    // Select the task with the highest priority (lowest priority value) from the ready queue in O(log n)
    const task = readyQueue.dequeue();

    const startTime = Math.max(currentTime, task.arrivalTime);
    const finishTime = startTime + task.burstTime;
    const waitingTime = startTime - task.arrivalTime;
    const turnaroundTime = finishTime - task.arrivalTime;

    const processedTask = {
      ...task,
      arrivalTime: roundToTwo(task.arrivalTime),
      startTime: roundToTwo(startTime),
      finishTime: roundToTwo(finishTime),
      waitingTime: roundToTwo(waitingTime),
      turnaroundTime: roundToTwo(turnaroundTime),
    };

    result.push(processedTask);

    gantt.push({
      taskId: task.id,
      startTime: roundToTwo(startTime),
      endTime: roundToTwo(finishTime),
    });

    currentTime = finishTime; // Update current time to the finish time of the task
  }

  const metrics = calculateMetrics(result);

  return {
    algorithm: "Priority",
    gantt,
    metrics,
    tasks: result,
  };
};

export default priority;
