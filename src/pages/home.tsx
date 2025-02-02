import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/page-layout";
import { AnimatedText } from "@/components/animated-text";

export default function HomePage() {
  return (
    <PageLayout fullWidth>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center bg-gradient-to-b from-background to-secondary/20">
        <AnimatedText
          text="Welcome to AdventureOS"
          className="text-4xl sm:text-6xl font-bold tracking-tight font-serif italic"
        />
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
          Your gateway to endless adventures. Create, explore, and share
          interactive stories in a revolutionary operating system designed for
          storytellers.
        </p>
        <div className="flex gap-4 mt-8">
          <Button asChild size="lg">
            <Link to="/get-started">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/docs">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-24">
        <AnimatedText
          text="Why AdventureOS?"
          className="text-3xl font-bold text-center mb-12"
          delay={3}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Interactive Stories"
            description="Create branching narratives with our intuitive story-building tools"
            icon="📖"
          />
          <FeatureCard
            title="Rich Media Support"
            description="Enhance your stories with images, sound, and dynamic elements"
            icon="🎨"
          />
          <FeatureCard
            title="Community Driven"
            description="Share your adventures and explore stories from creators worldwide"
            icon="🌍"
          />
        </div>
      </section>
    </PageLayout>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
