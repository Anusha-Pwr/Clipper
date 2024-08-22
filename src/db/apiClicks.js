import supabase from "./supabase";
import { UAParser } from "ua-parser-js";
import bcrypt from "bcryptjs";

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
    const { data, error } = await supabase
      .from("urls")
      .select("expiration_date, password")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error.message);
      throw new Error("Error fetching expiration date");
    }

    const { expiration_date: expirationDate, password: hashedPassword } = data; // data retreived from supabase

    if (expirationDate && new Date(expirationDate) < new Date()) {
      // if the link has expired
      alert("This link has expired and is no longer available.");
      return;
    }

    if (hashedPassword) {
      // if the link is password-protected
      const userPassword = prompt(
        "This link is password-protected. Please enter the password:"
      );

      if (!userPassword) {
        alert("Password is required to access this link.");
        return;
      }

      // check for password matching
      const passwordIsValid = await bcrypt.compare(
        userPassword,
        hashedPassword
      );

      if (!passwordIsValid) {
        alert("Incorrect password. Access denied.");
        return;
      }
    }

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
