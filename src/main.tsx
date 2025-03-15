import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./redux/index.ts";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={Store} >
      <App />
    </Provider>
  </BrowserRouter>
);
