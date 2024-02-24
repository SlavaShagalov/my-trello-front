import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Navbar from "../Navbar";
import Card from '../models/card';
import CardService from '../api/CardService';

import SuccessBtn from '../buttons/SuccessBtn';
import DangerBtn from '../buttons/DangerBtn';
import FormField from '../fields/FormField';

const CardPage = () => {
    const { id } = useParams();

    const [card, setCard] = useState<Card | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const cardJson = await CardService.get(id!);
                setCard(cardJson);
                setTitle(cardJson.title);
                setContent(cardJson.content);
            } catch (error) {
                console.error('Failed to fetch card:', error);
            }
        }
        fetchData();
    }, []);

    const update = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('title:', title);
        console.log('Content:', content);
        try {
            await CardService.update(id!, title, content);
        } catch (error: any) {
            console.log('Update failed:', error.message);
        }
    };

    const deleteCard = async (event: any) => {
        event.preventDefault();
        try {
            await CardService.delete(id!);
            navigate(-1);
        } catch (error: any) {
            console.log('Delete failed:', error.message);
        }
    };

    return (
        <div className="bg-green-500 h-screen w-full">
            <Navbar />
            <form className="bg-white shadow-md rounded mx-48 my-6 px-12 py-6" onSubmit={update}>
                <div className="mb-4 flex">
                    <DangerBtn className="w-40" onClick={deleteCard}>Delete</DangerBtn>
                </div>
                <div className="mt-4 mb-4 flex items-center">
                    <FormField id="title" placeholder="Title" value={title} className="w-full"
                        onChange={(e: any) => setTitle(e.target.value)} />
                </div>
                <div className="mb-4  flex items-center">
                    <textarea
                        className="shadow appearance-none border rounded w-full min-h-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="content"
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className='mb-16'>
                    <SuccessBtn className="w-40 mr-4" type="submit">Save</SuccessBtn>
                    <DangerBtn className="w-40" onClick={() => navigate(-1)}>Close</DangerBtn>
                </div>
            </form>
        </div>
    );
}

export default CardPage;
