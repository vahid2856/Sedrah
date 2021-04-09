import { FC, useState } from 'react';
import SortableTree, {
  TreeItem,
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { GetNodeKeyFunction } from 'react-sortable-tree/utils/tree-data-utils';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

import NodeRendererComponent from '@components/node-renderer';
import AlertDialog from '@components/dialog-box';
import AddNodeForm from '@components/add-node-form';
import EditNodeForm from '@components/edit-node-form';
import ImportInitialTree from '@components/import-tree';

export interface SedrahNodeData extends TreeItem {
  age: number;
}

import {
  fade,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contentWrapper: {
      display: 'flex',
      flexGrow: 1,
      padding: theme.spacing(2),
      margin: theme.spacing(2),
    },
    mainContent: {
      padding: theme.spacing(2),
      height: `calc(100vh - ${128}px)`,
      overflow: 'scroll',
    },
    searchBar: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    mainButtons: {
      '& button': {
        margin: theme.spacing(0, 1),
      },
    },
  }),
);

const Tree: FC = () => {
  const classes = useStyles();

  const [treeData, setTreeData] = useState<Array<TreeItem>>([]);
  const [summaryMode, setSummaryMode] = useState(false);
  const [treeZoom, setTreeZoom] = useState(1);
  const [selectedNodes, setSelectedNodes] = useState<Array<SedrahNodeData>>([]);
  const [isRemoveAlertVisible, setIsRemoveAlertVisible] = useState(false);
  const [selectedNodePath, setSelectedNodePath] = useState<Array<
    number | string
  > | null>(null);
  const [selectedNode, setSelectedNode] = useState<SedrahNodeData | null>(null);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [parentPathToAdd, setParentPathToAdd] = useState<string | number>('');
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(0);

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

  const handleAddNode = (newNodeData: SedrahNodeData) => {
    setTreeData(
      (prevTreeData) =>
        addNodeUnderParent({
          treeData: prevTreeData,
          parentKey: parentPathToAdd,
          expandParent: true,
          getNodeKey,
          newNode: {
            title: newNodeData.title,
            subtitle: newNodeData.subtitle,
            age: newNodeData.age,
          },
        }).treeData,
    );
    toggleAddForm();
  };

  const handleUpdateNode = (newNodeData: SedrahNodeData) => {
    if (selectedNodePath) {
      setTreeData((state) =>
        changeNodeAtPath({
          treeData: state,
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

  const selectPrevMatch = () =>
    setSearchFocusIndex((prevSearchFocusIndex) =>
      prevSearchFocusIndex !== null
        ? (searchFoundCount + prevSearchFocusIndex - 1) % searchFoundCount
        : searchFoundCount - 1,
    );

  const selectNextMatch = () =>
    setSearchFocusIndex((prevSearchFocusIndex) =>
      prevSearchFocusIndex !== null
        ? (prevSearchFocusIndex + 1) % searchFoundCount
        : 0,
    );

  const handleZoomButtons = (zoomType: 'in' | 'out') => {
    setTreeZoom((prevState) => {
      const bottomLimit = 0.25;
      const topLimit = 3;

      if (zoomType === 'in') {
        if (prevState === topLimit) {
          return prevState;
        }
        return prevState + 0.25;
      }
      if (zoomType === 'out') {
        if (prevState === bottomLimit) {
          return prevState;
        }
        return prevState - 0.25;
      }

      return 1;
    });
  };

  const handleExportToFile = () => {
    const link = document.createElement('a');
    const treeString =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(treeData));
    link.setAttribute('href', treeString);
    link.setAttribute('download', 'tree.json');
    document.body.appendChild(link);
    link.click();
  };

  const handleDetailsMode = () => {
    setSummaryMode((prevState) => !prevState);
  };

  const renderNodeButtons = (
    node: SedrahNodeData,
    path: Array<string | number>,
  ) => {
    return [
      <Checkbox
        key="select checkbox"
        size="small"
        checked={selectedNodes.some(
          (selectedNode) => selectedNode.id === node.id,
        )}
        onChange={() => {
          setSelectedNodes((prevState) => {
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
        onClick={(e) => e.stopPropagation()}
      />,
      <IconButton
        key="update"
        onClick={() => {
          setSelectedNode(node);
          setSelectedNodePath(path);
          setIsEditFormVisible(true);
        }}
      >
        <EditIcon />
      </IconButton>,
      <IconButton
        key="add"
        onClick={() => {
          setParentPathToAdd(path[path.length - 1]);
          setIsAddFormVisible(true);
        }}
      >
        <AddIcon />
      </IconButton>,
      <IconButton
        key="remove"
        onClick={() => {
          setSelectedNodePath(path);
          setIsRemoveAlertVisible(true);
        }}
      >
        <DeleteIcon />
      </IconButton>,
    ];
  };

  const renderNodeTitle = (
    node: SedrahNodeData,
    path: Array<string | number>,
  ) => {
    return (
      <TextField
        size="small"
        variant="outlined"
        value={node.title}
        onChange={(event) => {
          const newTitle = event.target.value;

          setTreeData((prevTreeData) =>
            changeNodeAtPath({
              treeData: prevTreeData,
              path,
              getNodeKey,
              newNode: { ...node, title: newTitle },
            }),
          );
        }}
      />
    );
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Sedrah</Typography>
          <div className={classes.searchBar}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                placeholder="جستجو..."
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              />
            </div>
            <IconButton color="inherit" onClick={selectNextMatch}>
              <NavigateNextIcon />
            </IconButton>
            <IconButton color="inherit" onClick={selectPrevMatch}>
              <NavigateBeforeIcon />
            </IconButton>
            <span>
              &nbsp;
              {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
              &nbsp;/&nbsp;
              {searchFoundCount || 0}
            </span>
          </div>
          <Button
            variant="contained"
            color="secondary"
            disabled={treeZoom === 1}
            onClick={() => setTreeZoom(1)}
          >
            ریست
          </Button>
          <IconButton color="inherit" onClick={() => handleZoomButtons('in')}>
            <ZoomInIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => handleZoomButtons('out')}>
            <ZoomOutIcon />
          </IconButton>
          <Divider variant="middle" orientation="vertical" flexItem />
          <FormControlLabel
            control={
              <Switch checked={!summaryMode} onChange={handleDetailsMode} />
            }
            label="نمایش با جزئیات"
          />
          <Divider variant="middle" orientation="vertical" flexItem />
          <div className={classes.mainButtons}>
            <Button
              variant="contained"
              color="secondary"
              disabled={selectedNodes.length === 0}
              onClick={() => alert(JSON.stringify(selectedNodes))}
            >
              نمایش منتخب
            </Button>
            <ImportInitialTree onImport={setTreeData} />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleExportToFile}
              disabled={treeData.length === 0}
              startIcon={<OpenInNewIcon />}
            >
              خروجی نهایی
            </Button>
          </div>
        </Toolbar>
      </AppBar>
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
                style={{ zoom: treeZoom }}
                onlyExpandSearchedNodes
                rowHeight={summaryMode ? 92 : 172}
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
                  <ImportInitialTree onImport={setTreeData} />
                )}
                generateNodeProps={({ node, path }) => ({
                  summaryMode,
                  buttons: renderNodeButtons(node as SedrahNodeData, path),
                  title: renderNodeTitle(node as SedrahNodeData, path),
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
        open={isAddFormVisible}
        title="افزودن گره جدید"
        content={<AddNodeForm onAddNode={handleAddNode} />}
        cancelText="انصراف"
        onCancel={toggleAddForm}
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
