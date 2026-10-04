"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { problemApi } from "@/lib/api";
import { EmptyState, PageHeader } from "@/components/ui-kit";
import { toast } from "sonner";

export default function ProblemsPage() {
  const params = useSearchParams(); const router = useRouter(); const client = useQueryClient();
  const search = params.get("search") ?? ""; const type = params.get("type") ?? "";
  const query = useQuery({ queryKey: ["problems", search, type], queryFn: () => problemApi.list({ page: Number(params.get("page") ?? 1), limit: 30, ...(search && { search }), ...(type && { type }) }) });
  const remove = useMutation({ mutationFn: problemApi.remove, onSuccess: () => { toast.success("Problem deleted"); void client.invalidateQueries({ queryKey: ["problems"] }); } });
  const set = (key: string, value: string) => { const next = new URLSearchParams(params); value ? next.set(key, value) : next.delete(key); router.replace(`/provider/problems?${next}`); };
  return <main className="p-5 sm:p-10"><PageHeader eyebrow="Authoring" title="Problem library" description="Create and maintain reusable questions for your assessments." action={<button onClick={() => toast.info("Use the backend-authoring workflow to add a problem.")} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">New problem</button>} />
    <div className="mb-6 flex flex-wrap gap-3"><input value={search} onChange={(e) => set("search", e.target.value)} className="rounded-xl border bg-white px-4 py-3" placeholder="Search questions" /><select value={type} onChange={(e) => set("type", e.target.value)} className="rounded-xl border bg-white px-4 py-3"><option value="">All types</option><option value="MCQ">Multiple choice</option><option value="WRITTEN">Written</option></select></div>
    {query.data?.problems?.length ? <div className="grid gap-4 md:grid-cols-2">{query.data.problems.map((problem) => <article className="rounded-2xl border bg-white p-5" key={problem.id}><div className="flex justify-between gap-4"><h2 className="font-black">{problem.title}</h2><span className="text-xs font-bold text-indigo-600">{problem.type}</span></div><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{problem.question}</p><div className="mt-5 flex items-center justify-between text-xs text-slate-400"><span>{problem.points} points</span><button onClick={() => remove.mutate(problem.id)} className="font-bold text-rose-600">Delete</button></div></article>)}</div> : <EmptyState title="Your library is empty" message="Create a problem to reuse it across multiple assessments." />}
  </main>;
}
