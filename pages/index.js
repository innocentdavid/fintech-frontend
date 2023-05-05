


import styles from '../styles/Home.module.css'
import Inputfeild from '../components/inputfeild'
import Emailverifybutton from '../components/Buttons/Emailverifybutton'
import Data from '../components/Data'
import Table from '../components/Table'
import Link from 'next/link'


export default function Home() {

  return (
    <div className="mx-auto w-[80%] my-[50px] border border-slate-500 rounded-lg ">
        <header className="flex gap-10 items-center justify-end p-5">
          <Link href='/login' className="text-sm text-blue-800 font-bold">
            Log out
          </Link>
        </header>

      <Data/>

      <Table/>

    </div>

  )
}
