import conf from "@/conf/conf";
import { Client, Account, ID } from "appwrite";

export class Service {
  client = new Client();
  account;

  constructor() {
    this.client
      .setProject(conf.appwriteProjectId)
      .setEndpoint(conf.appwriteUrl);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create({
        userId: ID.unique(),
        email,
        password,
        name,
      });

      if (userAccount) {
        // call another method
        return this.login({ email, password });
      } else {
        return null; // returned userAccount by the instructor; maybe incorrect
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

      return user;
    } catch (error) {
      console.log("Appwrite service :: handleOAuth2Callback :: error", error);
      throw error;
    }
  }

  async deleteAccount() {
    try {
      // Delete profile first

      // Call your backend to delete auth account

      // Logout
      
    } catch (error) {
      console.log("Appwrite service :: deleteAccount :: error", error);
      throw error;
    }
  }
}

const authService = new Service();

export default authService;
