

import React from 'react'

const Inputfeild = (props) => {
    return (
        <div className='flex gap-1 flex-col mx-3 my-2'>
            <label className='text-[14px]'>{props.label}</label>
            <input type={props.type}
                // value={props.formData[props.name]}
                name={props.name}
                readOnly={props.read}
                onChange={props.onChange}
                placeholder={props.plholder}
                className='px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none w-full mb-4' id="" />
        </div>
    )
};

export default Inputfeild