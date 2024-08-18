import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { urlState } from "../context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import * as Yup from "yup";
import { QRCode } from "react-qrcode-logo";
import Error from "./Error";
import useFetch from "../hooks/useFetch";
import { createUrl } from "../db/apiUrls";
import { BeatLoader } from "react-spinners";

const CreateLink = () => {
  const { user } = urlState();
  const navigate = useNavigate();
  const ref = useRef();

  const [searchParams, setSearchParams] = useSearchParams();

  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  function handleInputChange(e) {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  }

  async function handleCreateLink() {
    setErrors({});

    try {
      const schema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        longUrl: Yup.string()
          .url("Enter a valid url")
          .required("Long url is required"),
        customUrl: Yup.string(),
      });

      await schema.validate(formData, { abortEarly: false });

      const canvas = ref.current?.canvasRef?.current;
      if (!canvas) throw new Error("Canvas not found!");

      const dataUrl = canvas.toDataURL("image/png");
      console.log("QR Code Data URL:", dataUrl);

      const blob = await new Promise((resolve, reject) =>
        canvas.toBlob((result) => {
          if (result) {
            console.log(result.type);
            console.log(result.size);
            resolve(result);
          } else reject(new Error("Blob creation failed!"));
        })
      );

      console.log(blob);

      await fnCreateUrl(blob);
      //api call
    } catch (e) {
      if (e?.inner) {
        // handling validation errors
        const newErrors = {};
        e.inner.forEach((err) => (newErrors[err.path] = err.message));
        setErrors(newErrors);
      } else {
        // handling general errors/ errors during blob creation
        console.error(e.message);
        setErrors({ general: e.message });
      }
    }
  }

  const {
    data,
    loading,
    error,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formData, user_id: user.id });

  useEffect(() => {
    if (data && !error) {
      navigate(`/link/${data[0].id}`);
    }
  }, [data, error]);

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) {
          setSearchParams({});
          setErrors({});
          setFormData({ title: "", longUrl: "", customUrl: "" });
        }
      }}
    >
      <DialogTrigger>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>

          {errors.general && <Error message={errors.general} />}

          {formData?.longUrl && (
            <QRCode size={250} value={formData.longUrl} ref={ref} />
          )}

          <Input
            id="title"
            value={formData.title}
            placeholder="Short link's title"
            onChange={handleInputChange}
          />
          {errors.title && <Error message={errors.title} />}

          <Input
            id="longUrl"
            type="url"
            value={formData.longUrl}
            placeholder="Enter your long url"
            onChange={handleInputChange}
          />
          {errors.longUrl && <Error message={errors.longUrl} />}

          <div className="flex items-center gap-2">
            <Card className="p-2">clipper.in</Card> /
            <Input
              id="customUrl"
              value={formData.customUrl}
              placeholder="Enter custom url (optional)"
              onChange={handleInputChange}
            />
          </div>
        </DialogHeader>

        <DialogFooter>
          <Button
            disabled={loading}
            variant="destructive"
            onClick={handleCreateLink}
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
