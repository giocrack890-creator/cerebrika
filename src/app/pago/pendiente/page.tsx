import { ResultScreen } from "@/components/landing/result";
import { site } from "@/content/site";

export default function PendingPage() {
  return <ResultScreen title={site.payments.pendingTitle} body={site.payments.pendingBody} />;
}
