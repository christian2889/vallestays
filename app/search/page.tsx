import "./search.css";
import { Suspense } from "react";
import { listProperties } from "@/lib/db";
import { SearchPage } from "./SearchPage";

export const revalidate = 60;

export default async function Page() {
  const properties = await listProperties();
  return (
    <Suspense fallback={null}>
      <SearchPage properties={properties} />
    </Suspense>
  );
}
