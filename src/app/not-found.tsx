import Link from "next/link";
import { ResultScreen } from "@/components/landing/result";

export default function NotFound() {
  return (
    <ResultScreen
      title="Esta página no está"
      body="El enlace no coincide con ninguna parte del sitio."
      action={
        <Link href="/catalogo" className="btn btn-primary">
          Ver el catálogo
        </Link>
      }
    />
  );
}
