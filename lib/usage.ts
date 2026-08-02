// 免费用户每日可用次数限制（基于 localStorage，纯前端演示用，非安全方案）

const STORAGE_KEY = "xhs_copywriter_usage";
export const DAILY_FREE_LIMIT = 3;

interface UsageRecord {
  date: string; // YYYY-MM-DD
  count: number;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function readRecord(): UsageRecord {
  if (typeof window === "undefined") {
    return { date: todayStr(), count: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayStr(), count: 0 };
    const parsed = JSON.parse(raw) as UsageRecord;
    if (parsed.date !== todayStr()) {
      return { date: todayStr(), count: 0 };
    }
    return parsed;
  } catch {
    return { date: todayStr(), count: 0 };
  }
}

function writeRecord(record: UsageRecord) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

/** 获取今日剩余可用次数 */
export function getRemainingUses(): number {
  const record = readRecord();
  return Math.max(0, DAILY_FREE_LIMIT - record.count);
}

/** 今日已用次数 */
export function getUsedCount(): number {
  return readRecord().count;
}

/** 是否还可以生成 */
export function canGenerate(): boolean {
  return getRemainingUses() > 0;
}

/** 消耗一次生成额度，返回消耗后剩余次数 */
export function consumeUse(): number {
  const record = readRecord();
  const updated: UsageRecord = { date: todayStr(), count: record.count + 1 };
  writeRecord(updated);
  return Math.max(0, DAILY_FREE_LIMIT - updated.count);
}
