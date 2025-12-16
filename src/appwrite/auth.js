import conf from "@/conf/conf";
import { Client, Account, ID } from "appwrite";
import profileService from "./profile";

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

        return userAccount;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession({ email, password });
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser :: error ", error);
    }

    return null;
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }

  async OAuth2SignUp({ provider }) {
    try {
      const baseUrl = window.location.origin;

      return this.account.createOAuth2Token({
        // use createOAuth2Session here
        provider,
        // success: `${baseUrl}/`,
        success: `${baseUrl}/auth/callback`,
        failure: `${baseUrl}/signup`,
      });
    } catch (error) {
      console.log("Appwrite service :: OAuth2SignUp :: error", error);
      throw error;
    }
  }

  async handleOAuth2Callback(userId, secret) {
    try {
      // Create a session using the OAuth2 token
      await this.account.createSession({ userId, secret });

      // Get the user data
      const user = await this.account.get();

      // Check if profile exists, if not create one
      try {
        await profileService.getProfile(user.$id);
      } catch (error) {
        // Profile doesn't exist, create it
        await profileService.createProfile({
          userId: user.$id,
          name: user.name,
          age: null,
          bio: "",
          avatar: null,
        });
      }

      return user;
    } catch (error) {
      console.log("Appwrite service :: handleOAuth2Callback :: error", error);
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
