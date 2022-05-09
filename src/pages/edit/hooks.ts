import {useImmer} from "use-immer";
import throttle from 'lodash.throttle'
import {setShapeHoverStyle, setShapeStyle} from "@/components";
import {useStore} from "react-redux";
import {RootStore, useEditState} from "@/store";
import {addComponent} from '@/store/edit';
import {history} from "@/utils/history";
import dayjs from "dayjs";

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
  isBottom: boolean
  frameLoaded: boolean
  isTop: boolean
  spinning: boolean
  current: number
  url: string
  containerHeight: number
  draggableComponents: any[]
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

function getElementPosition(element: HTMLElement): ElementStyle {
  const {width, height, left: _left, top: _top, right: _right} = element?.getBoundingClientRect()
  // const clientWidth = document.documentElement.clientWidth
  const clientHeight = document.documentElement.clientHeight
  const top = _top/* + 20 + 53*/
  const left = _left/* + 20 + 350*/
  const right = _right - width + 5
  const bottom = clientHeight - top - height - 40 - 53
  return {left, right, top, bottom, width, height}
}

const TEMPLATE_ELE_ID_PREFIX = 'mumu-render-id-_component_'

let comCurrentId = ''
let comHoverCurrentId = ''
let isScroll = false
let current = 0
let hoverCurrent = 0

export function useEditor() {
  const [editorState, setEditorState] = useImmer<State>({
    toolStyle: {top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0},
    isBottom: false,
    spinning: true,
    isTop: false,
    current: 0,
    url: '',
    frameLoaded: false,
    containerHeight: 667,
    draggableComponents: []
  });
  const {dispatch} = useStore<RootStore>();
  const editState = useEditState()

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
    return frameDoc?.querySelector(selectors);
  }

  const handleDragEvent = (e: any, node: HTMLElement) => {
    const {clientY} = e
    const {height, top, bottom, width} = node.getBoundingClientRect()
    const line = document.getElementById('shape-line')
    if (!line) return
    line.style.display = 'block'
    if ((clientY - top) < height / 2) {
      // 上半部分
      line.style.top = `${top - 2}px`
      line.style.width = `${width}px`
    } else {
      // 下半部分
      line.style.top = `${bottom - 2}px`
      line.style.width = `${width}px`
      hoverCurrent = hoverCurrent + 1
    }
  }

  const handleEvent = (e: Event, componentsPND: any, callback?: Function) => {
    const type = e.type // dragover mousemove click
    let node = e.target as HTMLElement | null;
    if (!node) return
    while (node?.tagName !== 'HTML') {
      let currentId = node?.getAttribute('id') || '';
      if (currentId.indexOf(TEMPLATE_ELE_ID_PREFIX) >= 0) {
        const PIDs = Array.from(componentsPND.childNodes).map((nd: any) => nd.getAttribute('id'))
        PIDs.forEach((id, index) => {
          // 对比当前鼠标位置的元素
          if (id === currentId && node) {
            if (type === 'dragover') {
              comHoverCurrentId = currentId
              hoverCurrent = index
              handleDragEvent(e, node)
              return
            }
            const position = getElementPosition(node)
            if (type === 'mouseover') {
              comHoverCurrentId = currentId
              !isScroll && setShapeHoverStyle(position)
            }
            if (type === 'click') {
              comCurrentId = currentId
              current = index
              setEditorState(draft => {
                draft.current = index;
                draft.isTop = index === 0
                draft.isBottom = index === PIDs.length - 1
                draft.toolStyle = position
              })
              setShapeStyle(position)
            }
            // if (type === 'drop') {
            //   setShapeStyle(position)
            // }
            callback?.(index);
          }
        })
        break;
      }
      node = node?.parentNode as HTMLElement;
    }
  }

  let t1 = 0;
  let t2 = 0;
  let timer = null as any;

  function getScrollTop() {
    return document.documentElement.scrollTop || document.body.scrollTop;
  }

  const onIframeScroll = throttle((componentsPND) => {
    isScroll = true
    clearTimeout(timer);
    const PIDs = Array.from(componentsPND.childNodes).map((nd: any) => nd.getAttribute('id'))
    PIDs.forEach((id, index) => {
      if (id === comCurrentId) {
        const node = Array.from(componentsPND.childNodes)[index] as HTMLElement
        const position = getElementPosition(node)
        setShapeStyle(position)
      }
      if (id === comHoverCurrentId) {
        const node = Array.from(componentsPND.childNodes)[index] as HTMLElement
        const position = getElementPosition(node)
        setShapeHoverStyle(position)
      }
    })

    t1 = getScrollTop();
    timer = setTimeout(() => {
      t2 = getScrollTop();
      if (t2 === t1) {
        // 滚动结束
        isScroll = false
      }
    }, 500);
  }, 0)

  const eventInit = (selectCb: (arg0: number) => void) => {
    requestIdleCallback(() => {
      const componentsPND = getIframeView();
      if (!componentsPND) return;
      history.actionType = '初始化'
      history.push({
        ...editState.pageConfig,
        actionType: history.actionType,
        createTime: dayjs().format('YYYY-MM-DD hh:mm:ss')
      })
      componentsPND.addEventListener('click', (e: Event) => {
        history.actionType = '选中组件'
        handleEvent(e, componentsPND, selectCb)
      });
      componentsPND.addEventListener('dragover', (e: Event) => {
        e.preventDefault()
        handleEvent(e, componentsPND)
      });
      componentsPND.addEventListener('dragleave', () => {
        const line = document.getElementById('shape-line')
        line && (line.style.display = 'none')
      })
      componentsPND.addEventListener('drop', (e: any) => {
        const line = document.getElementById('shape-line')
        line && (line.style.display = 'none')
        const data = e?.dataTransfer?.getData('text/plain')
        if (data != null) {
          dispatch(addComponent({data: JSON.parse(data), index: hoverCurrent}))
        }
        // 重置样式
        current = hoverCurrent
        comCurrentId = comHoverCurrentId
        handleEvent(e, componentsPND)
        history.actionType = '新增组件'
      });
      componentsPND.addEventListener('mouseover', (e: Event) => {
        handleEvent(e, componentsPND)
      })
      componentsPND.addEventListener('mouseleave', () => {
        const shape = document.getElementById('shape-hover')
        shape && (shape.style.display = 'none')
      })
      componentsPND.addEventListener('scroll', () => onIframeScroll(componentsPND))
      window.addEventListener('resize', () => onIframeScroll(componentsPND))
    })
  }

  return {
    setSpinning,
    setUrl,
    setFrameLoaded,
    eventInit,
    editorState,
    current
  }
}

