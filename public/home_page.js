window.onload = () => {
  // variables
  const original_language = document.getElementById("original_language");
  const target_language = document.getElementById("target_language");
  const originalBox = document.querySelector(".original_lyrics pre");
  const translatedBox = document.querySelector(".translated_lyrics pre");

  // hardcoded languages for target and original dropdown menus
  const sourceLangDeepL = [
    { code: "AR", name: "Arabic" },
    { code: "BG", name: "Bulgarian" },
    { code: "CS", name: "Czech" },
    { code: "DA", name: "Danish" },
    { code: "DE", name: "German" },
    { code: "EL", name: "Greek" },
    { code: "EN", name: "English" },
    { code: "ES", name: "Spanish" },
    { code: "ET", name: "Estonian" },
    { code: "FI", name: "Finnish" },
    { code: "FR", name: "French" },
    { code: "HE", name: "Hebrew" },
    { code: "HU", name: "Hungarian" },
    { code: "ID", name: "Indonesian" },
    { code: "IT", name: "Italian" },
    { code: "JA", name: "Japanese" },
    { code: "KO", name: "Korean" },
    { code: "LT", name: "Lithuanian" },
    { code: "LV", name: "Latvian" },
    { code: "NB", name: "Norwegian Bokmål" },
    { code: "NL", name: "Dutch" },
    { code: "PL", name: "Polish" },
    { code: "PT", name: "Portuguese" },
    { code: "RO", name: "Romanian" },
    { code: "RU", name: "Russian" },
    { code: "SK", name: "Slovak" },
    { code: "SL", name: "Slovenian" },
    { code: "SV", name: "Swedish" },
    { code: "TH", name: "Thai" },
    { code: "TR", name: "Turkish" },
    { code: "UK", name: "Ukrainian" },
    { code: "VI", name: "Vietnamese" },
    { code: "ZH", name: "Chinese" },
  ];

  const targetLangDeepL = [
    { code: "AR", name: "Arabic" },
    { code: "BG", name: "Bulgarian" },
    { code: "CS", name: "Czech" },
    { code: "DA", name: "Danish" },
    { code: "DE", name: "German" },
    { code: "EL", name: "Greek" },
    { code: "EN", name: "English" },
    { code: "ES", name: "Spanish" },
    { code: "ET", name: "Estonian" },
    { code: "FI", name: "Finnish" },
    { code: "FR", name: "French" },
    { code: "HE", name: "Hebrew" },
    { code: "HU", name: "Hungarian" },
    { code: "ID", name: "Indonesian" },
    { code: "IT", name: "Italian" },
    { code: "JA", name: "Japanese" },
    { code: "KO", name: "Korean" },
    { code: "LT", name: "Lithuanian" },
    { code: "LV", name: "Latvian" },
    { code: "NB", name: "Norwegian Bokmål" },
    { code: "NL", name: "Dutch" },
    { code: "PL", name: "Polish" },
    { code: "PT", name: "Portuguese" },
    { code: "RO", name: "Romanian" },
    { code: "RU", name: "Russian" },
    { code: "SK", name: "Slovak" },
    { code: "SL", name: "Slovenian" },
    { code: "SV", name: "Swedish" },
    { code: "TH", name: "Thai" },
    { code: "TR", name: "Turkish" },
    { code: "UK", name: "Ukrainian" },
    { code: "VI", name: "Vietnamese" },
    { code: "ZH", name: "Chinese" },
  ];

  // adding the languages to the original_language and target_language dropdown menus
  languages.forEach((lang) => {
    const option1 = document.createElement("option");
    option1.value = lang.code;
    option1.textContent = lang.name;
    original_language.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = lang.code;
    option2.textContent = lang.name;
    target_language.appendChild(option2);
  });

  // --- Simple Top 10 Popular Songs Chart ---
  fetch("/api/popular")
    .then((res) => res.json())
    .then((data) => {
      const chartDataArray = [["Song", "Popularity"]];
      data.results.forEach((song, index) => {
        chartDataArray.push([song.trackName, 10 - index]); // descending numbers from 10
      });

      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        const chartData = google.visualization.arrayToDataTable(chartDataArray);
        const options = {
          title: "Top 10 Popular Songs",
          legend: { position: "none" },
        };
        const chart = new google.visualization.ColumnChart(
          document.getElementById("popularSongsChart")
        );
        chart.draw(chartData, options);
      });
    });

  // USER: clicks Translate button
  // COLLECT all the details
  document
    .getElementById("songForm")
    .addEventListener("submit", async (details) => {
      details.preventDefault(); // stop page from refreshing

      const title = document.getElementById("song_title").value;
      const artist = document.getElementById("artist").value;
      const originalLang = original_language.value;
      const targetLang = target_language.value;

      console.log({ title, artist, originalLang, targetLang });

      // temporary loading messages
      originalBox.textContent = "lyrics are loading...";
      translatedBox.textContent = "lyrics are translating...";

      // FETCHING ORIGINAL LYRICS from Lyrics.oh API
      const originalLyrics = await getLyrics(artist, title);
      originalBox.textContent = originalLyrics;

      // FETCHING TRANSLATE for lyrics
      try {
        const response = await fetch("/home_page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            artist,
            title,
            original_lang: originalLang,
            target_lang: targetLang,
            original_lyrics: originalLyrics,
            translated_lyrics: originalLyrics,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Translation failed");
        }

        localStorage.setItem("fullLyrics", original_lyrics);
        localStorage.setItem("translatedLyrics", translated_lyrics);
        
      } catch (translateErr) {
        console.error(translateErr);
        translatedBox.textContent = "Error translating lyrics.";
      }
    });

  // RESTART BUTTON: restarts form
  document.getElementById("restartButton").addEventListener("click", () => {
    // clears text inputs
    document.getElementById("song_title").value = "";
    document.getElementById("artist").value = "";

    // resets dropdown menus
    document.getElementById("original_language").selectedIndex = 0;
    document.getElementById("target_language").selectedIndex = 0;

    // clears the preview text
    originalBox.textContent = "";
    translatedBox.textContent = "";

    console.log("Form Restarted");
  });

  // FULL LYRICS BUTTON: opens the full_lyrics.html page and shows the lyrics
  document.getElementById("fullLyricsButton").addEventListener("click", () => {
    const originalLyrics = originalBox.textContent;
    const translatedLyrics = translatedBox.textContent;

    // Provides an alert if there are no lyrics to display
    if (!originalLyrics) {
      alert("!!!No lyrics to display!!!");
      return;
    }

    // Saves the lyrics so the next page can read them
    localStorage.setItem("fullLyrics", originalLyrics);
    localStorage.setItem("translatedLyrics", translatedLyrics);

    // Goes to the full lyrics page
    window.location.href = "full_lyrics.html";
  });
};

// fetching the lyrics
async function getLyrics(artist, title) {
  try {
    const res = await fetch(
      `https://api.lyrics.ovh/v1/${artist}/${title}`
    );
    const data = await res.json();

    if (data.lyrics) {
      return data.lyrics;
    } else {
      return "Lyrics not found";
    }
  } catch (fetch_lyrics_error) {
    console.error("Error fetching lyrics:", fetch_lyrics_error);
    return "Error fetching lyrics";
  }
}
