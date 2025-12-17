import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPost: null,
  posts: [],
  userPosts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload.post;
    },
    addPost: (state, action) => {
      const newPost = action.payload.post;
      state.posts.push(newPost);
      // Also add to userPosts since it's the user's own post
      state.userPosts.push(newPost);
    },
    editPost: (state, action) => {
      const updated = action.payload.post;

      // Update in posts array
      const index = state.posts.findIndex((p) => p.$id === updated.$id);
      if (index !== -1) state.posts[index] = updated;

      // Update in userPosts array
      const userIndex = state.userPosts.findIndex((p) => p.$id === updated.$id);
      if (userIndex !== -1) state.userPosts[userIndex] = updated;

      // Update currentPost if it's the same
      if (state.currentPost?.$id === updated.$id) {
        state.currentPost = updated;
      }
    },
    removePost: (state, action) => {
      const id = action.payload;

      // Remove from posts
      state.posts = state.posts.filter((p) => p.$id !== id);

      // Remove from userPosts
      state.userPosts = state.userPosts.filter((p) => p.$id !== id);

      // Clear currentPost if it's the same
      if (state.currentPost?.$id === id) {
        state.currentPost = null;
      }
    },
    setUserPosts: (state, action) => {
      state.userPosts = action.payload.userPosts;
    },
    clearAllPosts: (state) => {
      state.posts = [];
      state.userPosts = [];
      state.currentPost = null;
    },
  },
});

export const { setPosts, setCurrentPost, addPost, editPost, removePost, setUserPosts, clearAllPosts } = postSlice.actions;
export default postSlice.reducer;
