import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requestId: null as string | null,
};

const autoloanSlice = createSlice({
  name: "autoloan",
  initialState,
  reducers: {
    setRequestId(state, action) {
      state.requestId = action.payload;
    },
  },
});

export const { setRequestId } = autoloanSlice.actions;
export default autoloanSlice;
