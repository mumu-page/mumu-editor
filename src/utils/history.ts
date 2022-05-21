import { PageConfig } from "@/store/edit/state";
import dayJS from "dayjs";
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayJS.extend(utc)
dayJS.extend(tz)
dayJS.tz.setDefault("PRC")

// 最大历史栈长度
const MAX_HISTORY_LENGTH = 100;

// 获取数组最后一个元素
const last = (arr: string | any[]) => arr[arr.length - 1];
// 清空数组
const clear = (arr: any[]) => arr.splice(0, arr.length);

type ActionType = '删除组件' | '新增组件' | '移动组件' | '更新属性' | '选中组件' | '复制组件' | '初始化'

export interface HistoryItem {
  createTime?: string
  actionType: ActionType
}

interface Callback<T> {
  name: string
  callback: (h: History<T>) => void
}

/** 历史记录包括： 新增、组件点击、组件属性改变、组件顺序、组件复制、删除 */

class History<T> {
  private readonly stack: (T & HistoryItem)[];
  private _undoStack: (T & HistoryItem)[];
  private _currentValue: (T & HistoryItem) | null;
  private _actionType: ActionType | undefined;
  private readonly maxLength: number;
  private _callbacks: Callback<T>[] = []

  constructor(maxLength = MAX_HISTORY_LENGTH) {
    // 历史记录栈
    this.stack = [];
    // 撤销栈
    this._undoStack = [];
    // 最新的值
    this._currentValue = null;
    // 最大历史栈长度
    this.maxLength = maxLength;
  }

  onUpdate(name: string, callback: (h: History<T>) => void) {
    this._callbacks.push({ name, callback })
  }

  offUpdate(name: string) {
    for (let i = 0; i < this._callbacks.length; i++) {
      const item = this._callbacks[i]
      if (item.name === name) {
        this._callbacks.splice(i, 1)
        break
      }
    }
  }

  runCallback() {
    this._callbacks.forEach(item => item.callback(this))
  }

  /**
   * 是否满
   */
  isFull() {
    return this.stack.length >= this.maxLength;
  }

  /**
   * 添加历史记录
   * @param {*} value 历史记录值
   */
  push(value: T & HistoryItem) {
    value.createTime = dayJS().format('YYYY-MM-DD hh:mm:ss')
    this.stack.push(value);
    this._undoStack = [];
    this._currentValue = value;
    if (this.stack.length > this.maxLength) {
      this.stack.splice(0, 1);
    }
    this.runCallback()
  }

  /**
   * 撤销
   */
  undo() {
    if (this.stack.length === 1) {
      return;
    }
    const value = this.stack.pop();
    if (!value) return
    this._undoStack.push(value);
    this._currentValue = last(this.stack);
    this.runCallback()
  }

  /**
   * 重做
   */
  redo() {
    if (this._undoStack.length === 0) {
      return;
    }
    const valueList = this._undoStack.pop();
    if (!valueList) return
    this.stack.push(valueList);
    this._currentValue = last(this.stack);
    this.runCallback()
  }

  getStackByIndex(index: number) {
    return this.stack[index]
  }

  /**
   * 获取反转后的栈内容
   */
  getReverseStack() {
    if (this.stack.length === 1) return this.stack
    const result: (T & HistoryItem)[] = [...this.stack]
    let left = 0; // 存储左边第一个位置
    let right = this.stack.length - 1;//存储右边最后一个位置
    while (left < right) {
      let temp = result[left]; // 利用一个中间变量来交换位置
      result[left] = result[right];
      result[right] = temp;
      left++;
      right--;
    }
    return result
  }

  /**
   * 清空历史栈
   */
  clear() {
    this._undoStack.push(...this.stack);
    clear(this.stack)
    this.runCallback()
  }

  getStack() {
    return this.stack
  }

  /**
   * 跳转到指定的某条记录
   * @param index
   */
  setCurrentValue(index: number) {
    this._currentValue = this.stack[index]
  }

  get actionType() {
    return this._actionType
  }

  set actionType(val) {
    this._actionType = val
  }

  get currentValue() {
    return this._currentValue
  }

  set currentValue(val) {
    this._currentValue = val
  }
}

export const
  history = new History<PageConfig>()
