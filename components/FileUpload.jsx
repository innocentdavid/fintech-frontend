import React from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'

export default function FileUpload(props) {

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      // Handle the valid PDF file here
      // console.log('Valid PDF file:', file);
    } else {
      // Handle invalid file type here
      throw('Invalid file type');
    }
  };

  // console.log(props.disabled);

  return (
      <label htmlFor="bankstatement1" className='bg-gray-300 cursor-pointer rounded-[10px] text-black grid place-items-center w-[50px] h-[40px]'>
          <FaCloudUploadAlt size={20} />
      <input type="file" 
      // disabled={props.disabled}
      // disabled={true}
      id="bankstatement1" name={props.name} accept="application/pdf" onChange={props.onChange} readable={props.read} className='hidden' />
      </label>
  )
}
