


import axios from 'axios';
import Boxfield from '../components/boxfield';
import Extrabox from '../components/extrabox';
import { formatNumber } from '../utils/helpers';
import { parseCookies } from 'nookies';

export default function Stats({ data }) {
// export default function Stats() {
//   const data = []

  return (<>
    <div className=' flex md:flex-row flex-col my-[40px] md:my-[70px] w-full '>
      <div className='md:w-[30%] flex  justify-center align-middle '>
        <Boxfield
          title='Awaiting statements'
          count={data?.['awaiting']?.count ?? 0}
          amount={formatNumber(data?.['awaiting']?.sum) ?? 0}
        />
      </div>

      <div className='md:w-[70%] justify-center md:mr-8 w-full mx-auto flex flex-col'>
        <div className=' flex  justify-center md:flex-row flex-col md:w-full'>
          <Boxfield
            title='Submitted'
            count={data?.['submitted']?.count ?? 0}
            amount={formatNumber(data?.['submitted']?.sum) ?? 0}
          />

          <Boxfield
            title='Approved'
            count={data?.['approved']?.count ?? 0}
            amount={formatNumber(data?.['approved']?.sum) ?? 0}
          />

          <Boxfield
            title='Funded'
            count={data?.['funded']?.count ?? 0}
            amount={formatNumber(data?.['funded']?.sum) ?? 0}
          />
        </div>

        <div className=' flex justify-center md:flex-row flex-col'>
          <Boxfield
            title='Declined'
            count={data?.['declined']?.count ?? 0}
            amount={formatNumber(data?.['declined']?.sum) ?? 0}
          />

          <Extrabox
            title='Commission'
            count={data?.['commission']?.count ?? 0}
            amount={formatNumber(data?.['commission']?.sum) ?? 0}
            percent={data?.['commission']?.percentage ?? 0}
          />

        </div>

      </div>

    </div>
  </>)
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context)
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/get_starts/`, {
    headers: {
      "Content-Type": 'application/json',
      'Authorization': `Bearer ${cookies['jwt']}`
    },
    withCredentials: true
  }).catch(err => {
    console.log(err);
  });

  return {
    props: {
      data: res?.data ?? {},
    },
  };
}