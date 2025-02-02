import { PageLayout } from "@/components/layout/page-layout";
import { AnimatedText } from "@/components/animated-text";

export default function WorkPage() {
  return (
    <PageLayout fullWidth>
      <section className="py-24">
        <AnimatedText text="Work" className="font-serif text-3xl mb-8" />
        <p className="font-sans">Here's what I've been working on.</p>
        <div className="prose dark:prose-invert max-w-none">
          <p>Work page content goes here...</p>
        </div>
      </section>
    </PageLayout>
  );
}
