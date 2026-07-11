import React, { useState ,useEffect} from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import API from "../services/api";


const SEMESTERS = [
  { id: 1, label: "Sem 1", color: "#3E7C74" },
  { id: 2, label: "Sem 2", color: "#5C8A9E" },
  { id: 3, label: "Sem 3", color: "#7C7CA8" },
  { id: 4, label: "Sem 4", color: "#B0708F" },
  { id: 5, label: "Sem 5", color: "#C68A4E" },
  { id: 6, label: "Sem 6", color: "#E8A33D" },
];
const STEPS = [
  {
    n: "01",
    title: "Pick your semester",
    body: "Flip to your semester tab and see every subject the syllabus covers.",
  },
  {
    n: "02",
    title: "Open a subject",
    body: "Unit-wise notes, previous year questions, and quick revision sheets.",
  },
  {
    n: "03",
    title: "Download and study",
    body: "Save the PDF, or read it inline. No sign-up wall to get to your notes.",
  },
];


export default function HomePage() {
  const navigate = useNavigate();
  const [activeSem, setActiveSem] = useState();
  const [query, setQuery] = useState("");
const [subjects, setSubjects] = useState([]);
useEffect(() => {
  API.get("/notes/subjects/all")
    .then((res) => {
      setSubjects(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);
  const filtered = subjects.filter((s) => {
    const matchesSem = s.sem === activeSem;
    const matchesQuery =
      query.trim() === "" ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.code.toLowerCase().includes(query.toLowerCase());
    return matchesSem && matchesQuery;
  });

  return (
    <div className="home">
      <header className="nav">
        <div className="nav-inner">
          <a className="logo" href="/HomePage">
            <span className="logo-mark">Nty</span>
            <span className="logo-word">Noteify</span>
          </a>
          <nav className="nav-links">
            <a href="#browse">Browse subjects</a>
            <a href="#how">How it works</a>
            <a href="#about">About</a>
          </nav>
          <a className="nav-cta" href="#browse">
            Browse notes
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <h1><b>WELCOME TO NOTEIFY</b></h1>
          <p className="eyebrow">MCA &amp; BCA notes, organised by semester</p>
          <h1>
            Every subject,
            <br />
            indexed.
          </h1>
          <p className="hero-sub">
            No scattered PDFs in ten different WhatsApp groups. Just pick a
            semester, find your subject, and get the notes you actually need.
          </p>

          <div className="search-row">
            <input
              type="text"
              placeholder="Search a subject or code, e.g. DBMS or MCA402"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search subjects"
            />
            <button type="button">Search</button>
          </div>

          <div className="tab-strip" role="tablist" aria-label="Select semester">
            {SEMESTERS.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={activeSem === s.id}
                className={`tab ${activeSem === s.id ? "tab-active" : ""}`}
                style={{
                  "--tab-color": s.color,
                  zIndex: activeSem === s.id ? 10 : SEMESTERS.length - i,
                }}
                onClick={() => setActiveSem(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="courses">
        <div className="section-inner course-grid">
          <div className="course-card">
            <p className="course-code">MCA</p>
            <h3>Master of Computer Applications</h3>
            <p>4 semesters of core CS, systems, and applied electives.</p>
          </div>
          <div className="course-card">
            <p className="course-code">BCA</p>
            <h3>Bachelor of Computer Applications</h3>
            <p>6 semesters from foundations through final-year projects.</p>
          </div>
        </div>
      </section>

      <section id="browse" className="browse">
        <div className="section-inner">
          <div className="browse-head">
            <h2>
              Showing <span>{SEMESTERS.find((s) => s.id === activeSem)?.label}</span>
            </h2>
            <p>{filtered.length} subject{filtered.length === 1 ? "" : "s"} indexed so far</p>
          </div>

          <div className="subject-grid">
            {filtered.length === 0 && (
              <div className="empty-state">
                <p>No subjects indexed for this semester yet.</p>
              </div>
            )}
            {filtered.map((s) => (
              <div
                className="subject-card"
                key={s.code}
                onClick={() => navigate(`/subject/${s.code}`)}
                style={{ cursor: "pointer" }}>

                <div className="subject-top">
                  <span className="subject-code">{s.code}</span>
                  <span className="subject-course">{s.course}</span>
                </div>
                <h3>{s.name}</h3>
                <p className="subject-notes">{s.notes} notes uploaded</p>
              </div>

            ))}
          </div>
        </div>
      </section>

      <section id="how" className="how">
        <div className="section-inner">
          <h2>How it works</h2>
          <div className="steps">
            {STEPS.map((step) => (
              <div className="step" key={step.n}>
                <span className="step-n">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="about" className="footer">
        <div className="section-inner footer-inner">
          <div>
            <p className="logo-word footer-logo">The Index</p>
            <p className="footer-note">
              Built by a student, for students. Notes are contributed by
              seniors and volunteers across MCA and BCA batches.
            </p>
          </div>
          <div className="footer-links">
            <a href="#browse">Browse subjects</a>
            <a href="#how">How it works</a>
            <a href="khushugupta2001@gmail.com">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
