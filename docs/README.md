# Lyrics Translator

In short, this system translates song lyrics into the user’s preferred language.

## Description

In today’s culturally diverse world, language barriers can prevent listeners from fully appreciating the meaning of songs. Although many audio streaming services provide lyrics, they rarely offer translations, limiting the listener’s understanding. The Lyrics Translator is a web application that addresses that gap by allowing users to translate song lyrics into any language of their choice.

## Target Browsers

This application will be specifically tailored for iOS devices because a significant portion of music streaming occurs on iPhones and iPads, particularly through services like Apple Music and Spotify.

# Developer Manual

#### *Disclaimer*
##### To my future developers, I unfortunately did not finish this web application. It is at a great start, but there are a lot of errors I did not resolve. If I were to have finished,
##### this is what I suggest:

### 1. Installation
#### Dependencies:
      * npm install
###### This is significant as it will install all these packages: express, body-parser, dotenv, @supabase/supabase-js, validator, nodemon.

#### Clone the Repository
git clone https://github.com/ShellyParraZ/inst377-sparra-lyricstranslator.git
cd inst377-sparra-lyricstranslator

#### Get Your Own Environmental Variables
###### DEEPL_API_KEY, SUPABASE_KEY

### 2. How to Run the Application

#### Run On Vercel
###### inst377-sparra-lyricstranslator-jlwwbnja3.vercel.app

#### Run Manually
###### The system is built with three main pages:

- Home Page: Users enter a song title, artist, original language, and preferred translation language. The page displays the original and translated lyrics vertically, with options to expand to a full screen view or restart the search. It also has a chart of Top 10 Songs that automatically loads.

- Full Lyrics Page: Provides a larger, horizontal view of the original and translated lyrics for easier comparison.

- About Page: Explains the purpose of the project.

The application uses two APIs: Lyrics.ovh to retrieve song lyrics and DeepL Translate to translate them into the selected language. The frontend is built with HTML and CSS. The backend functionality and API integration will be managed by JavaScript. Supabase will temporarily store user search history for improved performance.

After cloning the repo, just use local servers.

### 3. Run the Tests
###### There are no tests that were written, but there are a lot of try/catch, errors, and alerts to determine areas of concern or confusion.

### 4. API Endpoints
###### GET /home_page: returns all lyrics_data stored in Supabase.

### 5. Bugs
###### There are a lot of bugs, such as get errors.

### 6. Future Development
###### There is a lot of future development. I wanted it to connect with other applications, such as Spotify.
