import OpenAI from "openai";

const MAX_NAME_LENGTH = 100;
const MAX_TOTAL = 10;

function cleanList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => String(v ?? "").trim().slice(0, MAX_NAME_LENGTH))
    .filter(Boolean)
    .slice(0, MAX_TOTAL);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "POST 요청만 지원해요."
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      error: "서버에 API 키가 설정되지 않았어요. Vercel 환경 변수를 확인해 주세요."
    });
  }

  try {
    const domestic = cleanList(req.body?.domestic);
    const international = cleanList(req.body?.international);
    const mode = ["full", "voice", "acting"].includes(req.body?.mode)
      ? req.body.mode
      : "full";

    const total = domestic.length + international.length;

    if (total < 3 || total > MAX_TOTAL) {
      return res.status(400).json({
        error: "국내·해외 합계 3~10명을 입력해 주세요."
      });
    }

    const modeGuide = {
      full: "음색, 음역, 울림, 호흡, 발성, 딕션, 말투, 속도, 억양, 문장 끝, 감정 표현, 연기 스타일을 균형 있게 분석",
      voice: "노래나 연기보다 평소 말하는 목소리, 음색, 울림, 호흡, 발성, 말투를 중심으로 분석",
      acting: "캐릭터 보이스, 배역별 연기, 감정 표현, 발성 변화와 연기 스타일을 중심으로 분석"
    }[mode];

    const prompt = `
너는 '목소리 취향 소나무 테스트'의 전문 분석가야.
한국어로 친근하고 재미있게 답해.

아래 인물들의 공개된 음성 자료를 웹 검색으로 확인하고,
실제로 확인 가능한 특징만 분석해.

[분석 시 주의사항]
- 성우 이름은 특정 대표 배역 하나에만 한정하지 말고 전반적인 음색, 발성, 연기 경향을 분석해.
- 배역마다 목소리가 달라질 수 있다는 점을 고려해.
- 캐릭터 이름이면 해당 캐릭터의 목소리만 분석해.
- 가수는 노래 음색과 평소 말하는 목소리를 구분해.
- 배우와 인플루언서는 인터뷰, 라디오, 방송 등 평소 말하는 음성을 우선해.
- 자료를 확인하지 못한 인물은 추측하지 말고 '자료 부족'이라고 표시해.
- 성별이나 외모 등 목소리와 무관한 특성으로 취향을 단정하지 마.
- 언어와 국적 차이보다 실제 청각적 특징의 공통점을 우선해.
- 소나무 지수는 과학적 측정치가 아닌 재미용 추정 점수라고 밝혀.

[분석 기준]
${modeGuide}

[입력 인물]
국내: ${domestic.length ? domestic.join(", ") : "없음"}
해외: ${international.length ? international.join(", ") : "없음"}

[결과 구성]
1. 소나무 지수 0~100점과 등급
   - 90~100: 천년 소나무
   - 75~89: 뿌리 깊은 소나무
   - 50~74: 취향 혼합림
   - 25~49: 자유로운 잡목림
   - 0~24: 취향 미스터리

2. 대표 목소리 취향 유형명
3. 국내 취향 분석
4. 해외 취향 분석 (입력이 없으면 입력 없음 표시)
5. 전체 인물의 목소리 공통점 3가지
6. 취향의 차이 또는 예외
7. 가장 결정적인 취향 요소
8. 한 줄 총평
9. 확인이 필요한 점 및 자료 부족 인물

인물별 특징을 구체적으로 설명하되,
확인되지 않은 내용을 사실처럼 단정하지 마.
읽기 쉽고 재미있는 결과로 작성해.
`;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-astra",
      tools: [{ type: "web_search" }],
      tool_choice: "required",
      input: prompt
    });

    const result = (response.output_text || "").trim();

    if (!result) {
      throw new Error("AI가 결과를 반환하지 않았어요.");
    }

    return res.status(200).json({ result });

  } catch (error) {
    console.error("voice-pine analyze error:", error?.message || error);

    return res.status(500).json({
      error: "분석 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요. API 사용량 한도나 결제 설정도 확인해 주세요."
    });
  }
}
