'use client';

import { useEffect, useState } from "react";

/* Lexical Design System */
import { $getRoot } from 'lexical';
import { $generateHtmlFromNodes , $generateNodesFromDOM} from '@lexical/html';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { TRANSFORMERS } from "@lexical/markdown";

import './style.css';

/* Lexical Plugins */
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

/* Custom Plugins */
import CodeHighlightPlugin from "./plugin/CodeHighlightPlugin";
import ToolbarPlugin from "./plugin/ToolbarPlugin";
import PlaygroundAutoLinkPlugin from "./plugin/AutoLinkPlugin";
import TreeViewPlugin from "./plugin/TreeViewPlugin";

import editorTheme from "./editortheme";
import { textDailyStandup } from "./text-daily-standup";
import DeleteTableOnBackspacePlugin from "./plugin/CustomDelete";

function Placeholder() {
  return <div className="editor-placeholder">Enter content here...</div>;
}

const editorConfig = {
  theme: editorTheme,
  namespace: "daily-standup-editor",
  
  onError(error) {
    throw error;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

// ✅ Custom plugin to extract HTML
function HTMLExporter({ onHTMLChange }) {
  const [editor] = useLexicalComposerContext();

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor);
          
          const text = $getRoot().getTextContent();
          onHTMLChange(html, text);
        });
      }}
    />
  );
}

// ✅ Plugin to import initial HTML
function HTMLImporter({ htmlContent }) {
  const [editor] = useLexicalComposerContext();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized || !htmlContent) return;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(htmlContent, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });

    setHasInitialized(true);
  }, [editor, htmlContent, hasInitialized]);

  return null;
}

export function Editor({htmlContent, setHtmlContent}) {
  const [isMounted, setIsMounted] = useState(false);
//   const [htmlContent, setHtmlContent] = useState('');
  const [plainText, setPlainText] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container sm:width-full ">
          <ToolbarPlugin />
          <div className="editor-inner"> 
            <RichTextPlugin
              contentEditable={<ContentEditable  className="editor-input" />}
              placeholder={<Placeholder />}
              ErrorBoundary={({ error }) => (
                <div className="editor-error">
                  <p>Error: {error.message}</p>
                </div>
              )}
            />
            <DeleteTableOnBackspacePlugin />
            <HTMLImporter htmlContent={htmlContent} />
            <HTMLExporter
              onHTMLChange={(html, text) => {
                setHtmlContent(html);
                // setPlainText(text);
              }}
            />
            <ListPlugin />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <CodeHighlightPlugin />
            <LinkPlugin />
            <TabIndentationPlugin />
            <PlaygroundAutoLinkPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            {/* <TreeViewPlugin /> */}
          </div>
        </div>
      </LexicalComposer>

     
    </>
  );
}
