export default async function handler(req, res) {
  const response = await fetch(
    "https://itunes.apple.com/search?term=pop&entity=song&limit=10"
  );
  const JSONdata = await response.json();
  res.status(200).json(JSONdata);
}
