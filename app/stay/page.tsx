import "./stay.css";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { listProperties, getProperty } from "@/lib/db";
import { StayPage } from "./StayPage";

export const revalidate = 60;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; lang?: string }>;
}) {
  const { id } = await searchParams;
  const all = await listProperties();
  const property = id ? await getProperty(id) : all[0] ?? null;
  if (!property) return notFound();
  const similar = all.filter((p) => p.id !== property.id).slice(0, 3);

  return (
    <Suspense fallback={null}>
      <StayPage property={property} similar={similar} />
    </Suspense>
  );
}
