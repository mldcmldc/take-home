import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import SecondPage from "./pages/SecondPage";
import { Toaster } from "./components/ui/toaster";
import RedirectPage from "./pages/RedirectPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/second" element={<SecondPage />} />
          <Route path="/:slug" element={<RedirectPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </StrictMode>
  </QueryClientProvider>,
);
