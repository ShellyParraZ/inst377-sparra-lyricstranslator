const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const supabaseClient = require("@supabase/supabase-js");
const validator = require("validator/lib/isISO6391");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// Initialize Supabase Client
const supabase_URL = process.env.SUPABASE_URL;
const supabase_Key = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabase_URL, supabase_Key);

app.get("/", (req, res) => {
  res.sendFile("public/home_page.html", { root: __dirname });
});

// get form submissions
app.get("/home_page", async (req, res) => {
  console.log("Attempting to GET all form submissions.");

  const { data, error } = await supabase.from("lyrics_data").select();

  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
    return;
  } else {
    res.send(data);
  }
});

app.post("/home_page", async (req, res) => {
  // Shows up in Terminal
  console.log("Adding song for translation.");
  console.log("Request", req.body);

  const artist = req.body.artist;
  const title = req.body.title;
  const original_lang = req.body.original_lang;
  const target_lang = req.body.target_lang;
  const original_lyrics = req.body.original_lyrics;
  const translated_lyrics = req.body.translated_lyrics;

  if (!validator(original_lang.toLowerCase())) {
    console.error(
      `Original Language Abbreviation: ${original_lang} is invalid.`
    );
    res.statusCode = 400;
    const errorJSON = {
      message: `Original Language Abbreviation: ${original_lang} is not a valid abbreviation.`,
    };
    res.header("Content-type", "application/json");
    res.send(JSON.stringify(errorJSON));
    return;
  }
  if (!validator(target_lang.toLowerCase())) {
    console.error(`Target Language Abbreviation: ${target_lang} is invalid.`);
    res.statusCode = 400;
    const errorJSON = {
      message: `Target Language Abbreviation: ${target_lang} is not a valid abbreviation.`,
    };
    res.header("Content-type", "application/json");
    res.send(JSON.stringify(errorJSON));
    return;
  }

  const { data, error } = await supabase
    .from("lyrics_data")
    .insert({
      title,
      artist,
      original_lang: original_lang,
      target_lang: target_lang,
      original_lyrics: original_lyrics,
      translated_lyrics: translated_lyrics,
    })
    .select();

  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
    return;
  } else {
    res.send(data);
  }
});

app.get("/popular", async (req, res) => {
  try {
    const response = await fetch(
      "https://itunes.apple.com/search?term=pop&entity=song&limit=10"
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch popular songs" });
  }
});

app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});
