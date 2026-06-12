class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }

  // O(1)
  getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }

  // O(1)
  getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }

  // O(1)
  getParentIndex(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }

  // O(1)
  hasLeftChild(index) {
    return this.getLeftChildIndex(index) < this.heap.length;
  }

  // O(1)
  hasRightChild(index) {
    return this.getRightChildIndex(index) < this.heap.length;
  }

  // O(1)
  hasParent(index) {
    return this.getParentIndex(index) >= 0;
  }

  // O(1)
  leftChild(index) {
    return this.heap[this.getLeftChildIndex(index)];
  }

  // O(1)
  rightChild(index) {
    return this.heap[this.getRightChildIndex(index)];
  }

  // O(1)
  parent(index) {
    return this.heap[this.getParentIndex(index)];
  }

  // O(1)
  swap(indexOne, indexTwo) {
    const temp = this.heap[indexOne];
    this.heap[indexOne] = this.heap[indexTwo];
    this.heap[indexTwo] = temp;
  }

  // O(1)
  peek() {
    if (this.heap.length === 0) {
      return null;
    }
    return this.heap[0];
  }

  // O(log n)
  extractMin() {
    if (this.heap.length === 0) {
      return null;
    }
    if (this.heap.length === 1) {
      return this.heap.pop();
    }
    const item = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return item;
  }

  // O(log n)
  insert(item) {
    this.heap.push(item);
    this.heapifyUp();
  }

  // O(log n)
  heapifyUp() {
    let index = this.heap.length - 1;
    while (
      this.hasParent(index) &&
      this.comparator(this.parent(index), this.heap[index]) > 0
    ) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  // O(log n)
  heapifyDown() {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (
        this.hasRightChild(index) &&
        this.comparator(this.rightChild(index), this.leftChild(index)) < 0
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }

      if (this.comparator(this.heap[index], this.heap[smallerChildIndex]) <= 0) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }

  // O(1)
  isEmpty() {
    return this.heap.length === 0;
  }

  // O(1)
  size() {
    return this.heap.length;
  }
}

export default MinHeap;
