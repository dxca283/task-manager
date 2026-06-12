const calculateMetrics = (tasks) => {
  const totalTasks = tasks.length;

  const totalWaitingTime = tasks.reduce(
    (sum, task) => sum + task.waitingTime,
    0,
  );

  const totalTurnaroundTime = tasks.reduce(
    (sum, task) => sum + task.turnaroundTime,
    0,
  );

  const averageWaitingTime = totalWaitingTime / totalTasks;

  const averageTurnaroundTime = totalTurnaroundTime / totalTasks;

  // tổng burst time
  const totalBurstTime = tasks.reduce((sum, task) => sum + task.burstTime, 0);

  // finish time lớn nhất
  const totalExecutionTime = Math.max(...tasks.map((task) => task.finishTime));

  // throughput
  const throughput = totalTasks / totalExecutionTime;

  // cpu utilization
  const cpuUtilization = (totalBurstTime / totalExecutionTime) * 100;

  return {
    averageWaitingTime: Math.round(averageWaitingTime * 100) / 100,
    averageTurnaroundTime: Math.round(averageTurnaroundTime * 100) / 100,
    throughput: Math.round(throughput * 100) / 100,
    cpuUtilization: Math.round(cpuUtilization * 100) / 100,
  };
};

export default calculateMetrics;
