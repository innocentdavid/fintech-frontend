


import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Inputfeild from '../components/inputfeild'
import Emailverifybutton from '../components/Buttons/Emailverifybutton'
import Data from '../components/Data'
import  Displaytable from '../components/table'


export default function Home() {
  return (

    <div className="mx-auto w-[80%] my-[50px] border border-slate-500 rounded-lg ">
      <header className="flex justify-between align-center m-5 " >
      <div className="w-[50%]">
        <Inputfeild
            type= 'search'
            name = 'search'
            plholder= 'Type here'
          />
      </div>

        <Emailverifybutton
          title='Add data'
          title2='Log out'
          link='/add'
        />
      </header>

      <Data/>

      <Displaytable
        leaders= 'bitty'
        crowler = 'Success'
        id= '123'
        status = 'funded'
        DOB = '06/06/23'
        legalname = 'The business name'
        Advanced= '7,500'
        comission= '600.00'
        link='/add'
      />

    </div>

  )
}
