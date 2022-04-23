import { useState } from "react";

function getElementTop(element: { offsetTop: any; offsetParent: any; }) {
  let actualTop = element.offsetTop;
  let current = element.offsetParent;

  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }

  return actualTop;
}

export function useEditor() {
  const [state, setState] = useState({
    toolStyle: {} as any,
    activeStyle: {},
    hoverStyle: {},
    isBottom: false,
    isTop: false,
    current: 0,
    containerHeight: 667,
    dragableComponents: []
  });

  const getIframeElement = (selectors = '#slider-view') => {
    const frame = document.getElementById('frame') as HTMLFrameElement | null
    const componentsPND = frame?.contentWindow?.document.querySelector(selectors);
    if (!componentsPND) return {} as any
    return componentsPND
  }

  const restStyle = (height: string, top: number, type: string) => {
    const state2 = JSON.parse(JSON.stringify(state))
    state2[type] = {
      height,
      top: `${top}px`,
    }
    setState(state2)

    requestIdleCallback(() => {
      const toolND = document.getElementById('se-view-tools');
      if (!toolND) return
      const toolHeight = parseInt(getComputedStyle(toolND).height, 10);
      const state3 = JSON.parse(JSON.stringify(state))
      state3.toolStyle = {
        top: `${top + 10 + toolHeight > state.containerHeight ? top - toolHeight + parseInt(height, 10) : top + 10}px`,
      };
      setState(state3)
    })
  }

  const eventInit = (selectCb: (arg0: number) => void) => {
    requestIdleCallback(() => {
      const componentsPND = getIframeElement();
      if (!componentsPND) return;
      componentsPND.addEventListener('click', (e: { target: any; }) => {
        let node = e.target as any;
        while (node?.tagName !== 'HTML') {
          let currentId = node?.getAttribute('id') || '';
          if (currentId.indexOf('mumu-render-id-_component_') >= 0) {
            const top = getElementTop(node);
            const { height } = getComputedStyle(node);
            restStyle(height, top, 'activeStyle');
            const pids = Array.from(componentsPND.childNodes).map((nd: any) => nd.getAttribute('id'))
            pids.forEach((id, index) => {
              if (id === currentId) {
                state.isTop = index === 0;
                state.isBottom = index === pids.length - 1;
                state.current = index;
                selectCb(index);
              }
            });
          }
          node = node.parentNode;
        }
      });
      componentsPND.addEventListener('mouseover', (e: { target: any; }) => {
        let node = e.target;
        while (node.tagName !== 'HTML') {
          let currentId = node?.getAttribute('id') || '';
          if (currentId.indexOf('mumu-render-id-_component_') >= 0) {
            try {
              const top = getElementTop(node);
              const { height } = getComputedStyle(node);
              restStyle(height, top, 'hoverStyle');
              const pids = Array.from(componentsPND.childNodes).map((nd: any) => nd.getAttribute('id'))
              pids.forEach((id, index) => {
                if (id === currentId) {
                  state.isTop = index === 0;
                  state.isBottom = index === pids.length - 1;
                  state.current = index;
                }
              })
            } catch (e) {
              // ignore
            }
  
          }
          node = node.parentNode;
        }
      });
    })
  }

  const init = (index: number) => {
    requestIdleCallback(() => {
      const componentsPND = getIframeElement();
      if (!componentsPND) return;
      const container = getIframeElement('html')
      if (!container) return;
      const containerHeight = Math.ceil(parseFloat(getComputedStyle(container).height) + componentsPND.offsetTop);
      state.containerHeight = containerHeight > 667 ? containerHeight : 667;
      if (index === -1) return;
      const node = componentsPND.childNodes?.[index];
      if(!node) return
      let currentId = node?.getAttribute('id') || '';
      const top = getElementTop(node);
      const { height } = getComputedStyle(node);
      restStyle(height, top, 'activeStyle');
      const pids = Array.from(componentsPND.childNodes).map((nd: any) => nd.getAttribute('id'))
      pids.forEach((id, index) => {
        if (id === currentId) {
          state.isTop = index === 0;
          state.isBottom = index === pids.length - 1;
          state.current = index;
        }
      })
    })
  }

  const getIndex = (y: number) => {
    const componentsPND = getIframeElement();
    let total = 40;
    let index = 0;
    Array.from(componentsPND.childNodes).some((nd: any, i) => {
      try {
        total = total + parseInt(getComputedStyle(nd).height, 10);
        if (total > y) {
          index = i;
          return true;
        }
      } catch (e) {
        //
      }

      index = i;
      return false;
    });
    return index;
  }

  // 需要设置fixed布局的组件样式
  const setFixedStyle = (index: any) => {
    const componentsPND = getIframeElement()
    state.dragableComponents = [];
    Array.from(componentsPND?.childNodes || []).forEach((nd: any) => {
      if (nd.getAttribute('data-layout') === 'fixed') {
        try {
          // const el = nd.childNodes[0];
          // const { left, top, width, height } = getComputedStyle(el);
          // state.dragableComponents.push({
          //   x: parseInt(left),
          //   y: parseInt(top),
          //   width: parseInt(width, 10),
          //   height: parseInt(height, 10),
          //   index
          // });
        } catch (e) {
          //
        }
      }
    });
  }

  return {
    eventInit,
    init,
    editorState: state,
    getIndex,
    setFixedStyle,
  }
}

