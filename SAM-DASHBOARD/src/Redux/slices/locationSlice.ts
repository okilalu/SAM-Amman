import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type {
  Location,
  LocationState,
  LocationResponse,
} from "../../../types/types";
import { uri } from "../../../utils/uri";

export const createLocation = createAsyncThunk<
  LocationResponse,
  { data: Partial<Location> }
>("location/create", async ({ data }, { rejectWithValue }) => {
  console.log(data);
  try {
    const response = await axios.post(`${uri}/api/v8/location/create`, {
      loc: data,
    });
    return response.data as LocationResponse;
  } catch (error: any) {
    console.error("❌ Create Location Error:", error);
    return rejectWithValue(error.response?.data);
  }
});

export const updateLocation = createAsyncThunk<
  LocationResponse,
  { id: number; location: string },
  { rejectValue: string }
>("location/update", async ({ id, location }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${uri}/api/v8/location/update/${id}`, {
      loc: location,
    });
    return response.data as LocationResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update location"
    );
  }
});

export const deleteLocation = createAsyncThunk<
  number,
  { id: number },
  { rejectValue: string }
>("location/delete", async ({ id }, { rejectWithValue }) => {
  try {
    await axios.delete(`${uri}/api/v8/location/delete/${id}`);
    return id; // hanya id yang dihapus
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete location"
    );
  }
});

// ==========================
// 🔹 GET ALL LOCATIONS
// ==========================
export const getAllLocation = createAsyncThunk<
  LocationResponse,
  void,
  { rejectValue: string }
>("locations/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${uri}/api/v8/location/get`);
    return response.data as LocationResponse;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch locations"
    );
  }
});

// ==========================
// 🧩 INITIAL STATE
// ==========================
const initialState: LocationState = {
  data: [],
  selectedLocation: null,
  loading: false,
  error: null,
};

// ==========================
// 🧩 SLICE
// ==========================
const locationSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    setSelectedLocation(state, action: PayloadAction<Location | null>) {
      state.selectedLocation = action.payload;
    },
    resetLocationError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createLocation.fulfilled,
        (state, action: PayloadAction<LocationResponse>) => {
          state.loading = false;
          // pastikan hanya ambil data array
          if (Array.isArray(action.payload.data)) {
            state.data = action.payload.data;
          }
        }
      )
      .addCase(createLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create location";
      })

      // GET ALL
      .addCase(getAllLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllLocation.fulfilled,
        (state, action: PayloadAction<LocationResponse>) => {
          state.loading = false;
          if (Array.isArray(action.payload.data)) {
            state.data = action.payload.data;
          }
        }
      )
      .addCase(getAllLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch locations";
      })

      // UPDATE
      .addCase(updateLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateLocation.fulfilled,
        (state, action: PayloadAction<LocationResponse>) => {
          state.loading = false;
          if (Array.isArray(action.payload.data)) {
            state.data = action.payload.data;
          }
        }
      )
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update location";
      })

      // DELETE
      .addCase(deleteLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteLocation.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.data = state.data.filter((loc) => loc.id !== action.payload);
        }
      )
      .addCase(deleteLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete location";
      });
  },
});

export const { setSelectedLocation, resetLocationError } =
  locationSlice.actions;
export default locationSlice.reducer;
