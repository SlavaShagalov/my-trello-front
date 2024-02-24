import React from 'react';

const FormField: React.FC<{
    className?: any;
    [key: string]: any;
}> = ({
    className,
    ...props
}) => {
        return (
            <input
                className={`text-gray-700 
                            shadow appearance-none border rounded py-2 px-3 leading-tight 
                            focus:outline-none focus:shadow-outline
                            ${className ? className : ''}`}
                type="text"
                {...props}
            />
        );
    }

export default FormField;
