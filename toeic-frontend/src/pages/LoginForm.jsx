import { useState } from "react";
import { XIcon, LogInIcon } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { useUser } from "../context/UserContext";

function LoginForm({ onClose, onSwitch }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const { setUser } = useUser();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.login(formData);
      const { token } = res.data;

      const decoded = jwtDecode(token);
      const username = decoded.sub;

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      setUser({ username });
      onClose();
      window.location.href = "/";
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        onClick={onClose}
      >
        <XIcon size={20} />
      </button>

      <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6">🔐 Welcome Back</h2>

      {error && (
        <div className="text-red-500 text-sm text-center mb-3">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:from-blue-600 hover:to-blue-800 flex items-center justify-center gap-2 transition-all"
        >
          <LogInIcon size={20} /> Login
        </button>
      </form>

      <p className="text-sm text-center mt-5 text-gray-600">
        Don’t have an account?{" "}
        <button onClick={onSwitch} className="text-blue-600 hover:underline">
          Register here
        </button>
      </p>
    </div>
  );
}

export default LoginForm;
