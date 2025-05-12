import ThemeSwitcher from "../components/ThemeSwitcher";

const StyleGuide = () => {
  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold text-brand">🎨 Style Guide – Creditable</h1>

      <ThemeSwitcher />

      {/* Colors */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ColorBox name="brand" className="bg-brand" />
          <ColorBox name="brand-dark" className="bg-brand-dark text-white" />
          <ColorBox name="brand-light" className="bg-brand-light" />
          <ColorBox name="neutral-100" className="bg-neutral-100 border" />
          <ColorBox name="neutral-900" className="bg-neutral-900 text-white" />
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Typography</h2>
        <div className="space-y-2">
          <p className="text-3xl font-bold">Heading 1 – 3xl / Bold</p>
          <p className="text-xl font-semibold">Heading 2 – xl / Semibold</p>
          <p className="text-base">Body Text – base</p>
          <p className="text-sm text-neutral-600">Caption – sm / muted</p>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Buttons</h2>
        <div className="space-x-4">
          <button className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark">
            Primary
          </button>
          <button className="bg-brand-light text-brand px-4 py-2 rounded">
            Subtle
          </button>
          <button className="border border-brand text-brand px-4 py-2 rounded hover:bg-brand-light">
            Outline
          </button>
        </div>
      </section>
    </div>
  );
};

const ColorBox = ({ name, className }: { name: string; className: string }) => (
  <div className={`h-16 rounded flex items-center justify-center text-sm ${className}`}>
    {name}
  </div>
);

export default StyleGuide;
