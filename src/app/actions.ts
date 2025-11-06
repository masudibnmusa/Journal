"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addEntry(formData: FormData) {
  const content = String(formData.get("content") ?? "").trim();
  const moodRaw = formData.get("mood");
  const mood = moodRaw ? String(moodRaw).trim() : null;
  const dateRaw = formData.get("date");
  const date = dateRaw ? new Date(String(dateRaw)) : new Date();

  if (!content) return { error: "Content is required" } as const;

  await prisma.entry.create({
    data: {
      content,
      mood: mood && mood.length > 0 ? mood : null,
      date,
    },
  });

  revalidatePath("/");
  return { ok: true } as const;
}

export async function deleteEntry(id: number) {
  await prisma.entry.delete({ where: { id } });
  revalidatePath("/");
}
