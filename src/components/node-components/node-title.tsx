import { FC } from 'react';
import { changeNodeAtPath, TreeItem } from 'react-sortable-tree';
import TextField from '@material-ui/core/TextField';

import { SedrahNodeData, getNodeKey } from '@components/tree';

interface NodeTitleProps {
  node: SedrahNodeData;
  path: Array<string | number>;
  treeData: Array<TreeItem>;
  onUpdateTree: (treeData: Array<TreeItem>) => void;
}

const NodeTitle: FC<NodeTitleProps> = (props) => {
  const { node, path, treeData, onUpdateTree } = props;

  return (
    <TextField
      size="small"
      variant="outlined"
      value={node.title}
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
    />
  );
};

export default NodeTitle;
