import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  KEY_BACKSPACE_COMMAND,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  $getRoot,
} from 'lexical';
import { TableNode } from '@lexical/table';

export default function DeleteTableOnBackspacePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      () => {
        return editor.update(() => {
          const selection = $getSelection();

          if (!$isRangeSelection(selection)) return false;

          const anchorNode = selection.anchor.getNode();

          if (!anchorNode.isAttached()) return false;

          // Check if caret is at the very beginning of the document or parent node
          if (
            selection.anchor.offset !== 0 ||
            selection.focus.offset !== 0
          ) {
            return false;
          }

          let currentNode = anchorNode;
          while (currentNode != null) {
            if (currentNode instanceof TableNode) {
              // Check if it's the first child of its parent (or root)
              const parent = currentNode.getParent();
              const isFirstChild =
                parent ? parent.getFirstChild() === currentNode : false;

              // Only delete table if it's at the beginning
              if (isFirstChild || currentNode.getPreviousSibling() === null) {
                currentNode.remove();
                return true;
              }
            }
            currentNode = currentNode.getParent();
          }

          return false;
        });
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor]);

  return null;
}
