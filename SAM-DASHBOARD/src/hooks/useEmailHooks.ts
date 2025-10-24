// src/hooks/useEmailData.ts
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../Redux/store";
import type { Email } from "../../types/types";
import {
  createEmail,
  updateEmail,
  deleteEmail,
  getAllEmail,
} from "../Redux/slices/emailSlicer";

interface UseEmailProps {
  closeModal?: () => void;
}

export function useEmailData({ closeModal }: UseEmailProps = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch all (safe handler)
  const fetchAllEmails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await dispatch(getAllEmail()).unwrap();

      if (res && Array.isArray(res.data)) {
        setEmails(res.data);
      } else {
        setEmails([]);
      }
      setSuccess(res?.message ?? "Fetched");

      return res;
    } catch (err: any) {
      setError(err?.message || "Gagal memuat daftar email");
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Create
  const handleCreateEmail = async (payload: Partial<Email>) => {
    setIsLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await dispatch(createEmail({ data: payload })).unwrap(); // EmailsResponse
      if (res && Array.isArray(res.data)) {
        setEmails((prev) => {
          const newList = [...prev];
          for (const item of res.data) {
            const idx = newList.findIndex((e) => e.id === item.id);
            if (idx >= 0) newList[idx] = item;
            else newList.push(item);
          }
          return newList;
        });
      }
      setSuccess(res?.message ?? "Created");
      await fetchAllEmails();
      closeModal?.();
      return res;
    } catch (err: any) {
      setError(err?.message || "Gagal membuat email");
    } finally {
      setIsLoading(false);
    }
  };

  // Update
  const handleUpdateEmail = async (id: number, emailName: string) => {
    setIsLoading(true);
    setSuccess(null);
    setWarning(null);
    setError(null);
    try {
      const res = await dispatch(updateEmail({ id, emailName })).unwrap();
      if (res && Array.isArray(res.data)) {
        setEmails((prev) =>
          prev.map((e) => {
            const found = res.data.find((u) => u.id === e.id);
            setWarning(res.message || "Pilih salah satu email terlebih dahulu");
            return found ?? e;
          })
        );
      }
      setSuccess(res?.message ?? "Updated");
      await fetchAllEmails();
      closeModal?.();
      return res;
    } catch (err: any) {
      setError(err?.message || "Gagal memperbarui email");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete
  const handleDeleteEmail = async (id: number) => {
    setIsLoading(true);
    setSuccess(null);
    setError(null);
    setWarning(null);
    try {
      const res = await dispatch(deleteEmail({ id })).unwrap(); // returns { id }
      setEmails((prev) => prev.filter((e) => e.id !== res.id));
      setSuccess("Deleted");
      await fetchAllEmails();
      closeModal?.();
      return res;
    } catch (err: any) {
      console.log(err);
      setError(err?.message || "Gagal menghapus email");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    emails,
    isLoading,
    error,
    success,
    fetchAllEmails,
    handleCreateEmail,
    handleUpdateEmail,
    handleDeleteEmail,
    setError,
    warning,
    setWarning,
  };
}
