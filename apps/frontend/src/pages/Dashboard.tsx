const Dashboard = () => {
  return (
    <div className="text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark transition">
        + Add Plan
        </button>
      </div>
      <section className="bg-white dark:bg-neutral-800 p-4 sm:p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-semibold mb-4">Recently Added Plans</h3>
        <p>Use this dashboard to access tools for checking plan     creditability.</p>
        {/* Table or List here */}
      </section>
    </div>
  );
};

export default Dashboard;
