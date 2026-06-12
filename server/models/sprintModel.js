import mongoose, { Schema } from "mongoose";

const sprintSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    sprintGoal: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    deadline: { type: Date },
    status: {
      type: String,
      default: "planning",
      enum: ["planning", "active", "completed"],
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appliedAlgorithm: { type: String, default: null },
    autoScheduleEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Sprint = mongoose.model("Sprint", sprintSchema);

export default Sprint;
