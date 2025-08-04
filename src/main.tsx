import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // Tailwind + Fonts
import "./App.css";   // Your custom overrides (if any)

createRoot(document.getElementById("root")!).render(<App />);
