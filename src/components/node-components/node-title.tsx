import { FC } from 'react';
import {
  addNodeUnderParent,
  changeNodeAtPath,
  TreeItem,
} from 'react-sortable-tree';
import InputBase from '@material-ui/core/InputBase';

import { useConfigs } from '@configs/main-configs';
import { getNodeKey } from '@components/tree';
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
  const { primaryField } = useConfigs();

  return (
    <InputBase
      autoFocus
      classes={{ root: classes.nodeTitle, focused: classes.nodeTitleFocused }}
      value={node[primaryField]}
      style={{ width: `${node[primaryField].toString().length}ch` }}
      onChange={(event) => {
        const newTitle = event.target.value;

        onUpdateTree(
          changeNodeAtPath({
            treeData,
            path,
            getNodeKey,
            newNode: { ...node, [primaryField]: newTitle },
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
              newNode: { [primaryField]: '' },
            }).treeData,
          );
        }
      }}
    />
  );
};

export default NodeTitle;
