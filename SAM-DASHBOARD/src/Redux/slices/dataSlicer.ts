import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { DataResponse, Datas, DataState } from "../../../types/types";
import { uri } from "../../../utils/uri";

// Filter Data
export const filterData = createAsyncThunk<
  DataResponse,
  { samId: string; data: Datas }
>("filter/data", async ({ samId, data }, { rejectWithValue }) => {
  console.log(samId, data);
  try {
    const res = await axios.get(`${uri}/api/v3/filter/data/${samId}`, {
      params: {
        minSpeed: data.minSpeed,
        maxSpeed: data.maxSpeed,
        startDate: data.startDate,
        endDate: data.endDate,
        category: data.category,
      },
    });
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.res?.data || error.message);
  }
});

// GetAll User
export const getAll = createAsyncThunk<DataResponse, { samId: string }>(
  "get/all/data",
  async ({ samId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${uri}/api/v3/all/data/${samId}`);

      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.res?.data || error.massage);
    }
  }
);

const initialState: DataState = {
  data: [],
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // filterData
    builder.addCase(filterData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(filterData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.data.data ?? [];
    });
    builder.addCase(filterData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get All data
    builder.addCase(getAll.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAll.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.data.data ?? [];
    });
    builder.addCase(getAll.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default dataSlice.reducer;
