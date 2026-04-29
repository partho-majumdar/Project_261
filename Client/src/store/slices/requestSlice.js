import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const requestSlice = createSlice({
  name: "request",
  initialState: {
    list: [],
    selected: null,
  },
  reducers: {},
  extraReducers: (builder) => {},
});

export default requestSlice.reducer;
