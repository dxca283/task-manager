import React, { useMemo } from "react";

const GanttChart = ({ gantt, tasksData }) => {
  const tasks = useMemo(() => {
    if (!gantt || gantt.length === 0) return [];

    // Create a dictionary for O(1) title lookups
    const taskDict = {};
    if (tasksData) {
      tasksData.forEach((t) => {
        taskDict[t.id] = t.title;
      });
    }

    return gantt.map((task, index) => {
      // Ensure end time is strictly greater than start time for visual rendering
      const safeEndTime = Math.max(task.startTime + 0.1, task.endTime);
      
      // Look up title from tasksData using taskId, fallback to existing title or index
      const actualTitle = taskDict[task.taskId] || task.title || `Task ${index + 1}`;

      return {
        ...task,
        startTime: task.startTime,
        endTime: safeEndTime,
        name: actualTitle,
        id: `${task.taskId}-${index}`, // Unique ID for each execution slice
        color: `hsl(${(index * 50) % 360}, 70%, 50%)`,
      };
    });
  }, [gantt, tasksData]);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-lg font-medium mb-4">Gantt Chart</h3>
        <p className="text-sm text-gray-500">No data available to display Gantt chart.</p>
      </div>
    );
  }

  // Calculate total hours for timeline scale
  const maxEndTime = Math.max(...tasks.map((t) => t.endTime));
  const totalHours = Math.max(10, Math.ceil(maxEndTime + 1)); // Show at least 10 hours for spacing

  // Generate ticks for every hour
  const ticks = Array.from({ length: totalHours + 1 }, (_, i) => i);
  
  // Dynamic widths for horizontal scrolling
  const timelineMinWidth = totalHours * 50; // 50px per hour
  const leftPanelWidth = 280; // 160(Task) + 60(Start) + 60(End)
  const chartMinWidth = leftPanelWidth + timelineMinWidth;

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            height: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Execution Timeline</h3>
        <span className="text-sm text-gray-500 italic">Hour Offset Timeline</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 custom-scrollbar pb-2">
        <div style={{ minWidth: `${chartMinWidth}px` }}>
          {/* Header Row */}
          <div className="flex bg-gray-50 text-gray-700 font-bold h-12 items-center border-b border-gray-200">
            <div className="px-3 truncate" style={{ width: "160px", minWidth: "160px" }}>Task</div>
            <div className="px-2 truncate text-center" style={{ width: "60px", minWidth: "60px" }}>Start</div>
            <div className="px-2 truncate text-center" style={{ width: "60px", minWidth: "60px" }}>End</div>
            
            {/* Timeline Axis Header */}
            <div className="flex-1 relative h-full border-l border-gray-200">
              {ticks.map((tick) => (
                <div
                  key={tick}
                  className="absolute top-0 bottom-0 border-l border-gray-200 text-xs text-gray-500 pl-1 pt-3"
                  style={{ left: `${(tick / totalHours) * 100}%` }}
                >
                  {tick}h
                </div>
              ))}
            </div>
          </div>

          {/* Data Rows */}
          <div className="flex flex-col">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex border-b border-gray-100 h-12 items-center hover:bg-gray-50 relative group transition-colors"
              >
                {/* Left Panel Data */}
                <div className="px-3 truncate text-gray-800 font-medium" style={{ width: "160px", minWidth: "160px" }} title={task.name}>
                  {task.name}
                </div>
                <div className="px-2 truncate text-center text-gray-600 text-sm" style={{ width: "60px", minWidth: "60px" }}>
                  {task.startTime}h
                </div>
                <div className="px-2 truncate text-center text-gray-600 text-sm" style={{ width: "60px", minWidth: "60px" }}>
                  {task.endTime}h
                </div>
                
                {/* Timeline Bar Area */}
                <div className="flex-1 relative h-full border-l border-gray-200">
                  {/* Vertical Grid Lines */}
                  {ticks.map((tick) => (
                    <div
                      key={tick}
                      className="absolute top-0 bottom-0 border-l border-gray-100"
                      style={{ left: `${(tick / totalHours) * 100}%` }}
                    ></div>
                  ))}

                  {/* Task Execution Bar */}
                  <div
                    className="absolute top-2 bottom-2 rounded-md shadow-sm opacity-90 transition-all hover:opacity-100 hover:shadow-md cursor-pointer flex items-center justify-center"
                    style={{
                      left: `${(task.startTime / totalHours) * 100}%`,
                      width: `${((task.endTime - task.startTime) / totalHours) * 100}%`,
                      backgroundColor: task.color,
                      minWidth: "4px", // Ensure very small tasks are visible
                    }}
                    title={`${task.name}: ${task.startTime}h - ${task.endTime}h`}
                  >
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
