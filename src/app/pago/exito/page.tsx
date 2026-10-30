import { ResultScreen } from "@/components/landing/result";
import { site } from "@/content/site";

export default function SuccessPage() {
  return <ResultScreen title={site.payments.successTitle} body={site.payments.successBody} />;
}
