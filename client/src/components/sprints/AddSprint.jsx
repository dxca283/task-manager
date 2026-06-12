import { Dialog } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateSprintMutation, useUpdateSprintMutation } from "../../redux/slices/api/sprintApiSlice";
import { Button, Loading, ModalWrapper, Textbox } from "../";

const AddSprint = ({ open, setOpen, sprintData }) => {
  let defaultValues = sprintData ?? {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [createSprint, { isLoading }] = useCreateSprintMutation();
  const [updateSprint, { isLoading: isUpdating }] = useUpdateSprintMutation();

  const handleOnSubmit = async (data) => {
    try {
      if (sprintData) {
        const res = await updateSprint({ ...data, _id: sprintData._id }).unwrap();
        toast.success(res?.message);
      } else {
        const res = await createSprint(data).unwrap();
        toast.success("New Sprint created successfully");
      }

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error || "Something went wrong");
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {sprintData ? "UPDATE SPRINT" : "CREATE NEW SPRINT"}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Sprint Name"
              type="text"
              name="name"
              label="Sprint Name"
              className="w-full rounded"
              register={register("name", {
                required: "Sprint name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />

            <div className="flex gap-4">
              <Textbox
                placeholder="Start Date"
                type="date"
                name="startDate"
                label="Start Date"
                className="w-full rounded"
                register={register("startDate", {
                  required: "Start date is required!",
                })}
                error={errors.startDate ? errors.startDate.message : ""}
              />
              <Textbox
                placeholder="End Date"
                type="date"
                name="endDate"
                label="End Date"
                className="w-full rounded"
                register={register("endDate", {
                  required: "End date is required!",
                })}
                error={errors.endDate ? errors.endDate.message : ""}
              />
            </div>

            <Textbox
              placeholder="Sprint Goal (optional)"
              type="text"
              name="sprintGoal"
              label="Sprint Goal"
              className="w-full rounded"
              register={register("sprintGoal")}
            />
            
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Status</label>
              <select
                className="bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 outline-none text-base focus:ring-2 ring-blue-300 rounded"
                {...register("status")}
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {isLoading || isUpdating ? (
            <div className="py-5">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
                label="Submit"
              />

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddSprint;
