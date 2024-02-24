import React, { SyntheticEvent, useContext } from 'react';
import DragContext from './types';

// listens for drags over drop zones
const DropZone: React.FC<{
    as?: any;
    dropId?: any;
    dropType?: any;
    style?: any;
    children?: any;
    [key: string]: any;
}> = ({
    as,
    dropId,
    dropType,
    style,
    children,
    ...props
}) => {
        const { dragItem, dragType, setDrop, drop, onDrop } = useContext(DragContext);

        function handleDragOver(e: any) { // просто подавляем действия по умолчанию, чтоб не мешали
            // console.log("handleDragOver");
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        };

        let Component = as || "div";
        return (
            <Component onDragEnter={(e: SyntheticEvent) => dragItem && dropType === dragType && setDrop(dropId)}
                onDragOver={handleDragOver}
                onDrop={onDrop}
                style={{ position: "relative", ...style }}
                {...props}>
                {children}
                {drop === dropId && <div style={{ position: "absolute", inset: "0px" }}></div>}
            </Component>
        );
    };

export default DropZone;
