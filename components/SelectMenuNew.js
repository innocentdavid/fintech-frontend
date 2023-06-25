

import React from 'react'

const SelectMenuNew = (props)=>{
    const selectedState = props.formData[props.name]
    const stateOptions = [
        { id: 'AL', name: 'Alabama' },
        { id: 'AK', name: 'Alaska' },
        { id: 'AZ', name: 'Arizona' },
        { id: 'AR', name: 'Arkansas' },
        { id: 'CA', name: 'California' },
        { id: 'CO', name: 'Colorado' },
        { id: 'CT', name: 'Connecticut' },
        { id: 'DE', name: 'Delaware' },
        { id: 'FL', name: 'Florida' },
        { id: 'GA', name: 'Georgia' },
        { id: 'HI', name: 'Hawaii' },
        { id: 'ID', name: 'Idaho' },
        { id: 'IL', name: 'Illinois' },
        { id: 'IN', name: 'Indiana' },
        { id: 'IA', name: 'Iowa' },
        { id: 'KS', name: 'Kansas' },
        { id: 'KY', name: 'Kentucky' },
        { id: 'LA', name: 'Louisiana' },
        { id: 'ME', name: 'Maine' },
        { id: 'MD', name: 'Maryland' },
        { id: 'MA', name: 'Massachusetts' },
        { id: 'MI', name: 'Michigan' },
        { id: 'MN', name: 'Minnesota' },
        { id: 'MS', name: 'Mississippi' },
        { id: 'MO', name: 'Missouri' },
        { id: 'MT', name: 'Montana' },
        { id: 'NE', name: 'Nebraska' },
        { id: 'NV', name: 'Nevada' },
        { id: 'NH', name: 'New Hampshire' },
        { id: 'NJ', name: 'New Jersey' },
        { id: 'NM', name: 'New Mexico' },
        { id: 'NY', name: 'New York' },
        { id: 'NC', name: 'North Carolina' },
        { id: 'ND', name: 'North Dakota' },
        { id: 'OH', name: 'Ohio' },
        { id: 'OK', name: 'Oklahoma' },
        { id: 'OR', name: 'Oregon' },
        { id: 'PA', name: 'Pennsylvania' },
        { id: 'RI', name: 'Rhode Island' },
        { id: 'SC', name: 'South Carolina' },
        { id: 'SD', name: 'South Dakota' },
        { id: 'TN', name: 'Tennessee' },
        { id: 'TX', name: 'Texas' },
        { id: 'UT', name: 'Utah' },
        { id: 'VT', name: 'Vermont' },
        { id: 'VA', name: 'Virginia' },
        { id: 'WA', name: 'Washington' },
        { id: 'WV', name: 'West Virginia' },
        { id: 'WI', name: 'Wisconsin' },
        { id: 'WY', name: 'Wyoming' }
    ];
    // selected = { selectedState === state.id ? true : false }

    return(<>
        <div className='flex gap-1 flex-col mx-3 my-2'>

            <select className='text-[15px] w-full h-[40px] border border-gray-500 rounded-lg' 
            name={props.name} onChange={props.onChange} disabled={props.disabled}>
                <option value="">SELECT</option>
                {stateOptions.map(state => {
                    return (<option key={state.id} value={state.id} selected={selectedState === state.id ? true : false}>{state.name}</option>)
                })}
                </select>
        </div>
    </>)
}

export default SelectMenuNew