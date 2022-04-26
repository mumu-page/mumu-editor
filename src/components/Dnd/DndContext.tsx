import React, { createContext, FC, ReactNode } from "react";

export interface TContext {
  children?: ReactNode;
  onDragOver: () => void;
  onDragEnd: (oldIndex: number, newIndex: number) => void;
}

const Context = createContext<TContext>({} as TContext);

const DndContext: FC<TContext> = (props) => {
  return (
    <Context.Provider
      value={{
        onDragEnd: (oldIndex, newIndex) => {
          props.onDragEnd(oldIndex, newIndex);
        },
        onDragOver: () => {
          props.onDragOver();
        }
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export { Context };
export default DndContext;