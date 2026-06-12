import Task from "../models/taskModel.js";
import normalizeTasksHelper from "../services/normalizeTasksHelper.js";
import fcfs from "../services/algorithms/fcfs.js";
import sjf from "../services/algorithms/sjf.js";
import priority from "../services/algorithms/priority.js";
import roundRobin from "../services/algorithms/roundRobin.js";

export const runAlgorithm = async (req, res) => {
  try {
    const { algorithm, quantum, sprintId } = req.body;

    // validate algorithm
    if (!algorithm) {
      return res.status(400).json({
        message: "Algorithm is required",
      });
    }

    if (!sprintId) {
      return res.status(400).json({
        message: "Sprint ID is required",
      });
    }

    // validate quantum
    if (algorithm === "ROUND_ROBIN" && (!quantum || quantum <= 0)) {
      return res.status(400).json({
        message: "Quantum must be greater than 0",
      });
    }

    // lấy tasks chưa completed trong sprint được chọn
    const tasks = await Task.find({
      sprintId: sprintId,
      stage: {
        $ne: "completed",
      },
      isTrashed: false,
    });

    // không có task
    if (tasks.length === 0) {
      return res.status(400).json({
        message: "No tasks available in this sprint",
      });
    }

    // normalize business tasks
    const normalizedTasks = normalizeTasksHelper(tasks);

    let result;

    switch (algorithm) {
      case "FCFS":
        result = fcfs(normalizedTasks);
        break;

      case "SJF":
        result = sjf(normalizedTasks);
        break;

      case "PRIORITY":
        result = priority(normalizedTasks);
        break;

      case "ROUND_ROBIN":
        result = roundRobin(normalizedTasks, quantum);
        break;

      default:
        return res.status(400).json({
          message: "Invalid scheduling algorithm",
        });
    }

    return res.status(200).json({
      success: true,

      totalTasks: normalizedTasks.length,

      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const compareAlgorithms = async (req, res) => {
  try {
    const { sprintId, quantum } = req.body;

    if (!sprintId) {
      return res.status(400).json({
        message: "Sprint ID is required",
      });
    }

    if (!quantum || quantum <= 0) {
      return res.status(400).json({
        message: "Quantum must be greater than 0 for Round Robin",
      });
    }

    const tasks = await Task.find({
      sprintId: sprintId,
      stage: {
        $ne: "completed",
      },
      isTrashed: false,
    });

    if (tasks.length === 0) {
      return res.status(400).json({
        message: "No tasks available in this sprint",
      });
    }

    const normalizedTasks = normalizeTasksHelper(tasks);

    // Run algorithms with deep cloned tasks to prevent mutation side-effects
    const fcfsResult = fcfs(JSON.parse(JSON.stringify(normalizedTasks)));
    const sjfResult = sjf(JSON.parse(JSON.stringify(normalizedTasks)));
    const priorityResult = priority(JSON.parse(JSON.stringify(normalizedTasks)));
    const rrResult = roundRobin(JSON.parse(JSON.stringify(normalizedTasks)), quantum);

    const results = [
      {
        algorithm: "FCFS",
        averageWaitingTime: fcfsResult.metrics.averageWaitingTime,
        averageTurnaroundTime: fcfsResult.metrics.averageTurnaroundTime,
        ...fcfsResult,
      },
      {
        algorithm: "SJF",
        averageWaitingTime: sjfResult.metrics.averageWaitingTime,
        averageTurnaroundTime: sjfResult.metrics.averageTurnaroundTime,
        ...sjfResult,
      },
      {
        algorithm: "Priority",
        averageWaitingTime: priorityResult.metrics.averageWaitingTime,
        averageTurnaroundTime: priorityResult.metrics.averageTurnaroundTime,
        ...priorityResult,
      },
      {
        algorithm: "Round Robin",
        quantum,
        averageWaitingTime: rrResult.metrics.averageWaitingTime,
        averageTurnaroundTime: rrResult.metrics.averageTurnaroundTime,
        ...rrResult,
      },
    ];

    return res.status(200).json({
      success: true,
      totalTasks: normalizedTasks.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
