import { createSlice } from "@reduxjs/toolkit";
import { getInitialTheme } from "@/utils/theme";

const initialState = {
  mode: getInitialTheme(), 
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