import React from "react";
import { HiOutlineRefresh } from "react-icons/hi"; // import the loading spinner icon from react-iconst classNames for conditional classnames
// import { createPortal } from "react-dom"; // import createPortal to render the modal outside of the component tree

const LoadingModal = ({ loading }) => {
    return (<>
        <div className={`${loading ? 'opacity-100 z-50 h-screen w-full bg-black/60' : "opacity-0 z-0 pointer-events-none"} fixed top-0 left-0 w-screen h-screen flex justify-center items-center`}>
            <div className="bg-white shadow-lg rounded-lg p-8">
                {loading && (
                    <div className="flex justify-center items-center">
                        <HiOutlineRefresh className="animate-spin text-blue-500 mr-4" />
                        <p className="text-gray-500 font-semibold">Loading...</p>
                    </div>
                )}
            </div>
        </div>
    </>)
};

export default LoadingModal;