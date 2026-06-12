import React from "react";

const MetricsCards = ({ algorithm, metrics, totalTasks }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-lg font-medium">Algorithm</h3>
        <p className="text-xl font-bold">{algorithm}</p>
      </div>
      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-lg font-medium">Average Waiting Time</h3>
        <p className="text-xl font-bold">
          {metrics.averageWaitingTime.toFixed(2)}
        </p>
      </div>
      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-lg font-medium">Average Turnaround Time</h3>
        <p className="text-xl font-bold">
          {metrics.averageTurnaroundTime.toFixed(2)}
        </p>
      </div>
      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-lg font-medium">Total Tasks</h3>
        <p className="text-xl font-bold">{totalTasks}</p>
      </div>
    </div>
  );
};

export default MetricsCards;
