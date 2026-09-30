import React from 'react';
import { Typography } from 'antd';
import ToolCard from '../components/ToolCard';
import { DiffEditor } from '@monaco-editor/react';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';

const { Text } = Typography;

const DiffChecker: React.FC = () => {
  const [original, setOriginal] = useCacheState<string>('diff-original', '');
  const [modified, setModified] = useCacheState<string>('diff-modified', '');
  const [initialOriginal] = React.useState(original);
  const [initialModified] = React.useState(modified);

  const appTheme = useAppStore(state => state.theme);
  const editorTheme = appTheme === 'dark' ? 'vs-dark' : 'light';
  
  const handleMount = (editor: any) => {
    const originalEditor = editor.getOriginalEditor();
    const modifiedEditor = editor.getModifiedEditor();
    
    originalEditor.onDidChangeModelContent(() => {
      setOriginal(originalEditor.getValue());
    });
    
    modifiedEditor.onDidChangeModelContent(() => {
      setModified(modifiedEditor.getValue());
    });
  };

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <ToolCard 
        title={
          <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ flex: 1 }}><Text strong>Bản gốc (Original)</Text></div>
            <div style={{ flex: 1, paddingLeft: 16 }}><Text strong>Bản thay đổi (Modified)</Text></div>
          </div>
        }
        
        noPadding={true}
      >
        <DiffEditor
          height="100%"
          theme={editorTheme}
          original={initialOriginal}
          modified={initialModified}
          onMount={handleMount}
          options={{ 
            scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 }, 
            minimap: { enabled: false },
            wordWrap: 'wordWrapColumn', 
            wordWrapColumn: 200, 
            renderSideBySide: true,
            originalEditable: true,
            readOnly: false
          }}
        />
      </ToolCard>
    </div>
  );
};

export default DiffChecker;
