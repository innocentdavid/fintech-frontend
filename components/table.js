

import React from 'react'

const Displaytable = (props) =>{

    return(

        <div className='mb-8'>
            <table className='w-[90%] border border-black mx-auto'>

                <tr>
                    <th className='border border-black'>Leaders</th>
                    <th className='border border-black'>Crowler</th>
                    <th className='border border-black'>ID</th>
                    <th className='border border-black'>Status</th>
                    <th className='border border-black'>Date of Status</th>
                    <th className='border border-black'>Legal Name</th>
                    <th className='border border-black'>Advanced</th>
                    <th className='border border-black'>Commission</th>
                    <th className='border border-black'>Link</th>
                </tr>

                <tr>
                    <td className='border border-black text-[17px] px-3 py-2'>{props.leaders}</td>
                    <td className='border border-black text-[17px] px-3 py-2'>{props.crowler} </td>
                    <td className='border border-black text-[17px] px-3 py-2'>{props.id} </td>
                    <td className='border border-black text-[17px] px-3 py-2'>{props.status} </td>
                    <td className='border border-black text-[17px] px-3 py-2'>{props.DOB} </td>
                    <td className='border border-black text-[17px] px-3 py-2'> {props.legalname} </td>
                    <td className='border border-black text-[17px] px-3 py-2'>${props.Advanced} </td>
                    <td className='border border-black text-[17px] px-3 py-2'>${props.comission}</td>
                    <td className='border border-black text-[17px] px-3 py-2'>{props.link}</td>
                </tr>
        
            </table>

        </div>
    )
}

export default  Displaytable