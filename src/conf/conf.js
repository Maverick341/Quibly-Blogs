const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteArticlesTableId: String(import.meta.env.VITE_APPWRITE_ARTICLES_TABLE_ID),
    appwriteProfilesTableId: String(import.meta.env.VITE_APPWRITE_PROFILES_TABLE_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteAvatarBucketId: String(import.meta.env.VITE_APPWRITE_AVATAR_BUCKET_ID),
}

export default conf;