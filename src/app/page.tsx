import { prisma } from "@/lib/prisma";
import { addEntry, deleteEntry } from "./actions";

export default async function Home() {
  const entries = await prisma.entry.findMany({ orderBy: { date: "desc" } });
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 text-zinc-800">
      {/* Top bar */}
      <div className="border-b border-sky-100/80 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-semibold tracking-tight text-sky-800">Speech of Moment</h1>
          <span className="text-xs text-sky-800/70">Your daily timeline</span>
        </div>
      </div>

      {/* Shell with sidebar + main */}
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden rounded-xl border border-sky-100 bg-white/80 p-4 shadow-sm md:block">
          <div className="mb-4">
            <div className="text-sm font-medium text-sky-900">Quick Filters</div>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="cursor-default rounded-md px-2 py-1 text-sky-700 hover:bg-sky-50">All entries</li>
              <li className="cursor-default rounded-md px-2 py-1 text-sky-700 hover:bg-sky-50">Today</li>
              <li className="cursor-default rounded-md px-2 py-1 text-sky-700 hover:bg-sky-50">With mood</li>
            </ul>
          </div>
          <div className="mt-6 text-xs text-sky-900/60">Tip: The form stays on the right—add thoughts anytime.</div>
        </aside>

        {/* Main content split: entries list + sticky form */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          {/* Entries list */}
          <div className="space-y-4">
            {entries.length === 0 ? (
              <p className="text-sm text-sky-900/60">No entries yet. Use the panel on the right to add your first one.</p>
            ) : (
              entries.map((e) => (
                <article key={e.id} className="relative rounded-xl border border-sky-100 bg-white p-5 shadow-sm">
                  <div className="mb-2 flex items-center justify-between text-sm text-sky-900/70">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{new Date(e.date).toLocaleDateString()}</span>
                      {e.mood && (
                        <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-700 ring-1 ring-inset ring-sky-100">{e.mood}</span>
                      )}
                    </div>
                    <form action={async (formData: FormData) => {
                      'use server'
                      const id = Number(formData.get('id'))
                      await deleteEntry(id)
                    }}>
                      <input type="hidden" name="id" value={e.id} />
                      <button className="text-red-600 hover:underline">Delete</button>
                    </form>
                  </div>
                  <p className="whitespace-pre-wrap text-[0.95rem] leading-7 text-zinc-800">{e.content}</p>
                </article>
              ))
            )}
          </div>

          {/* Sticky compose panel */}
          <div className="lg:sticky lg:top-6">
            <form action={addEntry} className="space-y-3 rounded-xl border border-sky-100 bg-white/90 p-5 shadow-sm backdrop-blur">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col text-sm">
                  <span className="mb-1 text-sky-900">Date</span>
                  <input
                    type="date"
                    name="date"
                    defaultValue={today}
                    className="rounded-md border border-sky-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </label>
                <label className="flex flex-col text-sm">
                  <span className="mb-1 text-sky-900">Mood (optional)</span>
                  <input
                    type="text"
                    name="mood"
                    placeholder="e.g. happy, focused, tired"
                    className="rounded-md border border-sky-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </label>
              </div>
              <label className="flex flex-col text-sm">
                <span className="mb-1 text-sky-900">What happened?</span>
                <textarea
                  name="content"
                  required
                  rows={7}
                  className="resize-y rounded-md border border-sky-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Write your activities, thoughts, or notes..."
                />
              </label>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-sky-600 px-4 py-2 text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
