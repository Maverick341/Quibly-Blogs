import conf from "@/conf/conf";
import { Client, Account, ID } from "appwrite";
import profileService from "./profile";
import toast from "react-hot-toast";
import { getToastStyles } from "@/utils/toastStyles";

export class Service {
  client = new Client();
  account;

  constructor() {
    this.client
      .setProject(conf.appwriteProjectId)
      .setEndpoint(conf.appwriteUrl);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name, age, bio }) {
    const toastId = toast.loading("Creating account...");
    try {
      const userAccount = await this.account.create({
        userId: ID.unique(),
        email,
        password,
        name,
      });

      if (userAccount) {
        // Login first to establish session
        await this.login({ email, password });

        // Now create profile with active session
        await profileService.createProfile({
          userId: userAccount.$id,
          name,
          age: age ? Number(age) : null,
          bio: bio || "",
          avatar: null,
        });

        toast.success("Account created successfully!", { 
          id: toastId,
          style: getToastStyles("success"),
        });
        return userAccount;
      } else {
        const errorMessage = error.message || "Account creation failed.";
        toast.error(errorMessage, { 
          id: toastId,
          style: getToastStyles("error"),
        });
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    const toastId = toast.loading("Logging in...", {
      style: getToastStyles(),
    });
    try {
      const session = await this.account.createEmailPasswordSession({
        email,
        password,
      });
      toast.success("Login successful!", {
        id: toastId,
        style: getToastStyles("success"),
      });
      return session;
    } catch (error) {
      const errorMessage =
        error.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage, { 
        id: toastId,
        style: getToastStyles("error"),
      });
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const session = await this.account.get();
      return session;
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser :: error ", error);
      throw error;
    }
  }

  async logout() {
    const toastId = toast.loading("Signing out...", {
      style: getToastStyles(),
    });
    try {
      const result = await this.account.deleteSessions();
      toast.success("Logged out successfully", { 
        id: toastId,
        style: getToastStyles("success"),
      });
      return result;
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
      toast.error("Failed to log out", { 
        id: toastId,
        style: getToastStyles("error"),
      });
      throw error;
    }
  }

  async OAuth2SignUp({ provider }) {
    toast.loading(`Redirecting to ${provider}...`, { 
      duration: 2000,
      style: getToastStyles(),
    });
    try {
      const successUrl = window.location.origin + "/?oauth=success";
      const failureUrl = window.location.origin + "/signup?oauth=failed";

      return this.account.createOAuth2Session({
        provider,
        success: successUrl,
        failure: failureUrl,
      });
    } catch (error) {
      console.log("Appwrite service :: OAuth2SignUp :: error", error);
      toast.error(`Failed to connect with ${provider}`, {
        style: getToastStyles("error"),
      });
      throw error;
    }
  }

  async deleteAccount() {
    try {
      // Get current user
      const user = await this.getCurrentUser();
      if (!user) throw new Error("No user logged in");

      // Delete profile first
      await profileService.deleteProfile(user.$id);

      // Call backend to delete auth account
      const response = await fetch(
        `${conf.backendApiUrl}/api/deleteUser/${user.$id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      // Logout
      await this.logout();

      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteAccount :: error", error);
      throw error;
    }
  }
}

const authService = new Service();

export default authService;
