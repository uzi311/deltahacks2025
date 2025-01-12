import './HomePage.css';
import React from 'react'
import Image from 'next/image';

const HomePage = () => {
  return (
    <div className='container-div'>
            <div className='image-div'>
                <Image src="/logo.jpg" alt="Logo" className='main-image' height={700} width={700}/>
            </div>
            <div className='text-div'>
                <div className='header-div'>
                    <h1> Welcome to MindSync!</h1>
                </div>
                <div className='description-div'>
                    <p className='description-text'>
                    MindSync is a revolutionary platform that helps therapists understand the emotions of patients who struggle to express themselves, such as individuals with autism. By utilizing EEG headbands like Muse, MindSync captures brainwave data in real-time and translates it into clear emotional states, such as stress, relaxation, or anxiety. This information is displayed on a dynamic dashboard, allowing therapists to tailor their approach immediately and provide more effective care.
                    </p>
                    <p className='description-text'>
                    Beyond real-time insights, MindSync generates detailed post-session reports that highlight emotional trends, key moments, and responses to therapeutic techniques. Over time, the system learns from individual patient data, identifying patterns and offering personalized recommendations. By bridging the gap between unspoken emotions and understanding, MindSync empowers therapists to create deeper connections and improve outcomes, fostering a world where everyone’s emotions are seen, understood, and supported.
                    </p>
                </div>
            </div>
    </div>
  )
}

export default HomePage
