import React from 'react';

const SuccessBtn: React.FC<{
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
                className={`bg-green-600 hover:bg-green-700 
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

export default SuccessBtn;
