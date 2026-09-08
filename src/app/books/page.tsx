import { redirect } from "next/navigation";

/** /books was renamed to the Products storefront. */
export default function BooksRedirectPage() {
  redirect("/products");
}
