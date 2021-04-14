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
      value={node.name}
      style={{ width: `${node.name.length}ch` }}
      onChange={(event) => {
        const newTitle = event.target.value;

        onUpdateTree(
          changeNodeAtPath({
            treeData,
            path,
            getNodeKey,
            newNode: { ...node, name: newTitle },
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
                name: '',
                username: '',
                introducer: '',
                birth_year: '',
                tel: '',
                email: '',
              },
            }).treeData,
          );
        }
      }}
    />
  );
};

export default NodeTitle;
