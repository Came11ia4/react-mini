// 存放工具方法的文件

/**
 * 对 fiber 对象要做的操作进行的标记
 */

// 没有任何操作
export const NoFlags = 0b00000000000000000000
// 节点新增、插入、移动
export const Placement = 0b0000000000000000000010 // 2
// 节点更新属性
export const Update = 0b0000000000000000000100 // 4
// 删除节点
export const Deletion = 0b0000000000000000001000 // 8

export function isStrOrNum(s) {
  return typeof s === 'string' || typeof s === 'number'
}

export function isFn(fn) {
  return typeof fn === 'function'
}

export function isUndefined(val) {
  return val === undefined
}

export function isArray(arr) {
  return Array.isArray(arr)
}

export function updateNode(node, prevValue, newValue) {
  // 处理旧值
  Object.keys(prevValue).forEach((k) => {
    if (k === 'children') {
      isStrOrNum(newValue[k]) && (node.textContent = '')
    } else if (k.startsWith('on')) {
      let eventName = k.slice(2).toLocaleLowerCase()
      eventName === 'change' && (eventName = 'input')
      node.removeEventListener(eventName, prevValue[k])
    } else {
      !(k in newValue) && (node[k] = '')
    }
  })
  // 处理新值
  Object.keys(newValue).forEach((k) => {
    if (k === 'children') {
      isStrOrNum(newValue[k]) && (node.textContent = newValue[k])
    } else if (k.startsWith('on')) {
      let eventName = k.slice(2).toLowerCase()
      eventName === 'change' && (eventName = 'input')
      node.addEventListener(eventName, newValue[k])
    } else {
      node[k] = newValue[k]
    }
  })
}

export function getCurrentTime() {
  return performance.now()
}

/**
 * 比较hook的前后依赖项是否相等
 * @param {*} deps 新的依赖项
 * @param {*} prevDeps 旧的依赖项
 * @returns 
 */
export function areHookInputEqual(deps, prevDeps) {
  if (prevDeps === null) return false;

  for (let i = 0; i < deps.length && i < prevDeps.length; i++) {
    if (Object.is(deps[i], prevDeps[i])) continue;
    return false;
  }

  return true;
}
