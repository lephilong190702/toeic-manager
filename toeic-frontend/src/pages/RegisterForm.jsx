import { useState } from "react";
import { XIcon, UserPlusIcon } from "lucide-react";
import api from "../services/api";

function RegisterForm({ onClose, onSwitch }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { username, password, confirmPassword } = formData;

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.register({ username, password });
      setSuccess(true);
      setTimeout(onSwitch, 1000);
    } catch (err) {
      setError("Username already exists or server error");
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-white via-green-50 to-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        onClick={onClose}
      >
        <XIcon size={20} />
      </button>

      <h2 className="text-3xl font-extrabold text-center text-green-800 mb-6">📝 Create Account</h2>

      {error && (
        <div className="text-red-500 text-sm text-center mb-3">{error}</div>
      )}
      {success && (
        <div className="text-green-600 text-sm text-center mb-3">
          ✅ Registration successful!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          value={username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold hover:from-green-600 hover:to-green-800 flex items-center justify-center gap-2 transition-all"
        >
          <UserPlusIcon size={20} /> Register
        </button>
      </form>

      <p className="text-sm text-center mt-5 text-gray-600">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-green-600 hover:underline"
        >
          Login here
        </button>
      </p>
    </div>
  );
}

export default RegisterForm;
