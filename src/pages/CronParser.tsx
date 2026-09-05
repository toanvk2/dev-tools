import React, { useState, useEffect } from 'react';
import { Card, Input, Typography, Alert, List } from 'antd';
import cronstrue from 'cronstrue/i18n';
import { CronExpressionParser } from 'cron-parser';
import { useCacheState } from '../hooks/useCacheState';
import { useAppStore } from '../store/useAppStore';

const { Text, Title, Paragraph } = Typography;

const CronParser: React.FC = () => {
  const [cronExp, setCronExp] = useCacheState<string>('cron-exp', '0 12 * * 1-5');
  const [humanReadable, setHumanReadable] = useState<string>('');
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const appTheme = useAppStore(state => state.theme);
  const isDark = appTheme === 'dark';

  useEffect(() => {
    if (!cronExp) {
      setHumanReadable('');
      setNextRuns([]);
      setError(null);
      return;
    }

    try {
      // 1. Translate to human readable (Vietnamese and English)
      const descVi = cronstrue.toString(cronExp, { locale: 'vi' });
      setHumanReadable(descVi);

      // 2. Calculate next 5 runs
      const interval = CronExpressionParser.parse(cronExp);
      const runs = [];
      for (let i = 0; i < 5; i++) {
        runs.push(interval.next().toDate().toLocaleString('vi-VN'));
      }
      setNextRuns(runs);
      setError(null);
    } catch (err: any) {
      setHumanReadable('');
      setNextRuns([]);
      setError('Biểu thức Cron không hợp lệ.');
    }
  }, [cronExp]);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card title="Cron Job Parser" styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}>
        <Paragraph>
          Nhập biểu thức Cron (Cron Expression) để xem giải nghĩa và lịch chạy tiếp theo.
        </Paragraph>
        
        <Input 
          size="large" 
          value={cronExp} 
          onChange={(e) => setCronExp(e.target.value)} 
          placeholder="* * * * *" 
          style={{ fontSize: 24, fontFamily: 'monospace', textAlign: 'center', marginBottom: 24 }}
        />

        {error && <Alert type="error" message={error} showIcon />}
        
        {!error && humanReadable && (
          <Alert 
            type="success" 
            message={<Text strong style={{ fontSize: 16 }}>{humanReadable}</Text>} 
            showIcon 
            style={{ marginBottom: 24 }}
          />
        )}

        {!error && nextRuns.length > 0 && (
          <div>
            <Title level={5}>5 lần chạy tiếp theo (Next 5 Runs):</Title>
            <List
              bordered
              dataSource={nextRuns}
              renderItem={(item) => (
                <List.Item style={{ fontFamily: 'monospace', background: isDark ? '#141414' : '#fff' }}>
                  {item}
                </List.Item>
              )}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default CronParser;
