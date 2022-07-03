import axios from "axios";

export const fileLookup = (hash, apiKey, callback, onError) => {
  const VTHeader = { "x-apikey": apiKey };
  axios
    .get("https://www.virustotal.com/api/v3/files/" + hash, { headers: VTHeader })
    .then((response) => {
      console.log(response);
      callback(response);
    })
    .catch((error) => {
      console.log(error);
      onError(error);
    });
};
