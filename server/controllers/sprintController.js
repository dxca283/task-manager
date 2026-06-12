import asyncHandler from "express-async-handler";
import Sprint from "../models/sprintModel.js";
import Task from "../models/taskModel.js";

const createSprint = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, description, sprintGoal, startDate, endDate, deadline, status, appliedAlgorithm, autoScheduleEnabled } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ status: false, message: "Name, start date, and end date are required." });
    }

    const sprint = await Sprint.create({
      name,
      description,
      sprintGoal,
      startDate,
      endDate,
      deadline,
      status: status || "planning",
      createdBy: userId,
      appliedAlgorithm,
      autoScheduleEnabled
    });

    return res.status(201).json({ status: true, message: "Sprint created successfully.", sprint });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});

const getSprints = asyncHandler(async (req, res) => {
  try {
    const sprints = await Sprint.find()
      .populate("createdBy", "name title email")
      .sort({ createdAt: -1 });

    const sprintIds = sprints.map((s) => s._id);
    const tasks = await Task.aggregate([
      { $match: { sprintId: { $in: sprintIds }, isTrashed: false } },
      { $group: { _id: "$sprintId", count: { $sum: 1 } } }
    ]);

    const taskCountMap = tasks.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const sprintsWithCount = sprints.map(sprint => ({
      ...sprint.toObject(),
      taskCount: taskCountMap[sprint._id.toString()] || 0
    }));

    return res.status(200).json({ status: true, sprints: sprintsWithCount });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});

const getSprintById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const sprint = await Sprint.findById(id).populate("createdBy", "name title email");
    
    if (!sprint) {
       return res.status(404).json({ status: false, message: "Sprint not found." });
    }

    return res.status(200).json({ status: true, sprint });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});

const updateSprint = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, sprintGoal, startDate, endDate, deadline, status, appliedAlgorithm, autoScheduleEnabled } = req.body;

    const sprint = await Sprint.findById(id);

    if (!sprint) {
      return res.status(404).json({ status: false, message: "Sprint not found." });
    }

    sprint.name = name || sprint.name;
    sprint.description = description !== undefined ? description : sprint.description;
    sprint.sprintGoal = sprintGoal !== undefined ? sprintGoal : sprint.sprintGoal;
    sprint.startDate = startDate || sprint.startDate;
    sprint.endDate = endDate || sprint.endDate;
    sprint.deadline = deadline !== undefined ? deadline : sprint.deadline;
    sprint.status = status || sprint.status;
    sprint.appliedAlgorithm = appliedAlgorithm !== undefined ? appliedAlgorithm : sprint.appliedAlgorithm;
    sprint.autoScheduleEnabled = autoScheduleEnabled !== undefined ? autoScheduleEnabled : sprint.autoScheduleEnabled;

    await sprint.save();

    return res.status(200).json({ status: true, message: "Sprint updated successfully.", sprint });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});

const deleteSprint = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    const sprint = await Sprint.findById(id);
    if (!sprint) {
       return res.status(404).json({ status: false, message: "Sprint not found." });
    }

    await Sprint.findByIdAndDelete(id);

    // Unlink tasks from this sprint
    await Task.updateMany({ sprintId: id }, { $unset: { sprintId: "" } });

    return res.status(200).json({ status: true, message: "Sprint deleted successfully." });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});

export { createSprint, getSprints, getSprintById, updateSprint, deleteSprint };
