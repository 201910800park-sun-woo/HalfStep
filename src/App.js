import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  // YouTube URL 유효성 검사 함수
  const isValidYouTubeUrl = (url) => {
    const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  };

  const handleAnalyze = async () => {
    // URL 유효성 검사
    if (!url || !isValidYouTubeUrl(url)) {
      setError('유효하지 않은 YouTube URL입니다.');
      setResult(null); // 결과 초기화
      return;
    }

    setError(''); // 에러 메시지 초기화
    setLoading(true); // 로딩 상태로 전환

    try {
      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeUrl: url }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false); // 로딩 완료 후 상태 초기화
    }
  };

  return (
    <div>
      {/* Navbar & Hero Section */}
      <div className="container-fluid position-relative p-0">
        <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
          <a href="/" className="navbar-brand p-0">
            <h1 className="text-primary m-0">반발자국</h1>
          </a>
        </nav>

        <div
          className="container-fluid bg-primary py-5 mb-5 hero-header"
          style={{
            backgroundImage: "url('img/your-new-image.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="container py-5">
            <div className="row justify-content-center py-5">
              <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
                <h1 className="display-3 text-white mb-3 animated slideInDown">
                  YouTube 동영상 요약 및 감정 분석
                </h1>
                <p className="fs-4 text-white mb-4 animated slideInDown">
                  분석하고 싶은 YouTube 동영상 URL을 입력하세요.
                </p>

                {/* URL 입력 필드 및 버튼 */}
                <div className="position-relative w-75 mx-auto animated slideInDown">
                  <input
                    className="form-control border-0 rounded-pill w-100 py-3 ps-4 pe-5"
                    type="text"
                    placeholder="YouTube URL 입력"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill py-2 px-4 position-absolute top-0 end-0"
                    onClick={handleAnalyze}
                    style={{ marginTop: '7px' }}
                  >
                    분석 시작
                  </button>
                </div>

                {/* 유효하지 않은 URL 경고 메시지 */}
                {error && <p className="text-danger mt-3">{error}</p>}

                {/* 로딩 중일 때 메시지 표시 */}
                {loading && <p className="text-info mt-3">요약 중... 잠시만 기다려 주세요.</p>}

                {/* 분석 결과 표시 */}
                {result && (
                  <div className="mt-5">
                    <h4>요약:</h4>
                    <p>{result.summary}</p>
                    <h4>감정 분석:</h4>
                    <p>{result.sentiment}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;