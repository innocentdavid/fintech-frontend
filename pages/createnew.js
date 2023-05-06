

import axios from 'axios';
import { connectDB } from '../components/db'
import Creates from '../components/create'


  export async function getServerSideProps() {
    // await connectDB();
    return { props: {} };
  }

  const  Createnew = ()=>{
    return(
      <div className='w-[80%] mx-auto flex justify-center rounded-lg mt-[60px]'>
        <Creates/>
      </div>
    )
  }

  export default Createnew