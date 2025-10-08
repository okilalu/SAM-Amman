import React, { useState } from "react";
import CustomTable from "../components/CustomTable";
import Pagination from "../components/Pagination";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import CustomFilter from "../components/CustomFilter";

export default function ManageUser() {
  const dummyUsers = [
    { id: 1, username: "admin1", password: "Admin", privilage: "Admin" },
    { id: 2, username: "guest1", password: "Guest", privilage: "Guest" },
    { id: 3, username: "admin2", password: "Admin", privilage: "Admin" },
    { id: 4, username: "guest2", password: "Guest", privilage: "Guest" },
    { id: 5, username: "admin", password: "Admin", privilage: "Admin" },
  ];

  const [users, setUsers] = useState(dummyUsers);
  const [filter, setFilter] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    id: 0,
    username: "",
    password: "",
    privilage: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = 5;

  // 🔍 Filter & Sort
  const filteredUsers = users
    .filter((user) =>
      user.username.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      sortDirection === "asc"
        ? a.username.localeCompare(b.username)
        : b.username.localeCompare(a.username)
    );

  // 🔹 Modal control
  const handleOpenModal = (id: string, user?: any) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.showModal();

    if (user) {
      setFormData(user);
    } else {
      setFormData({ id: 0, username: "", password: "", privilage: "" });
    }
  };

  const handleCloseModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.close();
  };

  // 🔸 Checkbox handler
  const handleSelectUser = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Pagination
  const handlePageCHange = (page) => {
    setCurrentPage(page);
    console.log("Pindah ke halaman: ", page);
  };

  // 🟢 CREATE
  const handleRegister = () => {
    if (!formData.username || !formData.password || !formData.privilage) {
      alert("Lengkapi semua field!");
      return;
    }

    const newUser = {
      id: users.length + 1,
      username: formData.username,
      password: formData.password,
      privilage: formData.privilage,
    };
    console.log(newUser);

    setUsers([...users, newUser]);
    handleCloseModal("modal_register");
  };

  // 🟡 UPDATE
  const handleUpdate = () => {
    if (selectedIds.length !== 1) {
      alert("Pilih tepat satu user untuk diupdate!");
      return;
    }

    const updatedUsers = users.map((user) =>
      user.id === selectedIds[0] ? { ...user, ...formData } : user
    );
    setUsers(updatedUsers);
    setSelectedIds([]);
    handleCloseModal("modal_update");
  };

  // 🔴 DELETE
  const handleDelete = () => {
    if (selectedIds.length === 0) {
      alert("Pilih user yang ingin dihapus terlebih dahulu!");
      return;
    }
    const deleteUsers = users.filter((user) => !selectedIds.includes(user.id));
    setUsers(deleteUsers);
    setSelectedIds([]);
    handleCloseModal("modal_delete");
  };

  return (
    <div className="p-16 flex gap-3 min-h-screen pt-7 pl-72 bg-gray-100">
      <div className="flex-1 p-10 pt-12 text-sm text-black">
        {/* Breadcrumb */}
        <div className="breadcrumbs bg-gray-200 text-sm mb-4 p-3">
          <ul>
            <li>
              <a className="text-blue-600">Home</a>
            </li>
            <li>
              <a>Manage User</a>
            </li>
          </ul>
        </div>

        <h2 className="text-3xl text-black font-bold mb-8">Manage User</h2>

        {/* FILTER */}
        <CustomFilter
          filterLabel="Filter"
          sortLabel="Sort Direction"
          placeholder="Cari username..."
          filter={filter}
          setFilter={setFilter}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />

        {/* TABLE */}
        <div className="pt-5">
          <CustomTable
            headers={["Select", "UserId", "Username", "Password", "Privilage"]}
          >
            {filteredUsers.length > 0 ? (
              filteredUsers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 text-center">
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-error"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelectUser(item.id)}
                    />
                  </td>
                  <td>{item.id}</td>
                  <td>{item.username}</td>
                  <td>{item.password}</td>
                  <td>{item.privilage}</td>
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

        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChange={handlePageCHange}
        />

        {/* BUTTON ACTION */}
        <div className="pt-5 flex gap-3 justify-end">
          <CustomButton
            text="Add User"
            onClick={() => handleOpenModal("modal_register")}
            className="btn-success"
          />
          <CustomButton
            text="Update"
            onClick={() => {
              const selectedUser = users.find((u) => u.id === selectedIds[0]);
              if (selectedUser) handleOpenModal("modal_update", selectedUser);
              else alert("Pilih user terlebih dahulu!");
            }}
            className="btn-info"
          />
          <CustomButton
            text="Delete"
            onClick={() => handleOpenModal("modal_delete")}
            className="btn-error"
          />
        </div>

        {/* MODALS */}
        <div className="pt-5">
          {/* REGISTER MODAL */}
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
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Enter Password"
                className="mb-4 w-full bg-gray-200 rounded-md p-2"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <select
                className="w-full bg-gray-200 rounded-md p-2"
                value={formData.privilage}
                onChange={(e) =>
                  setFormData({ ...formData, privilage: e.target.value })
                }
              >
                <option value="">Choose Role</option>
                <option value="Admin">Admin</option>
                <option value="Guest">Guest</option>
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
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Enter Password"
                className="mb-4 w-full bg-gray-200 rounded-md p-2"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <select
                className="w-full bg-gray-200 rounded-md p-2"
                value={formData.privilage}
                onChange={(e) =>
                  setFormData({ ...formData, privilage: e.target.value })
                }
              >
                <option value="">Choose Role</option>
                <option value="Admin">Admin</option>
                <option value="Guest">Guest</option>
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
      </div>
    </div>
  );
}
