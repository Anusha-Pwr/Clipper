import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { urlState } from "../context";

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();

  const { isAuthenticated, loading } = urlState();

  useEffect(() => {
    if (!isAuthenticated && !loading) navigate("/auth");
  }, [isAuthenticated, loading]);

  if (loading) return <BarLoader width={"100%"} color="#36d7b7" />;

  if(isAuthenticated) return children;
};

export default RequireAuth;
