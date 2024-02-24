import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import SettingsForm from '../forms/SettingsForm';

const SettingsPage: React.FC = () => {
    return (
        // <div className="bg-red-300 h-full w-full">
        //     <Navbar />
        //     <SettingsForm />
        // </div>
        <div className='bg-green-500 h-screen w-screen '>
            <Navbar />
            <div className="flex mt-16 justify-center items-center">
                <SettingsForm />
            </div>
        </div>
    );
}

export default SettingsPage;
