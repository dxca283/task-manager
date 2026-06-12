import clsx from "clsx";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { toast } from "sonner";
import { Button, ConfirmatioDialog, Loading, Title } from "../components";
import AddSprint from "../components/sprints/AddSprint";
import { useGetSprintsQuery, useDeleteSprintMutation } from "../redux/slices/api/sprintApiSlice";
import { dateFormatter } from "../utils/index";

const Sprints = () => {
  const { data, isLoading, refetch } = useGetSprintsQuery();
  const [deleteSprint] = useDeleteSprintMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    // Format dates to YYYY-MM-DD for input type="date"
    const formattedSprint = {
      ...el,
      startDate: el.startDate ? dateFormatter(el.startDate) : "",
      endDate: el.endDate ? dateFormatter(el.endDate) : "",
    };
    setSelected(formattedSprint);
    setOpen(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteSprint(selected).unwrap();
      refetch();
      toast.success(res?.message);
      setSelected(null);
      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-700";
      case "active":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300 dark:border-gray-600">
      <tr className="text-black dark:text-white text-left">
        <th className="py-2">Sprint Name</th>
        <th className="py-2">Status</th>
        <th className="py-2">Start Date</th>
        <th className="py-2">End Date</th>
        <th className="py-2">Tasks</th>
        <th className="py-2 text-right">Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ sprint }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">
        <p className="font-semibold text-black dark:text-gray-300">{sprint.name}</p>
        <span className="text-xs text-gray-500">{sprint.sprintGoal}</span>
      </td>
      <td className="p-2">
        <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", getStatusColor(sprint.status))}>
          {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
        </span>
      </td>
      <td className="p-2">{dateFormatter(sprint.startDate)}</td>
      <td className="p-2">{dateFormatter(sprint.endDate)}</td>
      <td className="p-2">
        <span className="font-semibold">{sprint.taskCount || 0}</span> tasks
      </td>
      <td className="p-2 flex gap-4 justify-end">
        <Button
          className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
          label="Edit"
          type="button"
          onClick={() => editClick(sprint)}
        />
        <Button
          className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
          label="Delete"
          type="button"
          onClick={() => deleteClick(sprint?._id)}
        />
      </td>
    </tr>
  );

  return isLoading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Sprint Management" />
          <Button
            label="Create Sprint"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
          />
        </div>
        <div className="bg-white dark:bg-[#1f1f1f] px-2 md:px-4 py-4 shadow rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {data?.sprints?.map((sprint, index) => (
                  <TableRow key={index} sprint={sprint} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {open && (
        <AddSprint
          open={open}
          setOpen={setOpen}
          sprintData={selected}
          key={new Date().getTime().toString()}
        />
      )}

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default Sprints;
