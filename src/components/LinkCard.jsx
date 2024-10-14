import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Check, Copy, Download, LinkIcon, Lock, Trash } from "lucide-react";
import useFetch from "../hooks/useFetch";
import { deleteUrl } from "../db/apiUrls";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url, fetchUrls }) => {
  const {
    data,
    loading,
    error,
    fn: fnDeleteUrl,
  } = useFetch(deleteUrl, url?.id);

  const [copied, setCopied] = useState(false);
  const copiedTimeOutRef = useRef();

  useEffect(() => {
    return () => {
      if (copiedTimeOutRef.current) {
        clearTimeout(copiedTimeOutRef.current);
      }
    };
  }, []);

  function downloadImage() {
    const imgUrl = url?.qr;
    const fileName = url?.title;

    const anchor = document.createElement("a");
    anchor.href = imgUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);

    anchor.click();
    document.body.removeChild(anchor);
  }

  function handleCopyUrl() {
    navigator.clipboard.writeText(`https://clipper.in/${url?.short_url}`);
    setCopied(true);

    if (copiedTimeOutRef.current) {
      clearTimeout(copiedTimeOutRef.current);
    }

    copiedTimeOutRef.current = setTimeout(() => {
      setCopied(false);
    }, 500);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <div className="shrink-0 sm:h-24 sm:w-24 md:h-32 md:w-32">
        <img
          src={url?.qr}
          alt="qr code"
          className="h-full w-full object-contain ring ring-blue-500"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <Link to={`/link/${url?.id}`}>
          <span className="text-xl sm:text-2xl md:text-3xl font-extrabold hover:underline cursor-pointer mt-0 truncate">
            {url?.title}
          </span>

          <span className="text-lg sm:text-xl md:text-2xl flex gap-3 items-center text-blue-400 font-bold hover:underline cursor-pointe">
            <a className="truncate">
              {window.location.origin}/
              {url?.custom_url ? url.custom_url : url.short_url}
            </a>
            {url?.password && (
              <span className="text-green-500">
                <Lock className="h-5 w-5" />
              </span>
            )}
          </span>

          <span className="flex items-center gap-1 hover:underline cursor-pointer">
            <LinkIcon className="p-1" />
            <a className="truncate">{url?.original_url}</a>
          </span>
        </Link>
        <span className="flex items-end font-extralight text-xs flex-1">
          Created: {new Date(url?.created_at).toLocaleString()}
        </span>
        {url?.expiration_date && (
          <span className="flex items-end flex-1 font-extralight text-xs text-red-500">
            Expired: {new Date(url?.expiration_date).toLocaleString()}
          </span>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={handleCopyUrl}>
          {copied ? <Check className="text-green-500" /> : <Copy />}
        </Button>
        <Button variant="ghost" onClick={downloadImage}>
          <Download />
        </Button>
        <Button
          variant="ghost"
          onClick={async () => {
            await fnDeleteUrl();
            fetchUrls();
          }}
        >
          {loading ? <BeatLoader color="white" size={5} /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
