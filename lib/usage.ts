const FREE_DAILY_LIMIT = 1;
const VIP_DAILY_LIMIT = 10;
const AUTH_CODE = "VIP30";
const AUTH_DAYS = 30;

export function getUsage() {
  if (typeof window === "undefined") {
    return { count: 0, isVip: false };
  }

  const vipExpire = localStorage.getItem("vip_expire");
  if (vipExpire) {
    const expireTime = Number(vipExpire);
    if (Date.now() < expireTime) {
      return { count: 0, isVip: true };
    } else {
      localStorage.removeItem("vip_expire");
      localStorage.removeItem("vip_usage_data");
    }
  }

  const today = new Date().toDateString();
  const data = localStorage.getItem("usage_data");

  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (parsed.date === today) {
        return { count: parsed.count || 0, isVip: false };
      }
    } catch (e) {}
  }

  return { count: 0, isVip: false };
}

export function canGenerate() {
  const usage = getUsage();

  if (usage.isVip) {
    const today = new Date().toDateString();
    const data = localStorage.getItem("vip_usage_data");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.date === today) {
          return (parsed.count || 0) < VIP_DAILY_LIMIT;
        }
      } catch (e) {}
    }
    return true;
  }

  return usage.count < FREE_DAILY_LIMIT;
}

export function increaseUsage() {
  if (typeof window === "undefined") return;

  const usage = getUsage();
  const today = new Date().toDateString();

  if (usage.isVip) {
    const data = localStorage.getItem("vip_usage_data");
    let count = 1;
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.date === today) {
          count = (parsed.count || 0) + 1;
        }
      } catch (e) {}
    }
    localStorage.setItem("vip_usage_data", JSON.stringify({ date: today, count }));
  } else {
    const data = localStorage.getItem("usage_data");
    let count = 1;
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.date === today) {
          count = (parsed.count || 0) + 1;
        }
      } catch (e) {}
    }
    localStorage.setItem("usage_data", JSON.stringify({ date: today, count }));
  }
}

export function activateVip(code: string) {
  if (code.trim().toUpperCase() === AUTH_CODE) {
    const expireTime = Date.now() + AUTH_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem("vip_expire", String(expireTime));
    return true;
  }
  return false;
}

export function getRemaining() {
  const usage = getUsage();

  if (usage.isVip) {
    const today = new Date().toDateString();
    const data = localStorage.getItem("vip_usage_data");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.date === today) {
          return Math.max(0, VIP_DAILY_LIMIT - (parsed.count || 0));
        }
      } catch (e) {}
    }
    return VIP_DAILY_LIMIT;
  }

  return Math.max(0, FREE_DAILY_LIMIT - usage.count);
}
