import supabase, { supabaseUrl } from "./supabase";
import bcrypt from "bcryptjs";

export async function getUrls(user_id) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error.message);
    throw new Error("Error fetching urls.");
  }

  return data;
}

export async function deleteUrl(id) {
  const { data, error } = await supabase.from("urls").delete().eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Error deleting url.");
  }

  return data;
}

/* creating the new url record */
export async function createUrl(
  { title, longUrl, customUrl, expirationDate, password, user_id },
  qrcode
) {
  let shortUrl;
  let isUnique = false;

  // Generate unique short url
  while (!isUnique) {
    shortUrl = Math.random().toString(36).substr(2, 6);

    const { data } = await supabase
      .from("urls")
      .select("short_url")
      .eq("short_url", shortUrl);

    if (data.length === 0) {
      isUnique = true;
    }
  }

  // upload qr code to database bucket
  const fileName = `qr-${shortUrl}`;

  // console.log(qrcode.type);
  // console.log(qrcode.size);
  const { error: storageError } = await supabase.storage
    .from("qr")
    .upload(fileName, qrcode, {
      contentType: "image/png",
    });

  if (storageError) throw new Error(storageError.message);

  const qr = `${supabaseUrl}/storage/v1/object/public/qr/${fileName}`;

  let hashedPassword = null;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  // insert the url record to the database table "urls"
  try {
    const { data, error } = await supabase
      .from("urls")
      .insert([
        {
          title,
          original_url: longUrl,
          custom_url: customUrl || null,
          short_url: shortUrl,
          user_id,
          qr,
          expiration_date: expirationDate,
          password: hashedPassword,
        },
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error.code === "23505") {
      throw new Error(
        "Custom URL already exists. Please choose a different one."
      );
    } else {
      console.error(error.message);
      throw new Error("Error creating short url.");
    }
  }
}

export async function getLongUrl(linkId) {
  const { data, error } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${linkId}, custom_url.eq.${linkId}`)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Short url not found");
  }

  return data;
}

export async function getUrlInfo({ id, user_id }) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Error fetching url data");
  }

  return data;
}
