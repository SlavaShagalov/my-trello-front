import React, { useState } from 'react';
import WorkspaceService from './api/WorkspaceService';

const WorkspaceHeader: React.FC<{
  id: number,
  initName?: string,
  onDelete: any;
  children?: React.ReactNode
}> = ({
  id,
  initName = "Default",
  onDelete,
  children
}) => {
    const [name, setName] = useState(initName);

    const delWorkspace = async (event: any) => {
      event.preventDefault();
      try {
        await WorkspaceService.delete(id);
        onDelete(id);
      } catch (error: any) {
        console.log('Delete failed:', error.message);
      }
    };

    const updateName = async(newName: any) => {
      try {
        await WorkspaceService.updateName(id, newName);
        setName(newName);
      } catch (error: any) {
        console.log('Update failed:', error.message);
      }
    };

    return  (
      <div>
        <div className="border-b border-gray-300 my-4"></div>
        <div className="mb-2 flex items-center">
          <div className='flex items-center'>
            <div className="text-white bg-orange-500 text-xl font-bold w-8 h-8 mr-2 flex justify-center items-center rounded">X</div>
            <input
              className="bg-inherit hover:bg-slate-300 focus:bg-white focus:text-black h-10 px-2 text-lg font-bold appearance-none rounded mr-2 leading-tight outline-none focus:shadow-outline"
              type="text"
              value={name}
              onChange={(e) => updateName(e.target.value)}
            />
          </div>
          <button
            className="bg-gray-200 hover:bg-red-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={delWorkspace}
          >
            Delete
          </button>
        </div>
        {children}
      </div>
    );
  }

export default WorkspaceHeader;
