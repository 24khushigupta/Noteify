import { useLocation, Navigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer() {
  const location = useLocation();
  const fileUrl = location.state?.fileUrl;

  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  if (!fileUrl) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>PDF Viewer</h2>

      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <Page pageNumber={pageNumber} />
      </Document>

      <br />

      <button
        disabled={pageNumber <= 1}
        onClick={() => setPageNumber(pageNumber - 1)}
      >
        Previous
      </button>

      <span style={{ margin: "0 15px" }}>
        {pageNumber} / {numPages}
      </span>

      <button
        disabled={pageNumber >= numPages}
        onClick={() => setPageNumber(pageNumber + 1)}
      >
        Next
      </button>

      <br />
      <br />

      <a href={fileUrl} download>
        ⬇ Download PDF
      </a>
    </div>
  );
}