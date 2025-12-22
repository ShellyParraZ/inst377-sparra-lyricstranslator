window.onload = () => {
  // getting the original and target language from Home Page
  const original_langDropdown = localStorage.getItem("originalLangName");
  const target_langDropdown = localStorage.getItem("targetLangName");

  // getting the original and target language empty HEADER from full_lyrics
  const originalHeader = document.getElementById("o_langTitle");
  const targetHeader = document.getElementById("t_langTitle");

  // getting full original and target lyrics from Home Page (if it exists)
  const o_lyrics = localStorage.getItem("fullLyrics");
  const t_lyrics = localStorage.getItem("translatedLyrics");

  // getting empty fullLyricsText
  const o_lyricsBox = document.getElementById("fullOriginalLyricsText");
  const t_lyricsBox = document.getElementById("fullTargetLyricsText");

  // setting the languages in the headers/titles
  if (original_langDropdown) {
    originalHeader.textContent = `Original Lyrics (${original_langDropdown})`;
  } else {
    originalHeader.textContent = "Original Lyrics";
  }
  if (target_langDropdown) {
    targetHeader.textContent = `Translated Lyrics (${target_langDropdown})`;
  } else {
    targetHeader.textContent = "Translated Lyrics";
  }

  // original lyrics
  if (o_lyrics) {
    o_lyricsBox.textContent = o_lyrics;
  } else {
    o_lyricsBox.textContent = "No lyrics available.";
  }

  // translated lyrics
  if (t_lyrics) {
    t_lyricsBox.textContent = t_lyrics;
  } else {
    t_lyricsBox.textContent = "No translation available.";
  }

  o_lyricsBox.textContent = o_lyrics;
  t_lyricsBox.textContent = t_lyrics;
};
