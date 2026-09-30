import React from 'react';
import Editor from '@monaco-editor/react';
import type { EditorProps } from '@monaco-editor/react';
import { useAppStore } from '../store/useAppStore';

export interface CodeEditorProps extends EditorProps {
  /** If true, configures word wrap at 200 chars instead of viewport */
  smartWrap?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ smartWrap = true, options, ...props }) => {
  const appTheme = useAppStore(state => state.theme);
  const editorTheme = appTheme === 'dark' ? 'vs-dark' : 'light';

    const defaultOptions: any = {
    scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    padding: { top: 16 },
    wordWrap: smartWrap ? 'wordWrapColumn' : 'off',
    wordWrapColumn: smartWrap ? 200 : 80,
    ...options,
  };

  return (
    <Editor
      height="100%"
      theme={editorTheme}
      options={defaultOptions}
      {...props}
    />
  );
};

export default CodeEditor;
