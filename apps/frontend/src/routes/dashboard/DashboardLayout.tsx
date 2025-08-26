import { Outlet, NavLink } from 'react-router-dom';

export function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-white border-r dark:bg-neutral-900 dark:border-neutral-700">
        <nav className="p-4 space-y-2">
          <NavLink to="/companies" className="block">Clients</NavLink>
          <NavLink to="/dashboard/settings" className="block">Settings</NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
