// ============================================================
//  laundrygo 설문 응답 수집 — Google Apps Script
//  사용법:
//    1. Google Sheets 열기 → 확장 프로그램 → Apps Script
//    2. 이 코드 전체 붙여넣기 → 저장
//    3. 배포 → 새 배포 → 유형: 웹 앱
//       실행 계정: 나     |  액세스: 모든 사용자
//    4. 배포 URL을 복사 → .env.local 의 GOOGLE_APPS_SCRIPT_URL 에 붙여넣기
// ============================================================

const SHEET_NAME = 'responses'   // 시트 이름 (없으면 자동 생성)

const HEADERS = [
  '제출 시간', '성별', '연령대', '거주 지역', '트레일 경력',
  '중요 요소', '불안 요소',
  '종합 만족도', '접수 편의성', '청결도', '유지력', '배송 속도',
  '차별점 (주관식)', 'NPS',
  '추가 희망 서비스', '자유 의견', '연락처',
]

function getOrCreateSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet()
  let   sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow(HEADERS)
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setBackground('#004D43')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
    sheet.setFrozenRows(1)
  }
  return sheet
}

function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents)
    const sheet = getOrCreateSheet()

    sheet.appendRow([
      new Date().toLocaleString('ko-KR'),
      data.gender            || '',
      data.ageGroup          || '',
      data.residence         || '',
      data.trailExperience   || '',
      (data.importantFactors || []).join(', '),
      (data.anxietyFactors   || []).join(', '),
      data.overallSatisfaction                  ?? '',
      data.detailedRatings?.convenience         ?? '',
      data.detailedRatings?.cleanliness         ?? '',
      data.detailedRatings?.durability          ?? '',
      data.detailedRatings?.deliverySpeed       ?? '',
      data.differentiator    || '',
      data.nps               ?? '',
      data.additionalServices || '',
      data.freeOpinion       || '',
      data.contact           || '',
    ])

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// GET 요청으로 연결 테스트 가능
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok', service: 'laundrygo-survey' }))
    .setMimeType(ContentService.MimeType.JSON)
}
