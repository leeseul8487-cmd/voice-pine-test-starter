# 목소리 취향 소나무 테스트

## 포함 파일
- `index.html`: 테스트 화면
- `api/analyze.js`: 서버에서 OpenAI API를 호출하는 함수 (API 키는 브라우저에 전달되지 않음)
- `package.json`: OpenAI SDK 의존성
- `vercel.json`: Vercel 함수 설정

## 배포 순서 (초보자용)

### 1. OpenAI API 키 만들기
1. https://platform.openai.com/api-keys 에 로그인합니다.
2. Create new secret key를 눌러 키를 만듭니다.
3. 키를 복사해 안전한 곳에 잠시 보관합니다. 다른 사람에게 보내거나 GitHub 파일에 붙여넣지 마세요.
4. API 사용은 ChatGPT 구독과 별도이며, 결제/사용 한도를 설정하는 것이 좋습니다.
   - 공식 안내: https://developers.openai.com/api/docs/quickstart

### 2. GitHub에 프로젝트 올리기
1. https://github.com 에 가입/로그인합니다.
2. New repository를 눌러 새 저장소를 만듭니다. 예: `voice-pine-test`
3. 이 압축파일을 풀고, 안의 파일과 `api` 폴더를 저장소에 업로드합니다.
4. 저장소는 Public 또는 Private 모두 가능하지만, 소스에 API 키를 절대 넣지 않습니다.

### 3. Vercel에 배포하기
1. https://vercel.com 에 가입/로그인합니다.
2. Add New → Project를 선택합니다.
3. 방금 만든 GitHub 저장소를 Import 합니다.
4. Framework Preset은 Other로 두고 Deploy를 누릅니다.
5. 배포가 끝나면 프로젝트의 Settings → Environment Variables로 이동합니다.
6. 다음 환경 변수를 추가합니다.
   - Name: `OPENAI_API_KEY`
   - Value: 1단계에서 만든 API 키
   - Environment: Production, Preview, Development 모두 선택
7. Save 한 뒤 Deployments에서 Redeploy를 실행합니다.
8. Vercel이 제공한 `https://프로젝트이름.vercel.app` 주소를 공유하면 됩니다.

선택 사항:
- `OPENAI_MODEL` = `gpt-6-luna` (비용 효율형 기본값). 사용 가능한 모델은 OpenAI 계정/프로젝트 권한에 따라 다를 수 있습니다.

## 중요한 보안/운영 안내
- API 키는 Vercel의 서버 환경 변수에만 저장됩니다. HTML/브라우저 코드에 넣지 마세요.
- 분석 요청마다 OpenAI API 사용료가 발생할 수 있습니다. Vercel 배포도 무료 한도/정책이 변경될 수 있으므로 현재 요금과 제한을 확인하세요.
- 공개 웹사이트이므로 링크를 아는 누구나 분석을 요청할 수 있습니다. 사용량 한도와 결제 알림을 설정하고, 사용량을 주기적으로 확인하세요.
- 현재 버전은 이름을 서버에 저장하지 않지만, 분석 요청에 입력한 이름은 OpenAI API로 전송됩니다.
- 모델은 공개 자료를 웹 검색해 분석하지만, 모든 음성 샘플을 직접 청취하는 것은 아닙니다. 검색 자료가 부족하면 결과가 부정확할 수 있습니다.
- 이미지 저장은 결과 텍스트를 카드 형태 PNG로 그려 저장하는 기능이며, AI가 인물 사진을 생성하는 기능은 아닙니다.
- 이 초기 버전에는 계정/로그인, 데이터베이스, 강력한 IP별 요청 제한이 없습니다. 공유 범위가 커지면 CAPTCHA와 rate limit을 추가하는 것이 좋습니다.

## 로컬 확인 (선택)
Node.js 설치 후 프로젝트 폴더에서:
```bash
npm install
npm install -g vercel
vercel dev
```
`.env.local` 파일에 `OPENAI_API_KEY=여기에_키`를 넣어 로컬 테스트할 수 있습니다. `.env.local`은 절대 GitHub에 업로드하지 마세요.
