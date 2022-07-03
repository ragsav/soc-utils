import "./style.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Select, Button, Alert, Progress } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { DownloadOutlined, UndoOutlined } from "@ant-design/icons";
const { Option, OptGroup } = Select;

const apiKey = "d09f11ba37a84a33b7774a304044a0e3f13e704becee7f7ab43f62462cfc59d4";
const VTHeader = { "x-apikey": apiKey };
function VirusTotalFileCheck() {
  const [isLoading, setIsLoading] = useState(false);
  const [hashText, setHashText] = useState("");
  const [hashes, setHashes] = useState([]);
  const [logs, setLogs] = useState("");
  const [rawLogs, setRawLogs] = useState({});
  const [error, setError] = useState("");
  const [hashCounter, setHashCounter] = useState(0);
  const [hashConversion, setHashConversion] = useState("md5");
  let interval;
  // let rawLogs = {};

  const handleFileLookup = (hashes) => {
    interval =
      !interval &&
      setInterval(() => {
        setHashCounter((prev) => prev + 1);
        axios
          .get("https://www.virustotal.com/api/v3/files/" + hashes[hashCounter], { headers: VTHeader })
          .then((response) => {
            setRawLogs((rawLogs) => {
              rawLogs[hashes[hashCounter]] = response;
              return { ...rawLogs };
            });
            console.log(response);
            try {
              setLogs((logs) => logs + "\n" + response.data.data.attributes[hashConversion]);
            } catch (err) {
              console.log(err);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }, 15000);
    if (hashes && hashCounter >= hashes.length) {
      clearInterval(interval);
      setHashCounter(0);
      setHashes([]);
      setIsLoading(false);
    }
  };

  const handleDownloadRawLogs = async () => {
    const fileName = "raw_logs.json";
    const json = JSON.stringify(rawLogs);
    const blob = new Blob([json], { type: "application/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleResetState = () => {
    setHashCounter(0);
    setHashText("");
    setHashes([]);
    setIsLoading(false);
    setLogs("");
    setRawLogs({});
    setError("");
    clearInterval(interval);
  };

  useEffect(() => {
    console.log({ hashes });
    if (hashes && hashes.length > 0) {
      handleFileLookup(hashes);
    }
    return () => {
      clearInterval(interval);
    };
  }, [hashes, hashes.length, hashCounter]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setLogs("");
    setRawLogs({});

    if (hashText.trim() === "") {
      setError("Enter valid hash values");
      return;
    }
    setError("");
    setIsLoading(true);
    setHashes(hashText.trim().split("\n"));
  };

  const handleHashConversionChange = (e) => {
    setHashConversion(e);
  };
  return (
    <div className="App">
      <div className="nav-bar"></div>
      <div className="container-main">
        <form className="hash-input-form">
          <div className="mb-3 w-100 d-flex flex-column align-items-start justify-content-start">
            <div className="mb-2 w-100 d-flex flex-row align-items-center justify-content-start">
              <Select defaultValue="md5" style={{ width: 100 }} onChange={handleHashConversionChange}>
                <Option value="md5">MD5</Option>
                <Option value="sha1">SHA1</Option>
                <Option value="sha256">SHA256</Option>
              </Select>
              <Button type="default" className="ml-2" icon={<UndoOutlined />} onClick={handleResetState}>
                Reset
              </Button>
            </div>

            <label for="hashes" className="form-label mt-2">
              Enter Hashes
            </label>
            {hashes && hashes.length > 0 ? <Progress percent={(hashCounter / hashes.length) * 100} showInfo={false} /> : null}
            <TextArea
              value={hashText}
              onChange={(e) => {
                setHashText(e.target.value);
              }}
              id="hashes"
              rows={10}
              className="hash-input"
            />
            {error ? <Alert showIcon message={error} type="error" className="w-100 mt-2 text-left" /> : null}
          </div>
          <div className="mb-2 w-100 d-flex flex-row align-items-center justify-content-start">
            <Button onClick={handleOnSubmit} type="primary" loading={isLoading}>
              {isLoading ? "Processing..." : "Submit"}
            </Button>

            <span className="ml-3">{`Progress : ${hashCounter} / ${hashes.length}`}</span>
          </div>
        </form>
        <div className="mb-3 w-100 mt-5 d-flex flex-column align-items-start justify-content-start">
          <div className="mb-2 w-100 d-flex flex-row align-items-center justify-content-between">
            <label className="form-label">Logs</label>
            <Button type="default" icon={<DownloadOutlined />} onClick={handleDownloadRawLogs}>
              Download raw logs
            </Button>
          </div>

          <TextArea className="dark-console" value={logs} readOnly rows={10} />
        </div>
      </div>
    </div>
  );
}

export default VirusTotalFileCheck;
