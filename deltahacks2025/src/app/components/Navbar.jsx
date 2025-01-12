"use client"
import React from 'react'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Image from 'next/image';
import './Navbar.css';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const goToHomePage = () => {
    router.push('/');
  };
  const goToDashboard = () => {
    router.push('/Dashboard');
  };
  return (
    <div className='main-div'>
      <div className='image-div'>
        <Image src="/logo.jpg" alt="Logo" width={75} height={75} className='logo-image'/>
      </div>
      <div className='title-div'>
        <h1>MindSync</h1>
      </div>
      <ButtonGroup variant="outlined" color='#008080' className='button-group'>
        <Button sx={{ color: 'white' }} onClick={goToHomePage}>Home</Button>
        <Button sx={{ color: 'white' }} onClick={goToDashboard}>Dashboard</Button>
        <Button sx={{ color: 'white' }}>Contact</Button>
      </ButtonGroup>
    </div>
  )
}

export default Navbar
