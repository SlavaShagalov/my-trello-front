import React, { useState } from 'react';
import ListService from './api/ListService';

const List: React.FC<{
  id: number,
  initName: string,
  dragItem: any,
  onDelete: any,
  children: any,
}> = ({
  id,
  initName,
  dragItem,
  onDelete,
  children
}) => {
    const [name, setName] = useState(initName);

    const delList = async (event: any) => {
      event.preventDefault();
      try {
        await ListService.delete(id);
        onDelete(id);
      } catch (error: any) {
        console.log('Delete failed:', error.message);
      }
    };

    const updateName = async (newName: any) => {
      try {
        await ListService.updateName(id, newName);
        setName(newName);
      } catch (error: any) {
        console.log('Update failed:', error.message);
      }
    };

    return (
      <div className={`rounded-xl bg-gray-100 p-2 mx-2 my-5 w-80 shrink-0 grow-0 shadow select-none${dragItem ? " rotate-6" : ""}`}>
        <div className="px-3 py-1 flex justify-between">
          <textarea
            className="shadow appearance-none border rounded w-full mr-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChange={(e) => updateName(e.target.value)}
          />
          <button
            className="bg-gray-200 hover:bg-red-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={delList}
          >
            Del
          </button>
        </div>
        {children}
      </div>
    );
  }

export default List;
