import { combineReducers } from "redux";
import themeReducer from "./theme/themeSlice";
import userReducer from "./user/userSlice";

const rootReducer = combineReducers({
  theme: themeReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
