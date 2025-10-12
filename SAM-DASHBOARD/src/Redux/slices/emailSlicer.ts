// src/Redux/slices/emailSlicer.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { uri } from "../../../utils/uri";
import type { Email, EmailState, EmailsResponse } from "../../../types/types";

// GET ALL
export const getAllEmail = createAsyncThunk<
  EmailsResponse,
  void,
  { rejectValue: string }
>("email/getAll", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${uri}/api/v6/emails/get`);
    // res.data harus match EmailsResponse
    return res.data as EmailsResponse;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Gagal mengambil data email"
    );
  }
});

// CREATE
export const createEmail = createAsyncThunk<
  EmailsResponse,
  { data: Partial<Email> },
  { rejectValue: string }
>("email/create", async ({ data }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${uri}/api/v6/email/create`, data);
    return res.data as EmailsResponse;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Gagal membuat email"
    );
  }
});

// UPDATE
export const updateEmail = createAsyncThunk<
  EmailsResponse,
  { id: number; emailName: string },
  { rejectValue: string }
>("email/update", async ({ id, emailName }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${uri}/api/v6/email/update/${id}`, {
      emailName,
    });
    return res.data as EmailsResponse;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Gagal memperbarui email"
    );
  }
});

// DELETE
export const deleteEmail = createAsyncThunk<
  { id: number },
  { id: number },
  { rejectValue: string }
>("email/delete", async ({ id }, { rejectWithValue }) => {
  try {
    await axios.delete(`${uri}/api/v6/email/delete/${id}`);
    return { id };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Gagal menghapus email"
    );
  }
});

const initialState: EmailState = {
  data: [],
  loading: false,
  error: null,
  selectedEmail: null,
};

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    setSelectedEmail(state, action: PayloadAction<Email | null>) {
      state.selectedEmail = action.payload;
    },
    resetEmailError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // GET ALL
    builder
      .addCase(getAllEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllEmail.fulfilled,
        (state, action: PayloadAction<EmailsResponse>) => {
          state.loading = false;
          // action.payload.data sudah Email[]
          state.data = Array.isArray(action.payload.data)
            ? action.payload.data
            : [];
        }
      )
      .addCase(getAllEmail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ??
          action.error?.message ??
          "Gagal mengambil data email";
      });

    // CREATE
    builder
      .addCase(createEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createEmail.fulfilled,
        (state, action: PayloadAction<EmailsResponse>) => {
          state.loading = false;
          // backend bisa mengembalikan created item dalam data array
          const payloadEmails = Array.isArray(action.payload.data)
            ? action.payload.data
            : [];
          // tambahkan new items (pastikan tidak menjadi nested)
          state.data = [...state.data, ...payloadEmails];
        }
      )
      .addCase(createEmail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error?.message ?? "Gagal membuat email";
      });

    // UPDATE
    builder
      .addCase(updateEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateEmail.fulfilled,
        (state, action: PayloadAction<EmailsResponse>) => {
          state.loading = false;
          const payloadEmails = Array.isArray(action.payload.data)
            ? action.payload.data
            : [];
          // perbarui setiap email yang cocok id-nya dengan yang ada pada payload
          for (const updated of payloadEmails) {
            state.data = state.data.map((e) =>
              e.id === updated.id ? updated : e
            );
          }
        }
      )
      .addCase(updateEmail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error?.message ?? "Gagal memperbarui email";
      });

    // DELETE
    builder
      .addCase(deleteEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteEmail.fulfilled,
        (state, action: PayloadAction<{ id: number }>) => {
          state.loading = false;
          state.data = state.data.filter((e) => e.id !== action.payload.id);
        }
      )
      .addCase(deleteEmail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error?.message ?? "Gagal menghapus email";
      });
  },
});

export const { setSelectedEmail, resetEmailError } = emailSlice.actions;
export default emailSlice.reducer;
