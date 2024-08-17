import supabase, { supabaseUrl } from "./supabase";

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
export async function createUrl({
  title,
  longUrl,
  customUrl,
  qrcode,
  user_id,
}) {
  
  let shortUrl;
  let isUnique = false;

  // Generate unique short url
  while(!isUnique) {
    shortUrl = Math.random().toString(36).substr(2, 6);

    const {data} = await supabase.from("urls").select("short_url").eq("short_url", shortUrl);

    if(data.length===0) {
        isUnique = true;
    }
  }
  
  // upload qr code to database bucket
  const fileName = `qr-${shortUrl}`;

  const { error: storageError } = await supabase.storage
    .from("qr")
    .upload(fileName, qrcode);

  if (storageError) throw new Error(storageError.message);

  const qr = `${supabaseUrl}/storage/v1/object/public/qr/${fileName}`;

  // insert the url record to the database table "urls"
  try {
    const { data, error } = await supabase.auth
      .from("urls")
      .insert([
        {
          title,
          user_id,
          original_url: longUrl,
          short_url: shortUrl,
          custom_url: customUrl || null,
          qr,
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
