import {useImmer} from "use-immer";
import throttle from 'lodash.throttle'

interface ElementStyle {
    top: number
    left: number
    right: number
    bottom: number
    width: number
    height: number
}

interface State {
    toolStyle: ElementStyle
    activeStyle: ElementStyle
    hoverStyle: ElementStyle
    isBottom: boolean
    frameLoaded: boolean
    isTop: boolean
    spinning: boolean
    current: number
    currentId: string
    url: string
    containerHeight: number
    dragableComponents: any[]
}

function getElementTop(element: { offsetTop: any; offsetParent: any; }) {
  let actualTop = element.offsetTop;
  let current = element.offsetParent;

  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }

  return actualTop;
}

function getElementPosition(element: HTMLElement | null) {
  if (!element) return { top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 }
  const { width, height, left: _left, top: _top, right: _right } = element?.getBoundingClientRect()
  const clientWidth = document.documentElement.clientWidth
  const clientHeight = document.documentElement.clientHeight
  const top = _top/* + 20 + 53*/
  const left = _left/* + 20 + 350*/
  const right = _right - width + 5
  const bottom = clientHeight - top - height- 40 - 53
  return {left, right, top, bottom, width, height}
}

function setShapeStyle(position: ElementStyle) {
    const top = document.getElementById('shape-top')
    const right = document.getElementById('shape-right')
    const bottom = document.getElementById('shape-bottom')
    const left = document.getElementById('shape-left')
    if(!top || !right || !bottom || !left) return
    top.style.top = `${position.top}px`
    top.style.left = `${position.left}px`
    top.style.width = `${position.width}px`
    right.style.right = `${position.right}px`
    right.style.top = `${position.top}px`
    right.style.height = `${position.height}px`
    bottom.style.left = `${position.left}px`
    bottom.style.bottom = `${position.bottom}px`
    bottom.style.width = `${position.width}px`
    left.style.left = `${position.left}px`
    left.style.top = `${position.top}px`
    left.style.height = `${position.height}px`
}

const TEMPLATE_ELE_ID_PREFIX = 'mumu-render-id-_component_'

let comCurrentId = ''

export function useEditor() {
  const [editorState, setEditorState] = useImmer<State>({
    toolStyle: { top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 },
    activeStyle: { top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 },
    hoverStyle: { top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 },
    isBottom: false,
    spinning: true,
    isTop: false,
    current: 0,
    currentId: '',
    url: '',
    frameLoaded: false,
    containerHeight: 667,
    dragableComponents: []
  });

  const setFrameLoaded = (loaded: boolean) => {
    setEditorState(draft => {
      draft.frameLoaded = loaded
    })
  }

  const setUrl = (url: string) => {
    setEditorState(draft => {
      draft.url = url
    })
  }
  const setSpinning = (spinning: boolean) => {
    setEditorState(draft => {
      draft.spinning = spinning
    })
  }
  const getIframeDoc = () => {
    const frame = document.getElementById('frame') as HTMLFrameElement | null
    return frame?.contentWindow?.document
  }

  const getIframeView = (selectors = '#slider-view') => {
    const frameDoc = getIframeDoc()
    const componentsPND = frameDoc?.querySelector(selectors);
    if (!componentsPND) return {} as any
    return componentsPND
  }

  const handleEvent = (e: Event, componentsPND: any, drag: boolean, callback?: Function) => {
    let node = e.target as HTMLElement | null;
    if (!node) return
    while (node?.tagName !== 'HTML') {
      let currentId = node?.getAttribute('id') || '';
      if (currentId.indexOf(TEMPLATE_ELE_ID_PREFIX) >= 0) {
        const pids = Array.from(componentsPND.childNodes).map((nd: any) => nd.getAttribute('id'))
        // eslint-disable-next-line no-loop-func
        pids.forEach((id, index) => {
          if (id === currentId) {
            comCurrentId = currentId
            setEditorState(draft => {
              draft.isTop = index === 0;
              draft.isBottom = index === pids.length - 1;
              draft.current = index;
              draft.currentId = currentId;
              // draft.activeStyle = getElementPosition(node)
            })
            const position = getElementPosition(node)
            setShapeStyle(position)
            callback?.(index);
          }
        })
        break;
      }
      node = node?.parentNode as HTMLElement;
    }
  }

  const onIframeScroll = throttle((componentsPND) => {
    const pids = Array.from(componentsPND.childNodes).map((nd: any) => nd.getAttribute('id'))
    // eslint-disable-next-line no-loop-func
    pids.forEach((id, index) => {
      if (id === comCurrentId) {
        const node = Array.from(componentsPND.childNodes)[index] as HTMLElement
        setEditorState(draft => {
          // draft.activeStyle = getElementPosition(node)
        })
        const position = getElementPosition(node)
        setShapeStyle(position)
      }
    })
  }, 0)

  const eventInit = (selectCb: (arg0: number) => void) => {
    requestIdleCallback(() => {
      const iframeDoc = getIframeDoc()
      const componentsPND = getIframeView();
      if (!componentsPND) return;
      componentsPND.addEventListener('click', (e: Event) => handleEvent(e, componentsPND, false, selectCb));
      componentsPND.addEventListener('dragover', (e: Event) => handleEvent(e, componentsPND, true));
      iframeDoc?.addEventListener('scroll', () => onIframeScroll(componentsPND))
      window.addEventListener('resize',  () => onIframeScroll(componentsPND))
    })
  }

  const init = (index: number) => {
    requestIdleCallback(() => {
      const componentsPND = getIframeView();
      if (!componentsPND) return;
      const container = getIframeView('html')
      if (!container) return;
      const containerHeight = Math.ceil(parseFloat(getComputedStyle(container).height) + componentsPND.offsetTop);
      setEditorState(draft => {
        draft.containerHeight = containerHeight > 667 ? containerHeight : 667;
      })
      if (index === -1) return;
      const node = componentsPND.childNodes?.[index];
      if (!node) return
      let currentId = node?.getAttribute('id') || '';
      const top = getElementTop(node);
      const { height } = getComputedStyle(node);
      // restStyle(height, top, 'activeStyle');
      // const pids = Array.from(componentsPND.childNodes).map((nd: any) => nd.getAttribute('id'))
      // pids.forEach((id, index) => {
      //   if (id === currentId) {
      //     setEditorState(draft => {
      //       draft.isTop = index === 0;
      //       draft.isBottom = index === pids.length - 1;
      //       draft.current = index;
      //     })
      //   }
      // })
    })
  }

  const getIndex = (y: number) => {
    const componentsPND = getIframeView();
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
    const componentsPND = getIframeView()
    setEditorState(draft => {
      draft.dragableComponents = [];
    })
    Array.from(componentsPND?.childNodes || []).forEach((nd: any) => {
      if (nd.getAttribute('data-layout') === 'fixed') {
        try {
          const el = nd.childNodes[0];
          const { left, top, width, height } = getComputedStyle(el);
          setEditorState(draft => {
            draft.dragableComponents.push({
              x: parseInt(left),
              y: parseInt(top),
              width: parseInt(width, 10),
              height: parseInt(height, 10),
              index
            });
          })
        } catch (e) {
          //
        }
      }
    });
  }

  return {
    setSpinning,
    setUrl,
    setFrameLoaded,
    eventInit,
    init,
    editorState,
    getIndex,
    setFixedStyle,
  }
}

