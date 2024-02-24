import React from 'react';

const RectBoard: React.FC<{
  name?: string,
  // bg?: string
}> = ({
  name = "Notes",
  // bg="bg-yellow-600"
  // bg = "red"
}) => {
    // const boxStyle = {
    //   backgroundColor: bg,
    // };
    return (
      <div className="bg-yellow-600 w-48 h-24 mb-5 mr-5 p-2 rounded">
        <p className="text-base text-white font-bold leading-5">{name}</p>
      </div>
    );
  }

export default RectBoard;
