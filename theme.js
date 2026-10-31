'use strict';
const themeButton = document.querySelector('#theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let explicitTheme = false;
try { explicitTheme = ['light', 'dark'].includes(localStorage.getItem('sarah-theme')); } catch {}
function applyTheme(theme) {
 document.documentElement.dataset.theme = theme;
 themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
 themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
 document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#17191c' : '#faf9f6');
}
applyTheme(document.documentElement.dataset.theme || (systemTheme.matches ? 'dark' : 'light'));
themeButton.addEventListener('click', () => {
 const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
 explicitTheme = true;
 applyTheme(theme);
 try { localStorage.setItem('sarah-theme', theme); } catch {}
});
systemTheme.addEventListener('change', event => { if (!explicitTheme) applyTheme(event.matches ? 'dark' : 'light'); });

// Keep the portfolio and hobbies tab in sync when a preference changes.
window.addEventListener('storage', event => {
 if (event.key !== 'sarah-theme') return;
 explicitTheme = event.newValue === 'dark' || event.newValue === 'light';
 applyTheme(explicitTheme ? event.newValue : (systemTheme.matches ? 'dark' : 'light'));
});
