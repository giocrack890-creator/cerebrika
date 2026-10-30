import { ResultScreen } from "@/components/landing/result";
import { site } from "@/content/site";

export default function FailurePage() {
  return <ResultScreen title={site.payments.errorTitle} body={site.payments.errorBody} />;
}
