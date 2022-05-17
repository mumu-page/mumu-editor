import { useImmer } from "use-immer";

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

export function useEditor() {
  const [editorState, setEditorState] = useImmer<State>({
    toolStyle: { top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 },
    isBottom: false,
    spinning: true,
    isTop: false,
    current: 0,
    url: '',
    frameLoaded: false,
    containerHeight: 667,
    draggableComponents: []
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

  return {
    setSpinning,
    setUrl,
    setFrameLoaded,
    editorState,
  }
}

