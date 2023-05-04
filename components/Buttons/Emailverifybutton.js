import React from "react";


const Emailverifybutton = (props) => {
  return (
    <div className="flex gap-10 items-center ">
      <a
        href=""
        className="px-8 py-2 text-sm bg-blue-900 text-slate-100 rounded-lg"
        onClick={props.fun}
      >
        {props.title}
      </a>
      <a href={props.link} className="text-sm text-blue-800 font-bold">
      {props.title2}
      </a>
    </div>
  );
};

export default Emailverifybutton;
