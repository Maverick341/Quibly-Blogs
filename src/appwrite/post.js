import conf from "@/conf/conf.js";
import { Client, TablesDB, Storage, Query, ID } from "appwrite";

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

  async createPost({ title, subtitle, slug, content, featuredImage, status, publishStatus, userId, authorName }) {
    try {
      return await this.databases.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteArticlesTableId,
        rowId: slug,
        data: {
          title,
          subtitle,
          content,
          featuredImage,
          status,
          publishStatus,
          userId,
          authorName
        },
      });
    } catch (error) {
      console.log("Appwrite service :: createPost :: error ", error);
    }
  }

  async updatePost(slug, { title, subtitle, content, featuredImage, status, publishStatus, authorName }) {
    try {
      return await this.databases.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteArticlesTableId,
        rowId: slug,
        data: {
          title,
          subtitle,
          content,
          featuredImage,
          status,
          publishStatus,
          authorName
        },
      });
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error ", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteArticlesTableId,
        rowId: slug,
      });

      return true;
    } catch (error) {
      console.log("Appwrite service :: deletePost :: error ", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteArticlesTableId,
        rowId: slug,
      });
    } catch (error) {
      console.log("Appwrite service :: getPost :: error ", error);
    }
  }

  async getPosts(queries = []) {
    try {
      return await this.databases.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteArticlesTableId,
        queries,
      });
    } catch (error) {
      console.log("Appwrite service :: getPosts :: error ", error);
      return false;
    }
  }

  // file upload service
  async uploadFile(file) {
    try {
      return await this.bucket.createFile({
        bucketId: conf.appwriteBucketId,
        fileId: ID.unique(),
        file,
      });
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error ", error);
      return null;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile({
        bucketId: conf.appwriteBucketId,
        fileId,
      });
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error ", error);
      return false;
    }
  }

  getFileView(fileId) {
    return this.bucket.getFileView({
      bucketId: conf.appwriteBucketId,
      fileId,
    });
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview({
      bucketId: conf.appwriteBucketId,
      fileId,
    });

    // Construct preview URL directly using endpoint (getFilePreview is premium-only in latest Appwrite)
    // return `${conf.appwriteUrl}/storage/buckets/${conf.appwriteBucketId}/files/${fileId}/preview`;
  }
}

const postService = new Service();
export default postService;
