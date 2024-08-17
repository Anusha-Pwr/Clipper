import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Filter } from "lucide-react";
import { urlState } from "../context";
import useFetch from "../hooks/useFetch";
import { getUrls } from "../db/apiUrls";
import { getClicksForUrls } from "../db/apiClicks";
import Error from "../components/Error";
import LinkCard from "../components/LinkCard";

const DashBoard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = urlState();
  const {
    data: urls,
    loading,
    error,
    fn: fnGetUrls,
  } = useFetch(getUrls, user?.id);
  const {
    data: clicks,
    loading: loadingClicks,
    fn: fnGetClicksForUrls,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    if (user) {
      fnGetUrls();
    }
  }, []);

  useEffect(() => {
    if (urls?.length) {
      fnGetClicksForUrls();
    }
  }, [urls?.length]);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {(loading || loadingClicks) && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        <Button>Create Link</Button>
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Filter your links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2 p-1" />
      </div>

      {error && <Error message={error.message} />}
      
      {filteredUrls?.map((url, i) => <LinkCard key={i} url={url} fetchUrls={fnGetUrls} />)}
    </div>
  );
};

export default DashBoard;
