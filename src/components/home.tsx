import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the boot screen
    navigate("/");
  }, [navigate]);

  return (
    <div className="w-screen h-screen bg-black">
      {/* This component just redirects to the boot screen */}
    </div>
  );
}

export default Home;
