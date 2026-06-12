import React from "react";

const ExecutionTable = ({ tasks }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h3 className="text-lg font-medium mb-4">Execution Table</h3>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Task</th>
              <th className="border border-gray-300 px-4 py-2">Arrival Time</th>
              <th className="border border-gray-300 px-4 py-2">Burst Time</th>
              <th className="border border-gray-300 px-4 py-2">Start Time</th>
              <th className="border border-gray-300 px-4 py-2">Finish Time</th>
              <th className="border border-gray-300 px-4 py-2">Waiting Time</th>
              <th className="border border-gray-300 px-4 py-2">
                Turnaround Time
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {task.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.arrivalTime}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.burstTime}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.startTime}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.finishTime}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.waitingTime}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.turnaroundTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExecutionTable;
