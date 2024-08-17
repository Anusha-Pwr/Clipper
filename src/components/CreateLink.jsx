import React, { useState } from "react";
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

const CreateLink = () => {
  const { user } = urlState();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: ""
  });

  function handleInputChange(e) {
    setFormData((prevData) => ({
        ...prevData,
        [e.target.id]: e.target.value
    }));
  }

  return (
    <Dialog defaultOpen={longLink} onOpenChange={(res) => !res && setSearchParams({})}>
      <DialogTrigger>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
          <Input id="title" value={formData.title} placeholder="Short link's title" onChange={handleInputChange} />

          <Input id="longUrl" value={formData.longUrl} placeholder="Enter your long url" onChange={handleInputChange} />

          <div className="flex items-center gap-2">
            <Card className="p-2">clipper.in</Card> /
            <Input id="customUrl" value={formData.customUrl} placeholder="Enter custom url (optional)" onChange={handleInputChange} />
          </div>
        </DialogHeader>

        <DialogFooter>
          <Button variant="destructive">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
