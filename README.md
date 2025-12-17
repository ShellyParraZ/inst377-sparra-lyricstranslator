# Lyrics Translator

In short, this system translates song’s lyrics into the user’s preferred language.

## Description
In today’s culturally diverse world, language barriers can prevent listeners from fully appreciating the meaning of songs. While many audio streaming services provide lyrics, they rarely offer translations, limiting the listener’s understanding. This project addresses that gap by allowing users to translate song lyrics into any language of their choice.

### The system is built as a web application with three main pages:
Home Page: Users enter a song title, artist, original language, and preferred translation language. The page displays the original and translated lyrics vertically, with options to expand to a full screen view or restart the search.

Full Lyrics Page: Provides a larger, horizontal view of the original and translated lyrics for easier comparison.

About Page: Explains the purpose of the project.

The web application uses two APIs: Lyrics.ovh to retrieve song lyrics and DeepL Translate to translate them into the selected language. The frontend is built with HTML and CSS. The backend functionality and API integration will be managed by JavaScript. SQLite will temporarily store user search history for improved performance.

This program will benefit a wide range of stakeholders, including audio streaming services, artists, language learners, and the general public, offering an accessible way to understand and enjoy music across languages.
