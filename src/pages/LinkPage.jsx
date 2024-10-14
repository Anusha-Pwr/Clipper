import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { deleteUrl, getUrlInfo } from "../db/apiUrls";
import { getClicksData } from "../db/apiClicks";
import { useParams } from "react-router-dom";
import { urlState } from "../context";
import { BarLoader, BeatLoader } from "react-spinners";
import { Button } from "../components/ui/button";
import { Copy, Download, LinkIcon, Lock, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LocationStats from "../components/LocationStats";
import DeviceStats from "../components/DeviceStats";

const LinkPage = () => {
  const { id } = useParams();
  const { user } = urlState();

  const {
    data: url,
    loading,
    error,
    fn: fnGetUrlInfo,
  } = useFetch(getUrlInfo, { id, user_id: user?.id });

  const {
    data: clicksForUrl,
    loading: clicksLoading,
    error: clicksError,
    fn: fnGetClicksData,
  } = useFetch(getClicksData, id);

  useEffect(() => {
    if (id && user?.id) {
      fnGetUrlInfo();
      fnGetClicksData();
    }
  }, [id, user?.id]);

  let link = "";
  if (url) {
    link = url?.custom_url ? url.custom_url : url.short_url;
  }

  const { loading: loadingDelete, fn: fnDeleteUrl } = useFetch(deleteUrl, id);

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

  return (
    <>
      {(loading || clicksLoading) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5  flex-wrap">
          <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold hover:underline cursor-pointer">
            {url?.title}
          </span>

          <div className="w-full">
            <a
              href={`${window.location.origin}/${link}`}
              target="_blank"
              className="text-xl sm:text-2xl md:text-3xl items-center gap-3 text-blue-400 font-bold hover:underline cursor-pointer break-words"
            >
              ${window.location.origin}/{link}
            </a>
          </div>

          {url?.password && (
            <div className="flex gap-2 items-center text-green-500">
              <span className="text-green-800 font-extrabold bg-green-200 rounded-full p-1 sm:p-1.5 md:p-2">
                Password protected
              </span>
              <span className="group-hover:block">
                <Lock className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9" />
              </span>
            </div>
          )}

          <a
            href={url?.original_url}
            target="_blank"
            className="flex items-center gap-1 hover:underline cursor-pointer"
          >
            <LinkIcon className="p-1" />
            {url?.original_url}
          </a>

          <span className="flex items-end font-extralight text-sm">
            Created:{" "}
            {url?.created_at && new Date(url?.created_at).toLocaleString()}
          </span>

          {url?.expiration_date && (
            <span className="flex items-end font-extralight text-sm text-red-500">
              Expired:{" "}
              {url?.expiration_date &&
                new Date(url?.expiration_date).toLocaleString()}
            </span>
          )}

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                navigator.clipboard.writeText(`https://clipper.in/${link}`)
              }
            >
              <Copy />
            </Button>
            <Button variant="ghost" onClick={downloadImage}>
              <Download />
            </Button>
            <Button variant="ghost" onClick={fnDeleteUrl}>
              {loadingDelete ? (
                <BeatLoader color="white" size={5} />
              ) : (
                <Trash />
              )}
            </Button>
          </div>

          <img
            src={url?.qr}
            alt="qr code"
            className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
          />
        </div>

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <Card>
              <CardHeader>
                <CardTitle>Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{clicksForUrl?.length}</p>
              </CardContent>
            </Card>
            <CardTitle>Location Info</CardTitle>
            <LocationStats stats={clicksForUrl ?? null} />

            <CardTitle>Device Info</CardTitle>
            <DeviceStats stats={clicksForUrl ?? null} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LinkPage;
