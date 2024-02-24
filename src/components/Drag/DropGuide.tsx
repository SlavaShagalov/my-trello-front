import React, { useContext } from 'react';

// context
import DragContext from './types';

// indicates where the drop will go when dragging over a dropzone
const DropGuide: React.FC<{
    as?: any;
    dropId: any;
    [key: string]: any;
}> = ({
    as,
    dropId,
    ...props
}) => {
        const { drop } = useContext(DragContext);
        let Component = as || "div";
        return drop === dropId
            ? <Component {...props} />
            : null;
    };

export default DropGuide;
