import React from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'

export default function FileUpload() {
  return (
      <label htmlFor="bankstatement1" className='bg-gray-300 cursor-pointer rounded-[10px] text-black grid place-items-center w-[50px] h-[40px]'>
          <FaCloudUploadAlt size={20} />
          <input type="file" id="bankstatement1" className='hidden' />
      </label>
  )
}
