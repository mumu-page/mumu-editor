import { COMPONENT_ELEMENT_ITEM_ID_PREFIX } from "@/constants"
import { Component, RemoteComponent } from "@/store/edit/state"
import { uuid } from "@/utils/utils"

// 重置拖拽ID，保证每次拖拽ID都是唯一的
export const restComponentsId = (components: Component[]): Component[] => {
  return components.map(item => ({
    ...item,
    id: `${COMPONENT_ELEMENT_ITEM_ID_PREFIX}${uuid()}`,
    children: Array.isArray(item.children) ? restComponentsId(item.children) : []
  }))
}