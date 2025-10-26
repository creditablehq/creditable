import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/creditable_transparent.png";

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    logout();
  }

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
        <div className="w-24 mb-8 overflow-hidden"><img src={logo} className="object-contain w-auto h-full" alt="Creditable Logo"/></div>

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
          <NavLink
            to="/companies"
            className={({ isActive }) =>
              isActive ? 'text-brand font-medium' : 'text-neutral-700 dark:text-neutral-300'
            }
          >
            Clients
          </NavLink>
          {user?.role === 'ADMIN' && <NavLink
            to="/brokers"
            className={({ isActive }) => 
              isActive ? 'text-brand font-medium' : 'text-neutral-700 dark:text-neutral-300'
            }
          >
            Brokers
          </NavLink>}
          {user?.role === 'ADMIN' && <NavLink
            to="/feedback"
            className={({ isActive }) =>
              isActive ? 'text-brand font-medium' : 'text-neutral-700 dark:text-neutral-300'
            }
          >
            Feedback
          </NavLink>}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? 'text-brand font-medium' : 'text-neutral-700 dark:text-neutral-300'
            }
          >
            Settings
          </NavLink>
          {user?.role === 'ADMIN' && <NavLink
            to="/style-guide"
            className={({ isActive }) =>
              isActive ? 'text-brand font-medium' : 'text-neutral-700 dark:text-neutral-300'
            }
          >
            Style Guide
          </NavLink>}
        </nav>

        <div className="mt-auto pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <button onClick={handleLogout} className="text-sm text-neutral-400 hover:text-red-500 w-full text-left cursor-pointer">
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
