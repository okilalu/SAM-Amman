import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { uri } from "../../../utils/uri";
import { saveToken, getToken, removeToken } from "../../../utils/auth";
import type {
  UserState,
  User,
  UserResponse,
  MultiUserResponse,
} from "../../../types/types";

// ====================== THUNKS ======================

// Register User
export const createUser = createAsyncThunk<UserResponse, User>(
  "user/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${uri}/api/v1/register/user`, data);
      return res.data;
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
      const res = await axios.post(`${uri}/api/v1/login/user`, data, {
        withCredentials: true, // cookie cross-origin
      });

      // Simpan token fallback jika dikirim backend
      if (res.data.data?.token) {
        saveToken({ token: res.data.data.token, user: res.data.data.user });
      }

      return res.data;
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
      const auth = getToken();
      const token = auth?.token;

      const res = await axios.get(`${uri}/api/v1/current/user`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      return res.data;
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
      await axios.post(`${uri}/api/v1/logout`, {}, { withCredentials: true });
      removeToken(); // hapus token fallback
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to logout");
    }
  }
);

// Get All Users
export const getAllUser = createAsyncThunk<MultiUserResponse>(
  "user/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const auth = getToken();
      const token = auth?.token;

      const res = await axios.get(`${uri}/api/v1/getAll/user`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update User
export const updateUser = createAsyncThunk<
  UserResponse,
  { userId: string; data: Partial<User> }
>("user/update", async ({ userId, data }, { rejectWithValue }) => {
  try {
    const auth = getToken();
    const token = auth?.token;

    const res = await axios.put(`${uri}/api/v1/update/user/${userId}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Delete User
export const deleteUser = createAsyncThunk(
  "user/delete",
  async ({ userId }: { userId: string }, { rejectWithValue }) => {
    try {
      const auth = getToken();
      const token = auth?.token;

      const res = await axios.delete(`${uri}/api/v1/delete/user/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ====================== SLICE ======================

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
    // --- Create User ---
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

    // --- Login ---
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

    // --- Current User ---
    builder.addCase(currentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(currentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data.user;
    });
    builder.addCase(currentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // --- Logout ---
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
    });

    // --- Get All Users ---
    builder.addCase(getAllUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.data.user ?? [];
    });
    builder.addCase(getAllUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // --- Update User ---
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
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

    // --- Delete User ---
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.meta.arg.userId;
      state.users = state.users!.filter((u) => String(u.id) !== deletedId);
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;
