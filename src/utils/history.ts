// 最大历史栈长度
const MAX_HISTORY_LENGTH = 100;

// 获取数组最后一个元素
const last = (arr: string | any[]) => arr[arr.length - 1];
// 清空数组
const clear = (arr: any[]) => arr.splice(0, arr.length);

class History {
  stack: any[];
  undoStack: any[];
  currentValue: null;
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
   * 是否满
   */
  isFull() {
    return this.stack.length >= this.maxLength;
  }

  /**
   * 添加历史记录
   * @param {*} value 历史记录值
   */
  push(value: any) {
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
  undo() {
    if (this.stack.length === 1) {
      return;
    }
    const value = this.stack.pop();
    this.undoStack.push([value]);
    this.currentValue = last(this.stack);
  }

  /**
   * 重做
   */
  redo() {
    if (this.undoStack.length === 0) {
      return;
    }
    const valueList = this.undoStack.pop();
    this.stack.push(...valueList);
    this.currentValue = last(this.stack);
  }

  /**
   * 清空历史栈
   */
  clear() {
    this.undoStack.push([ ...this.stack ]);
    clear(this.stack)
  }
}

export const historyState = new History()