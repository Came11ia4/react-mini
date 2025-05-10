function getParentDOM(wip) {
  let temp = wip
  while (temp) {
    if (temp.stateNode) {
      return temp.stateNode
    }

    temp = temp.return
  }
}

function commitNode(wip) {
  const parentNodeDOM = getParentDOM(wip.return)
  if(wip.stateNode) {
    parentNodeDOM.appendChild(wip.stateNode)
  }
}

export default function commitWorker(wip) {
  if (!wip) return
  commitNode(wip)
  commitWorker(wip.child)
  commitWorker(wip.sibling)
}
