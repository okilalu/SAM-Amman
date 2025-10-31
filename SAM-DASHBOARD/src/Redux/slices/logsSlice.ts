import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { LogState, LogResponse } from "../../../types/types";
import { uri } from "../../../utils/uri";

const initialState: LogState = {
  logs: [],
  loading: false,
  error: null,
};

export const fetchLogs = createAsyncThunk<
  LogResponse,
  void,
  { rejectValue: string }
>("logs/get", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${uri}/api/v7/logs/get`);
    return response.data as LogResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Gagal memuat data log"
    );
  }
});

const logSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchLogs.fulfilled,
        (state, action: PayloadAction<LogResponse>) => {
          state.loading = false;
          state.logs = action.payload.data ?? [];
        }
      )
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Gagal memuat data log";
      });
  },
});

export default logSlice.reducer;
