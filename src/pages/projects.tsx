import { PageLayout } from "@/components/layout/page-layout";
import { AnimatedText } from "@/components/animated-text";

export default function ProjectsPage() {
  return (
    <PageLayout fullWidth>
      <section className="py-24">
        <AnimatedText text="Projects" className="text-4xl font-bold mb-8" />
        <div className="prose dark:prose-invert max-w-none">
          <p>Projects page content goes here...</p>
        </div>
      </section>
    </PageLayout>
  );
}
