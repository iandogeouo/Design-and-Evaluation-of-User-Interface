'use strict';

// ── 輔助函數：安全執行 ────────────────────────
function safeExec(selector, callback) {
  const el = document.querySelector(selector);
  if (el) callback(el);
}

// ── 進度條 ──────────────────────────────────
const progressBar = document.getElementById('progress-bar');
function updateProgress() {
  if (!progressBar) return;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
  progressBar.style.width = pct + '%';
}

// ── 導覽列 ──────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);

  // 只有在首頁或有 section[id] 的地方才執行高亮
  if (sections.length > 0) {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(a => {
      const href = a.getAttribute('href')?.replace('#', '');
      a.classList.toggle('active', href === current);
    });
  }
}

// hamburger
safeExec('#navToggle', (el) => {
  const navList = document.getElementById('navLinks');
  el.addEventListener('click', () => navList && navList.classList.toggle('open'));
});

// ── 返回頂部 ─────────────────────────────────
const backTop = document.getElementById('backTop');
function updateBackTop() {
  if (backTop) backTop.classList.toggle('show', window.scrollY > 400);
}
if (backTop) {
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── 打字機效果 ───────────────────────────────
const TYPEWRITER_TEXT = '益智遊戲怎麼選？';
const typeEl = document.getElementById('typewriterEl');
let typeIdx = 0;

function typeChar() {
  if (!typeEl) return;
  if (typeIdx <= TYPEWRITER_TEXT.length) {
    typeEl.textContent = TYPEWRITER_TEXT.slice(0, typeIdx);
    typeIdx++;
    setTimeout(typeChar, typeIdx === 1 ? 600 : 80);
  }
}
if (typeEl) setTimeout(typeChar, 800);

// ── Scroll Reveal ──────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.bar[data-w]').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Tab & FAQ ───────────────────────────────
document.querySelectorAll('.tabs').forEach(tabsEl => {
  tabsEl.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsEl.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.dataset.target;
      const section = tabsEl.closest('.section');
      section.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });
});

document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  if (btn) {
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  }
});

// ── 表單驗證 ─────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  const nameInput = document.getElementById('fname');
  const emailInput = document.getElementById('femail');
  const nameErr = document.getElementById('fnameErr');
  const emailErr = document.getElementById('femailErr');

  if (nameInput) {
    const savedName = localStorage.getItem('contactName');
    if (savedName) nameInput.value = savedName;
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim() && nameErr) nameErr.textContent = '';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    if (nameInput && !nameInput.value.trim()) {
      if (nameErr) nameErr.textContent = '⚠ 請填寫姓名';
      valid = false;
    }
    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (!emailVal) {
      if (emailErr) emailErr.textContent = '⚠ 請填寫 Email';
      valid = false;
    }
    if (valid) {
      if (nameInput) localStorage.setItem('contactName', nameInput.value.trim());
      showToast('✅ 送出成功！感謝您的意見回饋。');
      form.reset();
    }
  });
}

// ── 雷達圖 ──────────────────────────────────
function initChart() {
  const ctx = document.getElementById('radarChart');
  if (!ctx || typeof Chart === 'undefined') return;
  // (Chart.js 邏輯保持不變...)
}

const chartEl = document.getElementById('radarChart');
if (chartEl) {
  const chartObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (typeof initChart === 'function') initChart();
      chartObs.disconnect();
    }
  }, { threshold: 0.3 });
  chartObs.observe(chartEl);
}

// ── 主題 & 字體 ──────────────────────────────
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.add('light');
    themeToggle.textContent = '☀️';
  }
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

const FONT_LEVELS = [85, 92, 100, 108, 116];
let fontLevelIdx = parseInt(localStorage.getItem('fontLevel')) || 2;
function applyFontSize(idx) {
  fontLevelIdx = Math.max(0, Math.min(FONT_LEVELS.length - 1, idx));
  document.documentElement.style.fontSize = FONT_LEVELS[fontLevelIdx] + '%';
  localStorage.setItem('fontLevel', fontLevelIdx);
}
applyFontSize(fontLevelIdx);

safeExec('#fontDecrease', el => el.addEventListener('click', () => applyFontSize(fontLevelIdx - 1)));
safeExec('#fontIncrease', el => el.addEventListener('click', () => applyFontSize(fontLevelIdx + 1)));

// ── Toast ──────────────────────────────────
function showToast(msg) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 400);
  }, 3000);
}

// ── 全域事件 ────────────────────────────────
window.addEventListener('scroll', () => {
  updateProgress();
  updateNav();
  updateBackTop();
}, { passive: true });

document.addEventListener('keydown', e => {
  if (e.shiftKey && e.code === 'KeyD') {
    if (themeToggle) themeToggle.click();
  }
});

// 初始化執行一次
updateProgress();
updateNav();
updateBackTop();
