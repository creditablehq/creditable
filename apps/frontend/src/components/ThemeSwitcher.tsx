import { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<'default' | 'green' | 'amber'>('default');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    // Handle brand theme
    root.classList.remove('theme-green', 'theme-amber');
    if (theme === 'green') root.classList.add('theme-green');
    else if (theme === 'amber') root.classList.add('theme-amber');

    // Handle light/dark
    root.classList.toggle('dark', dark);
  }, [theme, dark]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center text-sm">
      <label className="space-x-2">
        <span>Theme:</span>
        <select value={theme} onChange={e => setTheme(e.target.value as any)} className="border px-2 py-1 rounded">
          <option value="default">Blue (Default)</option>
          <option value="green">Green</option>
          <option value="amber">Amber</option>
        </select>
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={dark} onChange={e => setDark(e.target.checked)} />
        <span>Dark Mode</span>
      </label>
    </div>
  );
};

export default ThemeSwitcher;
