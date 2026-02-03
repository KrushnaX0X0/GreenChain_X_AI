import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 1. Extract the token from the URL (?token=...)
    const token = searchParams.get("token");

    if (token) {
      // 2. Set the token in localStorage
      localStorage.setItem("token", token);

      // 3. Decode token to check for roles
      try {
        const decoded = jwtDecode(token);
        const roles = decoded.roles || [];
        const isAdmin = roles.includes("ROLE_ADMIN");

        // 4. Navigate based on role
        if (isAdmin) {
          navigate("/dashbord", { replace: true });
        } else {
          navigate("/userdashbord", { replace: true });
        }
      } catch (e) {
        console.error("Failed to decode token", e);
        navigate("/userdashbord", { replace: true }); // Fallback
      }
    } else {
      // If no token found, something went wrong, go back to login
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
        Securing Session...
      </p>
    </div>
  );
};

export default OAuthSuccess;