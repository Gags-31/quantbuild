import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import EntityListPage from "./pages/EntityListPage";
import type { EntityConfig } from "./entityConfig";
import { entityConfigs as staticEntityConfigs } from "./entityConfig";
import { appInfo as staticAppInfo } from "./appInfo";

interface AppProps {
  entityConfigs?: EntityConfig[];
  appInfo?: { name: string; appType: string; features: string[] };
}

export default function App({ entityConfigs, appInfo }: AppProps) {
  const configs = entityConfigs ?? staticEntityConfigs;
  const info = appInfo ?? staticAppInfo;

  return (
    <div className="min-h-screen">
      <Navbar entityConfigs={configs} appInfo={info} />
      <Toast />
      <Routes>
        <Route path="/" element={<Home appInfo={info} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        {configs.map((cfg) => (
          <Route
            key={cfg.resource}
            path={"/" + cfg.resource}
            element={<ProtectedRoute><EntityListPage config={cfg} /></ProtectedRoute>}
          />
        ))}
      </Routes>
    </div>
  );
}
