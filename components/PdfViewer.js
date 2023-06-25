// import React from "react";
// import { Document } from "react-pdf";

// const PdfViewer = ({ pdfData }) => {

//     return (
//         <div>
//             {pdfData ? <Document data={pdfData} /> : 'Loading...'}
//         </div>
//     );
// };

// export default PdfViewer;

import React, { useEffect, useState, useRef, useCallback } from 'react';
// import pdfjsLib from "pdfjs-dist/build/pdf";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import LoadingModal from './LoadingModal ';

export default function PdfViewer({ url }) {
    const canvasRef = useRef();
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    const [loading, setLoading] = useState(true)
    const [pdfRef, setPdfRef] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    // const [scale, setScale] = useState(0.5)
    
    // useEffect(() => {
    //   if(window){
    //       let scale;
    //       const viewportWidth = window.innerWidth;

    //       if (viewportWidth < 768) { // Mobile devices
    //           scale = 0.5;
    //       } else if (viewportWidth < 1024) { // Tablet devices
    //           scale = 1;
    //       } else { // Desktop devices
    //           scale = 1.5;
    //       }
          
    //       setScale(scale)          
    //   }
    //     window.addEventListener('resize', setViewportAndRender);

    //     // Clean up the event listener when component unmounts or when PDF changes
    //     return () => {
    //         window.removeEventListener('resize', setViewportAndRender);
    //     };
    // }, [])
    

    const renderPage = useCallback((pageNum, pdf = pdfRef) => {
        if (loading) return;
        pdf && pdf.getPage(pageNum).then(function (page) {            
            // const viewport = page.getViewport({ scale });
            // const canvas = canvasRef.current;
            // canvas.height = viewport.height;
            // canvas.width = viewport.width;
            // const renderContext = {
            //     canvasContext: canvas.getContext('2d'),
            //     viewport: viewport
            // };
            // page.render(renderContext);
            
            let scale = 0.5;

            const determineScale = () => {
                const viewportWidth = window.innerWidth;
                console.log("viewportWidth: ");
                console.log(viewportWidth);

                if (viewportWidth < 768) { // Mobile devices
                    scale = 0.5;
                } else if (viewportWidth < 1024) { // Tablet devices
                    scale = 1;
                } else { // Desktop devices
                    scale = 1.5;
                }
            };

            const setViewportAndRender = () => {
                determineScale();

                const viewport = page.getViewport({ scale });
                const canvas = canvasRef.current;
                if (!viewport && canvas) return;
                canvas.height = viewport?.height;
                canvas.width = viewport?.width;
                const renderContext = {
                    canvasContext: canvas.getContext('2d'),
                    viewport: viewport
                };
                page.render(renderContext);
            };

            setViewportAndRender();

            // Listen for resize events
            window.addEventListener('resize', setViewportAndRender);

            // Clean up the event listener when component unmounts or when PDF changes
            return () => {
                window.removeEventListener('resize', setViewportAndRender);
            };
        });
    }, [loading, pdfRef]);

    useEffect(() => {
        renderPage(currentPage, pdfRef);
    }, [pdfRef, currentPage, renderPage]);

    useEffect(() => {
        const loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(loadedPdf => {
            setPdfRef(loadedPdf);
            // console.log('loadedPdf: ');
            // console.log(loadedPdf);
            setLoading(false)
        }, function (reason) {
            console.error(reason);
        });
    }, [url]);

    const nextPage = () => pdfRef && currentPage < pdfRef.numPages && setCurrentPage(currentPage + 1);

    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    return (<>
        {loading && <>
            Loading...
            <LoadingModal loading={loading} />
        </>}
        <canvas ref={canvasRef} className='border'></canvas>

        {!loading && <div className="flex items-center justify-between mt-2 mb-10 text-xs md:text-base">
            <div className="">{currentPage}/{pdfRef?._pdfInfo?.numPages || ''} pages</div>
            <div className="flex gap-4 mr-4">
                {currentPage > 1 && <button className='bg-black text-white font-bold rounded-lg md:w-[100px] px-2 py-1 md:py-3' onClick={() => { prevPage() }}>Prev</button>}
                {currentPage < pdfRef?._pdfInfo?.numPages && <button className='bg-blue-600 text-white font-bold rounded-lg md:w-[100px] px-2 py-1 md:py-3' onClick={() => { nextPage() }}>Next</button>}
            </div>
        </div>}
    </>)
}