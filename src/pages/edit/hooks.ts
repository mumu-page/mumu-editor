import {useImmer} from "use-immer";
import {throttle} from 'lodash'
import {setShapeHoverStyle, setShapeStyle} from "@/components";
import {useStore} from "react-redux";
import {RootStore, useEditState} from "@/store";
import {addComponent, setCurrentComponent} from '@/store/edit';
import {history} from "@/utils/history";
import dayjs from "dayjs";
import {useCallback, useEffect, useRef} from "react";
import {hideShape, hideShapeHover} from "@/components/Shape";
import {hideTool, showTool} from "@/components/Tool";
import {postMsgToChild} from "@/utils/utils";
import {GET_CONFIG} from "@/constants";

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

interface RefData {
  isScroll: boolean,
  current: number,
  hoverCurrent: number,
  componentsPND: Element | null | undefined
  selectCb?: (arg0: number) => void
  resizeObserver: ResizeObserver | null
  mutationObserver: MutationObserver | null
  preTop: number;
  nextTop: number;
  timer: NodeJS.Timeout | null;
}

const TEMPLATE_ELE_ID_PREFIX = 'mumu-render-id-_component_'

function getScrollTop() {
  return document.documentElement.scrollTop || document.body.scrollTop;
}

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
  const staticData = useRef<RefData>({
    isScroll: false,
    current: 0,
    hoverCurrent: 0,
    componentsPND: null,
    selectCb: () => {
    },
    resizeObserver: null,
    mutationObserver: null,
    preTop: 0,
    nextTop: 0,
    timer: null
  })

  const getIframeHeight = () => {
    return staticData.current?.componentsPND?.scrollHeight || 0
  }

  const getDeviation = () => {
    const previewContainer = document.getElementById('preview-container')
    let deviation = 0
    const iframeHeight = getIframeHeight()
    const previewContainerHeight = previewContainer?.getBoundingClientRect()?.height || 0
    if (Math.floor(iframeHeight) > Math.ceil(previewContainerHeight)) deviation = 5
    return deviation
  }

  const getElementPosition = (element: HTMLElement): ElementStyle => {
    const {width, height, left: _left, top: _top, right: _right} = element?.getBoundingClientRect()
    const clientHeight = document.documentElement.clientHeight
    const top = _top/* + 20 + 53*/
    const left = _left/* + 20 + 350*/
    const right = _right - width + getDeviation()
    const bottom = clientHeight - top - height - 40 - 53
    return {left, right, top, bottom, width, height}
  }

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

  const isTopOrBottom = (e: any, node: HTMLElement) => {
    const {clientY} = e
    const {height, top} = node.getBoundingClientRect()
    if ((clientY - top) < height / 2) {
      return 'top'
    } else {
      return 'bottom'
    }
  }

  const handleDragEvent = (e: any, node: HTMLElement) => {
    const {top, bottom, width} = node.getBoundingClientRect()
    const line = document.getElementById('shape-line')
    if (!line) return
    line.style.display = 'block'
    const type = isTopOrBottom(e, node)
    if (type === 'top') {
      line.style.top = `${top - 2}px`
      line.style.width = `${width}px`
    } else {
      line.style.top = `${bottom - 2}px`
      line.style.width = `${width}px`
      staticData.current.hoverCurrent = staticData.current.hoverCurrent + 1
    }
  }

  const setToolStyle = (index: number, position: ElementStyle) => {
    if (!staticData.current.componentsPND) return
    showTool()
    // 滚动时不更新工具组件，减少卡顿
    if (staticData.current.isScroll) return
    const childNodes = Array.from(staticData.current.componentsPND.childNodes)
    const PIDs = childNodes.map((nd: any) => nd.getAttribute('id'))
    // 设置工具组件样式
    setEditorState(draft => {
      if (PIDs.length === 1) {
        draft.isTop = true
        draft.isBottom = true
      } else {
        draft.isTop = index === 0
        draft.isBottom = index === PIDs.length - 1
      }
      draft.toolStyle = position
    })
  }

  const computedShapeAndToolStyle = () => {
    if (!staticData.current.componentsPND) return
    const childNodes = Array.from(staticData.current.componentsPND.childNodes)
    if (!childNodes.length) {
      hideShape()
      hideShapeHover()
      hideTool()
      staticData.current.current = -1
      return;
    }
    const currentDom = childNodes[staticData.current.current] as HTMLElement
    const hoverCurrentDom = childNodes[staticData.current.hoverCurrent] as HTMLElement
    if (currentDom) {
      const position = getElementPosition(currentDom)
      setEditorState(draft => {
        draft.current = staticData.current.current;
      })
      setToolStyle(staticData.current.current, position)
      setShapeStyle(position)
    }
    if (hoverCurrentDom) {
      const hoverPosition = getElementPosition(hoverCurrentDom)
      setShapeHoverStyle(hoverPosition)
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
              staticData.current.hoverCurrent = index
              handleDragEvent(e, node)
            }
            if (type === 'mouseover') {
              staticData.current.hoverCurrent = index
              !staticData.current.isScroll && computedShapeAndToolStyle()
            }
            if (type === 'click') {
              staticData.current.current = index
            }
            if (type === 'drop') {
              const type = isTopOrBottom(e, node)
              if (type === 'top') {
                staticData.current.current = index !== 0 ? index - 1 : 0
              } else {
                staticData.current.current = index + 1
              }
            }
            if (['click', 'drop'].includes(type)) {
              computedShapeAndToolStyle()
              dispatch(setCurrentComponent({currentIndex: index}))
            }
            callback?.(staticData.current.current);
          }
        })
        break;
      }
      node = node?.parentNode as HTMLElement;
    }
  }

  const onIframeScroll = throttle(() => {
    staticData.current.isScroll = true
    clearTimeout(staticData.current.timer as any);
    computedShapeAndToolStyle()
    staticData.current.preTop = getScrollTop();
    staticData.current.timer = setTimeout(() => {
      staticData.current.nextTop = getScrollTop();
      if (staticData.current.nextTop === staticData.current.preTop) {
        // 滚动结束
        staticData.current.isScroll = false
      }
    }, 500);
  }, 0)

  const onClick = useCallback((e: Event) => {
    handleEvent(e, staticData.current.componentsPND, staticData.current.selectCb)
  }, [])

  const onDragover = useCallback((e: Event) => {
    e.preventDefault()
    handleEvent(e, staticData.current.componentsPND)
  }, [])

  const onDragleave = useCallback(() => {
    const line = document.getElementById('shape-line')
    line && (line.style.display = 'none')
  }, [])

  const onDrop = useCallback((e: any) => {
    const line = document.getElementById('shape-line')
    line && (line.style.display = 'none')
    const data = e?.dataTransfer?.getData('text/plain')
    if (data != null) {
      dispatch(addComponent({data: JSON.parse(data), index: staticData.current.hoverCurrent}))
    }
    // 重置样式
    staticData.current.current = staticData.current.hoverCurrent
    handleEvent(e, staticData.current.componentsPND)
  }, [])

  const onMouseover = useCallback((e: Event) => {
    handleEvent(e, staticData.current.componentsPND)
  }, [])

  const onMouseleave = useCallback(() => {
    const shape = document.getElementById('shape-hover')
    shape && (shape.style.display = 'none')
  }, [])

  const onScroll = useCallback(() => onIframeScroll(), [])

  const onResize = useCallback(() => computedShapeAndToolStyle(), [])

  const eventInit = (selectCb?: (arg0: number) => void) => {
    requestIdleCallback(() => {
      staticData.current.componentsPND = getIframeView(/*editState.containerElementId*/);
      staticData.current.selectCb = selectCb
      if (!staticData.current.componentsPND) return;
      staticData.current.componentsPND.addEventListener('click', onClick);
      staticData.current.componentsPND.addEventListener('dragover', onDragover);
      staticData.current.componentsPND.addEventListener('dragleave', onDragleave)
      staticData.current.componentsPND.addEventListener('drop', onDrop);
      staticData.current.componentsPND.addEventListener('mouseover', onMouseover)
      staticData.current.componentsPND.addEventListener('mouseleave', onMouseleave)
      staticData.current.componentsPND.addEventListener('scroll', onScroll)
      window.addEventListener('resize', onResize)
      staticData.current.resizeObserver = new ResizeObserver(onResize);
      staticData.current.resizeObserver.observe(staticData.current.componentsPND)
      staticData.current.mutationObserver = new MutationObserver(onResize)
      staticData.current.mutationObserver.observe(staticData.current.componentsPND, {
        attributes: true, childList: true, subtree: true
      })
    })
  }

  useEffect(() => {
    return () => {
      if (!staticData?.current?.componentsPND) return
      staticData.current.componentsPND.removeEventListener('click', onClick);
      staticData.current.componentsPND.removeEventListener('dragover', onDragover);
      staticData.current.componentsPND.removeEventListener('dragleave', onDragleave)
      staticData.current.componentsPND.removeEventListener('drop', onDrop);
      staticData.current.componentsPND.removeEventListener('mouseover', onMouseover)
      staticData.current.componentsPND.removeEventListener('mouseleave', onMouseleave)
      staticData.current.componentsPND.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      staticData.current.resizeObserver?.disconnect()
      staticData.current.mutationObserver?.disconnect()
    }
  }, [])

  useEffect(() => {
    postMsgToChild({type: GET_CONFIG, data: JSON.parse(JSON.stringify(editState.pageConfig.userSelectComponents))})
  }, [editState])

  return {
    setSpinning,
    setUrl,
    setFrameLoaded,
    eventInit,
    editorState,
    staticData,
    computedShapeAndToolStyle
  }
}

