import { apiSlice } from "../apiSlice";

const SPRINTS_URL = "/sprint";

export const sprintApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSprints: builder.query({
      query: () => ({
        url: `${SPRINTS_URL}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Sprint"],
    }),
    getSprintById: builder.query({
      query: (id) => ({
        url: `${SPRINTS_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Sprint", id }],
    }),
    createSprint: builder.mutation({
      query: (data) => ({
        url: `${SPRINTS_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Sprint"],
    }),
    updateSprint: builder.mutation({
      query: (data) => ({
        url: `${SPRINTS_URL}/update/${data._id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Sprint"],
    }),
    deleteSprint: builder.mutation({
      query: (id) => ({
        url: `${SPRINTS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Sprint"],
    }),
  }),
});

export const {
  useGetSprintsQuery,
  useGetSprintByIdQuery,
  useCreateSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
} = sprintApiSlice;
