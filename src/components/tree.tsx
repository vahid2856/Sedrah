import { FC, useState } from 'react';
import SortableTree, {
  TreeItem,
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { GetNodeKeyFunction } from 'react-sortable-tree/utils/tree-data-utils';

import NodeRenderer from '@components/node-renderer';
import Button from '@material-ui/core/Button';
import { Checkbox } from '@material-ui/core';
import AlertDialog from '@components/dialog-box';
import AddNodeForm from '@components/add-node-form';
import EditNodeForm from '@components/edit-node-form';

export interface NodeData {
  title: string;
  description: string;
  age: number;
}

const Tree: FC = () => {
  const [treeData, setTreeData] = useState<Array<TreeItem>>([
    { id: 3, title: 'Peter Olofsson', subtitle: 'aasasd' },
    { id: 5, title: 'Karl Johansson', subtitle: 'aasasd' },
  ]);
  const [selectedNodes, setSelectedNodes] = useState<Array<TreeItem>>([]);
  const [isRemoveAlertVisible, setIsRemoveAlertVisible] = useState(false);
  const [selectedNodePath, setSelectedNodePath] = useState<Array<
    number | string
  > | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [parentPathToAdd, setParentPathToAdd] = useState<string | number>('');
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);

  const nodeContentRenderer: typeof NodeRenderer = (nodeData) => {
    return NodeRenderer({ ...nodeData });
  };

  const getNodeKey: GetNodeKeyFunction = ({ treeIndex }) => treeIndex;

  const toggleRemoveAlert = () => {
    setIsRemoveAlertVisible((prevState) => !prevState);
  };

  const toggleAddForm = () => {
    setIsAddFormVisible((prevState) => !prevState);
  };

  const toggleEditForm = () => {
    setIsEditFormVisible((prevState) => !prevState);
  };

  const handleRemoveNode = () => {
    if (selectedNodePath) {
      setTreeData((state) =>
        removeNodeAtPath({
          treeData: state,
          path: selectedNodePath,
          getNodeKey,
        }),
      );
      toggleRemoveAlert();
      setSelectedNode(null);
      setSelectedNodePath(null);
    }
  };

  const handleAddNode = (newNodeData: NodeData) => {
    setTreeData(
      (prevTreeData) =>
        addNodeUnderParent({
          treeData: prevTreeData,
          parentKey: parentPathToAdd,
          expandParent: true,
          getNodeKey,
          newNode: {
            title: newNodeData.title,
            subtitle: newNodeData.description,
          },
        }).treeData,
    );
    toggleAddForm();
  };

  const handleUpdateNode = (newNodeData: NodeData) => {
    if (selectedNodePath) {
      setTreeData((state) =>
        changeNodeAtPath({
          treeData: state,
          path: selectedNodePath,
          getNodeKey,
          newNode: {
            ...selectedNode,
            ...{
              title: newNodeData.title,
              subtitle: newNodeData.description,
            },
          },
        }),
      );
    }
    toggleAddForm();
    setSelectedNode(null);
    setSelectedNodePath(null);
  };

  const renderNodeButtons = (node: TreeItem, path: Array<string | number>) => {
    return [
      <Button
        key="update"
        variant="contained"
        color="primary"
        onClick={() => {
          setSelectedNode({ title: node.title, description: node.subtitle });
          setSelectedNodePath(path);
          setIsAddFormVisible(true);
        }}
      >
        update Child
      </Button>,
      <Button
        key="add"
        variant="contained"
        color="primary"
        onClick={() => {
          setParentPathToAdd(path[path.length - 1]);
          setIsAddFormVisible(true);
        }}
      >
        Add Child
      </Button>,
      <Button
        key="remove"
        variant="contained"
        color="primary"
        onClick={() => {
          setSelectedNodePath(path);
          setIsRemoveAlertVisible(true);
        }}
      >
        Remove
      </Button>,
      <Checkbox
        key="select checkbox"
        size="small"
        checked={selectedNodes.some(
          (selectedNode) => selectedNode.id === node.id,
        )}
        onChange={() => {
          setSelectedNodes((prevState) => {
            // TODO: fix this TS issue
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const newState = [...prevState];

            const wasSelectedNodeIndex = prevState.findIndex(
              (prevNode) => prevNode.id === node.id,
            );

            if (wasSelectedNodeIndex > -1) {
              newState.splice(wasSelectedNodeIndex, 1);
              return newState;
            } else {
              return [...prevState, node];
            }
          });
        }}
      />,
    ];
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        disabled={selectedNodes.length === 0}
        onClick={() => alert(JSON.stringify(selectedNodes))}
      >
        alert selected
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => alert(JSON.stringify(treeData))}
      >
        Save
      </Button>
      <div style={{ height: 500 }}>
        <SortableTree
          rowDirection="rtl"
          rowHeight={200}
          treeData={treeData}
          nodeContentRenderer={nodeContentRenderer}
          generateNodeProps={({ node, path }) => ({
            buttons: renderNodeButtons(node, path),
          })}
          onChange={(treeData) => setTreeData(treeData)}
        />
      </div>
      <AlertDialog
        open={isRemoveAlertVisible}
        title="Remove Nodes"
        content="Are you sure to remove the nodes?"
        okText="Yes"
        cancelText="No"
        onOK={handleRemoveNode}
        onCancel={toggleRemoveAlert}
      />
      <AlertDialog
        open={isAddFormVisible}
        title="Add New Node"
        content={<AddNodeForm onAddNode={handleAddNode} />}
        cancelText="Cancel"
        onCancel={toggleAddForm}
      />
      {Boolean(selectedNode) && (
        <AlertDialog
          open={isEditFormVisible}
          title="Edit Node"
          content={
            <EditNodeForm
              initialValues={selectedNode}
              onUpdateNode={handleUpdateNode}
            />
          }
          cancelText="Cancel"
          onCancel={toggleEditForm}
        />
      )}
    </>
  );
};

export default Tree;
