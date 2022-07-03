import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const standardHeader = { "x-apikey": "d09f11ba37a84a33b7774a304044a0e3f13e704becee7f7ab43f62462cfc59d4" };
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [hashText, setHashText] = useState("");
  const [hashes, setHashes] = useState([]);
  const [logs, setLogs] = useState("");
  const i = useRef(0);
  const interval = useRef();

  useEffect(() => {
    if (i && i.current === hashes.length) {
      clearInterval(interval.current);
      setIsLoading(false);
    }
  }, [i, i.current]);
  const fileLookup = (hashes) => {
    axios
      .get("https://www.virustotal.com/api/v3/files/" + hashes[i.current], { headers: standardHeader })
      .then((response) => {
        console.log(response);
        setLogs(logs + "\n" + JSON.stringify(response.data.data.attributes.md5));
      })
      .catch((error) => {
        console.log(error);
        setLogs(logs + "\n" + JSON.stringify(error));
      });
    i.current = i.current + 1;
  };

  useEffect(() => {
    if (hashes.length === 0) {
      setIsLoading(false);
      return;
    }
    interval.current = setInterval(fileLookup(hashes), 15000);
  }, [hashes, hashes.length]);

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setHashes(hashText.trim().split("\n"));
  };
  return (
    <div className="App">
      <div className="nav-bar"></div>
      <div className="container-main">
        <form className="hash-input-form" onSubmit={onSubmit}>
          <div className="mb-3 w-100 d-flex flex-column align-items-start justify-content-start">
            <label for="exampleFormControlTextarea1" className="form-label">
              Enter Hashes
            </label>
            <textarea
              value={hashText}
              onChange={(e) => {
                setHashText(e.target.value);
              }}
              className="form-control"
              id="hashes"
              rows="10"
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            {isLoading ? "Processing..." : "Submit"}
          </button>
        </form>
        <div className="mb-3 w-100 mt-5 d-flex flex-column align-items-start justify-content-start">
          <label className="form-label">Logs</label>
          <textarea className="form-control" rows="20" readOnly value={logs}></textarea>
        </div>
      </div>
    </div>
  );
}

export default App;
