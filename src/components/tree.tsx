import { FC, useState } from 'react';
import SortableTree, {
  TreeItem,
  NodeData,
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { GetNodeKeyFunction } from 'react-sortable-tree/utils/tree-data-utils';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { useConfigs } from '@configs/main-configs';
import NodeRendererComponent from '@components/node-components/node-renderer';
import AlertDialog from '@components/dialog-box';
import EditNodeForm from '@components/edit-node-form';
import NodeTitle from '@components/node-components/node-title';
import NodeButtons from '@components/node-components/node-buttons';
import { useStyles } from '@components/styles';
import TopBar from '@components/top-bar';

export const getNodeKey: GetNodeKeyFunction = ({ treeIndex }) => treeIndex;

const Tree: FC = () => {
  const classes = useStyles();
  const { initialTree, primaryField } = useConfigs();

  const [treeData, setTreeData] = useState<Array<TreeItem>>(initialTree);
  const [prevTreeData, setPrevTreeData] = useState<Array<Array<TreeItem>>>([
    initialTree,
  ]);
  const [undoRedoIndex, setUndoRedoIndex] = useState(0);
  const [summaryMode, setSummaryMode] = useState(false);
  const [isWithHandle, setIsWithHandle] = useState(true);
  const [treeZoom, setTreeZoom] = useState(1);
  const [selectedNodes, setSelectedNodes] = useState<
    Array<SedrahNodeData & NodeData>
  >([]);
  const [isRemoveAlertVisible, setIsRemoveAlertVisible] = useState(false);
  const [selectedNodePath, setSelectedNodePath] = useState<Array<
    number | string
  > | null>(null);
  const [selectedNode, setSelectedNode] = useState<SedrahNodeData | null>(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(0);

  const toggleRemoveAlert = () => {
    setIsRemoveAlertVisible((prevState) => !prevState);
  };

  const toggleEditForm = () => {
    setIsEditFormVisible((prevState) => !prevState);
  };

  const updateTree = (newTreeData: Array<TreeItem>) => {
    setTreeData(() => {
      setPrevTreeData((prevState) => {
        const newState = [...prevState].slice(0, undoRedoIndex + 1);
        newState.push(newTreeData);
        setUndoRedoIndex(newState.length - 1);
        return newState;
      });

      return newTreeData;
    });
  };

  const handleRemoveNode = () => {
    if (selectedNodePath) {
      updateTree(
        removeNodeAtPath({
          treeData,
          path: selectedNodePath,
          getNodeKey,
        }),
      );
      toggleRemoveAlert();
      setSelectedNode(null);
      setSelectedNodePath(null);
    }
  };

  const handleAddNode = (parentPath?: string | number) => {
    updateTree(
      addNodeUnderParent({
        treeData,
        parentKey: parentPath,
        expandParent: true,
        addAsFirstChild: parentPath === undefined,
        getNodeKey,
        newNode: { [primaryField]: '' },
      }).treeData,
    );
  };

  const handleUpdateNode = (newNodeData: SedrahNodeData) => {
    if (selectedNodePath) {
      updateTree(
        changeNodeAtPath({
          treeData,
          path: selectedNodePath,
          getNodeKey,
          newNode: {
            ...selectedNode,
            ...newNodeData,
          },
        }),
      );
    }
    toggleEditForm();
    setSelectedNode(null);
    setSelectedNodePath(null);
  };

  return (
    <>
      <TopBar
        treeData={treeData}
        selectedNodes={selectedNodes}
        searchFocusIndex={searchFocusIndex}
        searchFoundCount={searchFoundCount}
        searchString={searchString}
        treeZoom={treeZoom}
        summaryMode={summaryMode}
        isWithHandle={isWithHandle}
        prevTreeData={prevTreeData}
        undoRedoIndex={undoRedoIndex}
        onUpdateTree={updateTree}
        onSetTreeData={setTreeData}
        onSetSearchFocusIndex={setSearchFocusIndex}
        onSetSearchString={setSearchString}
        onSetTreeZoom={setTreeZoom}
        onSetSummaryMode={setSummaryMode}
        onSetIsWithHandle={setIsWithHandle}
        onSetUndoRedoIndex={setUndoRedoIndex}
      />
      <Paper className={classes.contentWrapper} elevation={10}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Paper
              className={classes.mainContent}
              elevation={10}
              variant="outlined"
              square
            >
              <SortableTree
                rowDirection="rtl"
                isVirtualized={false}
                style={{
                  transform: `scale(${treeZoom})`,
                  transformOrigin: 'top right',
                }}
                onlyExpandSearchedNodes
                rowHeight={summaryMode ? 60 : 172}
                treeData={treeData}
                searchQuery={searchString}
                searchFocusOffset={searchFocusIndex}
                searchFinishCallback={(matches) => {
                  setSearchFoundCount(matches.length);
                  setSearchFocusIndex(
                    matches.length > 0 ? searchFocusIndex % matches.length : 0,
                  );
                }}
                nodeContentRenderer={NodeRendererComponent}
                placeholderRenderer={() => (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      handleAddNode();
                    }}
                  >
                    افزودن گره
                  </Button>
                )}
                generateNodeProps={({ node, path }) => ({
                  summaryMode,
                  isWithHandle,
                  buttons: (
                    <NodeButtons
                      node={node as SedrahNodeData & NodeData}
                      path={path}
                      selectedNodes={selectedNodes}
                      onSetSelectedNodes={setSelectedNodes}
                      onSetSelectedNode={setSelectedNode}
                      onSetSelectedNodePath={setSelectedNodePath}
                      onSetIsEditFormVisible={setIsEditFormVisible}
                      onSetIsRemoveAlertVisible={setIsRemoveAlertVisible}
                      onAddNode={handleAddNode}
                    />
                  ),
                  title: (
                    <NodeTitle
                      node={node as SedrahNodeData}
                      path={path}
                      treeData={treeData}
                      onUpdateTree={updateTree}
                    />
                  ),
                })}
                onChange={(treeData) => setTreeData(treeData)}
              />
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      <AlertDialog
        open={isRemoveAlertVisible}
        title="حذف گره"
        content="آیا از حذف این گره مطمئن هستید؟"
        okText="بله"
        cancelText="خیر"
        onOK={handleRemoveNode}
        onCancel={toggleRemoveAlert}
      />
      <AlertDialog
        open={isEditFormVisible}
        title="ویرایش گره"
        content={
          <EditNodeForm
            initialValues={selectedNode}
            onUpdateNode={handleUpdateNode}
          />
        }
        cancelText="انصراف"
        onCancel={toggleEditForm}
      />
    </>
  );
};

export default Tree;
