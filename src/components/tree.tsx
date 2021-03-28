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
import { Checkbox, TextField } from '@material-ui/core';
import AlertDialog from '@components/dialog-box';

const Tree: FC = () => {
  const [treeData, setTreeData] = useState<Array<TreeItem>>([
    { id: 3, title: 'معارف', subtitle: '' },
    { id: 5, title: 'منظومه', subtitle: '' },
    { id: 7, title: 'فیلم سازی' },
  ]);
  const [selectedNodes, setSelectedNodes] = useState<Array<TreeItem>>([]);
  const [isRemoveAlertVisible, setIsRemoveAlertVisible] = useState(false);
  const [
    selectedNodePathToRemove,
    setSelectedNodePathToRemove,
  ] = useState<Array<number | string> | null>(null);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [parentPathToAdd, setParentPathToAdd] = useState<string | number>('');

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

  const handleRemoveNode = () => {
    if (selectedNodePathToRemove) {
      setTreeData((state) =>
        removeNodeAtPath({
          treeData: state,
          path: selectedNodePathToRemove,
          getNodeKey,
        }),
      );
      toggleRemoveAlert();
    }
  };

  const handleAddNode = () => {
    if (parentPathToAdd) {
      setTreeData(
        (prevTreeData) =>
          addNodeUnderParent({
            treeData: prevTreeData,
            parentKey: parentPathToAdd,
            expandParent: true,
            getNodeKey,
            newNode: {
              title: `زیر‌مجموعه جدید`,
              id: (Math.random() * 100+1).toFixed(0),
            },
          }).treeData,
      );
    }
    toggleAddForm();
  };

  const renderNodeButtons = (node: TreeItem, path: Array<string | number>) => {
    return [
      <Button
        key="add"
        variant="contained"
        color="primary"
        onClick={() => {
          setParentPathToAdd(path[path.length - 1]);
          setIsAddFormVisible(true);
        }}
      >
        افزودن زیرمجموعه
      </Button>,
      <Button
        key="remove"
        variant="contained"
        color="primary"
        onClick={() => {
          setSelectedNodePathToRemove(path);
          setIsRemoveAlertVisible(true);
        }}
      >
        حذف
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

  const renderNodeTitle = (node: TreeItem, path: Array<string | number>) => {
    return (
      <TextField
        variant="outlined"
        size="small"
        placeholder="node title"
        value={node?.title?.toString()}
        onChange={(event) => {
          const title = event.target.value;

          setTreeData((state) =>
            changeNodeAtPath({
              treeData: state,
              path,
              getNodeKey,
              newNode: { ...node, title },
            }),
          );
        }}
      />
    );
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        disabled={selectedNodes.length === 0}
        onClick={() => alert(JSON.stringify(selectedNodes))}
      >
        نمایش انتخاب‌ها
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => alert(JSON.stringify(treeData))}
      >
        ذخیره تغییرات
      </Button>
      <div style={{ height: 500 }}>
        <SortableTree
          rowDirection="rtl"
          rowHeight={200}
          treeData={treeData}
          nodeContentRenderer={nodeContentRenderer}
          generateNodeProps={({ node, path }) => ({
            buttons: renderNodeButtons(node, path),
            title: renderNodeTitle(node, path),
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
        content={<>add node form</>}
        okText="Yes"
        cancelText="No"
        onOK={handleAddNode}
        onCancel={toggleAddForm}
      />
    </>
  );
};

export default Tree;
