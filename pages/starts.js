


import axios from 'axios';
import Boxfield from '../components/boxfield';
import Extrabox from '../components/extrabox';
import { formatNumber } from '../utils/helpers';

export default function Home({ data }) {

  return (<>
    <div className=' flex md:flex-row flex-col my-[40px] md:my-[70px] w-full '>
      <div className='md:w-[30%] flex  justify-center align-middle '>
        <Boxfield
          title='Awaiting statements'
          count={data['awaiting'].count}
          amount={formatNumber(data['awaiting'].sum)}
        />
      </div>

      <div className='md:w-[70%] justify-center md:mr-8 w-full mx-auto flex flex-col'>
        <div className=' flex  justify-center md:flex-row flex-col md:w-full'>
          <Boxfield
            title='Submitted'
            count={data['submitted'].count}
            amount={formatNumber(data['submitted'].sum)}
          />

          <Boxfield
            title='Approved'
            count={data['approved'].count}
            amount={formatNumber(data['approved'].sum)}
          />

          <Boxfield
            title='Funded'
            count={data['funded'].count}
            amount={formatNumber(data['funded'].sum)}
          />
        </div>

        <div className=' flex justify-center md:flex-row flex-col'>
          <Boxfield
            title='Declined'
            count={data['declined'].count}
            amount={formatNumber(data['declined'].sum)}
          />

          <Extrabox
            title='Commission'
            count={data['commission'].count}
            amount={formatNumber(data['commission'].sum)}
            percent='6'
          />

        </div>

      </div>

    </div>
  </>)
}


export async function getServerSideProps(context) {
  const res = await axios.get('http://localhost:8000/api/get_starts/', {
    headers: {
      "Content-Type": 'application/json'
    }
  }).catch(err => {
    console.log(err);
  });

  return {
    props: {
      data: res?.data,
    },
  };
}