import React from 'react';
import { Row, Col, Typography, Segmented, Button } from 'antd';
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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

      <div style={{ flex: 1, minHeight: '65vh', border: '1px solid', borderColor: appTheme === 'dark' ? '#434343' : '#d9d9d9', borderRadius: 6, overflow: 'hidden' }}>
        {viewMode === 'edit' ? (
          <Row style={{ height: '100%' }}>
            <Col span={12} style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRight: '1px solid', borderColor: appTheme === 'dark' ? '#434343' : '#d9d9d9' }}>
              <div style={{ padding: '8px 16px', background: appTheme === 'dark' ? '#1f1f1f' : '#f5f5f5', borderBottom: '1px solid', borderColor: appTheme === 'dark' ? '#434343' : '#d9d9d9' }}>
                <Text strong>Bản gốc (Original)</Text>
              </div>
              <Editor
                height="100%"
                defaultLanguage="text"
                theme={editorTheme}
                value={original}
                onChange={(val) => setOriginal(val || '')}
                options={{ minimap: { enabled: false } }}
              />
            </Col>
            <Col span={12} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '8px 16px', background: appTheme === 'dark' ? '#1f1f1f' : '#f5f5f5', borderBottom: '1px solid', borderColor: appTheme === 'dark' ? '#434343' : '#d9d9d9' }}>
                <Text strong>Bản thay đổi (Modified)</Text>
              </div>
              <Editor
                height="100%"
                defaultLanguage="text"
                theme={editorTheme}
                value={modified}
                onChange={(val) => setModified(val || '')}
                options={{ minimap: { enabled: false } }}
              />
            </Col>
          </Row>
        ) : (
          <DiffEditor
            height="100%"
            theme={editorTheme}
            original={original}
            modified={modified}
            options={{
              minimap: { enabled: false },
              renderSideBySide: true,
              readOnly: true
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DiffChecker;
