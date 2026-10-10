import { Leaf, Recycle, Sparkles } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-[#07110d] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
              <Recycle size={22} />
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                WasteWise AI
              </h1>
              <p className="text-xs text-white/40">
                Intelligent waste classification
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/60 md:flex">
            <button className="transition hover:text-white">Home</button>
            <button className="transition hover:text-white">
              How it works
            </button>
            <button className="transition hover:text-white">About</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6">
        <section className="flex min-h-[calc(100vh-81px)] flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm text-emerald-300">
            <Sparkles size={15} />
            AI-powered waste intelligence
          </div>

          <h2 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Turn waste into
            <span className="block text-emerald-400">
              better decisions.
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
            Upload an image and let WasteWise AI identify the waste,
            estimate its classification confidence, and guide you toward
            the right disposal method.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-7 py-4 font-semibold text-[#07110d] transition hover:bg-emerald-300">
              <Leaf size={19} />
              Analyze Waste
            </button>

            <button className="rounded-xl border border-white/10 bg-white/[0.03] px-7 py-4 font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white">
              How it works
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;