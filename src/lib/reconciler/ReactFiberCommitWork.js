import { Placement, Update, updateNode } from "../shared/utils";

function getParentDOM(wip) {
  let temp = wip;
  while (temp) {
    if (temp.stateNode) {
      return temp.stateNode;
    }

    temp = temp.return;
  }
}

function commitNode(wip) {
  const parentNodeDOM = getParentDOM(wip.return);
  const { flags, stateNode } = wip;
  if (flags & Placement && stateNode) {
    parentNodeDOM.appendChild(wip.stateNode);
  }

  if (flags & Update && stateNode) {
    updateNode(wip.stateNode, wip.alternate.props, wip.props);
  }
}

export default function commitWorker(wip) {
  if (!wip) return;
  commitNode(wip);
  commitWorker(wip.child);
  commitWorker(wip.sibling);
}
