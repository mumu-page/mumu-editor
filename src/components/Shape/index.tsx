import React, {ReactElement, useEffect} from 'react'
import style from "./index.module.less";
import classNames from "classnames";

interface ShapeProps {
  tool?: ReactElement
}

interface ElementStyle {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

let shape: HTMLElement | null,
  top: HTMLElement | null,
  right: HTMLElement | null,
  bottom: HTMLElement | null,
  left: HTMLElement | null

let shapeHover: HTMLElement | null,
  topHover: HTMLElement | null,
  rightHover: HTMLElement | null,
  bottomHover: HTMLElement | null,
  leftHover: HTMLElement | null

export function setShapeStyle(position: ElementStyle) {
  if (!shape || !top || !right || !bottom || !left) return
  shape.style.display = 'block'
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

export function setShapeHoverStyle(position: ElementStyle) {
  if (!shapeHover || !topHover || !rightHover || !bottomHover || !leftHover) return
  shapeHover.style.display = 'block'
  topHover.style.top = `${position.top}px`
  topHover.style.left = `${position.left}px`
  topHover.style.width = `${position.width}px`
  rightHover.style.right = `${position.right}px`
  rightHover.style.top = `${position.top}px`
  rightHover.style.height = `${position.height}px`
  bottomHover.style.left = `${position.left}px`
  bottomHover.style.bottom = `${position.bottom}px`
  bottomHover.style.width = `${position.width}px`
  leftHover.style.left = `${position.left}px`
  leftHover.style.top = `${position.top}px`
  leftHover.style.height = `${position.height}px`
}

export function hideShape() {
  if(!shape) return
  shape.style.display = 'none'
}

export function hideShapeHover() {
  if(!shapeHover) return
  shapeHover.style.display = 'none'
}

function Shape(props: ShapeProps) {
  const {tool} = props
  const initEle = () => {
    shape = document.getElementById('shape')
    top = document.getElementById('shape-top')
    right = document.getElementById('shape-right')
    bottom = document.getElementById('shape-bottom')
    left = document.getElementById('shape-left')

    shapeHover = document.getElementById('shape-hover')
    topHover = document.getElementById('shape-hover-top')
    rightHover = document.getElementById('shape-hover-right')
    bottomHover = document.getElementById('shape-hover-bottom')
    leftHover = document.getElementById('shape-hover-left')
  }

  useEffect(() => {
    initEle()
  }, [])

  return (
    <>
      <div id={'shape'} className={classNames(style.shape)}>
        <div id={'shape-top'} className={style.top}>{tool}</div>
        <div id={'shape-right'} className={style.right}/>
        <div id={'shape-bottom'} className={style.bottom}/>
        <div id={'shape-left'} className={style.left}/>
      </div>
      <div id="shape-hover" className={classNames(style.shapeHover)}>
        <div id={'shape-hover-top'} className={style.top}/>
        <div id={'shape-hover-right'} className={style.right}/>
        <div id={'shape-hover-bottom'} className={style.bottom}/>
        <div id={'shape-hover-left'} className={style.left}/>
      </div>
      <div id={'shape-line'} className={style.line}/>
    </>
  )
}

export default Shape