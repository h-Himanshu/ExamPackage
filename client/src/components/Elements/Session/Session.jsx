import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Session = () => {
  const [newSessionName, setNewSessionName] = useState("");
  const [oldArchives, setOldArchives] = useState([]);
  const [selectedOldArchive, setSelectedOldArchive] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetch("/API/query/getOldArchives")
      .then((res) => {
        if (res.status === 200) {
          res.json().then((json) => {
            setOldArchives(json);
          });
        }
      })
      .catch((err) => console.log(err));
  }, [setOldArchives]);

  const startNewSession = () => {
    if (newSessionName === "") {
      alert("The text field cannot be empty");
      return;
    } else if (newSessionName === "EPMS") {
      alert("You cannot use the name EPMS");
      return;
    }

    const archiveCofirm = window.confirm(
      "Do you really want to start new session of Exam Package ??"
    );

    if (archiveCofirm) {
      fetch("/API/query/addNewSession", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newSessionName: newSessionName }),
      })
        .then((res) => {
          if (res.status === 200) alert("Successfully saved data");
          if (res.status === 409) alert("The file name already exist");
        })
        .catch((err) => console.log(err));
      navigate("/admin");
    }

    return;
  };

  const loadSession = () => {
    if (selectedOldArchive === "") {
      alert("Please Select a Valid Old Arhive to Load...");
      return;
    }

    const loadCofirm = window.confirm(
      "Do You Really Want to Load the Selected Old Session ?"
    );

    if (loadCofirm) {
      fetch("/API/query/loadSession", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToLoad: selectedOldArchive,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            alert("Successfully Loaded Data");
          }
        })
        .catch((err) => console.log(err));
      navigate("/admin");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <div className="mt-2 ">
        <h4>Start New Session</h4>
        <label> New Session Name</label>
        <input
          className="form-control"
          type="text"
          placeholder="Eg. 077-chaitra-part-II"
          onChange={(e) => setNewSessionName(e.target.value)}
        />
        <br />
        <button className="btn btn-primary" onClick={startNewSession}>
          Start New Session
        </button>
      </div>
      <div className="mt-5">
        <h4>Load Old Session</h4>
        <select
          className="form-control w-50"
          onChange={(e) => setSelectedOldArchive(e.target.value)}
        >
          <option key={-1} value={""}>
            {" "}
            --- Select a Session
          </option>
          {oldArchives.map((val, idx) => (
            <option key={idx} value={val}>
              {val}
            </option>
          ))}
        </select>
        <br />
        <button className="btn btn-success" onClick={loadSession}>
          Load Session
        </button>
      </div>
    </div>
  );
};

export default Session;
