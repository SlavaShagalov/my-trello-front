import React from 'react';

// sub-components
import DragItem from './DragItem';
import DropZone from './DropZone';
import DropZones from './DropZones';
import DropGuide from './DropGuide';

import DragContext from './types';

// drag context component
const Drag: React.FC<{
    draggable?: boolean,
    handleDrop: (data: { dragItem: any, dragType: any, drop: any }) => void,
    children: any
}> = ({
    draggable = true,
    handleDrop,
    children
}) => {
        console.log("typeof children", typeof children);

        const [dragItem, setDragItem] = React.useState<any | null>(null); // the item ID being dragged
        const [dragType, setDragType] = React.useState<any | null>(null); // if multiple types of drag item
        const [isDragging, setIsDragging] = React.useState<boolean | null>(null); // drag is happening
        const [drop, setDrop] = React.useState<any | null>(null); // the active dropzone

        React.useEffect(() => {
            if (dragItem) {
                document.body.style.cursor = "grabbing"; // changes mouse to grabbing while dragging
            } else {
                document.body.style.cursor = "default"; // back to default when no dragItem
            }
        }, [dragItem]); // runs when dragItem state changes

        const dragStart = function (e: any, dragId: any, dragType: any) { // dragId + dragType - знаем список/карточка + его id
            console.log("dragStart");
            e.stopPropagation();                   // не распространяем событие вверх по дереву
            e.dataTransfer.effectAllowed = 'move'; // задает разрешенные эффекты перетаскивания элемента
            setDragItem(dragId);
            dragType && setDragType(dragType);
        };

        const drag = function (e: any) {
            console.log("drag");
            e.stopPropagation();
            setIsDragging(true);
        };

        const dragEnd = function () {
            console.log("dragEnd");
            setDragItem(null);
            setDragType(null);
            setIsDragging(false);
            setDrop(null);
        };

        const onDrop = function (e: any) {
            console.log("onDrop");
            e.preventDefault(); // это метод JavaScript, который используется для отмены действия по умолчанию браузера в ответ на событие. 
            handleDrop({ dragItem, dragType, drop });
            setDragItem(null);
            setDragType(null);
            setIsDragging(false);
            setDrop(null);
        };

        return (
            <DragContext.Provider value={{
                draggable,
                dragItem,
                dragType,
                isDragging,
                dragStart,
                drag,
                dragEnd,
                drop,
                setDrop,
                onDrop
            }}>
                {typeof children === "function"
                    ? children({ activeItem: dragItem, activeType: dragType, isDragging })
                    : children}
            </DragContext.Provider>
        );
    };

// export Drag and assign sub-components
export default Object.assign(Drag, { DragItem, DropZone, DropZones, DropGuide });
