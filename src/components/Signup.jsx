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
import { BeatLoader } from "react-spinners";
import Error from "./Error";
import * as Yup from "yup";
import useFetch from "../hooks/useFetch";
import { signup } from "../db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { urlState } from "../context";

const Signup = () => {
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  function handleInputChange(e) {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  }

  const { data, loading, error, fn: fnSignup } = useFetch(signup, formData);
  const { fetchUser } = urlState();

  useEffect(() => {
    if (error === null && data) {
      // console.log(data);
      navigate(`/dashboard/?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [data, error]);

  async function handleSignup() {
    setErrors({});

    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters long")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Profile picture is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      fnSignup();
      // api call
    } catch (e) {
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
        <CardTitle>Signup</CardTitle>
        <CardDescription>Create an account if you haven't yet!</CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <Input
            type="name"
            name="name"
            placeholder="Enter name"
            onChange={handleInputChange}
          />
          {errors.name && <Error message={errors.name} />}
        </div>
        <div>
          <Input
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div>
          <Input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={handleInputChange}
          />
          {errors.password && <Error message={errors.password} />}
        </div>
        <div>
          <Input
            type="file"
            name="profile_pic"
            accept="image/*"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup}>
          {loading ? (
            <BeatLoader size={10} color="#36d7b7" />
          ) : (
            "Create Account"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
