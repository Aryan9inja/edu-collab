import { account, ID } from "@/lib/appwrite";

export interface UserData {
  name?: string;
  email: string;
  password: string;
}

const registerUser = async (formData: UserData) => {
  const { name, email, password } = formData;

  try {
    await account.create({
      userId: ID.unique(),
      email,
      password,
      name,
    });

    await account.createEmailPasswordSession({
      email,
      password,
    });
  } catch (error) {
    throw error || new Error("Error registering user");
  }
};

const loginUser = async (formData: UserData) => {
  const { email, password } = formData;

  try {
    await account.createEmailPasswordSession({
      email,
      password,
    });
  } catch (error) {
    throw error || new Error("Error logging in user");
  }
};

const logoutUser = async () => {
  try {
    await account.deleteSessions();
  } catch (error) {
    throw error || new Error("Error logging out user");
  }
};

const fetchUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    throw error || new Error("Error fetching user");
  }
};

export const authService = {
  registerUser,
  loginUser,
  logoutUser,
  fetchUser,
};
