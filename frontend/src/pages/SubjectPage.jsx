import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { Link } from "react-router-dom";
export default function SubjectPage() {
  const { code } = useParams();

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    API.get(`/notes/${code}`)
      .then((res) => {
        setNotes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [code]);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Subject Code: {code}</h1>

      {notes.length === 0 ? (
        <h3>No notes uploaded for this subject.</h3>
      ) : (
        notes.map((note) => (
          <div
            key={note._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <h2>{note.title}</h2>

            <p>
              <strong>Subject:</strong> {note.subjectName}
            </p>

            <p>
              <strong>Semester:</strong> {note.semester}
            </p>
            
            <Link
              to="/viewer"
               state={{ fileUrl: note.fileUrl }}
              style={{ marginRight: "15px" }}
            >
              📄 View PDF
            </Link>
            <a href={note.fileUrl} download={note.fileName}>
              ⬇ Download
            </a>
          </div>
        ))
      )}
    </div>
  );
}