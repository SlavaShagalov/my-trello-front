import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    cardId: number;
    children?: any;
    onClose: () => void;
}

interface CardData {
    id: number;
    list_id: number;
    title: string;
    content: string;
    position: number;
    created_at: Date;
    updated_at: Date;
}

const Modal: React.FC<ModalProps> = ({ cardId, children, onClose }) => {
    const [cardData, setCardData] = useState<CardData | null>(null);

    useEffect(() => {
        fetch(`http://127.0.0.1/api/v1/cards/${cardId}`, { credentials: 'include' })
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

                setCardData(resultJson);
            })
            .catch(error => {
                console.log('error', error);
            });
    }, []);

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
            <div className="relative min-h-96 min-w-96 p-8 bg-white m-auto max-w-screen-lg rounded-lg">
                <button onClick={onClose} className="absolute top-0 right-0 m-4 text-gray-500">
                    Close
                </button>
                <h2>Edit Card</h2>
                <input type="text" />
                <button>Save</button>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
