'use client'

import settings from '../settings.json';

import { neue } from '../assets/fonts';

import Register from '../components/register';
import Login from '@/components/login';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';

export default function Home() {
  // Stateful variables
  const [register, setRegister] = useState(true);
  // Event hndlers
  function onSwitchForm() {
    setRegister(value => !value);
  }
  return (
    <main className="flex min-h-screen flex-col items-center">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h1 className={`${neue.className} h1Title justify-between p-10`}>
        {settings.home.heading}
      </h1>
      {
        register ? <Register handleClick={onSwitchForm}/> : <Login handleClick={onSwitchForm}/>
      }
    </main>
  )
}
