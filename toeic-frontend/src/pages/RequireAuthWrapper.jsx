import { useUser } from "../context/UserContext";

function RequireAuthWrapper({ children }) {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-xl">
        🔒 Bạn cần đăng nhập để truy cập trang này.
      </div>
    );
  }

  return children;
}

export default RequireAuthWrapper;
