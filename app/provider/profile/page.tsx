"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { recruiterApi } from "@/lib/api";
import { PageHeader } from "@/components/ui-kit";
import { toast } from "sonner";

const schema = z.object({ companyName: z.string().max(200), companyDescription: z.string().max(5000), companyWebsite: z.string().url().or(z.literal("")) });
export default function RecruiterProfilePage() {
  const query = useQuery({ queryKey: ["recruiter-profile"], queryFn: recruiterApi.profile });
  const save = useMutation({ mutationFn: recruiterApi.update, onSuccess: () => toast.success("Company profile saved"), onError: () => toast.error("Could not save company profile") });
  const form = useForm({ defaultValues: { companyName: "", companyDescription: "", companyWebsite: "" }, onSubmit: async ({ value }) => { const parsed = schema.safeParse(value); if (!parsed.success) return toast.error(parsed.error.issues[0]?.message); await save.mutateAsync(parsed.data); } });
  return <main className="p-5 sm:p-10"><PageHeader eyebrow="Workspace settings" title="Company profile" description="This profile is shown to candidates evaluating your assessments." /><div className="max-w-2xl rounded-2xl border bg-white p-6"><p className="mb-6 text-sm text-slate-500">{query.data?.companyLogoUrl ? "Company logo uploaded" : "Add your company details to build trust with candidates."}</p><form className="space-y-5" onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }}>{(["companyName", "companyWebsite"] as const).map((name) => <form.Field name={name} key={name}>{(field) => <label className="block text-sm font-bold">{name === "companyName" ? "Company name" : "Website"}<input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" /></label>}</form.Field>)}<form.Field name="companyDescription">{(field) => <label className="block text-sm font-bold">Description<textarea value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="mt-2 min-h-32 w-full rounded-xl border px-4 py-3" /></label>}</form.Field><button disabled={save.isPending} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white">Save profile</button></form></div></main>;
}
