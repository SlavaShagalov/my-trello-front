import React from 'react';

const DangerBtn: React.FC<{
    className?: any;
    onClick?: any;
    children?: any;
    [key: string]: any;
}> = ({
    className,
    onClick,
    children,
    ...props
}) => {
        return (
            <button
                className={`bg-red-600 hover:bg-red-800 
                            text-white font-bold 
                            px-4 py-2 rounded 
                            cursor-pointer 
                            focus:outline-none focus:shadow-outline
                            ${className}`}
                onClick={onClick}
                {...props}
            >
                {children}
            </button>
        );
    }

export default DangerBtn;
