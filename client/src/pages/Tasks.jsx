import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdGridView } from "react-icons/md";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Loading, Table, Tabs, Title, SelectList } from "../components";
import { useGetSprintsQuery } from "../redux/slices/api/sprintApiSlice";
import { AddTask, BoardView, TaskTitle } from "../components/tasks";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import { TASK_TYPE } from "../utils";
import { useSelector } from "react-redux";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const Tasks = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || "");

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  // Sprint filter state
  const [selectedSprintName, setSelectedSprintName] = useState("");
  const { data: sprintData } = useGetSprintsQuery();
  const sprintOptions = sprintData?.sprints?.map((s) => s.name) || [];
  const sprintId = sprintData?.sprints?.find((s) => s.name === selectedSprintName)?._id;

  const status = params?.status || "";

  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: searchTerm,
    sprintId: sprintId,
  }, {
    skip: !sprintId,
  });

  // Refetch when sprint filter changes
  useEffect(() => {
    if (sprintId) {
      refetch();
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [open, sprintId]);

  return isLoading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4 gap-3'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {/* Sprint filter dropdown */}
        <SelectList
          label="Sprint"
          lists={sprintOptions}
          selected={selectedSprintName}
          setSelected={setSelectedSprintName}
        />

        {!status && user?.isAdmin && (
          <Button
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
            onClick={() => setOpen(true)}
          />
        )}
      </div>

      <div>
        {!sprintId ? (
          <div className="w-full py-20 flex items-center justify-center text-gray-500">
            Please select a sprint to view its tasks.
          </div>
        ) : (
          <Tabs tabs={TABS} setSelected={setSelected}>
            {!status && (
              <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
                <TaskTitle label='To Do' className={TASK_TYPE.todo} />
                <TaskTitle
                  label='In Progress'
                  className={TASK_TYPE["in progress"]}
                />
                <TaskTitle label='Completed' className={TASK_TYPE.completed} />
              </div>
            )}

            {selected === 0 ? (
              <BoardView tasks={data?.tasks} />
            ) : (
              <Table tasks={data?.tasks} />
            )}
          </Tabs>
        )}
      </div>
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
