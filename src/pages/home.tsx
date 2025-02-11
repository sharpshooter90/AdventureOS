import { PageLayout } from "../components/layout/page-layout";
import {
  WindowManagerProvider,
  useWindowManager,
} from "@/components/window/window-manager";
import { DesktopIcon } from "@/components/desktop/desktop-icon";
import { Content } from "@/components/content/about-content";

function Desktop() {
  const { dispatch } = useWindowManager();

  const handleOpenAboutMe = () => {
    dispatch({
      type: "OPEN_WINDOW",
      payload: {
        id: "about-me",
        title: "About.md",
        content: <Content />,
      },
    });
  };

  return (
    <div className="min-h-screen p-8 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 content-start">
      <DesktopIcon
        icon="📄"
        label="About.md"
        onDoubleClick={handleOpenAboutMe}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <WindowManagerProvider>
      <PageLayout>
        <Desktop />
      </PageLayout>
    </WindowManagerProvider>
  );
}
