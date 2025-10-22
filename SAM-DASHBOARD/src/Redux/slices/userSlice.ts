import { getToken, removeToken, saveToken } from "./../../../utils/auth";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { uri } from "../../../utils/uri";
import type {
  MultiUserResponse,
  User,
  UserResponse,
  UserState,
} from "../../../types/types";

// Register
export const createUser = createAsyncThunk<UserResponse, User>(
  "user/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${uri}/api/v1/register/user`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

// Login User
export const login = createAsyncThunk<UserResponse, User>(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${uri}/api/v1/login/user`, data, {
        withCredentials: true,
      });

      return response.data;
    } catch (error: any) {
      console.log(error);

      return rejectWithValue(error.response?.data || "Login Failed");
    }
  }
);

// Current User
export const currentUser = createAsyncThunk<UserResponse>(
  "user/current",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${uri}/api/v1/current/user`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch current user"
      );
    }
  }
);

// Logout User
export const logout = createAsyncThunk<void>(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${uri}/api/v1/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to log out");
    }
  }
);

// Get All User
export const getAllUser = createAsyncThunk<MultiUserResponse>(
  "user/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${uri}/api/v1/getAll/user`, {
        withCredentials: true,
      });
      console.log(response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? error.message);
    }
  }
);

// Update User
export const updateUser = createAsyncThunk<
  UserResponse,
  { userId: string; data: Partial<User> }
>("user/update", async ({ userId, data }, { rejectWithValue }) => {
  try {
    // const token = getToken();
    const response = await axios.put(
      `${uri}/api/v1/update/user/${userId}`,
      data
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data ?? error.message);
  }
});
// Delete User
export const deleteUser = createAsyncThunk(
  "history/deleteHistory",
  async ({ data }: { data: string }, thunkAPI) => {
    try {
      // const token = await localStorage.getItem("token");
      const response = await axios.delete(`${uri}/api/v1/delete/user/${data}`);
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState: UserState = {
  user: null,
  users: [],
  token: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create User
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data.user;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data.user;
      state.token = action.payload.data?.token || null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Current User
    builder.addCase(currentUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(currentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data.user;
    });
    builder.addCase(currentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get All User
    builder.addCase(getAllUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.data.user ?? [];
    });
    builder.addCase(getAllUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update User
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      const updatedUser = action.payload.data.user;
      state.user = updatedUser;
      state.users = state.users!.map((u) =>
        u.id === updatedUser.id ? updatedUser : u
      );
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete User
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      const deletedIds = action.meta.arg.data;
      state.users = state.users!.filter(
        (item) => item.id !== undefined && !deletedIds.includes(String(item.id))
      );
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout User
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
    });
  },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;
