import { prisma } from "@/lib/prisma";
import { addEntry, deleteEntry } from "./actions";

export default async function Home() {
  const entries = await prisma.entry.findMany({ orderBy: { date: "desc" } });
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-zinc-800">
      <main className="mx-auto max-w-3xl p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-sky-800">Speech of Moment</h1>
          <p className="mt-1 text-sm text-sky-700/70">Capture your thoughts and activities in a calm, light-blue space.</p>
        </header>

        <form action={addEntry} className="mb-10 space-y-3 rounded-xl border border-sky-100 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex flex-col text-sm">
              <span className="mb-1 text-sky-900">Date</span>
              <input
                type="date"
                name="date"
                defaultValue={today}
                className="rounded-md border border-sky-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </label>
            <label className="flex flex-col text-sm sm:col-span-2">
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
              rows={6}
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

        <section className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-sm text-sky-900/60">No entries yet. Add your first one above.</p>
          ) : (
            entries.map((e) => (
              <article key={e.id} className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between text-sm text-sky-900/70">
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
        </section>
      </main>
    </div>
  );
}
