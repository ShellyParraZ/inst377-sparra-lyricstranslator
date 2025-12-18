import { createClient } from "@supabase/supabase-js";

// Initialize Supabase using environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    title,
    artist,
    originalLang,
    targetLang,
    originalLyrics,
    translatedLyrics,
  } = req.body;

  if (!title || !artist || !originalLang || !targetLang) {
    return res.status(400).json({ error: "Missing required inputs" });
  }

  try {
    // Check if translation exists
    const { data: existing, error: selectError } = await supabase
      .from("lyrics_data")
      .select("*")
      .eq("title", title)
      .eq("artist", artist)
      .eq("original_lang", originalLang)
      .eq("target_lang", targetLang)
      .limit(1);

    if (selectError) throw selectError;

    if (existing && existing.length > 0) {
      return res.status(200).json(existing[0]); // return previous translation
    }

    // Insert the new translation
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
