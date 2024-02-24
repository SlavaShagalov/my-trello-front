import React, { useContext } from 'react';
import DropZone from './DropZone';

// context
import DragContext from './types';

// if we need multiple dropzones
const DropZones: React.FC<{
  dropType: any;
  prevId: any;
  nextId: any;
  split?: any;
  remember: any;
  children: any;
  [key: string]: any;
}> = ({
  dropType,
  prevId,
  nextId,
  split = "y",
  remember,
  children,
  ...props
}) => {
    const { dragType, isDragging } = useContext(DragContext);

    return (
      <div style={{ position: "relative" }} {...props}>
        {children}
        {dragType === dropType && isDragging &&
          <div style={{ position: "absolute", inset: "0px", display: "flex", flexDirection: split === "x" ? "row" : "column" }}>
            <DropZone dropId={prevId} style={{ width: "100%", height: "100%" }} dropType={dropType} remember={remember} />
            <DropZone dropId={nextId} style={{ width: "100%", height: "100%" }} dropType={dropType} remember={remember} />
          </div>
        }
      </div>
    );
  };

export default DropZones;
