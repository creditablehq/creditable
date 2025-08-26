import { useAuth } from "../../contexts/AuthContext";

const Topbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
      <div className="flex gap-2">
        <button
          className="sm:hidden text-brand self-baseline"
          onClick={onMenuClick}
        >
          ☰
        </button>
        <h1 className="sm:invisible text-lg font-semibold">Creditable</h1>
      </div>
      <div className="flex flex-row gap-3 items-center text-center">
        <div className="text-sm">Welcome, {user?.name?.split(" ")[0] ?? 'Broker'}</div>
      </div>
    </header>
  );
};

export default Topbar;
