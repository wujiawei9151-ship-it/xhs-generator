const FREE_DAILY_LIMIT = 1;
const AUTH_CODE = "VIP30"; // 授权码
const AUTH_DAYS = 30; // 授权天数

export function getUsage() {
  if (typeof window === "undefined") return { count: 0, isVip: false, expireDate: null };

  const vipExpire = localStorage.getItem("vip_expire");
  if (vipExpire) {
    const expireTime = parseInt(vipExpire);
    if (Date.now() < expireTime) {
      return { count: 0, isVip: true, expireDate: new Date(expireTime) };
    } else {
      localStorage.removeItem("vip_expire");
    }
  }

  const today = new Date().toDateString();
  const data = localStorage.getItem("usage_data");
  
  if (data) {
    const parsed = JSON.parse(data);
    if (parsed.date === today) {
      return { count: parsed.count, isVip: false, expireDate: null };
    }
  }
  
  return { count: 0, isVip: false, expireDate: null };
}

export function canGenerate() {
  const usage = getUsage();
  if (usage.isVip) return true;
  return usage.count < FREE_DAILY_LIMIT;
}

export function increaseUsage() {
  if (typeof window === "undefined") return;
  
  const usage = getUsage();
  if (usage.isVip) return;

  const today = new Date().toDateString();
  const data = localStorage.getItem("usage_data");
  
  let count = 1;
  if (data) {
    const parsed = JSON.parse(data);
    if (parsed.date === today) {
      count = parsed.count + 1;
    }
  }
  
  localStorage.setItem("usage_data", JSON.stringify({ date: today, count }));
}

export function activateVip(code: string) {
  if (code.trim().toUpperCase() === AUTH_CODE) {
    const expireTime = Date.now() + AUTH_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem("vip_expire", expireTime.toString());
    return true;
  }
  return false;
}

export function getRemaining() {
  const usage = getUsage();
  if (usage.isVip) return "无限次";
  return Math.max(0, FREE_DAILY_LIMIT - usage.count);
}
