"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { candidateApi } from "@/lib/api";
import { PageHeader, EmptyState } from "@/components/ui-kit";
import { toast } from "sonner";

export default function AttemptPage() {
  const { id } = useParams<{ id: string }>(); const router = useRouter(); const [answers, setAnswers] = useState<Record<string, string>>({});
  const query = useQuery({ queryKey: ["attempt", id], queryFn: () => candidateApi.attempt(id) });
  const submit = useMutation({ mutationFn: () => candidateApi.submit(id, Object.entries(answers).map(([assessmentItemId, answer]) => ({ assessmentItemId, answer }))), onSuccess: () => { toast.success("Attempt submitted"); router.push("/dashboard/assessments"); }, onError: () => toast.error("Please answer every question before submitting") });
  const items = query.data?.assessment?.items ?? [];
  return <main className="p-5 sm:p-10"><PageHeader eyebrow="Candidate assessment" title={query.data?.assessment?.title ?? "Attempt"} description="Answer each question carefully. Your submission is final." />{query.data?.status === "EVALUATED" || query.data?.status === "SUBMITTED" ? <EmptyState title="Attempt submitted" message={`Current status: ${query.data.status}.`} /> : <div className="max-w-3xl space-y-5">{items.map((item) => <section className="rounded-2xl border bg-white p-6" key={item.id}><h2 className="font-black">{item.order}. {item.question}</h2>{item.type === "MCQ" ? <div className="mt-5 grid gap-2">{item.options.map((option) => <label className="flex cursor-pointer gap-3 rounded-xl border p-3 text-sm" key={option}><input type="radio" name={item.id} checked={answers[item.id] === option} onChange={() => setAnswers((current) => ({ ...current, [item.id]: option }))} />{option}</label>)}</div> : <textarea value={answers[item.id] ?? ""} onChange={(e) => setAnswers((current) => ({ ...current, [item.id]: e.target.value }))} className="mt-5 min-h-32 w-full rounded-xl border p-3" placeholder="Write your answer" />}</section>)}<button disabled={submit.isPending || items.length === 0} onClick={() => submit.mutate()} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white">Submit attempt</button></div>}</main>;
}
