

import React from 'react'

const Inputfeild = (props) =>{
    return(
        <input type={props.type} 
        name={props.name} 
        placeholder={props.plholder} 
        className='px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none w-[60%] mb-4' id="" />
    )
};

export default Inputfeild