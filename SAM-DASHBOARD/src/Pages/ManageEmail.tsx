import { useState, useEffect } from "react";
import CustomTable from "../components/CustomTable";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import { useEmailData } from "../hooks/useEmailHooks";
import type { Email } from "../../types/types";
import { CustomInputs } from "@/components/CustomInputs";
import { CustomSelects } from "@/components/CustomSelects";
import { CustomPagination } from "@/components/CustomPagination";

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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<Email>({ emailName: "" });
  const dataPerPage = 5;
  const itemsPerPage = 5;
  const [selectOption, setSelectOption] = useState<string>("asc");

  useEffect(() => {
    fetchAllEmails();
  }, []);

  const filteredEmails = (emails ?? [])
    .filter((email) =>
      (email.emailName ?? "").toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      selectOption === "asc"
        ? (a.emailName ?? "").localeCompare(b.emailName ?? "")
        : (b.emailName ?? "").localeCompare(a.emailName ?? "")
    );

  const paginatedEmails = filteredEmails.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

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

  const handleSelectEmail = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Pindah ke halaman:", page);
  };

  const handleRegister = async () => {
    if (!formData.emailName?.trim()) {
      alert("Nama email harus diisi!");
      return;
    }
    await handleCreateEmail({ emailName: formData.emailName });
    handleCloseModal("modal_register");
  };

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

  const handleSelectOption = (selected: string) => {
    setSelectOption(selected);
  };

  const option = [
    {
      label: "Asc",
      value: "asc",
    },
    {
      label: "Desc",
      value: "desc",
    },
  ];

  return (
    <div className="flex gap-3">
      <div className="flex-1 text-sm text-black">
        <div className="flex flex-col gap-5 flex-1">
          <CustomInputs
            label="Filter email"
            placeholder="Cari email"
            onChange={(val) => setFilter(val)}
            helperText="x"
            helper={() => setFilter("")}
            value={filter}
          />
          <CustomSelects
            value={option.find((opt) => opt.value === selectOption) || null}
            onChange={handleSelectOption}
            options={option}
            label="Sort"
            flex="flex-row"
            labelClass="items-center gap-3"
          />
        </div>

        <div className="pt-5 min-h-[270px]">
          <CustomTable headers={["Select", "ID", "Email Name"]}>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 py-4">
                  Memuat data...
                </td>
              </tr>
            ) : paginatedEmails.length > 0 ? (
              paginatedEmails.map((item) => (
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

        <CustomPagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={emails ? emails!.length : 0}
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
