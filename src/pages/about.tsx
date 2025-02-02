import { PageLayout } from "@/components/layout/page-layout";
import { AnimatedText } from "@/components/animated-text";

export default function AboutPage() {
  return (
    <PageLayout fullWidth>
      <section className="py-24">
        <AnimatedText text="About Sudeep" className="text-4xl font-bold mb-8" />
        <div className="prose dark:prose-invert max-w-none">
          <p>About page content goes here...</p>
        </div>
      </section>
    </PageLayout>
  );
}
