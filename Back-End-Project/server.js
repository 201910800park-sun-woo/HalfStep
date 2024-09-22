const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// POST 요청 처리 (YouTube URL 분석 API)
app.post('/analyze', (req, res) => {
  const { youtubeUrl } = req.body;

  if (!youtubeUrl) {
    return res.status(400).json({ error: 'YouTube URL을 제공해 주세요.' });
  }

  // Python 스크립트 실행
  const python = spawn('python3', ['app/youtube_summary.py', youtubeUrl]);

  // Python 스크립트에서 나온 데이터를 처리
  python.stdout.on('data', (data) => {
    const result = JSON.parse(data.toString());
    res.json(result);
  });

  python.stderr.on('data', (data) => {
    console.error(`Python 스크립트 에러: ${data.toString()}`);
    res.status(500).json({ error: 'Python 스크립트를 실행하는 중 에러가 발생했습니다.', details: data.toString() });
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
