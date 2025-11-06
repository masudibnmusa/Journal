import { prisma } from "@/lib/prisma";
import { addEntry, deleteEntry } from "./actions";

export default async function Home() {
  const entries = await prisma.entry.findMany({ orderBy: { date: "desc" } });
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="mb-6 text-2xl font-semibold">Daily Journal</h1>

        <form action={addEntry} className="mb-8 space-y-3 rounded-md border p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex flex-col text-sm">
              <span className="mb-1">Date</span>
              <input
                type="date"
                name="date"
                defaultValue={today}
                className="rounded border px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col text-sm sm:col-span-2">
              <span className="mb-1">Mood (optional)</span>
              <input
                type="text"
                name="mood"
                placeholder="e.g. happy, focused, tired"
                className="rounded border px-3 py-2 text-sm"
              />
            </label>
          </div>
          <label className="flex flex-col text-sm">
            <span className="mb-1">What did you do today?</span>
            <textarea
              name="content"
              required
              rows={5}
              className="resize-y rounded border px-3 py-2 text-sm"
              placeholder="Write your activities, thoughts, or notes..."
            />
          </label>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded bg-black px-4 py-2 text-white hover:opacity-90 dark:bg-white dark:text-black"
            >
              Add Entry
            </button>
          </div>
        </form>

        <section className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-sm text-zinc-500">No entries yet. Add your first one above.</p>
          ) : (
            entries.map((e) => (
              <article key={e.id} className="rounded-md border p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-zinc-500">
                  <span>{new Date(e.date).toLocaleDateString()}</span>
                  <form action={async (formData: FormData) => {
                    'use server'
                    const id = Number(formData.get('id'))
                    await deleteEntry(id)
                  }}>
                    <input type="hidden" name="id" value={e.id} />
                    <button className="text-red-600 hover:underline">Delete</button>
                  </form>
                </div>
                {e.mood && (
                  <div className="mb-1 text-xs text-zinc-600">Mood: {e.mood}</div>
                )}
                <p className="whitespace-pre-wrap text-sm leading-6">{e.content}</p>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
