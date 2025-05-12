import { Placement, Update, updateNode } from "../shared/utils";
import { FunctionComponent } from "./ReactWorkTags";
import { invokeHooks } from "./ReactChildFiberAssistant";

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

  if(wip.tag === FunctionComponent) {
    invokeHooks(wip);
  }
}

export default function commitWorker(wip) {
  if (!wip) return;
  commitNode(wip);
  commitWorker(wip.child);
  commitWorker(wip.sibling);
}
