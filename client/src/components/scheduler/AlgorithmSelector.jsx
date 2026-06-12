import React from "react";

const AlgorithmSelector = ({
  algorithm,
  setAlgorithm,
  quantum,
  setQuantum,
  onRun,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label htmlFor="algorithm" className="font-medium">
          Algorithm:
        </label>
        <select
          id="algorithm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="border rounded p-2"
        >
          <option value="FCFS">FCFS</option>
          <option value="SJF">SJF</option>
          <option value="PRIORITY">PRIORITY</option>
          <option value="ROUND_ROBIN">ROUND ROBIN</option>
        </select>
      </div>

      {algorithm === "ROUND_ROBIN" && (
        <div className="flex items-center space-x-4">
          <label htmlFor="quantum" className="font-medium">
            Quantum:
          </label>
          <input
            id="quantum"
            type="number"
            value={quantum}
            onChange={(e) => setQuantum(Number(e.target.value))}
            className="border rounded p-2 w-20"
          />
        </div>
      )}

      <button
        onClick={onRun}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? "Running..." : "Run Scheduler"}
      </button>
    </div>
  );
};

export default AlgorithmSelector;
