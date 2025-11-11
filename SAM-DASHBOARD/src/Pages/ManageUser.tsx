import { useEffect, useState } from "react";
import CustomTable from "../components/CustomTable";
import CustomModal from "../components/CustomModal";
import { useUserData } from "../hooks/useUserHooks";
import { CustomInputs } from "@/components/CustomInputs";
import { CustomSelects } from "@/components/CustomSelects";
import { CustomPagination } from "@/components/CustomPagination";
import { CustomAlert } from "@/components/CustomAlert";
import { MdErrorOutline } from "react-icons/md";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { CustomButton } from "@/components/CustomButton";
import { CustomMainLoading } from "@/components/CustomMainLoading";

export default function ManageUser() {
  const {
    allUsers,
    validateAllUsers,
    registerUser,
    updateUsers,
    deleteUsers,
    success,
    error,
    setError,
    setSuccess,
  } = useUserData({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [credential, setCredential] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState<boolean>(true);
  const [selectOption, setSelectOption] = useState<string>("asc");
  const [warning, setWarning] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const handleShowPass = () => {
    setShow(!show);
  };

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

  const handleOpenRegister = () => {
    setUsername("");
    setPassword("");
    setCredential("");
    setSelectedIds([]); // reset pilihan checkbox biar gak keikut
    handleOpenModal("modal_register");
  };

  const isValid = username.length >= 4;

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
      setWarning("Lengkapi semua field!");
      return;
    }

    if (username.length < 4) {
      setWarning("Username Harus memiliki minimal 4 karakter");
      return;
    }
    if (password.length < 8) {
      setWarning("Password Harus memiliki minimal 8 karakter");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        username,
        password,
        credential,
      });
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
      setWarning("Choose at least one user");
      return;
    }
    const selectedId = selectedIds[0];
    const selectedUser = allUsers?.find((u) => u.userId === selectedId);

    if (!selectedUser) {
      setWarning("User not found");
      return;
    }

    if (username.length < 4) {
      setWarning("Username Harus memiliki minimal 4 karakter");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        username,
        // password,
        credential,
      };
      await updateUsers(String(selectedUser.userId!), payload);

      handleCloseModal("modal_update");
      await validateAllUsers();
      setSelectedIds([]);
    } catch (error) {
      // alert("Gagal memperbarui user");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      setWarning("Choose at least one user");
      return;
    }
    try {
      setLoading(true);
      await deleteUsers({ userId: String(selectedIds) });

      setSuccess("Successfuly deleted user");
      handleCloseModal("modal_delete");
      setSelectedIds([]);
      await validateAllUsers();
    } catch (error) {
      setError("Failed to deleted user");
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

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

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

  const optionCredentials = [
    {
      label: "Admin",
      value: "Admin",
    },
    {
      label: "Operator",
      value: "Operator",
    },
  ];

  const handlePrefillUpdate = () => {
    if (selectedIds.length !== 1) {
      setWarning("Choose at least one user");
      return;
    }
    const selectedUser = allUsers?.find((u) => u.userId === selectedIds[0]);
    if (!selectedUser) return;

    setUsername(selectedUser.username || "");
    setPassword("");
    setCredential(selectedUser.credential || "");
    handleOpenModal("modal_update");
  };

  return (
    <>
      {error && (
        <CustomAlert
          title={error}
          status="alert-error"
          icon={<MdErrorOutline />}
        />
      )}
      {success && (
        <CustomAlert
          title={success}
          status="alert-success"
          icon={<FaCheckCircle />}
        />
      )}
      {warning && (
        <CustomAlert
          title={warning}
          status="alert-warning"
          icon={<IoWarningOutline />}
        />
      )}
      <div className="flex flex-col lg:flex-row gap-3 w-full">
        <div className="flex-1 text-sm text-black w-full">
          {/* Filter & Sort */}
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex-1 min-w-[200px]">
              <CustomInputs
                label="Filter users"
                placeholder="Cari users"
                onChange={(val) => setFilter(val)}
                helperText="x"
                helper={() => setFilter("")}
                value={filter}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <CustomSelects
                value={option.find((opt) => opt.value === selectOption) || null}
                onChange={handleSelectOption}
                options={option}
                label="Sort"
                flex="flex-row"
                labelClass="items-center gap-3"
              />
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <CustomMainLoading
              variant="table"
              contents="user"
              menuLines={itemsPerPage}
            />
          ) : (
            <>
              {/* Table Wrapper */}
              <div className="pt-5 min-h-[270px] overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
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
                          <tr
                            key={idx}
                            className="hover:bg-gray-50 text-center"
                          >
                            <td>
                              <input
                                type="checkbox"
                                className="checkbox checkbox-error"
                                checked={selectedIds.includes(item.userId!)}
                                onChange={() => handleSelectUser(item.userId!)}
                              />
                            </td>
                            <td>{idx + 1}</td>
                            <td className="break-words max-w-[120px]">
                              {item.username}
                            </td>
                            <td className="truncate max-w-[120px]">
                              {item.password}
                            </td>
                            <td>{item.credential}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center text-gray-500 py-4"
                          >
                            Tidak ada data ditemukan
                          </td>
                        </tr>
                      )}
                    </CustomTable>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="mt-5">
                <CustomPagination
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={allUsers ? allUsers!.length : 0}
                  onPageChange={handlePageCHange}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-5 flex gap-3 justify-center md:justify-end lg:justify-end">
                <CustomButton
                  text="Add User"
                  onClick={handleOpenRegister}
                  className="btn-success"
                />
                <CustomButton
                  text="Update"
                  onClick={handlePrefillUpdate}
                  className="btn-info"
                />
                <CustomButton
                  text="Delete"
                  onClick={() => handleOpenModal("modal_delete")}
                  className="btn-error"
                />
              </div>

              {/* Modal Register */}
              <div className="pt-5">
                <CustomModal
                  title="Register User"
                  id="modal_register"
                  confirmText="Register"
                  onSubmit={handleRegister}
                >
                  <div className="flex flex-col gap-4 px-1 py-2 sm:px-3">
                    {/* Username */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Username
                      </label>

                      <input
                        type="text"
                        placeholder="Enter Username"
                        required
                        minLength={8}
                        title="Only letters, numbers or dash"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full px-3 py-2 text-sm rounded-md border transition-all duration-300
      ${
        username.length > 0 && !isValid
          ? "border-red-400 bg-red-50"
          : "border-gray-300 bg-gray-200"
      }
    `}
                      />
                      {username.length > 0 && !isValid && (
                        <span className="text-xs text-red-500 ml-1">
                          Username harus memiliki minimal 8 karakter dan hanya
                          boleh berisi huruf, angka, atau dash.
                        </span>
                      )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Password
                      </label>

                      <div className="relative">
                        <input
                          type={show ? "text" : "password"}
                          placeholder="Enter Password (min 8 karakter)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full px-3 py-2 pr-10 text-sm rounded-md border transition-all duration-300
            ${
              password.length > 0 && password.length < 8
                ? "border-red-400 bg-red-50"
                : "border-gray-300 bg-gray-200"
            }
          `}
                        />

                        {password.length > 0 && (
                          <button
                            type="button"
                            onClick={handleShowPass}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition"
                          >
                            {show ? (
                              <FaEye size={16} />
                            ) : (
                              <FaEyeSlash size={16} />
                            )}
                          </button>
                        )}
                      </div>

                      {password.length > 0 && password.length < 8 && (
                        <span className="text-xs text-red-500 ml-1">
                          Password harus memiliki minimal 8 karakter
                        </span>
                      )}
                    </div>

                    {/* Credential */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Credential
                      </label>

                      <CustomSelects
                        value={
                          optionCredentials.find(
                            (opt) => opt.value === credential
                          ) || null
                        }
                        onChange={(val) => setCredential(val)}
                        options={optionCredentials}
                        flex="flex-row"
                        background="bg-gray-200 border-none text-black w-full rounded-md"
                      />
                    </div>
                  </div>
                </CustomModal>

                {/* Update Modal */}
                <CustomModal
                  title="Update User"
                  id="modal_update"
                  confirmText="Update"
                  onSubmit={handleUpdate}
                >
                  <div className="flex flex-col gap-4 px-1 py-2 sm:px-2">
                    {/* Username */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Username
                      </label>

                      <input
                        type="text"
                        placeholder="Enter Username"
                        required
                        minLength={8}
                        title="Only letters, numbers or dash"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full px-3 py-2 text-sm rounded-md border transition-all duration-300
      ${
        username.length > 0 && !isValid
          ? "border-red-400 bg-red-50"
          : "border-gray-300 bg-gray-200"
      }
    `}
                      />

                      {/* ALERT ERROR mirip dengan password */}
                      {username.length > 0 && !isValid && (
                        <span className="text-xs text-red-500 ml-1">
                          Username harus memiliki minimal 8 karakter dan hanya
                          boleh berisi huruf, angka, atau dash.
                        </span>
                      )}
                    </div>

                    {/* Credential */}
                    <div className="flex flex-col gap-1">
                      <label className="px-1 text-sm font-medium text-gray-700">
                        Credential
                      </label>

                      <CustomSelects
                        value={
                          optionCredentials.find(
                            (opt) => opt.value === credential
                          ) || null
                        }
                        onChange={(val) => setCredential(val)}
                        options={optionCredentials}
                        flex="flex-row"
                        background="bg-gray-200 border-none text-black w-full rounded-md"
                      />
                    </div>
                  </div>
                </CustomModal>

                {/* Delete Modal */}
                <CustomModal
                  title="Delete User"
                  id="modal_delete"
                  confirmText="Delete"
                  onSubmit={handleDelete}
                >
                  <div className="flex flex-col px-3 py-2">
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
    </>
  );
}
