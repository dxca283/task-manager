class Queue {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.rearIndex = 0;
  }

  // O(1) enqueue
  enqueue(item) {
    this.items[this.rearIndex] = item;
    this.rearIndex++;
  }

  // O(1) dequeue
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }

  // O(1) peek
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.frontIndex];
  }

  // O(1) isEmpty
  isEmpty() {
    return this.rearIndex === this.frontIndex;
  }

  // O(1) size
  size() {
    return this.rearIndex - this.frontIndex;
  }
}

export default Queue;
