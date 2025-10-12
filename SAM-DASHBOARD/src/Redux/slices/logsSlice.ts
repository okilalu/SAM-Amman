import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { Log, LogState, LogResponse } from "../../../types/types";

const initialState: LogState = {
  logs: [],
  loading: false,
  error: null,
  selectedLog: null,
};

export const fetchLogs = createAsyncThunk(
  "logs/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<LogResponse>("/api/v7/logs/get");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch logs"
      );
    }
  }
);

const logSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    setSelectedLog(state, action: PayloadAction<Log | null>) {
      state.selectedLog = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogs.fulfilled, (state, action: PayloadAction<Log[]>) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedLog } = logSlice.actions;
export default logSlice.reducer;
