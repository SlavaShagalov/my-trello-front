import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
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
      })
      .catch(error => {
        console.log('error', error);
      });
  }, []);

  return (
    <div className="bg-green-400 h-12 p-2 flex items-center justify-between">
      <Link to={"/workspaces"}>
        <img src="/assets/Logo.png" alt="" />
      </Link>
      <Link to={"/settings"}>
        <img className='w-8 h-8' src={data.avatar} alt="" />
      </Link>
    </div >
  );
}

export default Navbar;
