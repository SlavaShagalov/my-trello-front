import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessBtn from '../buttons/SuccessBtn';
import FormField from '../fields/FormField';

const API_LOGIN_URL = "http://127.0.0.1/api/v1/auth/signin"

const SignInForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);

    const requestOptions: RequestInit = {
      method: 'POST',
      // mode: "no-cors",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "username": username,
        "password": password
      }),
      // redirect: 'follow'
    };

    fetch(API_LOGIN_URL, requestOptions)
      .then(response => {
        console.log("Status:", response.status);
        if (response.status === 200) {
          console.log('Authentication successful');
          navigate('/workspaces');
        } else {
          console.log('Authentication failed');
          navigate('/signup');
        }
        return response.json(); // handle user data
      })
      .then(result => {
        console.log(result);
        console.log('Authentication successful');
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  return (
    <form className="bg-white shadow-md rounded px-32 pt-16 pb-16" onSubmit={handleSubmit}>
      <div className="mb-4 flex justify-center" >
        <img src="/assets/Logo.png" alt="" />
      </div>
      <div className="mb-4 flex justify-center">
        <label className="text-gray-700 font-bold mb-2">
          Sign In
        </label>
      </div>
      <div className="mb-4">
        <FormField id="username" placeholder="Username" value={username} onChange={(e: any) => setUsername(e.target.value)} />
      </div>
      <div className="mb-6">
        <FormField id="password" type="password" placeholder="Password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
      </div>
      <div>
        <SuccessBtn className="w-full" type="submit">Sign In</SuccessBtn>
      </div>
    </form>
  );
}

export default SignInForm;
