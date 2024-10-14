import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {BeatLoader} from "react-spinners";
import Error from "./Error";
import * as Yup from "yup";
import useFetch from "../hooks/useFetch";
import { login } from "../db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { urlState } from "../context";

const Login = () => {

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  function handleInputChange(e) {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }

  const {data, loading, error, fn:fnLogin} = useFetch(login, formData);
  const {fetchUser} = urlState();

  useEffect(() => {
    if(error===null && data) {
      // console.log(data);
      navigate(`/dashboard/?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [data, error]);

  async function handleLogin() {
    setErrors({});

    try {
      const schema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters long").required("Password is required")
      });

      await schema.validate(formData, {abortEarly: false});
      fnLogin();
      // api call
    } catch(e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }  
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>to your account if you already have one!</CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <Input type="email" name="email" placeholder="Enter email" onChange={handleInputChange} />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div>
          <Input type="password" name="password" placeholder="Enter password" onChange={handleInputChange} />
          {errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin}>
          {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
