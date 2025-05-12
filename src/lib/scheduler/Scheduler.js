import { getCurrentTime } from "../shared/utils";
import { peek, pop, push } from "./SchedulerReactMinHeap";

let hasTimeRemaing = true; // 是否还有剩余时间
let taskIdCount = 1; // 任务计数器
const taskQueue = []; // 任务队列

const { port1, port2 } = new MessageChannel();
/**
 * 调度任务
 * @param {*} callback 用于执行一个fiber节点的回调
 */
export default function schedulerCallback(callback) {
  const currentTime = getCurrentTime();
  // 这里假设所有的任务优先级一致
  const timeout = -1;
  // 过期时间
  const expirationTime = currentTime + timeout;

  const newTask = {
    id: taskIdCount++,
    expirationTime,
    callback,
    sortIndex: expirationTime,
  };

  push(taskQueue, newTask);

  // 获取下一次调度
  port1.postMessage(null);
}

// 读取下一个任务
port2.onmessage = function () {
  const currentTime = getCurrentTime();
  let currentTask = peek(taskQueue);

  while (currentTask) {
    if (!hasTimeRemaing && currentTask.expirationTime > currentTime) {
      break;
    }
    // 说明当前还有时间执行任务
    const callback = currentTask.callback;
    currentTask.callback = null; // 防止内存泄漏
    const resultCallback = callback(currentTime - currentTask.expirationTime);
    if (resultCallback === undefined) {
      // 说明任务执行完了可以删除掉
      pop(taskQueue);
      currentTask = peek(taskQueue);
    }
  }
};
