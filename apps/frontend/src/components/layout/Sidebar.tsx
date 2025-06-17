import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } sm:hidden`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          w-64 p-4 z-50 shadow-md bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700
          flex flex-col
          fixed inset-y-0 left-0 transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          sm:translate-x-0 sm:sticky sm:top-0 sm:h-screen sm:flex-shrink-0 sm:shadow-sm
        `}
      >
        {/* Brand */}
        <div className="text-xl font-bold text-brand mb-6">Creditable</div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-3 text-sm flex-grow">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-brand font-medium' : 'text-neutral-700 dark:text-neutral-300'
            }
          >
            Dashboard
          </NavLink>
          <nav className="flex flex-col px-4 space-y-2">
            <NavLink
              to="/dashboard/clients"
              className={({ isActive }) =>
                isActive ? 'text-brand font-medium' : 'text-neutral-700 dark:text-neutral-300'
              }
            >
              Clients
            </NavLink>
            <NavLink
              to="/dashboard/plans"
              className={({ isActive }) =>
                isActive ? 'text-brand font-medium' : 'text-neutral-700 dark:text-neutral-300'
              }
            >
              Plans
            </NavLink>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                isActive ? 'text-brand font-medium' : 'text-neutral-700 dark:text-neutral-300'
              }
            >
              Settings
            </NavLink>
          </nav>
          {/* <NavLink
            to="/style-guide"
            className={({ isActive }) =>
              isActive ? 'text-brand font-medium' : 'text-neutral-700 dark:text-neutral-300'
            }
          >
            Style Guide
          </NavLink> */}
        </nav>

        <div className="mt-auto pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <button onClick={logout} className="text-sm text-neutral-400 hover:text-red-500 w-full text-left cursor-pointer">
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
