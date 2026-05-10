import "./checkout.css";
import { Suspense } from "react";
import { CheckoutPage } from "./CheckoutPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CheckoutPage />
    </Suspense>
  );
}
