import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { Device, DeviceResponse, DeviceState } from "../../../types/types";
import { uri } from "../../../utils/uri";

// Add Device
export const generateDevice = createAsyncThunk<
  DeviceResponse,
  { data: Device }
>("generate/device", async ({ data }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${uri}/api/v2/add/device`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

// Update device
export const updateDevice = createAsyncThunk<
  DeviceResponse,
  { deviceId: string; data: Partial<Device> }
>("device/update", async ({ deviceId, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(
      `${uri}/api/v2/update/device/${deviceId}`,
      data
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Delete Device
export const deleteDevice = createAsyncThunk<
  { samId: string },
  { samId: string }
>("device/delete", async ({ samId }, { rejectWithValue }) => {
  try {
    await axios.delete(`${uri}/api/v2/delete/device/${samId}`);
    return { samId };
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// GetAll Device
export const getAllDevice = createAsyncThunk<DeviceResponse>(
  "get/all-device",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${uri}/api/v2/getAll/device`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// GetAll Device
export const storageInfo = createAsyncThunk<DeviceResponse>(
  "storage/Info",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${uri}/api/v2/system/info`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState: DeviceState = {
  devices: [],
  loading: false,
  error: null,
  selectedDevice: null,
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    resetDeviceError: (state) => {
      state.error = null;
    },
    setSelectedDevice: (state, action: PayloadAction<string>) => {
      state.selectedDevice = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add device
    builder.addCase(generateDevice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(generateDevice.fulfilled, (state, action) => {
      state.loading = false;
      state.devices = action.payload.data.device || [];
    });
    builder.addCase(generateDevice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Device
    builder.addCase(updateDevice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateDevice.fulfilled, (state, action) => {
      state.loading = false;
      const updated = Array.isArray(action.payload.data.device)
        ? action.payload.data.device[0]
        : action.payload.data.device;

      if (updated) {
        state.devices = state.devices.map((d) =>
          d.id === updateDevice.id ? updated : d
        );
      }
    });
    builder.addCase(updateDevice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Device
    builder.addCase(deleteDevice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteDevice.fulfilled, (state, action) => {
      state.loading = false;
      state.devices = state.devices.filter(
        (d) => d.samId !== action.payload.samId
      );
    });
    builder.addCase(deleteDevice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // GetAll Device
    builder.addCase(getAllDevice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllDevice.fulfilled, (state, action) => {
      state.loading = false;
      state.devices = action.payload.data.device || [];
    });
    builder.addCase(getAllDevice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // System Info
    builder.addCase(storageInfo.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(storageInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.devices = action.payload.data.device || [];
    });
    builder.addCase(storageInfo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSelectedDevice } = deviceSlice.actions;
export default deviceSlice.reducer;
