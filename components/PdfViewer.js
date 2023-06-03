import React from "react";
import Document from "react-pdf";

const PdfViewer = ({ pdfData }) => {

    return (
        <div>
            {pdfData ? <Document data={pdfData} /> : 'Loading...'}
        </div>
    );
};

export default PdfViewer;