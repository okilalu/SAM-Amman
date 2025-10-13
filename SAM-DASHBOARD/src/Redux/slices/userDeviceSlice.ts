import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type {
  UserDevice,
  UserDeviceResponse,
  UserDeviceState,
} from "../../../types/types";
import { uri } from "../../../utils/uri";

// ==========================
// 🔹 ADD PERMISSION
// ==========================
export const addPermission = createAsyncThunk<
  UserDeviceResponse,
  { deviceId: string | string[]; userId: string },
  { rejectValue: string }
>("user-device/assign", async ({ deviceId, userId }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${uri}/api/v9/user-device/assign`, {
      deviceId,
      userId,
    });
    return response.data as UserDeviceResponse;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to add permission"
    );
  }
});

// ==========================
// 🔹 DELETE PERMISSION
// ==========================
export const deletePermission = createAsyncThunk<
  UserDeviceResponse,
  { userId: string; deviceId: string },
  { rejectValue: string }
>("user-device/delete", async ({ userId, deviceId }, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${uri}/api/v9/user-device/delete`, {
      data: { userId, deviceId }, // ✅ axios.delete butuh data di object "data"
    });
    return response.data as UserDeviceResponse;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to delete permission"
    );
  }
});

// ==========================
// 🔹 GET ALL PERMISSIONS BY USER ID
// ==========================
export const getAllPermissionsByUserId = createAsyncThunk<
  UserDeviceResponse,
  { userId: string },
  { rejectValue: string }
>("user-device/getByUserId", async ({ userId }, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${uri}/api/v9/user-device/get/device/${userId}`
    );
    return response.data as UserDeviceResponse;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to get permissions by user"
    );
  }
});

// ==========================
// 🔹 GET ALL PERMISSIONS BY DEVICE ID
// ==========================
export const getAllPermissionsByDeviceId = createAsyncThunk<
  UserDeviceResponse,
  { deviceId: string },
  { rejectValue: string }
>("user-device/getByDeviceId", async ({ deviceId }, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${uri}/api/v9/user-device/get/device/${deviceId}`
    );
    return response.data as UserDeviceResponse;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to get permissions by device"
    );
  }
});

// ==========================
// 🧩 INITIAL STATE
// ==========================
const initialState: UserDeviceState = {
  data: [],
  loading: false,
  error: null,
};

// ==========================
// 🧩 SLICE
// ==========================
const userDeviceSlice = createSlice({
  name: "userDevice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // =====================
    // ADD PERMISSION
    // =====================
    builder
      .addCase(addPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPermission.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          // pastikan payload ada data-nya
          state.data = Array.isArray(action.payload.data)
            ? action.payload.data
            : [...state.data, action.payload.data];
        }
      })
      .addCase(addPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add permission";
      });

    // =====================
    // DELETE PERMISSION
    // =====================
    builder
      .addCase(deletePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          const deleted = action.payload.data as UserDevice;
          state.data = state.data.filter(
            (item) =>
              !(
                item.userId === deleted.userId &&
                item.deviceId === deleted.deviceId
              )
          );
        }
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete permission";
      });

    // =====================
    // GET ALL BY USER ID
    // =====================
    builder
      .addCase(getAllPermissionsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPermissionsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data ?? [];
      })
      .addCase(getAllPermissionsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to get permissions by user";
      });

    // =====================
    // GET ALL BY DEVICE ID
    // =====================
    builder
      .addCase(getAllPermissionsByDeviceId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPermissionsByDeviceId.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data ?? [];
      })
      .addCase(getAllPermissionsByDeviceId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to get permissions by device";
      });
  },
});

export default userDeviceSlice.reducer;
