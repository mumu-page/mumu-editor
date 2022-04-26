import React, { DragEventHandler, ReactNode } from "react";
import { FC } from "react";

interface DragProps {
  children: ReactNode;
  index: number;
  id: number;
}

const Drag: FC<DragProps> = (props) => {
  const startDrag: DragEventHandler<HTMLDivElement> = (ev) => {
    // 传输数据
    ev.dataTransfer.setData("index", `${props.index}`);
    ev.dataTransfer.setData("id", `${props.id}`);
  };

  return (
    <div draggable onDragStart={startDrag}>
      {props.children}
    </div>
  );
};

export default Drag;

// eslint-disable-next-line no-lone-blocks
{/* <Drag index={1} id='1'>
  <div>被包裹的可以拖拽的组件</div>
</Drag> */}