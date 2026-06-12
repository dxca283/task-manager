import MinHeap from "./MinHeap.js";

class PriorityQueue {
  constructor(comparator = (a, b) => a - b) {
    this.heap = new MinHeap(comparator);
  }

  // O(log n)
  enqueue(item) {
    this.heap.insert(item);
  }

  // O(log n)
  dequeue() {
    return this.heap.extractMin();
  }

  // O(1)
  peek() {
    return this.heap.peek();
  }

  // O(1)
  isEmpty() {
    return this.heap.isEmpty();
  }

  // O(1)
  size() {
    return this.heap.size();
  }
}

export default PriorityQueue;
