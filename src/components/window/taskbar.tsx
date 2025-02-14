import { useWindowManager } from "./window-manager";
import { soundManager } from "../dialog/sound-manager";
import { UserBar } from "../multiplayer/components/UserBar";

export function Taskbar() {
  const { state, dispatch } = useWindowManager();

  const handleWindowClick = (id: string) => {
    const window = state.windows[id];
    if (window.isMinimized) {
      dispatch({ type: "RESTORE_WINDOW", payload: { id } });
    }
    dispatch({ type: "FOCUS_WINDOW", payload: { id } });
    soundManager.play("actionClick");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-[#000080] border-t-2 border-white flex items-center px-2 gap-2">
      {Object.values(state.windows).map((window) => (
        <button
          key={window.id}
          className={`px-4 py-1 min-w-[120px] text-left text-white text-sm truncate
            ${window.isMinimized ? "bg-[#000060]" : "bg-[#4040c0]"}
            ${state.activeWindowId === window.id ? "border-2 border-white" : ""}
            hover:bg-[#4040c0] transition-colors`}
          onClick={() => handleWindowClick(window.id)}
        >
          {window.title}
        </button>
      ))}
      <div className="ml-auto">
        <UserBar />
      </div>
    </div>
  );
}
