import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPost: null,
  posts: [],
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
      state.posts.push(action.payload.post);
    },
    editPost: (state, action) => {
      const updated = action.payload.post;

      const index = state.posts.findIndex((p) => p.$id === updated.$id);

      if (index !== -1) state.posts[index] = updated;

      if (state.currentPost.$id === updated.$id) {
        state.currentPost = updated;
      }
    },
    removePost: (state, action) => {
      const id = action.payload;

      state.posts = state.posts.filter((p) => p.$id !== id);

      if (state.currentPost?.$id === id) {
        state.currentPost = null;
      }
    },
  },
});

export const { setPosts, setCurrentPost, addPost, editPost, removePost } = postSlice.actions;
export default postSlice.reducer;
