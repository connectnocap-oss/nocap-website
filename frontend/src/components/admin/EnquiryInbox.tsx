import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { fetchEnquiries } from "@/lib/content";
import { Section } from "./fields";
import { Button } from "@/components/ui/button";

export default function EnquiryInbox() {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["enquiries"],
    queryFn: fetchEnquiries,
    retry: 1,
  });

  return (
    <Section title={`Enquiry inbox${data ? ` (${data.length})` : ""}`}>
      <div data-testid="enquiry-inbox">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-[#57534E]">
            Every brief from the footer form, newest first. You also get each one by email.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            data-testid="inbox-refresh-button"
          >
            <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} /> Refresh
          </Button>
        </div>
        {!data?.length ? (
          <p className="rounded-2xl bg-[#F3EFE6] p-5 text-sm text-[#57534E]" data-testid="inbox-empty">
            No briefs yet. They'll land here the moment someone hits "Send the brief".
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((q) => (
              <div key={q.id} className="rounded-2xl border border-[#E7E2D8] p-4" data-testid={`enquiry-${q.id}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-heading font-bold tracking-tight">
                    {q.name}
                    {q.brand ? <span className="font-normal text-[#57534E]"> · {q.brand}</span> : null}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.1em] text-[#57534E] uppercase">
                    {new Date(q.created_at).toLocaleString()}
                  </p>
                </div>
                <a
                  href={`mailto:${q.email}`}
                  className="text-sm text-[#143D2B] underline-offset-2 hover:underline"
                >
                  {q.email}
                </a>
                <p className="mt-2 text-sm leading-relaxed text-[#44403C]">{q.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
