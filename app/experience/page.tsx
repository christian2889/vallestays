import "../stay/stay.css";
import "./experience.css";
import { Suspense } from "react";
import { ExperiencePage } from "./ExperiencePage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ExperiencePage />
    </Suspense>
  );
}
