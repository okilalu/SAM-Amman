export const saveToken = (data: { token: string; user: any }) => {
  try {
    localStorage.setItem("auth", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving token", error);
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem("auth");
  } catch (error) {
    console.error("Error removing token", error);
  }
};

export const getToken = (): { token: string; user: any } | null => {
  try {
    const auth = localStorage.getItem("auth");
    return auth ? JSON.parse(auth) : null;
  } catch (error) {
    console.error("Error reading token:", error);
    return null;
  }
};
