import { FC } from 'react';
import { isDescendant } from 'react-sortable-tree';
import { NodeRendererProps } from 'react-sortable-tree';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';

function classnames(...classes: Array<unknown>) {
  // Use Boolean constructor as a filter callback
  // Allows for loose type truthy/falsey checks
  // Boolean("") === false;
  // Boolean(false) === false;
  // Boolean(undefined) === false;
  // Boolean(null) === false;
  // Boolean(0) === false;
  // Boolean("classname") === true;
  return classes.filter(Boolean).join(' ');
}

const NodeRenderer: FC<NodeRendererProps> = (props) => {
  // TODO: fix this TS issue
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    isSearchMatch = false,
    isSearchFocus = false,
    canDrag = false,
    toggleChildrenVisibility = null,
    buttons = [],
    className = '',
    style = {},
    parentNode = null,
    draggedNode = null,
    canDrop = false,
    title = null,
    subtitle = null,
    rowDirection = 'ltr',

    scaffoldBlockPxWidth,
    connectDragPreview,
    connectDragSource,
    isDragging,
    node,
    path,
    treeIndex,
    didDrop,
    treeId,
    isOver, // Not needed, but preserved for other renderers
    ...otherProps
  } = props;
  const nodeTitle = title || node.title;
  const nodeSubtitle = subtitle || node.subtitle;
  const rowDirectionClass = rowDirection === 'rtl' ? 'rst__rtl' : null;

  let handle;
  if (canDrag) {
    if (typeof node.children === 'function' && node.expanded) {
      // Show a loading symbol on the handle when the children are expanded
      //  and yet still defined by a function (a callback to fetch the children)
      handle = (
        <div className="rst__loadingHandle">
          <div className="rst__loadingCircle">
            {new Array(12).fill(0).map((_, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={classnames(
                  'rst__loadingCirclePoint',
                  rowDirectionClass,
                )}
              />
            ))}
          </div>
        </div>
      );
    } else {
      // Show the handle used to initiate a drag-and-drop
      handle = connectDragSource(<div className="rst__moveHandle" />, {
        dropEffect: 'copy',
      });
    }
  }

  const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
  const isLandingPadActive = !didDrop && isDragging;

  const buttonStyle = {
    [rowDirection === 'rtl' ? 'right' : 'left']: -0.5 * scaffoldBlockPxWidth,
  };

  return (
    <div style={{ height: '100%' }} {...otherProps}>
      {toggleChildrenVisibility &&
        node.children &&
        (node.children.length > 0 || typeof node.children === 'function') && (
          <div>
            <button
              type="button"
              aria-label={node.expanded ? 'Collapse' : 'Expand'}
              className={classnames(
                node.expanded ? 'rst__collapseButton' : 'rst__expandButton',
                rowDirectionClass,
              )}
              style={buttonStyle}
              onClick={() =>
                toggleChildrenVisibility({
                  node,
                  path,
                  treeIndex,
                })
              }
            />

            {node.expanded && !isDragging && (
              <div
                style={{ width: scaffoldBlockPxWidth }}
                className={classnames('rst__lineChildren', rowDirectionClass)}
              />
            )}
          </div>
        )}

      <div className={classnames('rst__rowWrapper', rowDirectionClass)}>
        {/* Set the row preview to be used during drag and drop */}
        {connectDragPreview(
          <div
            className={classnames(
              'rst__row',
              isLandingPadActive && 'rst__rowLandingPad',
              isLandingPadActive && !canDrop && 'rst__rowCancelPad',
              isSearchMatch && 'rst__rowSearchMatch',
              isSearchFocus && 'rst__rowSearchFocus',
              rowDirectionClass,
              className,
            )}
            style={{
              opacity: isDraggedDescendant ? 0.5 : 1,
              ...style,
            }}
          >
            {handle}

            <Card raised={isSearchMatch}>
              <CardHeader title={nodeTitle} subheader={nodeSubtitle} />
              <CardActions disableSpacing>
                {buttons.map((btn) => btn)}
              </CardActions>
            </Card>
          </div>,
        )}
      </div>
    </div>
  );
};

export default NodeRenderer;
