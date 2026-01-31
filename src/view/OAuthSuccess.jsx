import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <h2 className="text-xl font-semibold text-green-700">
        Logging you in with Google...
      </h2>
    </div>
  );
};

export default OAuthSuccess;
