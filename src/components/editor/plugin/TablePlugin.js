import React, { useState } from 'react';
import { Table as TableIcon } from 'lucide-react';
import Modal from '../Modal';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createTableNodeWithDimensions } from '@lexical/table';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
  Button,
  IconButton,
  TextField,
  Stack,
} from '@mui/material';

export default function TablePlugin() {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState();
  const [columns, setColumns] = useState();
  const [editor] = useLexicalComposerContext();

  const onAddTable = () => {
    if (!rows || !columns) return;
    editor.update(() => {
      const tableNode = $createTableNodeWithDimensions(rows, columns, false);
      $insertNodeToNearestRoot(tableNode);
    });
    setRows(undefined);
    setColumns(undefined);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <Modal
          title="Add Table"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          footer={
            <Button
              variant="contained"
              onClick={onAddTable}
              disabled={!rows || !columns}
            >
              Add
            </Button>
          }
        >
          <Stack spacing={2}>
            <TextField
              type="number"
              value={rows || ''}
              onChange={(e) => setRows(Number(e.target.value))}
              label="Rows"
              fullWidth
              autoFocus
            />
            <TextField
              type="number"
              value={columns || ''}
              onChange={(e) => setColumns(Number(e.target.value))}
              label="Columns"
              fullWidth
            />
          </Stack>
        </Modal>
      )}
      <IconButton
        onClick={() => setIsOpen(true)}
        size="small"
        aria-label="Add Table"
        sx={{ marginLeft: '8px', color: 'inherit' }}
      >
        <TableIcon size={18} />
      </IconButton>
    </>
  );
}
