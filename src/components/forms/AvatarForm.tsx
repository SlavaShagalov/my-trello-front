import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import SuccessBtn from '../buttons/SuccessBtn';

const AvatarForm: React.FC = () => {
  const [id, setId] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

        setId(resultJson.id);
        setPreviewUrl(resultJson.avatar);
      })
      .catch(error => {
        console.log('error', error);
      });
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('avatar', selectedFile);
      setSelectedFile(null);

      const requestOptions: RequestInit = {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      };

      fetch(`http://127.0.0.1/api/v1/users/${id}/avatar`, requestOptions)
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
          // setPreviewUrl(result.avatar);
        })
        .catch(error => {
          console.log('error', error)
        });
    }
  };

  return (
    <div className="flex items-end justify-between w-full">
      <div className="relative w-20 h-20 rounded-full overflow-hidden">
        <img
          src={previewUrl || 'current_avatar_url'}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="avatar-input"
      />
      <label
        htmlFor="avatar-input"
        className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
      >
        Select avatar
      </label>
      <SuccessBtn className={!selectedFile ? 'opacity-50 pointer-events-none' : ''}
        onClick={handleSubmit} disabled={!selectedFile}>
        Save avatar
      </SuccessBtn>
    </div>
  );
}

export default AvatarForm;
