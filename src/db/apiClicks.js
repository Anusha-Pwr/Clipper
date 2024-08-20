import supabase from "./supabase";
import { UAParser } from "ua-parser-js";

export async function getClicksForUrls(urlIds) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to fetch clicks.");
  }

  return data;
}

const parser = new UAParser();

export async function storeClicks({ id, originalUrl }) {
  console.log(id, originalUrl);
  try {
    const res = parser.getResult();
    const device = res.type || "Desktop";

    const response = await fetch("https://ipapi.co/json");
    const { city, country_name: country } = await response.json();

    await supabase.from("clicks").insert({
      url_id: id,
      city,
      device,
      country,
    });

    window.location.href = originalUrl;
  } catch (error) {
    console.error("Error recording click");
  }
}

export async function getClicksData(urlId) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", urlId);

  if (error) {
    console.error(error.message);
    throw new Error("Error fetching clicks data");
  }

  return data;
}
