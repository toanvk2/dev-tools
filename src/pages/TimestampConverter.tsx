import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Input, Card, Space, Button, InputNumber } from 'antd';
import { useAppStore } from '../store/useAppStore';

const { Text } = Typography;

const TimestampConverter: React.FC = () => {
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const appTheme = useAppStore(state => state.theme);

  // Unix to Date state
  const [epochInput, setEpochInput] = useState<string>('');
  const [dateResult, setDateResult] = useState<{ local: string, utc: string } | null>(null);

  // Date to Unix state
  const d = new Date();
  const [year, setYear] = useState<number>(d.getFullYear());
  const [month, setMonth] = useState<number>(d.getMonth() + 1);
  const [day, setDay] = useState<number>(d.getDate());
  const [hour, setHour] = useState<number>(d.getHours());
  const [minute, setMinute] = useState<number>(d.getMinutes());
  const [second, setSecond] = useState<number>(d.getSeconds());
  
  const [timestampResult, setTimestampResult] = useState<{ sec: number, ms: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentEpoch(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEpochToDate = (val: string) => {
    setEpochInput(val);
    if (!val) {
      setDateResult(null);
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    
    // Determine if seconds or ms. A length > 11 usually implies ms for current dates
    let date = new Date(val.length > 11 ? num : num * 1000);
    setDateResult({
      local: date.toLocaleString('vi-VN'),
      utc: date.toUTCString()
    });
  };

  const handleDateToEpoch = () => {
    // JavaScript months are 0-11
    const date = new Date(year, month - 1, day, hour, minute, second);
    setTimestampResult({
      sec: Math.floor(date.getTime() / 1000),
      ms: date.getTime()
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card style={{ textAlign: 'center', background: appTheme === 'dark' ? '#141414' : '#e6f7ff', borderColor: '#91d5ff' }}>
        <Space direction="vertical">
          <Text style={{ fontSize: 16 }}>The current Unix epoch time is</Text>
          <div style={{ fontSize: 40, fontWeight: 'bold', color: '#1890ff', fontFamily: 'monospace' }}>
            {currentEpoch}
          </div>
        </Space>
      </Card>

      <Row gutter={24} style={{ flex: 1 }}>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card style={{ height: "100%" }} title="Timestamp to Human Date" styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}>
        <Row gutter={16} align="middle">
          <Col span={24}>
            <Text>Supports seconds and milliseconds</Text>
            <Input 
              size="large" 
              placeholder="Enter epoch timestamp (e.g. 1725514601)" 
              value={epochInput}
              onChange={(e) => handleEpochToDate(e.target.value)}
              style={{ marginTop: 8, marginBottom: 16, fontFamily: 'monospace' }}
            />
          </Col>
        </Row>
        {dateResult && (
          <div style={{ padding: 16, background: appTheme === 'dark' ? '#1f1f1f' : '#f9f9f9', borderRadius: 8 }}>
            <Row>
              <Col span={4}><Text strong>GMT (UTC):</Text></Col>
              <Col span={20}><Text>{dateResult.utc}</Text></Col>
            </Row>
            <Row style={{ marginTop: 8 }}>
              <Col span={4}><Text strong>Your Time:</Text></Col>
              <Col span={20}><Text>{dateResult.local}</Text></Col>
            </Row>
          </div>
        )}
      </Card>
        </Col>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card style={{ height: "100%" }} title="Human Date to Timestamp" styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}>
        <Space wrap style={{ marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Yr</div>
            <InputNumber value={year} onChange={(v) => v && setYear(v)} style={{ width: 80 }} />
          </div>
          <div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Mon</div>
            <InputNumber min={1} max={12} value={month} onChange={(v) => v && setMonth(v)} style={{ width: 60 }} />
          </div>
          <div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Day</div>
            <InputNumber min={1} max={31} value={day} onChange={(v) => v && setDay(v)} style={{ width: 60 }} />
          </div>
          <div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Hr</div>
            <InputNumber min={0} max={23} value={hour} onChange={(v) => v !== null && setHour(v)} style={{ width: 60 }} />
          </div>
          <div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Min</div>
            <InputNumber min={0} max={59} value={minute} onChange={(v) => v !== null && setMinute(v)} style={{ width: 60 }} />
          </div>
          <div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Sec</div>
            <InputNumber min={0} max={59} value={second} onChange={(v) => v !== null && setSecond(v)} style={{ width: 60 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: 0 }}>
            <Button type="primary" onClick={handleDateToEpoch}>Convert</Button>
          </div>
        </Space>
        
        {timestampResult && (
          <div style={{ padding: 16, background: appTheme === 'dark' ? '#1f1f1f' : '#f9f9f9', borderRadius: 8 }}>
            <Row>
              <Col span={4}><Text strong>Seconds:</Text></Col>
              <Col span={20}><Text copyable style={{ fontFamily: 'monospace' }}>{timestampResult.sec.toString()}</Text></Col>
            </Row>
            <Row style={{ marginTop: 8 }}>
              <Col span={4}><Text strong>Milliseconds:</Text></Col>
              <Col span={20}><Text copyable style={{ fontFamily: 'monospace' }}>{timestampResult.ms.toString()}</Text></Col>
            </Row>
          </div>
        )}
      </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TimestampConverter;
