

import React from 'react'

const RadioFeild = (props) => {
    return (<>

        <div className="flex items-center">
            {props?.options?.map((option, index) => {
                return (
                    <div key={`radio_${index + 1}`} className='flex gap-1 flex-col mx-3 my-2'>
                        <label className='text-[14px] cursor-pointer' htmlFor={props.name + option}>{option}</label>
                        <input type={props.type}
                            name={props.name}
                            id={props.name + option}
                            readOnly={props.read}
                            disabled={props.disabled}
                            onChange={props.onChange}
                            value={option}
                            className='cursor-pointer px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none w-full mb-4' />
                    </div>
                )
            })}
        </div>
    </>
    )
};

export default RadioFeild