"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { EmptyState, PageHeader } from "@/components/ui-kit";
import { toast } from "sonner";

export default function ApplicationsPage() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["recruiter-applications"], queryFn: () => adminApi.recruiterApplications({ page: 1, limit: 50 }) });
  const approve = useMutation({ mutationFn: adminApi.approveRecruiter, onSuccess: () => { toast.success("Recruiter approved"); void client.invalidateQueries({ queryKey: ["recruiter-applications"] }); }, onError: () => toast.error("Could not approve application") });
  const users = query.data?.users ?? [];
  return <main className="p-5 sm:p-10"><PageHeader eyebrow="Admin review" title="Recruiter applications" description="Approve verified teams before they can publish assessments." />
    {users.length === 0 ? <EmptyState title="Inbox is clear" message="There are no pending recruiter applications." /> : <div className="grid gap-4">{users.map((user) => <article className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-5" key={user.id}><div><h2 className="font-black">{user.name}</h2><p className="text-sm text-slate-500">{user.email}</p></div><button disabled={approve.isPending} onClick={() => approve.mutate(user.id)} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white">Approve application</button></article>)}</div>}
  </main>;
}
