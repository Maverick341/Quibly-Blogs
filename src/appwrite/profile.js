import conf from "@/conf/conf";
import { Client, TablesDB, Storage } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setProject(conf.appwriteProjectId)
            .setEndpoint(conf.appwriteUrl);
        this.databases = new TablesDB(this.client);
        this.bucket = new Storage(this.client);
    }

    async createProfile({ userId, name, age, bio, avatar }) {
        try {
            return await this.databases.createRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteProfilesTableId,
                rowId: userId,
                data: {
                    name,
                    age,
                    bio,
                    avatar,
                },
            });
        } catch (error) {
            console.log("Appwrite service :: createProfile :: error ", error);
            throw error;
        }
    }

    async getProfile(userId) {
        try {
            return await this.databases.getRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteProfilesTableId,
                rowId: userId,
            });
        } catch (error) {
            console.log("Appwrite service :: getProfile :: error ", error);
            throw error;
        }
    }

    async updateProfile(userId, { name, age, bio, avatar }) {
        try {
            return await this.databases.updateRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteProfilesTableId,
                rowId: userId,
                data: {
                    name,
                    age,
                    bio,
                    avatar,
                },
            });
        } catch (error) {
            console.log("Appwrite service :: updateProfile :: error ", error);
            throw error;
        }   
    }

    // Optional: list multiple profiles (supports Queries.*)
    async listProfiles(queries = []) {
        try {
            return await this.databases.listRows({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteProfilesTableId,
                queries,
            });
        } catch (error) {
            console.log("Appwrite service :: listProfiles :: error ", error);
            throw error;
        }
    }

    // Optional: delete a profile (use for account deletion/admin)
    async deleteProfile(userId) {
        try {
            return await this.databases.deleteRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteProfilesTableId,
                rowId: userId,
            });
        } catch (error) {
            console.log("Appwrite service :: deleteProfile :: error ", error);
            throw error;
        }
    }
}

const profileService = new Service();
export default profileService;  