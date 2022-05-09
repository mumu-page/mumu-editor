import {PageConfig} from "@/store/edit/state";
import {clone} from "@/utils/utils";

// 最大历史栈长度
const MAX_HISTORY_LENGTH = 100;

// 获取数组最后一个元素
const last = (arr: string | any[]) => arr[arr.length - 1];
// 清空数组
const clear = (arr: any[]) => arr.splice(0, arr.length);

type ActionType = '删除组件' | '新增组件' | '移动组件' | '更新属性' | '选中组件' | '复制组件' | '初始化'

export interface HistoryItem {
  createTime: string
  actionType: ActionType
}

class History<T> {
  stack: (T & HistoryItem)[];
  undoStack: (T & HistoryItem)[];
  currentValue: (T & HistoryItem) | null;
  actionType: ActionType | undefined;
  maxLength: number;

  constructor(maxLength = MAX_HISTORY_LENGTH) {
    // 历史记录栈
    this.stack = [];
    // 撤销栈
    this.undoStack = [];
    // 最新的值
    this.currentValue = null;
    // 最大历史栈长度
    this.maxLength = maxLength;
  }

  /**
   * 获取反转后的栈内容
   */
  getStack() {
    if(this.stack.length===1) return this.stack
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
     * 是否满
     */
    isFull()
    {
      return this.stack.length >= this.maxLength;
    }

    /**
     * 添加历史记录
     * @param {*} value 历史记录值
     */
    push(value
  :
    T & HistoryItem
  )
    {
      this.stack.push(value);
      this.undoStack = [];
      this.currentValue = value;
      if (this.stack.length > this.maxLength) {
        this.stack.splice(0, 1);
      }
    }

    /**
     * 撤销
     */
    undo()
    {
      if (this.stack.length === 1) {
        return;
      }
      const value = this.stack.pop();
      if (!value) return
      this.undoStack.push(value);
      this.currentValue = last(this.stack);
    }

    /**
     * 重做
     */
    redo()
    {
      if (this.undoStack.length === 0) {
        return;
      }
      const valueList = this.undoStack.pop();
      if (!valueList) return
      this.stack.push(valueList);
      this.currentValue = last(this.stack);
    }

    /**
     * 清空历史栈
     */
    clear()
    {
      this.undoStack.push(...this.stack);
      clear(this.stack)
    }
  }

  export
  const
  history = new History<PageConfig>()
