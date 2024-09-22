import sys
import json
import os
from youtube_audio import download_audio_from_youtube
from whisper_transcriber import transcribe_audio_to_text
from summarizer import summarize_text

def save_text_data(text, filename='transcribed_text.txt'):
    with open(filename, 'w') as f:
        f.write(text)

def main(youtube_url):
    # 1. YouTube 오디오 다운로드
    audio_path = download_audio_from_youtube(youtube_url)

    try:
        # 2. Whisper로 오디오 텍스트 변환
        text = transcribe_audio_to_text(audio_path)

        # 텍스트 데이터 저장 (나중에 감정 분석에 사용)
        save_text_data(text, filename='saved_text.txt')

        # 3. 텍스트 요약
        summary = summarize_text(text)

        # 요약 결과 반환 (JSON 형식)
        result = {
            'summary': summary,
            'sentiment': '긍정적'  # 임시로 긍정적 감정 분석 결과 반환
        }

        print(json.dumps(result))

    finally:
        # 요약이 완료되면 오디오 파일 삭제
        if os.path.exists(audio_path):
            os.remove(audio_path)

if __name__ == "__main__":
    youtube_url = sys.argv[1]
    main(youtube_url)


