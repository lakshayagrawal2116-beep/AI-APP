import { createRoot } from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

// Publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// 👇 Wrapper to give Clerk access to React Router
function ClerkProviderWithRouter() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      <App />
    </ClerkProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ClerkProviderWithRouter />
  </BrowserRouter>
);
