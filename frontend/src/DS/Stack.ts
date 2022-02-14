export default class FixedStack<T> {
  maxSize: number;
  private currSize: number = 0;
  stack: T[] = [];
  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }
  push = (item: T) => {
    if (this.currSize <= this.maxSize) {
      // there is space left in the stack
      this.stack.splice(0, 0, item);
      this.currSize++;
    } else {
      // no space left in the stack
      // the bottom most element to be removed
      this.stack.pop();
      this.stack.splice(0, 0, item);
    }
  };
  pop = () => {
    if (this.currSize > 0) {
      this.stack.pop();
      this.currSize--;
    }
  };
  flush = () => {
    if (this.currSize > 0) {
      this.stack = [];
      this.currSize = 0;
    }
  };
  peek = () => {
    return this.stack[0];
  };
}
