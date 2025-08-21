// background.js — MV3 service worker

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function mergeCounts(target, counts) {
  for (const [word, count] of Object.entries(counts)) {
    target[word] = (target[word] || 0) + count;
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    const data = await chrome.storage.local.get({
      stats: {
        totals: { seen: {}, typed: {} },
        byDomain: {},
        byDay: {}
      }
    });

    const stats = data.stats;

    if (msg.type === "logFound" || msg.type === "logTyped") {
      const mode = msg.type === "logFound" ? "seen" : "typed";
      const domain = msg.domain || "unknown";
      const counts = msg.counts || {};

      // totals
      mergeCounts(stats.totals[mode], counts);

      // per-domain
      if (!stats.byDomain[domain]) stats.byDomain[domain] = { seen: {}, typed: {} };
      mergeCounts(stats.byDomain[domain][mode], counts);

      // per-day
      const day = todayKey();
      if (!stats.byDay[day]) stats.byDay[day] = { seen: {}, typed: {} };
      mergeCounts(stats.byDay[day][mode], counts);

      await chrome.storage.local.set({ stats });
      console.log("✅ Updated stats", stats);
      sendResponse({ ok: true });
      return;
    }

    if (msg.type === "getStats") {
      const domain = msg.domain || "unknown";
      const domainStats = stats.byDomain[domain] || { seen: {}, typed: {} };
      sendResponse({ stats, domainStats });
      return;
    }

    if (msg.type === "resetData") {
      const fresh = {
        totals: { seen: {}, typed: {} },
        byDomain: {},
        byDay: {}
      };
      await chrome.storage.local.set({ stats: fresh });
      sendResponse({ ok: true });
      return;
    }
  })();

  return true; // keep channel alive
});
