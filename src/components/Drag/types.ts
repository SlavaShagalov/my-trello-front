import React, { createContext } from 'react';

type DragContextType = {
    draggable: boolean;
    dragItem: any;
    dragType: any;
    isDragging: boolean | null;
    dragStart: (e: any, dragId: any, dragType: any) => void;
    drag: any;
    dragEnd: () => void;
    drop: any;
    setDrop: any;
    onDrop: any;
};

// context for the drag
const DragContext = createContext<DragContextType>({
    draggable: false,
    dragItem: null,
    dragType: null,
    isDragging: null,
    dragStart: (e: any, dragId: any, dragType: any) => { },
    drag: (e: any) => { },
    dragEnd: () => { },
    drop: null,
    setDrop: () => { },
    onDrop: (e: any) => { }
});

export default DragContext;
