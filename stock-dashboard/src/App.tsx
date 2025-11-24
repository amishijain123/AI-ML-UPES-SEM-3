import { Routes, Route } from "react-router-dom";
import LoginPage from "./login/login";
import Dashboard from "./components/ui/dashboard";

function App() {
  return (
    <Routes>
      {/* Default page should be login */}
      <Route path="/" element={<LoginPage />} />

      {/* Dashboard page */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
