import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark", // "light" | "dark"
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem("theme", state.mode);
    }
  },
});

export const { toggleMode, setTheme } = themeSlice.actions;
export default themeSlice.reducer;