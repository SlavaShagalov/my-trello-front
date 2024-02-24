import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import AvatarForm from './AvatarForm';
import SuccessBtn from '../buttons/SuccessBtn';
import DangerBtn from '../buttons/DangerBtn';
import FormField from '../fields/FormField';

const SettingsForm: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const defaultData = {
    "id": 0,
    "username": "",
    "email": "",
    "name": "",
    "avatar": "",
    "created_at": "",
    "updated_at": ""
  };
  const [data, setData] = React.useState(defaultData);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1/api/v1/auth/me`, { credentials: 'include' })
      .then(response => {
        console.log("Status:", response.status);
        if (response.status === 200) {
          console.log('ws success');
        } else {
          console.log('ws failed');
        }
        return response.json();
      })
      .then(resultJson => {
        console.log(resultJson);
        console.log('parse success');

        setData(resultJson);
        setName(resultJson.name);
        setEmail(resultJson.email);
        setUsername(resultJson.username);
      })
      .catch(error => {
        console.log('error', error);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Name:', name);
    console.log('Username:', username);
    console.log('Email:', email);

    const requestOptions: RequestInit = {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "name": name,
        "username": username,
        "email": email,
      }),
    };

    fetch(`http://127.0.0.1/api/v1/users/${data.id}`, requestOptions)
      .then(response => {
        console.log("Status:", response.status);
        if (response.status === 200) {
          console.log('Update successful');
        } else {
          console.log('Update failed');
        }
        return response.json();
      })
      .then(result => {
        console.log(result);
        console.log('JSON parse successful');
      })
      .catch(error => {
        console.log('error', error)
      });
  };

  const logout = (event: React.FormEvent) => {
    event.preventDefault();
    const requestOptions: RequestInit = {
      method: 'DELETE',
      credentials: 'include',
    };

    fetch(`http://127.0.0.1/api/v1/auth/logout`, requestOptions)
      .then(response => {
        console.log("Status:", response.status);
        if (response.status === 204) {
          console.log('Logout successful');
          navigate('/signin');
        } else {
          console.log('Logout failed');
        }
        return response
      })
      .catch(error => {
        console.log('error', error)
      });
  };

  return (
    <form className="bg-white shadow-md rounded px-32 pt-12 pb-16" onSubmit={handleSubmit}>
      <div className="mb-4 flex justify-center">
        <label className="text-gray-700 font-bold mb-2">
          Settings
        </label>
      </div>
      <AvatarForm />
      <div className="mt-4 mb-4 flex items-center">
        <label className="font-normal mr-2 min-w-24" htmlFor="name">Name:</label>
        <FormField id="name" placeholder="Name" value={name} onChange={(e: any) => setName(e.target.value)} />
      </div>
      <div className="mb-4  flex items-center">
        <label className="font-normal mr-2 min-w-24" htmlFor="username">Username:</label>
        <FormField id="username" placeholder="Username" value={username} onChange={(e: any) => setUsername(e.target.value)} />
      </div>
      <div className="mb-4  flex items-center">
        <label className="font-normal mr-2 min-w-24" htmlFor="email">Email:</label>
        <FormField id="email" type="email" placeholder="Email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
      </div>
      <div className='mb-16'>
        <SuccessBtn className="w-full" type="submit">Save</SuccessBtn>
      </div>
      <div className="mb-2 flex justify-center">
        <label className="text-red-700 font-bold">
          Danger zone
        </label>
      </div>
      <div>
        <DangerBtn className="w-full" onClick={logout}>Logout</DangerBtn>
      </div>
    </form>
  );
}

export default SettingsForm;
