"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { assessmentApi } from "@/lib/api";
import { PageHeader } from "@/components/ui-kit";
import { toast } from "sonner";

const schema = z.string().email("Enter a valid candidate email");
export default function InvitePage() {
  const { id } = useParams<{ id: string }>(); const router = useRouter();
  const assessment = useQuery({ queryKey: ["assessment", id], queryFn: () => assessmentApi.get(id) });
  const invite = useMutation({ mutationFn: (email: string) => assessmentApi.invite(id, email), onSuccess: () => { toast.success("Invitation sent"); router.push(`/provider/assessments/${id}`); }, onError: () => toast.error("Could not send invitation") });
  const form = useForm({ defaultValues: { email: "" }, onSubmit: async ({ value }) => { const parsed = schema.safeParse(value.email); if (!parsed.success) return toast.error(parsed.error.issues[0]?.message); await invite.mutateAsync(parsed.data); } });
  return <main className="p-5 sm:p-10"><PageHeader eyebrow="Candidate access" title="Invite a candidate" description={`Send an invitation for ${assessment.data?.title ?? "this assessment"}.`} /><div className="max-w-xl rounded-2xl border bg-white p-6"><form onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }} className="space-y-5"><form.Field name="email">{(field) => <label className="block text-sm font-bold">Candidate email<input type="email" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" placeholder="candidate@company.com" /></label>}</form.Field><button disabled={invite.isPending} className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white">{invite.isPending ? "Sending…" : "Send invitation"}</button></form></div></main>;
}
