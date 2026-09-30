import React from 'react';
import { Row, Col, Typography, Segmented, Button, Card } from 'antd';
import { Editor, DiffEditor } from '@monaco-editor/react';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';

const { Text } = Typography;

const DiffChecker: React.FC = () => {
  const [original, setOriginal] = useCacheState<string>('diff-original', '');
  const [modified, setModified] = useCacheState<string>('diff-modified', '');
  const [viewMode, setViewMode] = useCacheState<'edit' | 'diff'>('diff-mode', 'edit');

  const appTheme = useAppStore(state => state.theme);
  const editorTheme = appTheme === 'dark' ? 'vs-dark' : 'light';

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Segmented
          options={[
            { label: 'Chỉnh sửa (Edit)', value: 'edit' },
            { label: 'So sánh (Diff)', value: 'diff' }
          ]}
          value={viewMode}
          onChange={(val) => setViewMode(val as 'edit' | 'diff')}
        />
        {viewMode === 'edit' && (
          <Button type="primary" onClick={() => setViewMode('diff')} disabled={!original && !modified}>
            So sánh ngay
          </Button>
        )}
      </div>

            <Row gutter={24} style={{ flex: 1, margin: 0 }}>
        {viewMode === 'edit' ? (
          <>
            <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
              <Card 
                title={<Text strong>Bản gốc (Original)</Text>}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                styles={{ body: { flex: 1, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}
              >
                <Editor
                  height="100%"
                  defaultLanguage="text"
                  theme={editorTheme}
                  value={original}
                  onChange={(val) => setOriginal(val || '')}
                  options={{ scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 }, minimap: { enabled: false }, wordWrap: 'wordWrapColumn', wordWrapColumn: 200, scrollBeyondLastLine: false, padding: { top: 16 } }}
                />
              </Card>
            </Col>
            <Col span={12} style={{ display: 'flex', flexDirection: 'column', paddingRight: 0 }}>
              <Card 
                title={<Text strong>Bản thay đổi (Modified)</Text>}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                styles={{ body: { flex: 1, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}
              >
                <Editor
                  height="100%"
                  defaultLanguage="text"
                  theme={editorTheme}
                  value={modified}
                  onChange={(val) => setModified(val || '')}
                  options={{ scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 }, minimap: { enabled: false }, wordWrap: 'wordWrapColumn', wordWrapColumn: 200, scrollBeyondLastLine: false, padding: { top: 16 } }}
                />
              </Card>
            </Col>
          </>
        ) : (
          <Col span={24} style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
            <Card 
              title={<Text strong>So sánh (Diff View)</Text>}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              styles={{ body: { flex: 1, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}
            >
              <DiffEditor
                height="100%"
                theme={editorTheme}
                original={original}
                modified={modified}
                options={{ scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 }, minimap: { enabled: false },
                  wordWrap: 'wordWrapColumn', wordWrapColumn: 200, renderSideBySide: true,
                  readOnly: true
                }}
              />
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default DiffChecker;
