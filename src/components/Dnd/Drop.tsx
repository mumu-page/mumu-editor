import React, { DragEventHandler, ReactNode } from "react";
import { FC, useContext } from "react";
import { Context } from "./DndContext";

interface DropProps {
  children: ReactNode;
}

const Drop: FC<DropProps> = (props) => {
  const { onDragOver, onDragEnd } = useContext(Context);
  const dragOver: DragEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault();
    if (onDragOver) onDragOver();
  };

  const drop: DragEventHandler<HTMLDivElement> = (ev) => {
    // 获取数据
    const oldIndex = ev.dataTransfer.getData("index");
    // 获取拖拽结束时的Y轴坐标
    const Y = ev.clientY;
    // 简便计算，设定高度为20
    // 我这里很偷懒，实际计算情况很复杂
    //一般有两种实现思路，一种就是根据位置计算，另外一种就是给拖拽源设置可放置，然后获取
    const height = 20;
    const newIndex = Math.floor(Y / height);

    if (oldIndex) {
      if (onDragEnd) onDragEnd(Number(oldIndex), newIndex);
    }
  };

  return (
    <div onDragOver={dragOver} onDrop={drop}>
      {props.children}
    </div>
  );
};

export default Drop;

// eslint-disable-next-line no-lone-blocks
{/* <DndContext
  onDragEnd={(oldIndex, newIndex) => {
    setData(arrayMove(data, oldIndex, newIndex));
  }}
  onDragOver={() => { }}
>
  <Drop>
    {data.map((i, index) => (
      <Drag key={i.id} id={i.id} index={index}>
        <div className="item">{i.text}</div>
      </Drag>
    ))}
  </Drop>
</DndContext> */}