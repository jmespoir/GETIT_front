/**
 * 모집 기간은 "한국 시간(KST)" 기준으로 입력·표시합니다.
 * 서버는 UTC로 저장·비교하므로, 프론트에서만 KST ↔ UTC 변환을 합니다.
 * (서버는 받은 값을 그대로 저장하고, "현재 시각"과 비교할 때 UTC를 쓰면 됩니다.)
 */

/**
 * datetime-local 값(한국 시간)을 서버 전송 형식(UTC)으로 변환
 * 서버 형식: "YYYY-MM-DDTHH:mm:ss" (UTC, Z 없음)
 * @param {string} dateTimeLocal - "YYYY-MM-DDTHH:mm" (KST)
 * @returns {string} "YYYY-MM-DDTHH:mm:ss"
 */
export function kstToServerFormat(dateTimeLocal) {
  if (!dateTimeLocal || !dateTimeLocal.trim()) return '';
  const s = dateTimeLocal.trim();
  const withSec = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(s) ? s : s.replace(/T(\d{2}:\d{2})$/, 'T$1:00');
  const date = new Date(withSec + '+09:00');
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  const h = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  const sec = String(date.getUTCSeconds()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${min}:${sec}`;
}

/**
 * 서버에서 받은 UTC 문자열을 datetime-local(한국 시간)으로 변환
 * 서버 형식: "YYYY-MM-DDTHH:mm:ss" (UTC, Z 없을 수 있음)
 * @param {string} serverStored - "YYYY-MM-DDTHH:mm:ss" 또는 "YYYY-MM-DDTHH:mm:ss.sssZ"
 * @returns {string} "YYYY-MM-DDTHH:mm" (KST, input value용)
 */
export function serverStoredToKstDateTimeLocal(serverStored) {
  if (!serverStored || !serverStored.trim()) return '';
  const s = serverStored.trim();
  const date = new Date(s.endsWith('Z') || s.includes('+') ? s : s + 'Z');
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
  const y = get('year');
  const m = get('month');
  const d = get('day');
  const h = get('hour');
  const min = get('minute');
  return `${y}-${m}-${d}T${h}:${min}`;
}

/**
 * 한국 시간으로 포맷된 문자열 표시 (예: "2025년 3월 15일 23:59")
 * @param {string} isoUtc
 * @returns {string}
 */
export function formatKstLong(isoUtc) {
  if (!isoUtc || !isoUtc.trim()) return '';
  const date = new Date(isoUtc.trim());
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
