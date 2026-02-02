import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 1. Extract the token from the URL (?token=...)
    const token = searchParams.get("token");

    if (token) {
      // 2. Set the token in localStorage
      localStorage.setItem("token", token);
      
      // 3. Navigate to your dashboard
      // We use replace: true so the user can't "Go Back" to the loading screen
      navigate("/userdashbord", { replace: true });
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