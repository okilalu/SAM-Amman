import { useEffect, useState } from "react";
import CustomTable from "../components/CustomTable";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import { useUserData } from "../hooks/useUserHooks";
import { CustomInputs } from "@/components/CustomInputs";
import { CustomSelects } from "@/components/CustomSelects";
import { CustomPagination } from "@/components/CustomPagination";

export default function ManageUser() {
  const { allUsers, validateAllUsers, registerUser, updateUsers, deleteUsers } =
    useUserData({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [credential, setCredential] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<string>("asc");

  const filteredUsers = (allUsers ?? [])
    .filter((u) =>
      (u.username ?? "").toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      selectOption === "asc"
        ? (a.username ?? "").localeCompare(b.username ?? "")
        : (b.username ?? "").localeCompare(a.username ?? "")
    );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleCloseModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.close();
  };

  // 🔸 Checkbox handler
  const handleSelectUser = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Pagination
  const handlePageCHange = (page: number) => {
    setCurrentPage(page);
  };

  // create
  const handleRegister = async () => {
    if (!username || !password || !credential) {
      alert("Lengkapi semua field!");
      return;
    }

    if (password.length < 8) {
      alert("Password Harus memiliki minimal 8 karakter");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        username,
        password,
        credential,
      });
      alert("User berhasil ditambahkan");
      handleCloseModal("modal_register");

      setUsername("");
      setPassword("");
      setCredential("");
      validateAllUsers();
    } catch (error) {
      console.error("Gagal register user", error);
    } finally {
      setLoading(false);
    }
  };

  // Update
  const handleUpdate = async () => {
    if (selectedIds.length !== 1) {
      alert("Pilih tepat satu user untuk diupdate!");
      return;
    }
    const selectedId = selectedIds[0];
    const selectedUser = allUsers?.find((u) => u.userId === selectedId);

    if (!selectedUser) {
      alert("User tidak ditemukan");
      return;
    }
    console.log(selectedUser);

    if (password.length < 8) {
      alert("Password Harus memiliki minimal 8 karakter");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        username,
        password,
        credential,
      };
      await updateUsers(String(selectedUser.userId!), payload);

      handleCloseModal("modal_update");
      await validateAllUsers();
      setSelectedIds([]);
    } catch (error) {
      alert("Gagal memperbarui user");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Pilih user yang ingin dihapus terlebih dahulu!");
      return;
    }
    try {
      setLoading(true);
      await deleteUsers({ id: String(selectedIds) });

      alert(`${selectedIds.length} user berhasil dihapus.`);
      handleCloseModal("modal_delete");
      setSelectedIds([]);
      await validateAllUsers();
    } catch (error) {
      alert("Gagal menghapus user");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await validateAllUsers();
      setLoading(false);
    };
    loadData();
  }, []);

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

  const handlePrefillUpdate = () => {
    if (selectedIds.length !== 1) {
      alert("Pilih satu user untuk diupdate");
      return;
    }
    const selectedUser = allUsers?.find((u) => u.userId === selectedIds[0]);
    if (!selectedUser) return alert("User tidak ditemukan");

    setUsername(selectedUser.username || "");
    setPassword(selectedUser.password || "");
    setCredential(selectedUser.credential || "");
    handleOpenModal("modal_update");
  };

  return (
    <div className="flex gap-3">
      <div className="flex-1 text-sm text-black">
        <div className="flex flex-col gap-5 flex-1">
          <CustomInputs
            label="Filter users"
            placeholder="Cari users"
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

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <span className="loading loading-bars loading-xl text-blue-400"></span>
            <p className="ml-3 text-gray-700 text-lg">
              Memuat data pengguna...
            </p>
          </div>
        ) : (
          <>
            <div className="pt-5 min-h-[270px] ">
              <CustomTable
                headers={[
                  "Select",
                  "UserId",
                  "Username",
                  "Password",
                  "Privilage",
                ]}
              >
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 text-center">
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-error"
                          checked={selectedIds.includes(item.userId!)}
                          onChange={() => handleSelectUser(item.userId!)}
                        />
                      </td>
                      <td>{idx + 1}</td>
                      <td>{item.username}</td>
                      <td>{item.password}</td>
                      <td>{item.credential}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500 py-4">
                      Tidak ada data ditemukan
                    </td>
                  </tr>
                )}
              </CustomTable>
            </div>

            <CustomPagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={allUsers ? allUsers!.length : 0}
              onPageChange={handlePageCHange}
            />

            <div className="pt-5 flex gap-3 justify-end">
              <CustomButton
                text="Add User"
                onClick={() => handleOpenModal("modal_register")}
                className="btn-success"
              />
              <CustomButton
                text="Update"
                onClick={handlePrefillUpdate}
                // onClick={() => {
                //   const selectedUser = allUsers?.find(
                //     (u) => u.userId === selectedIds[0]
                //   );
                //   if (selectedUser) handleOpenModal("modal_update");
                //   else alert("Pilih user terlebih dahulu!");
                // }}
                className="btn-info"
              />
              <CustomButton
                text="Delete"
                onClick={() => handleOpenModal("modal_delete")}
                className="btn-error"
              />
            </div>

            <div className="pt-5">
              <CustomModal
                title="Register User"
                id="modal_register"
                confirmText="Register"
                onSubmit={handleRegister}
              >
                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Enter Username"
                    className="mb-4 w-full bg-gray-200 rounded-md p-2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Enter Password (min 8 karakter)"
                    className={`mb-2 w-full rounded-md p-2 ${
                      password.length > 0 && password.length < 8
                        ? "bg-red-100 border border-red-500"
                        : "bg-gray-200"
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password.length > 0 && password.length < 8 && (
                    <span className="text-red-500 text-sm mb-2">
                      Password harus memiliki minimal 8 karakter
                    </span>
                  )}
                  <select
                    className="w-full bg-gray-200 rounded-md p-2 mt-2"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                  >
                    <option value="">Choose Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Guest">Operator</option>
                  </select>
                </div>
              </CustomModal>

              {/* UPDATE MODAL */}
              <CustomModal
                title="Update User"
                id="modal_update"
                confirmText="Update"
                onSubmit={handleUpdate}
              >
                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Enter Username"
                    className="mb-4 w-full bg-gray-200 rounded-md p-2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Enter Password (min 8 karakter)"
                    className={`mb-2 w-full rounded-md p-2 ${
                      password.length > 0 && password.length < 8
                        ? "bg-red-100 border border-red-500"
                        : "bg-gray-200"
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password.length > 0 && password.length < 8 && (
                    <span className="text-red-500 text-sm mb-2">
                      Password harus memiliki minimal 8 karakter
                    </span>
                  )}
                  <select
                    className="w-full bg-gray-200 rounded-md p-2"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                  >
                    <option value="">Choose Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Guest">Operator</option>
                  </select>
                </div>
              </CustomModal>

              {/* DELETE MODAL */}
              <CustomModal
                title="Delete User"
                id="modal_delete"
                confirmText="Delete"
                onSubmit={handleDelete}
              >
                <div className="flex flex-col text-center">
                  <p>
                    Apakah anda yakin ingin menghapus{" "}
                    <strong>{selectedIds.length}</strong> user?
                  </p>
                </div>
              </CustomModal>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
