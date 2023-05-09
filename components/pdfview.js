
import React from 'react'
import  {useState}  from 'react'

import { Document, Page } from 'react-pdf';

const options = {
  cMapUrl: 'cmaps/',
  standardFontDataUrl: 'standard_fonts/',
};

const PdfViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const pdfUrl = 'http://www.gci.org.uk/Documents/Global-Warming-the-Complete-Briefing.pdf'
  const u = `http://localhost:8000/pdf_files/CHM_305_COMBINED_6x2j0nT.pdf`

  return (
    <>
      {/* <iframe src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${pdfUrl}`} width="100%" height="600" frameBorder="0" /> */}
      {/* <iframe src={`/CHM 305 COMBINED.pdf`} width="100%" height="600" frameBorder="0" /> */}
      <iframe src={url} width="100%" height="600" frameBorder="0" />
      {/* <Document file={'http://www.gci.org.uk/Documents/Global-Warming-the-Complete-Briefing.pdf'} onLoadSuccess={onDocumentLoadSuccess} options={options}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document> */}
      {/* <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document> */}
      {/* <p>
        Page {pageNumber} of {numPages}
      </p>
      <button
        disabled={pageNumber <= 1}
        onClick={() => setPageNumber(pageNumber - 1)}
      >
        Previous
      </button>
      <button
        disabled={pageNumber >= numPages}
        onClick={() => setPageNumber(pageNumber + 1)}
      >
        Next
      </button> */}
    </>
  );
};

export default PdfViewer;
