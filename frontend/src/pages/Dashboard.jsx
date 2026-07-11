import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [form, setForm] = useState({
    title: "",
    subjectCode: "",
    subjectName: "",
    course: "MCA",
    semester: 1,
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | saving | done | error
  const [errorMsg, setErrorMsg] = useState("");
const [notes, setNotes] = useState([]);
useEffect(() => {
  fetchNotes();
}, []);

const fetchNotes = async () => {
  try {
    const res = await API.get("/notes");
    setNotes(res.data);
  } catch (err) {
    console.log(err);
  }
};
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
const data = new FormData();

Object.entries({
  ...form,
  subjectCode: form.subjectCode.toUpperCase(),
}).forEach(([key, value]) => data.append(key, value));

data.append("file", file);
  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      setErrorMsg("Attach a PDF before submitting.");
      return;
    }

    setStatus("saving");
    setErrorMsg("");

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    data.append("file", file);

    try {
     await API.post("/notes", data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
  fetchNotes();

      setStatus("done");
      setForm({ title: "", subjectCode: "", subjectName: "", course: "MCA", semester: 1 });
      setFile(null);
      e.target.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }
  const deleteNote = async (id) => {
  if (!window.confirm("Delete this note?")) return;

  try {
    await API.delete(`/notes/${id}`);

    setNotes(notes.filter((note) => note._id !== id));

    alert("Note deleted");
  } catch (err) {
    console.log(err);
  }
};

  return (
    <form className="add-note" onSubmit={handleSubmit}>
      <h2>Add a note</h2>

      <label>
        Note title
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>

      <div className="row">
        <label>
          Subject code
          <input
            name="subjectCode"
            placeholder="MCA402"
            value={form.subjectCode}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Subject name
          <input
            name="subjectName"
            placeholder="Database Management Systems"
            value={form.subjectName}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className="row">
        <label>
          Course
          <select name="course" value={form.course} onChange={handleChange}>
            <option value="MCA">MCA</option>
            <option value="BCA">BCA</option>
          </select>
        </label>
        <label>
          Semester
          <select name="semester" value={form.semester} onChange={handleChange}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                Semester {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        PDF file
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
      </label>

      <button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Uploading..." : "Upload note"}

      </button>

      {status === "done" && <p className="msg success">Note uploaded.</p>}
      {status === "error" && <p className="msg error">{errorMsg}</p>}
      {notes.map((note) => (
  <div
    key={note._id}
    style={{
      border: "1px solid #ddd",
      margin: "10px 0",
      padding: "15px",
      borderRadius: "8px",
    }}
  >
    <h3>{note.subjectName}</h3>

    <p>{note.subjectCode}</p>

    <button
      onClick={() => deleteNote(note._id)}
      style={{
        background: "red",
        color: "#fff",
        border: "none",
        padding: "8px 15px",
        cursor: "pointer",
      }}
    >
      Delete
    </button>
  </div>
))}
    </form>
  );
}
