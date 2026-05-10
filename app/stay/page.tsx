import "./stay.css";
import { Suspense } from "react";
import { StayPage } from "./StayPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <StayPage />
    </Suspense>
  );
}
