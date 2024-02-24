import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessBtn from '../buttons/SuccessBtn';
import FormField from '../fields/FormField';

const API_REG_URL = "http://127.0.0.1/api/v1/auth/signup"

const SignUpForm: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Name:', name);
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);

    const requestOptions: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "name": name,
        "username": username,
        "email": email,
        "password": password
      }),
    };

    fetch(API_REG_URL, requestOptions)
      .then(response => {
        console.log("Status:", response.status);
        if (response.status === 200) {
          console.log('Authentication successful');
          navigate('/');
        } else {
          console.log('Authentication failed');
          navigate('/signin');
        }
        return response.json();
      })
      .then(result => {
        console.log(result);
        console.log('Authentication successful');
      })
      .catch(error => {
        console.log('error', error)
      });
  };

  return (
    <form className="bg-white shadow-md rounded px-32 pt-16 pb-16" onSubmit={handleSubmit}>
      <div className="mb-4 flex justify-center" >
        <img src="/assets/Logo.png" alt="" />
      </div>
      <div className="mb-4">
        <label className="text-gray-700 font-bold mb-2">
          Sign Up
        </label>
      </div>
      <div className="mb-4">
        <FormField id="name" placeholder="Name" value={name} onChange={(e: any) => setName(e.target.value)} />
      </div>
      <div className="mb-4">
        <FormField id="username" placeholder="Username" value={username} onChange={(e: any) => setUsername(e.target.value)} />
      </div>
      <div className="mb-4">
        <FormField id="email" type="email" placeholder="Email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
      </div>
      <div className="mb-6">
        <FormField id="password" type="password" placeholder="Password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
      </div>
      <div>
        <SuccessBtn className="w-full" type="submit">Sign Up</SuccessBtn>
      </div>
    </form>
  );
}

export default SignUpForm;
