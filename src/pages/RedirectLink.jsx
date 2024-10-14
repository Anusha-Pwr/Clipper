import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { getLongUrl } from "../db/apiUrls";
import { useParams } from "react-router-dom";
import { storeClicks } from "../db/apiClicks";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();

  const { loading, data, error, fn: fnGetLongUrl } = useFetch(getLongUrl, id);

  const {
    loading: statsLoading,
    error: statsError,
    fn: fnStoreClicks,
  } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fnGetLongUrl();
    // console.log(data);
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStoreClicks();
    }
  }, [loading]);

  if (loading || statsLoading)
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <div>Redirecting...</div>
      </>
    );

  if (error || statsError) {
    <>
      <p>Error: {error?.message || statsError?.message}</p>
      <p>Unable to redirect.</p>
    </>;
  }

  return null;
};

export default RedirectLink;
