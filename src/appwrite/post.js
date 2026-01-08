import conf from "@/conf/conf.js";
import { Client, TablesDB, Storage, Query, ID } from "appwrite";
import toast from "react-hot-toast";
import { getToastStyles } from "@/utils/toastStyles";

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

  async createPost({ slug, title, subtitle, content, featuredImage, status, publishStatus, userId, authorName }) {
    const toastId = toast.loading("Creating post...", {
      style: getToastStyles(),
    });
    try {
      const post = await this.databases.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteArticlesTableId,
        rowId: ID.unique(),
        data: {
          slug,
          title,
          subtitle,
          content,
          featuredImage,
          status,
          publishStatus,
          userId,
          authorName,
        },
      });
      toast.success("Post created successfully!", {
        id: toastId,
        style: getToastStyles("success"),
      });
      return post;
    } catch (error) {
      console.log("Appwrite service :: createPost :: error ", error);
      toast.error(error.message || "Failed to create post", {
        id: toastId,
        style: getToastStyles("error"),
      });
      throw error;
    }
  }

  async updatePost(id, { slug, title, subtitle, content, featuredImage, status, publishStatus, authorName }) {
    const toastId = toast.loading("Updating post...", {
      style: getToastStyles(),
    });
    try {
      const post = await this.databases.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteArticlesTableId,
        rowId: id,
        data: {
          slug,
          title,
          subtitle,
          content,
          featuredImage,
          status,
          publishStatus,
          authorName
        },
      });
      toast.success("Post updated successfully!", {
        id: toastId,
        style: getToastStyles("success"),
      });
      return post;
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error ", error);
      toast.error(error.message || "Failed to update post", {
        id: toastId,
        style: getToastStyles("error"),
      });
      throw error;
    }
  }

  async deletePost(id) {
    const toastId = toast.loading("Deleting post...", {
      style: getToastStyles(),
    });
    try {
      await this.databases.deleteRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteArticlesTableId,
        rowId: id,
      });
      toast.success("Post deleted successfully!", {
        id: toastId,
        style: getToastStyles("success"),
      });
      return true;
    } catch (error) {
      console.log("Appwrite service :: deletePost :: error ", error);
      toast.error(error.message || "Failed to delete post", {
        id: toastId,
        style: getToastStyles("error"),
      });
      return false;
    }
  }

  async getPost(id) {
    try {
      return await this.databases.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteArticlesTableId,
        rowId: id,
      });
    } catch (error) {
      console.log("Appwrite service :: getPost :: error ", error);
      toast.error("Failed to load post", {
        style: getToastStyles("error"),
      });
      throw error;
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
      toast.error("Failed to load posts", {
        style: getToastStyles("error"),
      });
      return false;
    }
  }

  // file upload service
  async uploadFile(file) {
    const toastId = toast.loading("Uploading image...", {
      style: getToastStyles(),
    });
    try {
      const uploadedFile = await this.bucket.createFile({
        bucketId: conf.appwriteBucketId,
        fileId: ID.unique(),
        file,
      });
      toast.success("Image uploaded successfully!", {
        id: toastId,
        style: getToastStyles("success"),
      });
      return uploadedFile;
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error ", error);
      toast.error(error.message || "Failed to upload image", {
        id: toastId,
        style: getToastStyles("error"),
      });
      return null;
    }
  }

  async deleteFile(fileId) {
    const toastId = toast.loading("Deleting image...", {
      style: getToastStyles(),
    });
    try {
      await this.bucket.deleteFile({
        bucketId: conf.appwriteBucketId,
        fileId,
      });
      toast.success("Image deleted successfully!", {
        id: toastId,
        style: getToastStyles("success"),
      });
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error ", error);
      toast.error(error.message || "Failed to delete image", {
        id: toastId,
        style: getToastStyles("error"),
      });
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
