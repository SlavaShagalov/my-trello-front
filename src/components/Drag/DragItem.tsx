import React, { useContext } from 'react';
import DragContext from './types';

// context

// a draggable item
const DragItem: React.FC<{
    as?: any;
    dragId: number;
    dragType: string;
    [key: string]: any;
}> = ({
    as,
    dragId,
    dragType,
    ...props
}) => {
        const { draggable, dragStart, drag, dragEnd } = useContext(DragContext);

        // console.log("dragId", dragId);
        // console.log("dragType", dragType);

        let Component = as || "div";
        return (
            <Component onDragStart={(e: any) => dragStart(e, dragId, dragType)}
                onDrag={drag}
                draggable={draggable}
                onDragEnd={dragEnd}
                {...props} />
        );
    };

export default DragItem;
