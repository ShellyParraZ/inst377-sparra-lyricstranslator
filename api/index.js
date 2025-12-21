import { createClient } from "@supabase/supabase-js";

// Initialize Supabase using environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// DeepL API key
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  // to prevent 405 error
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // blocks everything except POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, artist, originalLang, targetLang, originalLyrics } = req.body;

  if (!title || !artist || !originalLang || !targetLang || !originalLyrics) {
    return res.status(400).json({ error: "Missing required inputs" });
  }

  try {
    // Check if translation exists
    const { data: existing, error: selectError } = await supabase
      .from("lyrics_data")
      .select(
        "title, artist, original_lyrics, translated_lyrics, original_lang, target_lang"
      )
      .eq("title", title)
      .eq("artist", artist)
      .eq("original_lang", originalLang)
      .eq("target_lang", targetLang)
      .limit(1);

    if (selectError) throw selectError;

    if (existing && existing.length > 0) {
      return res.status(200).json(existing[0]); // return previous translation
    }

    // fetching DEEPL API to get lyric translation
    const deeplRes = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        auth_key: DEEPL_API_KEY,
        text: originalLyrics,
        target_lang: targetLang,
      }),
    });

    const deeplData = await deeplRes.json();
    if (!deeplData.translations || !deeplData.translations[0].text) {
      throw new Error("!!!DeepL translation failed!!!");
    }

    const translatedLyrics = deeplData.translations[0].text;

    // INSERT THE NEW TRANSLATION
    const { data, error: insertError } = await supabase
      .from("lyrics_data")
      .insert([
        {
          title,
          artist,
          original_lang: originalLang,
          target_lang: targetLang,
          original_lyrics: originalLyrics,
          translated_lyrics: translatedLyrics,
        },
      ])
      .select();

    if (insertError) throw insertError;

    return res.status(201).json(data[0]);
  } catch (extra_err) {
    console.error(extra_err);
    return res.status(500).json({ error: extra_err.message });
  }
}
