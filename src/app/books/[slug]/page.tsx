import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

/** /books/[slug] was renamed to the Products storefront. */
export default async function BookRedirectPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/products/${slug}`);
}
