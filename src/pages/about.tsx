import { PageLayout } from "@/components/layout/page-layout";

export default function AboutPage() {
  return (
    <PageLayout fullWidth>
      <section className="py-24">
        <h1 className="text-4xl font-bold mb-8">About Sudeep</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>About page content goes here...</p>
        </div>
      </section>
    </PageLayout>
  );
}
