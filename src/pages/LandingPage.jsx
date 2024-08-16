import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {

  const [longUrl, setLongUrl] = useState();

  const navigate = useNavigate();

  function handleShorten(e) {
    e.preventDefault();

    if(longUrl) {
      navigate(`/auth?createNew=${longUrl}`);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="my-10 text-3xl sm:my-16 sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
        This is the only URL shortener you'll ever need! 👇
      </h2>
      <form className="sm:h-14 sm:flex-row flex flex-col w-full gap-2 md:w-2/4" onSubmit={handleShorten}>
        <Input
          type="url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter your long url"
          className="h-full py-4 px-4"
        />
        <Button type="submit" variant="destructive" className="h-full">
          Shorten!
        </Button>
      </form>
      <img src="/banner.png" className="w-full my-11 md:px-11" />

      <Accordion type="multiple" collapsible className="w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            How does the Clipper URL shortener work?
          </AccordionTrigger>
          <AccordionContent>
            When you enter a long URL, our system generates a shorter version of
            that URL. This shortened URL redirects to the original long URL when
            accessed.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Do I need an account to use the app?
          </AccordionTrigger>
          <AccordionContent>
            Yes. Creating an account allows you to manage your URLs, view
            analytics, and customize your short URLs.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            What analytics are available for my shortened URLs?
          </AccordionTrigger>
          <AccordionContent>
            You can view the number of clicks, geolocation data of the clicks
            and device types (mobile/desktop) for each of your shortened URLs.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LandingPage;
