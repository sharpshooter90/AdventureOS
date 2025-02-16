export type TileLayout = "vertical" | "horizontal" | "grid" | "masterDetail";

interface TileConfig {
  padding: number;
  masterRatio?: number; // For master-detail layout, ratio of master pane (0-1)
  minWindowSize?: { width: number; height: number };
}

const DEFAULT_CONFIG: TileConfig = {
  padding: 10,
  masterRatio: 0.6,
  minWindowSize: { width: 200, height: 150 },
};

export interface TileRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class TileManager {
  private config: TileConfig;

  constructor(config: Partial<TileConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  calculateLayout(
    windows: string[],
    layout: TileLayout,
    viewportWidth: number,
    viewportHeight: number,
    taskbarHeight: number = 40,
    resizedWindow?: {
      id: string;
      rect: TileRect;
      resizeEdge?: "left" | "right" | "top" | "bottom";
    }
  ): Record<string, TileRect> {
    const availableHeight = viewportHeight - taskbarHeight;
    const positions: Record<string, TileRect> = {};

    if (resizedWindow) {
      return this.calculateAdaptiveLayout(
        windows,
        layout,
        viewportWidth,
        availableHeight,
        resizedWindow
      );
    }

    switch (layout) {
      case "vertical":
        this.calculateVerticalLayout(
          windows,
          viewportWidth,
          availableHeight,
          positions
        );
        break;
      case "horizontal":
        this.calculateHorizontalLayout(
          windows,
          viewportWidth,
          availableHeight,
          positions
        );
        break;
      case "grid":
        this.calculateGridLayout(
          windows,
          viewportWidth,
          availableHeight,
          positions
        );
        break;
      case "masterDetail":
        this.calculateMasterDetailLayout(
          windows,
          viewportWidth,
          availableHeight,
          positions
        );
        break;
    }

    return positions;
  }

  private findAdjacentWindow(
    windows: string[],
    layout: TileLayout,
    resizedWindow: { id: string; rect: TileRect; resizeEdge?: string },
    positions: Record<string, TileRect>
  ): string | null {
    const resizedRect = resizedWindow.rect;
    const edge = resizedWindow.resizeEdge;

    switch (layout) {
      case "horizontal": {
        if (edge === "right") {
          return (
            windows.find(
              (id) =>
                id !== resizedWindow.id &&
                Math.abs(
                  positions[id]?.x - (resizedRect.x + resizedRect.width)
                ) < this.config.padding
            ) || null
          );
        }
        if (edge === "left") {
          return (
            windows.find(
              (id) =>
                id !== resizedWindow.id &&
                Math.abs(
                  positions[id]?.x + positions[id]?.width - resizedRect.x
                ) < this.config.padding
            ) || null
          );
        }
        break;
      }
      case "vertical": {
        if (edge === "bottom") {
          return (
            windows.find(
              (id) =>
                id !== resizedWindow.id &&
                Math.abs(
                  positions[id]?.y - (resizedRect.y + resizedRect.height)
                ) < this.config.padding
            ) || null
          );
        }
        if (edge === "top") {
          return (
            windows.find(
              (id) =>
                id !== resizedWindow.id &&
                Math.abs(
                  positions[id]?.y + positions[id]?.height - resizedRect.y
                ) < this.config.padding
            ) || null
          );
        }
        break;
      }
    }
    return null;
  }

  private calculateAdaptiveLayout(
    windows: string[],
    layout: TileLayout,
    width: number,
    height: number,
    resizedWindow: {
      id: string;
      rect: TileRect;
      resizeEdge?: "left" | "right" | "top" | "bottom";
    }
  ): Record<string, TileRect> {
    const positions: Record<string, TileRect> = {};
    const padding = this.config.padding;

    // Create a stable copy of windows (array of ids) and sort them alphabetically
    let sortedWindows = windows.slice();
    sortedWindows.sort((a, b) => a.localeCompare(b));

    // Ensure the resized (active) window is always at the beginning
    const activeIndex = sortedWindows.indexOf(resizedWindow.id);
    if (activeIndex !== -1) {
      sortedWindows.splice(activeIndex, 1);
    }
    sortedWindows.unshift(resizedWindow.id);

    if (layout === "vertical") {
      const n = sortedWindows.length;
      const H_resized = resizedWindow.rect.height;
      // Calculate remaining height for other windows
      const remainingHeight = height - H_resized - padding * (n - 1);
      const defaultHeight = n > 1 ? remainingHeight / (n - 1) : 0;
      let y = 0;
      sortedWindows.forEach((id) => {
        if (id === resizedWindow.id) {
          positions[id] = { x: 0, y: y, width: width, height: H_resized };
          y += H_resized + padding;
        } else {
          positions[id] = { x: 0, y: y, width: width, height: defaultHeight };
          y += defaultHeight + padding;
        }
      });
      return positions;
    } else if (layout === "horizontal") {
      const n = sortedWindows.length;
      const W_resized = resizedWindow.rect.width;
      const remainingWidth = width - W_resized - padding * (n - 1);
      const defaultWidth = n > 1 ? remainingWidth / (n - 1) : 0;
      let x = 0;
      sortedWindows.forEach((id) => {
        if (id === resizedWindow.id) {
          positions[id] = { x: x, y: 0, width: W_resized, height: height };
          x += W_resized + padding;
        } else {
          positions[id] = { x: x, y: 0, width: defaultWidth, height: height };
          x += defaultWidth + padding;
        }
      });
      return positions;
    } else {
      // For grid and masterDetail, calculate default layout then override the resized window
      switch (layout) {
        case "grid":
          this.calculateGridLayout(sortedWindows, width, height, positions);
          break;
        case "masterDetail":
          this.calculateMasterDetailLayout(
            sortedWindows,
            width,
            height,
            positions
          );
          break;
      }
      positions[resizedWindow.id] = resizedWindow.rect;
      return positions;
    }
  }

  private calculateVerticalLayout(
    windows: string[],
    width: number,
    height: number,
    positions: Record<string, TileRect>
  ) {
    const windowHeight =
      (height - this.config.padding * (windows.length - 1)) / windows.length;

    windows.forEach((windowId, index) => {
      positions[windowId] = {
        x: 0,
        y: index * (windowHeight + this.config.padding),
        width,
        height: windowHeight,
      };
    });
  }

  private calculateHorizontalLayout(
    windows: string[],
    width: number,
    height: number,
    positions: Record<string, TileRect>
  ) {
    const windowWidth =
      (width - this.config.padding * (windows.length - 1)) / windows.length;

    windows.forEach((windowId, index) => {
      positions[windowId] = {
        x: index * (windowWidth + this.config.padding),
        y: 0,
        width: windowWidth,
        height,
      };
    });
  }

  private calculateGridLayout(
    windows: string[],
    width: number,
    height: number,
    positions: Record<string, TileRect>
  ) {
    const cols = Math.ceil(Math.sqrt(windows.length));
    const rows = Math.ceil(windows.length / cols);

    const windowWidth = (width - this.config.padding * (cols - 1)) / cols;
    const windowHeight = (height - this.config.padding * (rows - 1)) / rows;

    windows.forEach((windowId, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      positions[windowId] = {
        x: col * (windowWidth + this.config.padding),
        y: row * (windowHeight + this.config.padding),
        width: windowWidth,
        height: windowHeight,
      };
    });
  }

  private calculateMasterDetailLayout(
    windows: string[],
    width: number,
    height: number,
    positions: Record<string, TileRect>
  ) {
    if (windows.length === 0) return;

    const masterWidth = width * (this.config.masterRatio || 0.6);
    const detailWidth = width - masterWidth - this.config.padding;

    // Position master window
    positions[windows[0]] = {
      x: 0,
      y: 0,
      width: masterWidth,
      height,
    };

    // Position detail windows
    const detailWindows = windows.slice(1);
    if (detailWindows.length > 0) {
      const detailHeight =
        (height - this.config.padding * (detailWindows.length - 1)) /
        detailWindows.length;

      detailWindows.forEach((windowId, index) => {
        positions[windowId] = {
          x: masterWidth + this.config.padding,
          y: index * (detailHeight + this.config.padding),
          width: detailWidth,
          height: detailHeight,
        };
      });
    }
  }
}
