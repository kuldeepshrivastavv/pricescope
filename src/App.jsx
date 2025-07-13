import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Routes from "./Routes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <Routes />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;