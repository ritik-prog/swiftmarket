import { combineReducers } from "redux";
import themeReducer from "./theme/themeSlice";
import userReducer from "./user/userSlice";
import cartReducer from "./cart/cartSlice";
import wishlistReducer from "./wishlist/wishlistSlice";
import sidebarSlice from "./sidebar/sidebarSlice";

const rootReducer = combineReducers({
  theme: themeReducer,
  user: userReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  sidebar: sidebarSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
