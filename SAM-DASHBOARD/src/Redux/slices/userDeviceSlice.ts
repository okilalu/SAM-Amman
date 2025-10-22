import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { UserDeviceResponse, UserDeviceState } from "../../../types/types";
import { uri } from "../../../utils/uri";
import { getToken } from "../../../utils/auth";

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

export const getAllPermissionsByUserId = createAsyncThunk<
  UserDeviceResponse,
  { userId: string },
  { rejectValue: string }
>("user-device/getByUserId", async ({ userId }, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${uri}/api/v9/user-device/get/device/${userId}`
    );
    console.log("response:", response);
    return response.data as UserDeviceResponse;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to get permissions by user"
    );
  }
});

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

export const getAccessibleDevice = createAsyncThunk<UserDeviceResponse, void>(
  "user-device/accessible",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${uri}/api/v9/user-device/get/accessible/device`
      );
      return response.data as UserDeviceResponse;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to get permissions by device"
      );
    }
  }
);

const initialState: UserDeviceState = {
  data: [],
  loading: false,
  error: null,
};

const userDeviceSlice = createSlice({
  name: "userDevice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPermission.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.data = Array.isArray(action.payload.data)
            ? action.payload.data
            : [...state.data, action.payload.data];
        }
      })
      .addCase(addPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add permission";
      });

    builder
      .addCase(deletePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          const deleted = Array.isArray(action.payload.data)
            ? action.payload.data
            : [action.payload.data];

          state.data = state.data.filter(
            (item) =>
              !deleted.some(
                (deleted) =>
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

    builder
      .addCase(getAccessibleDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccessibleDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data ?? [];
      })
      .addCase(getAccessibleDevice.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any) ?? "Failed to get permissions by device";
      });
  },
});

export default userDeviceSlice.reducer;
