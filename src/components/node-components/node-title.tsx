import { FC } from 'react';
import {
  addNodeUnderParent,
  changeNodeAtPath,
  TreeItem,
} from 'react-sortable-tree';
import InputBase from '@material-ui/core/InputBase';

import { SedrahNodeData, getNodeKey } from '@components/tree';
import { useStyles } from '@components/styles';

interface NodeTitleProps {
  node: SedrahNodeData;
  path: Array<string | number>;
  treeData: Array<TreeItem>;
  onUpdateTree: (treeData: Array<TreeItem>) => void;
}

const NodeTitle: FC<NodeTitleProps> = (props) => {
  const { node, path, treeData, onUpdateTree } = props;
  const classes = useStyles();

  return (
    <InputBase
      classes={{ root: classes.nodeTitle, focused: classes.nodeTitleFocused }}
      value={node.title}
      style={{ width: `${(node.title as string).length}ch` }}
      onChange={(event) => {
        const newTitle = event.target.value;

        onUpdateTree(
          changeNodeAtPath({
            treeData,
            path,
            getNodeKey,
            newNode: { ...node, title: newTitle },
          }),
        );
      }}
      onKeyUp={(e) => {
        if (e.code === 'Enter') {
          onUpdateTree(
            addNodeUnderParent({
              treeData,
              parentKey: path[path.length - 2],
              expandParent: true,
              getNodeKey,
              newNode: {
                title: '',
                subtitle: '',
                age: '',
              },
            }).treeData,
          );
        }
      }}
    />
  );
};

export default NodeTitle;
