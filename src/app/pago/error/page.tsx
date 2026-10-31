import { ResultScreen } from "@/components/landing/result";
import { RetryPaymentLink } from "@/components/store/cart-provider";
import { FLAGSHIP_SLUG } from "@/content/products";
import { site } from "@/content/site";

export default function FailurePage() {
  return (
    <ResultScreen
      title={site.payments.errorTitle}
      body={site.payments.errorBody}
      action={<RetryPaymentLink label={site.payments.retry} fallbackHref={`/productos/${FLAGSHIP_SLUG}`} />}
    />
  );
}
