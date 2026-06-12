import React, { useState } from "react";
import { toast } from "sonner";
import { 
  useRunSchedulerMutation, 
  useCompareSchedulersMutation 
} from "../redux/slices/api/schedulerApiSlice.js";
import { useGetSprintsQuery } from "../redux/slices/api/sprintApiSlice";
import AlgorithmSelector from "../components/scheduler/AlgorithmSelector";
import MetricsCards from "../components/scheduler/MetricsCards";
import GanttChart from "../components/scheduler/GanttChart";
import ExecutionTable from "../components/scheduler/ExecutionTable";

const Scheduler = () => {
  const [mode, setMode] = useState("single"); // 'single' | 'compare'

  // Single mode state
  const [algorithm, setAlgorithm] = useState("FCFS");
  const [quantum, setQuantum] = useState(2);
  
  // Compare mode state
  const [compareQuantum, setCompareQuantum] = useState(2);
  const [selectedDetailResult, setSelectedDetailResult] = useState(null);

  const [selectedSprint, setSelectedSprint] = useState("");
  
  const { data: sprintData, isLoading: isSprintsLoading } = useGetSprintsQuery();
  const [runScheduler, { data: singleData, isLoading: isSingleLoading, error: singleError }] = useRunSchedulerMutation();
  const [compareSchedulers, { data: compareData, isLoading: isCompareLoading, error: compareError }] = useCompareSchedulersMutation();

  const handleRunScheduler = () => {
    if (!selectedSprint) {
      toast.error("Please select a sprint first.");
      return;
    }
    const requestBody = { algorithm, sprintId: selectedSprint };
    if (algorithm === "ROUND_ROBIN") {
      requestBody.quantum = quantum;
    }
    runScheduler(requestBody);
  };

  const handleCompareAll = () => {
    if (!selectedSprint) {
      toast.error("Please select a sprint first.");
      return;
    }
    if (compareQuantum <= 0) {
      toast.error("Quantum must be greater than 0");
      return;
    }
    setSelectedDetailResult(null); // clear old details
    compareSchedulers({ sprintId: selectedSprint, quantum: compareQuantum });
  };

  // Helper for highlighting best metrics
  const getBestMetrics = () => {
    if (!compareData || !compareData.results) return { bestWait: -1, bestTurnaround: -1 };
    let bestWait = Infinity;
    let bestTurnaround = Infinity;

    compareData.results.forEach(res => {
      if (res.averageWaitingTime < bestWait) bestWait = res.averageWaitingTime;
      if (res.averageTurnaroundTime < bestTurnaround) bestTurnaround = res.averageTurnaroundTime;
    });

    return { bestWait, bestTurnaround };
  };

  const { bestWait, bestTurnaround } = getBestMetrics();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Task Scheduling Simulator</h1>
        <p className="text-gray-600">
          Visualize how different scheduling algorithms process enterprise
          tasks.
        </p>
      </header>

      {/* Sprint Selector */}
      <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
        <label className="block text-gray-700 font-bold mb-2 text-sm">Select Sprint to Schedule</label>
        {isSprintsLoading ? (
          <p className="text-sm text-gray-500">Loading sprints...</p>
        ) : (
          <select
            value={selectedSprint}
            onChange={(e) => setSelectedSprint(e.target.value)}
            className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">-- Choose a Sprint --</option>
            {sprintData?.sprints?.map((sprint) => (
              <option key={sprint._id} value={sprint._id}>
                {sprint.name} ({sprint.status})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Mode Switcher */}
      <div className="flex space-x-4 border-b border-gray-200 pb-2">
        <button
          onClick={() => setMode("single")}
          className={`px-4 py-2 font-semibold rounded-t-md transition-colors ${mode === "single" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
        >
          Single Algorithm
        </button>
        <button
          onClick={() => setMode("compare")}
          className={`px-4 py-2 font-semibold rounded-t-md transition-colors ${mode === "compare" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
        >
          Compare Algorithms
        </button>
      </div>

      {/* Mode Content */}
      {mode === "single" ? (
        <div className="space-y-6">
          <AlgorithmSelector
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            quantum={quantum}
            setQuantum={setQuantum}
            onRun={handleRunScheduler}
            isLoading={isSingleLoading}
          />

          {isSingleLoading && <p className="text-gray-600 font-medium">Loading...</p>}
          {singleError && (
            <p className="text-red-500 bg-red-50 p-3 rounded">Failed to fetch scheduling data.</p>
          )}

          {singleData && (
            <>
              <MetricsCards
                algorithm={singleData.algorithm}
                metrics={singleData.metrics}
                totalTasks={singleData.tasks.length}
              />
              <GanttChart 
                gantt={singleData.gantt} 
                tasksData={singleData.tasks} 
                globalStartDate={sprintData?.sprints?.find((s) => s._id === selectedSprint)?.startDate}
              />
              <ExecutionTable tasks={singleData.tasks} />
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Compare Settings */}
          <div className="bg-white p-4 rounded shadow-sm border border-gray-200 space-y-4">
            <h3 className="font-semibold text-lg text-gray-800">Compare Settings</h3>
            <div className="flex items-center space-x-4">
              <label htmlFor="compareQuantum" className="font-medium text-sm text-gray-700">
                Round Robin Quantum:
              </label>
              <input
                id="compareQuantum"
                type="number"
                value={compareQuantum}
                onChange={(e) => setCompareQuantum(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1.5 w-24 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCompareAll}
              disabled={isCompareLoading}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
            >
              {isCompareLoading ? "Comparing..." : "Compare All"}
            </button>
          </div>

          {isCompareLoading && <p className="text-gray-600 font-medium">Loading comparison data...</p>}
          {compareError && (
            <p className="text-red-500 bg-red-50 p-3 rounded">Failed to fetch comparison data.</p>
          )}

          {compareData && compareData.results && (
            <div className="bg-white p-4 rounded shadow-sm border border-gray-200 overflow-x-auto">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Comparison Results</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200 text-gray-700">
                    <th className="p-3 font-semibold">Algorithm</th>
                    <th className="p-3 font-semibold">Avg Waiting Time</th>
                    <th className="p-3 font-semibold">Avg Turnaround Time</th>
                    <th className="p-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {compareData.results.map((res, index) => {
                    const isBestWait = res.averageWaitingTime === bestWait;
                    const isBestTurnaround = res.averageTurnaroundTime === bestTurnaround;
                    const algName = res.algorithm === "Round Robin" ? `Round Robin (q=${res.quantum})` : res.algorithm;
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-medium text-gray-800">{algName}</td>
                        <td className="p-3 text-gray-700">
                          {res.averageWaitingTime}{" "}
                          {isBestWait && <span className="text-xs ml-2 bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold shadow-sm">🏆 Best Wait</span>}
                        </td>
                        <td className="p-3 text-gray-700">
                          {res.averageTurnaroundTime}{" "}
                          {isBestTurnaround && <span className="text-xs ml-2 bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold shadow-sm">🏆 Best Turnaround</span>}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedDetailResult(res)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm border border-blue-600 rounded px-4 py-1.5 hover:bg-blue-50 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {selectedDetailResult && (
            <div className="space-y-6 mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-bold text-xl text-gray-800">
                Details for {selectedDetailResult.algorithm} {selectedDetailResult.algorithm === "Round Robin" ? `(q=${selectedDetailResult.quantum})` : ""}
              </h3>
              <MetricsCards
                algorithm={selectedDetailResult.algorithm}
                metrics={selectedDetailResult.metrics}
                totalTasks={compareData.totalTasks}
              />
              <ExecutionTable tasks={selectedDetailResult.tasks} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scheduler;
