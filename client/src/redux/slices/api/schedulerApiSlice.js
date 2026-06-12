import { apiSlice } from "../apiSlice";

export const schedulerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    runScheduler: builder.mutation({
      query: (body) => ({
        url: "/schedule/run",
        method: "POST",
        body,
      }),
    }),
    compareSchedulers: builder.mutation({
      query: (body) => ({
        url: "/schedule/compare",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useRunSchedulerMutation, useCompareSchedulersMutation } = schedulerApiSlice;
