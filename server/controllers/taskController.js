import asyncHandler from "express-async-handler";
import Notice from "../models/notis.js";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

const createTask = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.user;

    const {
      title,
      team,
      stage,
      date,
      priority,
      estimatedHours,
      sprintId,
      assets,
      links,
      description,
    } = req.body;

    // validation
    if (!title) {
      return res.status(400).json({
        status: false,
        message: "Title is required",
      });
    }

    if (!estimatedHours || estimatedHours <= 0) {
      return res.status(400).json({
        status: false,
        message: "Estimated hours must be greater than 0",
      });
    }

    // alert text
    let text = "New task has been assigned to you";

    if (team?.length > 1) {
      text += ` and ${team.length - 1} others.`;
    }

    text += ` The task priority is set to ${priority}.`;

    if (date) {
      text += ` Deadline: ${new Date(date).toDateString()}.`;
    }

    text += ` Please check and act accordingly.`;

    // activity log
    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    // normalize links
    let newLinks = [];

    if (links) {
      if (Array.isArray(links)) {
        newLinks = links;
      } else {
        newLinks = links.split(",").map((link) => link.trim());
      }
    }

    // create task
    const task = await Task.create({
      title,

      team: team || [],

      stage: stage?.toLowerCase() || "todo",

      date,

      priority: priority?.toLowerCase() || "normal",

      estimatedHours,
      sprintId: sprintId || null,

      assets: assets || [],

      activities: [activity],

      links: newLinks,

      description: description || "",
    });

    // create notice
    await Notice.create({
      team,
      text,
      task: task._id,
    });

    // assign task to users
    const users = await User.find({
      _id: team,
    });

    if (users?.length > 0) {
      for (const user of users) {
        await User.findByIdAndUpdate(user._id, {
          $push: {
            tasks: task._id,
          },
        });
      }
    }

    return res.status(201).json({
      status: true,

      message: "Task created successfully.",

      task,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

const duplicateTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const task = await Task.findById(id);

    //alert users of the task
    let text = "New task has been assigned to you";
    if (team.team?.length > 1) {
      text = text + ` and ${task.team?.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${
        task.priority
      } priority, so check and act accordingly. The task date is ${new Date(
        task.date,
      ).toDateString()}. Thank you!!!`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    const newTask = await Task.create({
      ...task,
      title: "Duplicate - " + task.title,
    });

    newTask.team = task.team;
    newTask.subTasks = task.subTasks;
    newTask.assets = task.assets;
    newTask.links = task.links;
    newTask.priority = task.priority;
    newTask.stage = task.stage;
    newTask.activities = activity;
    newTask.description = task.description;

    await newTask.save();

    await Notice.create({
      team: newTask.team,
      text,
      task: newTask._id,
    });

    res
      .status(200)
      .json({ status: true, message: "Task duplicated successfully." });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, date, team, stage, priority, estimatedHours, sprintId, assets, links, description } =
    req.body;

  try {
    const task = await Task.findById(id);

    let newLinks = [];

    if (links) {
      newLinks = links.split(",");
    }

    task.title = title;
    task.date = date;
    task.priority = priority.toLowerCase();
    if (estimatedHours) task.estimatedHours = estimatedHours;
    if (sprintId !== undefined) task.sprintId = sprintId || null;
    task.assets = assets;
    task.stage = stage.toLowerCase();
    task.team = team;
    task.links = newLinks;
    task.description = description;

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task duplicated successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

const updateTaskStage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    const task = await Task.findById(id);

    task.stage = stage.toLowerCase();

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task stage changed successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

const updateSubTaskStage = asyncHandler(async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;
    const { status } = req.body;

    await Task.findOneAndUpdate(
      {
        _id: taskId,
        "subTasks._id": subTaskId,
      },
      {
        $set: {
          "subTasks.$.isCompleted": status,
        },
      },
    );

    res.status(200).json({
      status: true,
      message: status
        ? "Task has been marked completed"
        : "Task has been marked uncompleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
});

const createSubTask = asyncHandler(async (req, res) => {
  const { title, tag, date } = req.body;
  const { id } = req.params;

  try {
    const newSubTask = {
      title,
      date,
      tag,
      isCompleted: false,
    };

    const task = await Task.findById(id);

    task.subTasks.push(newSubTask);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "SubTask added successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

const createMultipleTasks = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.user;
    const tasksData = req.body;

    if (!Array.isArray(tasksData) || tasksData.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Request body must be a non-empty array of tasks.",
      });
    }

    const createdTasks = [];

    for (const taskData of tasksData) {
      const {
        title,
        team,
        stage,
        date,
        priority,
        estimatedHours,
        sprintId,
        assets,
        links,
        description,
      } = taskData;

      if (!title || !estimatedHours || estimatedHours <= 0) {
        return res.status(400).json({
          status: false,
          message:
            "Each task must have a valid title and estimatedHours greater than 0.",
        });
      }

      let text = "New task has been assigned to you";
      if (team?.length > 1) {
        text += ` and ${team.length - 1} others.`;
      }
      text += ` The task priority is set to ${priority}.`;
      if (date) {
        text += ` Deadline: ${new Date(date).toDateString()}.`;
      }
      text += ` Please check and act accordingly.`;

      const activity = {
        type: "assigned",
        activity: text,
        by: userId,
      };

      let newLinks = [];
      if (links) {
        newLinks = Array.isArray(links)
          ? links
          : links.split(",").map((link) => link.trim());
      }

      const task = await Task.create({
        title,
        team: team || [],
        stage: stage?.toLowerCase() || "todo",
        date,
        priority: priority?.toLowerCase() || "normal",
        estimatedHours,
        sprintId: sprintId || null,
        assets: assets || [],
        activities: [activity],
        links: newLinks,
        description: description || "",
      });

      await Notice.create({
        team,
        text,
        task: task._id,
      });

      if (team?.length > 0) {
        for (const user of team) {
          await User.findByIdAndUpdate(user, {
            $push: { tasks: task._id },
          });
        }
      }

      createdTasks.push(task);
    }

    return res.status(201).json({
      status: true,
      message: "Tasks created successfully.",
      tasks: createdTasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

const getTasks = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { stage, isTrashed, search } = req.query;

  let query = { isTrashed: isTrashed ? true : false };

  if (!isAdmin) {
    query.team = { $all: [userId] };
  }
  if (stage) {
    query.stage = stage;
  }

  if (search) {
    const searchQuery = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { stage: { $regex: search, $options: "i" } },
        { priority: { $regex: search, $options: "i" } },
      ],
    };
    query = { ...query, ...searchQuery };
  }

  if (req.query.sprintId) {
    query.sprintId = req.query.sprintId;
  }

  let queryResult = Task.find(query)
    .populate({
      path: "team",
      select: "name title email",
    })
    .sort({ _id: -1 });

  const tasks = await queryResult;

  res.status(200).json({
    status: true,
    tasks,
  });
});

const getTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({
        path: "team",
        select: "name title role email",
      })
      .populate({
        path: "activities.by",
        select: "name",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch task", error);
  }
});

const postTaskActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { type, activity } = req.body;

  try {
    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };
    task.activities.push(data);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

const trashTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    res.status(200).json({
      status: true,
      message: `Task trashed successfully.`,
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

const deleteRestoreTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Task.findById(id);

      resp.isTrashed = false;

      resp.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } },
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

const dashboardStatistics = asyncHandler(async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    // Fetch all tasks from the database
    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isActive createdAt")
      .limit(10)
      .sort({ _id: -1 });

    // Group tasks by stage and calculate counts
    const groupedTasks = allTasks?.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    const graphData = Object.entries(
      allTasks?.reduce((result, task) => {
        const { priority } = task;
        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {}),
    ).map(([name, total]) => ({ name, total }));

    // Calculate total tasks
    const totalTasks = allTasks.length;
    const last10Task = allTasks?.slice(0, 10);

    // Combine results into a summary object
    const summary = {
      totalTasks,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupedTasks,
      graphData,
    };

    res
      .status(200)
      .json({ status: true, ...summary, message: "Successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
});

export {
  createSubTask,
  createTask,
  createMultipleTasks,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateSubTaskStage,
  updateTask,
  updateTaskStage,
};
