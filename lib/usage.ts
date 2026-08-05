const FREE_LIMIT = 1;
const VIP_LIMIT = 10;
const VIP_CODE = "VIP0518";
const VIP_DAYS = 30;

type UsageData = {
  date: string;
  count: number;
  isVip: boolean;
  vipExpire: string | null;
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function load(): UsageData {
  if (typeof window === "undefined") {
    return { date: getToday(), count: 0, isVip: false, vipExpire: null };
  }

  try {
    const raw = localStorage.getItem("xhs_usage");
    if (!raw) {
      return { date: getToday(), count: 0, isVip: false, vipExpire: null };
    }

    const data: UsageData = JSON.parse(raw);

    // 检查 VIP 是否过期
    if (data.isVip && data.vipExpire) {
      if (new Date(data.vipExpire) < new Date()) {
        data.isVip = false;
        data.vipExpire = null;
      }
    }

    // 跨天重置次数
    if (data.date !== getToday()) {
      data.date = getToday();
      data.count = 0;
    }

    return data;
  } catch {
    return { date: getToday(), count: 0, isVip: false, vipExpire: null };
  }
}

function save(data: UsageData) {
  if (typeof window === "undefined") return;
  localStorage.setItem("xhs_usage", JSON.stringify(data));
}

export function getUsage() {
  return load();
}

export function getRemaining() {
  const data = load();
  const limit = data.isVip ? VIP_LIMIT : FREE_LIMIT;
  return Math.max(0, limit - data.count);
}

export function canGenerate() {
  return getRemaining() > 0;
}

export function increaseUsage() {
  const data = load();
  data.count += 1;
  save(data);
}

export function activateVip(code: string) {
  if (code.trim().toUpperCase() !== VIP_CODE) {
    return false;
  }

  const data = load();
  const expire = new Date();
  expire.setDate(expire.getDate() + VIP_DAYS);

  data.isVip = true;
  data.vipExpire = expire.toISOString();
  data.count = 0; // 激活当天重置次数
  data.date = getToday();
  save(data);

  return true;
}
