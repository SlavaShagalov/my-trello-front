import React, { useState } from 'react';
import Modal from './Modal';
import { Link, useNavigate } from 'react-router-dom';

interface CardProps {
  id: number,
  title: string,
  description?: string,
  dragItem?: any
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description = "Some text",
  dragItem
}) => {
  const navigate = useNavigate();

  return (
    <div className={`rounded-lg bg-white border border-gray-300 shadow-sm p-5 m-2${dragItem ? " rotate-6" : ""}`}
      onClick={() => { navigate(`/cards/${id}`); }}>
      <h3 className="font-bold text-lg my-1">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default Card;
