import React, { useState, useEffect } from "react";
import CustomTable from "../components/CustomTable";
import Pagination from "../components/Pagination";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import CustomFilter from "../components/CustomFilter";
import { useEmailData } from "../hooks/useEmailHooks";
import type { Email } from "../../types/types";

export default function ManageEmail() {
  const {
    emails,
    fetchAllEmails,
    handleCreateEmail,
    handleDeleteEmail,
    handleUpdateEmail,
    isLoading,
  } = useEmailData();

  const [filter, setFilter] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<Email>({ emailName: "" });
  const dataPerPage = 5;
  const totalPage = 5;

  useEffect(() => {
    fetchAllEmails();
  }, []);

  // 🔍 Filter dan sort
  const filteredEmails = (emails ?? [])
    .filter((email) =>
      (email.emailName ?? "").toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      sortDirection === "asc"
        ? (a.id ?? 0) - (b.id ?? 0)
        : (b.id ?? 0) - (a.id ?? 0)
    );
  console.log(emails);

  const itemsPerPage = filteredEmails.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  // 🔹 Modal Control
  const handleOpenModal = (id: string, email?: Email) => {
    if (email) setFormData(email);
    else setFormData({ emailName: "" });
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleCloseModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.close();
  };

  // ✅ Select Checkbox
  const handleSelectEmail = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 🔄 Pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Pindah ke halaman:", page);
  };

  // 🟢 CREATE
  const handleRegister = async () => {
    if (!formData.emailName?.trim()) {
      alert("Nama email harus diisi!");
      return;
    }
    await handleCreateEmail({ emailName: formData.emailName });
    handleCloseModal("modal_register");
  };

  // 🟡 UPDATE
  const handleUpdate = async () => {
    if (selectedIds.length !== 1) {
      alert("Pilih tepat satu email untuk diupdate!");
      return;
    }
    const id = selectedIds[0];
    if (!formData.emailName?.trim()) {
      alert("Nama email harus diisi!");
      return;
    }
    await handleUpdateEmail(id, formData.emailName);
    setSelectedIds([]);
    handleCloseModal("modal_update");
  };

  // 🔴 DELETE
  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Pilih email yang ingin dihapus terlebih dahulu!");
      return;
    }
    for (const id of selectedIds) {
      await handleDeleteEmail(id);
    }
    setSelectedIds([]);
    handleCloseModal("modal_delete");
  };

  return (
    <div className="flex gap-3 min-h-screen pt-7 bg-gray-100">
      <div className="flex-1 p-10 pt-12 text-sm text-black">
        {/* 🔹 Breadcrumb */}
        <div className="breadcrumbs bg-gray-200 text-sm mb-4 p-3">
          <ul>
            <li>
              <a className="text-blue-600">Home</a>
            </li>
            <li>
              <a>Manage Email</a>
            </li>
          </ul>
        </div>

        <h2 className="text-3xl text-black font-bold mb-8">Manage Email</h2>

        {/* 🔹 Filter */}
        <CustomFilter
          filterLabel="Filter"
          sortLabel="Sort Direction"
          placeholder="Cari email..."
          filter={filter}
          setFilter={setFilter}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />

        {/* 🔹 Table */}
        <div className="pt-5">
          <CustomTable headers={["Select", "ID", "Email Name"]}>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 py-4">
                  Memuat data...
                </td>
              </tr>
            ) : itemsPerPage.length > 0 ? (
              itemsPerPage.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 text-center">
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-error"
                      checked={selectedIds.includes(item.id!)}
                      onChange={() => handleSelectEmail(item.id!)}
                    />
                  </td>
                  <td>{item.id}</td>
                  <td>{item.emailName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 py-4">
                  Tidak ada data ditemukan
                </td>
              </tr>
            )}
          </CustomTable>
        </div>

        {/* 🔹 Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={handlePageChange}
        />

        {/* 🔹 Action Buttons */}
        <div className="pt-5 flex gap-3 justify-end">
          <CustomButton
            text="Add Email"
            onClick={() => handleOpenModal("modal_register")}
            className="btn-success"
          />
          <CustomButton
            text="Update"
            onClick={() => {
              const selected = emails.find((e) => e.id === selectedIds[0]);
              if (selected) handleOpenModal("modal_update", selected);
              else alert("Pilih email terlebih dahulu!");
            }}
            className="btn-info"
          />
          <CustomButton
            text="Delete"
            onClick={() => handleOpenModal("modal_delete")}
            className="btn-error"
          />
        </div>

        {/* 🔹 Modal Create */}
        <div className="pt-5">
          <CustomModal
            title="Tambah Email"
            id="modal_register"
            confirmText="Simpan"
            onSubmit={handleRegister}
          >
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Masukkan nama email"
                className="mb-4 w-full bg-gray-200 rounded-md p-2"
                value={formData.emailName ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, emailName: e.target.value })
                }
              />
            </div>
          </CustomModal>

          {/* 🔹 Modal Update */}
          <CustomModal
            title="Update Email"
            id="modal_update"
            confirmText="Update"
            onSubmit={handleUpdate}
          >
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Masukkan nama email"
                className="mb-4 w-full bg-gray-200 rounded-md p-2"
                value={formData.emailName ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, emailName: e.target.value })
                }
              />
            </div>
          </CustomModal>

          {/* 🔹 Modal Delete */}
          <CustomModal
            title="Hapus Email"
            id="modal_delete"
            confirmText="Hapus"
            onSubmit={handleDelete}
          >
            <div className="flex flex-col text-center">
              <p>
                Apakah anda yakin ingin menghapus{" "}
                <strong>{selectedIds.length}</strong> email?
              </p>
            </div>
          </CustomModal>
        </div>
      </div>
    </div>
  );
}
