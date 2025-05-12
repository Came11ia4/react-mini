export function pop(heap) {
  if (heap.length === 0) return null;

  const first = heap[0];
  const last = heap.pop();
  if (first !== last) {
    heap[0] = last;
    signDown(heap, last, 0);
  } else {
    return first;
  }
}

/**
 * 向任务队列推入一个任务
 * @param {*} heap 任务队列
 * @param {*} task 推入的任务
 */
export function push(heap, task) {
  heap.push(task);
  const currentIndex = heap.length - 1;
  signUp(heap, task, currentIndex);
}
/**
 * @param {*} heap 任务队列
 * @returns 任务队列中的第一个任务
 */
export function peek(heap) {
  return heap.length === 0 ? null : heap[0];
}

/**
 * 向上调整任务在任务队列的位置
 * @param {*} heap 任务队列
 * @param {*} node 推入的任务
 * @param {*} i 当前任务的索引
 */
function signUp(heap, node, i) {
  let index = i;
  while (index > 0) {
    const parentIndex = Math.floor((index - 1) / 2);
    const parentValue = heap[parentIndex];
    if (compare(parentValue, node) > 0) {
      // 说明传入任务的优先级高于父节点任务
      heap[parentIndex] = node;
      heap[index] = parentValue;
      index = parentIndex;
    } else {
      // 传入的任务优先级低于父节点
      return;
    }
  }
}
/**
 * 向下调整任务在任务队列的位置
 * @param {*} heap 任务队列
 * @param {*} node 推入的任务
 * @param {*} i 当前任务的索引
 */
function signDown(heap, node, i) {
  let index = i;
  const len = heap.length;
  const halfLen = Math.floor(len / 2);
  while (index < halfLen) {
    const leftIndex = index * 2 + 1;
    const rightIndex = index * 2 + 2;

    const left = heap[leftIndex];
    const right = heap[rightIndex];
    if (compare(node, left) > 0) {
      // 左子树的优先级高
      if (rightIndex < len && compare(right, left) < 0) {
        // 说明右节点优先级高
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        // 说明左节点优先级高
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (compare(node, right) > 0 && rightIndex < len) {
      // 说明在比较右树时，当前任务优先级较低
      // 右树可能存在 单节点的情况 需要判断 数组边界值
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      return;
    }
  }
}

/**
 * 比较两个任务的优先级
 * @param {*} a
 * @param {*} b
 */
function compare(a, b) {
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}
