import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [hashText, setHashText] = useState("");
  const [logs, setLogs] = useState("");

  const onSubmit = () => {};
  return (
    <div className="App">
      <div className="nav-bar"></div>
      <div className="container-main">
        <form className="hash-input-form">
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
