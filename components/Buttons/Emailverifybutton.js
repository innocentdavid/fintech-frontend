import Link from "next/link";
import React from "react";


const Emailverifybutton = (props) => {
  return (
    <div className="flex gap-10 items-center ">
      <Link
        href={props?.link2 || ''}
        className="px-8 py-2 text-sm bg-blue-900 text-slate-100 rounded-lg"
        onClick={props?.fun || ''}
      >
        {props?.title || ''}
      </Link>
      <Link href={props?.link || ''} className="text-sm text-blue-800 font-bold">
      {props?.title2 || ''}
      </Link>
    </div>
  );
};

export default Emailverifybutton;
