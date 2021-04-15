import { FC } from 'react';
import { NodeData } from 'react-sortable-tree';

import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';

import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

interface NodeTitleProps {
  node: SedrahNodeData & NodeData;
  treeIndex: number;
  path: Array<string | number>;
  selectedNodes: Array<SedrahNodeData & NodeData>;
  onSetSelectedNodes: ReactSetState<Array<SedrahNodeData & NodeData>>;
  onSetSelectedNode: ReactSetState<SedrahNodeData | null>;
  onSetSelectedNodePath: ReactSetState<Array<string | number> | null>;
  onSetIsEditFormVisible: ReactSetState<boolean>;
  onSetIsRemoveAlertVisible: ReactSetState<boolean>;
  onAddNode: (path: string | number) => void;
}

const NodeButtons: FC<NodeTitleProps> = (props) => {
  const {
    node,
    treeIndex,
    path,
    selectedNodes,
    onSetSelectedNodes,
    onSetSelectedNode,
    onSetSelectedNodePath,
    onSetIsEditFormVisible,
    onSetIsRemoveAlertVisible,
    onAddNode,
  } = props;

  return (
    <>
      <Checkbox
        key="select checkbox"
        size="small"
        checked={selectedNodes.some(
          (selectedNode) => selectedNode.treeIndex === treeIndex,
        )}
        onChange={() => {
          onSetSelectedNodes((prevState) => {
            const newState = [...prevState];

            const wasSelectedNodeIndex = prevState.findIndex(
              (prevNode) => prevNode.treeIndex === treeIndex,
            );

            if (wasSelectedNodeIndex > -1) {
              newState.splice(wasSelectedNodeIndex, 1);
              return newState;
            } else {
              return [...prevState, { ...node, treeIndex }];
            }
          });
        }}
        onClick={(e) => e.stopPropagation()}
      />
      <IconButton
        key="update"
        onClick={() => {
          onSetSelectedNode(node);
          onSetSelectedNodePath(path);
          onSetIsEditFormVisible(true);
        }}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        key="add"
        onClick={() => {
          onAddNode(path[path.length - 1]);
        }}
      >
        <AddIcon />
      </IconButton>
      <IconButton
        key="remove"
        onClick={() => {
          onSetSelectedNodePath(path);
          onSetIsRemoveAlertVisible(true);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </>
  );
};

export default NodeButtons;
