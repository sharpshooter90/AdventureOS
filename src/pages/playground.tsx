import { PageLayout } from "@/components/layout/page-layout";

export default function PlaygroundPage() {
  return (
    <PageLayout fullWidth>
      <section className="py-24">
        <h1 className="text-4xl font-bold mb-8">Playground</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>Playground page content goes here...</p>
        </div>
      </section>
    </PageLayout>
  );
}
