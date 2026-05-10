import "./confirmed.css";
import { Suspense } from "react";
import { ConfirmedPage } from "./ConfirmedPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ConfirmedPage />
    </Suspense>
  );
}
