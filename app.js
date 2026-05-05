const MENU_JSON_URL = 'menu.json?v=1';

async function loadMenu() {
  try {
    const response = await fetch(MENU_JSON_URL);
    if (!response.ok) {
      throw new Error('menu.jsonを読み込めませんでした');
    }
    return await response.json();
  } catch (error) {
    showError(error.message);
    return null;
  }
}

function showError(message) {
  const target = document.getElementById('subjectList') || document.getElementById('appList');
  if (target) {
    target.innerHTML = `<p class="error">${escapeHtml(message)}</p>`;
  }
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function createMenuLink(label, url) {
  const a = document.createElement('a');
  a.className = 'menu-button';
  a.textContent = label;
  a.href = url;
  return a;
}

function renderTopPage(menu) {
  const area = document.getElementById('subjectList');
  if (!area) return;

  area.innerHTML = '';
  menu.subjects.forEach(subject => {
    area.appendChild(createMenuLink(subject.name, subject.page));
  });
}

function renderSubjectPage(menu) {
  const subjectId = document.body.dataset.subject;
  if (!subjectId) return;

  const subject = menu.subjects.find(item => item.id === subjectId);
  const title = document.getElementById('pageTitle');
  const area = document.getElementById('appList');

  if (!subject || !area) {
    showError('教科データが見つかりませんでした');
    return;
  }

  document.title = `${subject.name} | ${menu.siteTitle}`;
  if (title) title.textContent = subject.name;

  area.innerHTML = '';

  if (!subject.items || subject.items.length === 0) {
    area.innerHTML = '<p class="empty">現在、登録されているアプリはありません。</p>';
    return;
  }

  subject.items.forEach(item => {
    area.appendChild(createMenuLink(item.title, item.url));
  });
}

loadMenu().then(menu => {
  if (!menu) return;
  renderTopPage(menu);
  renderSubjectPage(menu);
});
