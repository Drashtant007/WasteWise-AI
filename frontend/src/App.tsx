import { Leaf, Recycle, Sparkles } from "lucide-react";
import WasteAnalyzer from "./components/WasteAnalyzer";

function App() {
  const scrollToAnalyzer = () => {
    document
      .getElementById("analyzer")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#07110d] text-white">
      {/* Navigation */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* Brand */}
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

          {/* Navigation Links */}
          <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex">
            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="transition hover:text-white"
            >
              Home
            </button>

            <button
              onClick={scrollToAnalyzer}
              className="transition hover:text-white"
            >
              Analyze
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="transition hover:text-white"
            >
              How it works
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6">
        {/* Hero Section */}
        <section className="flex min-h-[calc(100vh-81px)] flex-col items-center justify-center py-20 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm text-emerald-300">
            <Sparkles size={15} />
            AI-powered waste intelligence
          </div>

          {/* Heading */}
          <h2 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Turn waste into
            <span className="block text-emerald-400">
              better decisions.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
            Upload an image and let WasteWise AI identify the waste,
            estimate its classification confidence, and guide you
            toward the right disposal method.
          </p>

          {/* Hero Actions */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={scrollToAnalyzer}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-7 py-4 font-semibold text-[#07110d] transition hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/10"
            >
              <Leaf size={19} />
              Analyze Waste
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-xl border border-white/10 bg-white/[0.03] px-7 py-4 font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white"
            >
              How it works
            </button>
          </div>

          {/* Small credibility line */}
          <div className="mt-10 flex items-center gap-2 text-xs text-white/25">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Powered by deep learning
            <span className="text-white/15">•</span>
            ResNet50
          </div>
        </section>

        {/* Analyzer */}
        <WasteAnalyzer />

        {/* How It Works */}
        <section
          id="how-it-works"
          className="mx-auto max-w-5xl px-0 py-24"
        >
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/50">
              <Recycle size={15} />
              How it works
            </div>

            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              From image to insight.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-white/40">
              WasteWise AI combines image preprocessing, deep learning,
              and disposal guidance into a simple workflow.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="text-sm font-semibold text-emerald-300">
                01
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                Upload
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Provide an image of the waste item you want to
                classify.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="text-sm font-semibold text-emerald-300">
                02
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                Analyze
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Our ResNet50 deep learning model analyzes the image
                and predicts its waste category.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <div className="text-sm font-semibold text-emerald-300">
                03
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                Dispose smarter
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Get the predicted category, confidence score, and
                practical disposal guidance.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Recycle size={16} className="text-emerald-400" />
            <span>WasteWise AI</span>
          </div>

          <p>
            Intelligent waste classification & disposal guidance
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;