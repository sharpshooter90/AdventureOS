import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { useState, useEffect } from "react";

interface ColorToken {
  name: string;
  value: string;
  description: string;
  category: string;
}

interface AnimationConfig {
  name: string;
  duration: string;
  easing: string;
  description: string;
}

interface SoundMapping {
  event: string;
  soundFile: string;
  volume: number;
}

export function DevTools() {
  const [colorTokens, setColorTokens] = useState<ColorToken[]>([]);
  const [animations, setAnimations] = useState<AnimationConfig[]>([]);
  const [soundMappings, setSoundMappings] = useState<SoundMapping[]>([]);
  const [showFPS, setShowFPS] = useState(false);
  const [localStorage, setLocalStorage] = useState<Record<string, string>>({});

  useEffect(() => {
    loadColorTokens();
    loadAnimations();
    loadSoundMappings();
    loadLocalStorage();
  }, []);

  const loadColorTokens = () => {
    const tokens: ColorToken[] = [
      {
        name: "--color-primary",
        value: getComputedStyle(document.documentElement)
          .getPropertyValue("--color-primary")
          .trim(),
        description: "Primary theme color",
        category: "Base Colors",
      },
      {
        name: "--color-secondary",
        value: getComputedStyle(document.documentElement)
          .getPropertyValue("--color-secondary")
          .trim(),
        description: "Secondary theme color",
        category: "Base Colors",
      },
      {
        name: "--desktop-bg",
        value: getComputedStyle(document.documentElement)
          .getPropertyValue("--desktop-bg")
          .trim(),
        description: "Desktop background color",
        category: "Desktop",
      },
      {
        name: "--desktop-icon-selected",
        value: getComputedStyle(document.documentElement)
          .getPropertyValue("--desktop-icon-selected")
          .trim(),
        description: "Selected icon background",
        category: "Desktop",
      },
      {
        name: "--desktop-selection-border",
        value: getComputedStyle(document.documentElement)
          .getPropertyValue("--desktop-selection-border")
          .trim(),
        description: "Selection box border color",
        category: "Desktop",
      },
      {
        name: "--desktop-selection-bg",
        value: getComputedStyle(document.documentElement)
          .getPropertyValue("--desktop-selection-bg")
          .trim(),
        description: "Selection box background",
        category: "Desktop",
      },
      // Add more color tokens as needed
    ];

    setColorTokens(tokens);
  };

  const handleColorChange = (tokenName: string, newValue: string) => {
    document.documentElement.style.setProperty(tokenName, newValue);
    setColorTokens((prev) =>
      prev.map((token) =>
        token.name === tokenName ? { ...token, value: newValue } : token
      )
    );
  };

  const resetColors = () => {
    const styleSheet = Array.from(document.styleSheets).find((sheet) =>
      sheet.href?.includes("tokens.css")
    );

    if (styleSheet) {
      try {
        const rootRule = Array.from(styleSheet.cssRules).find(
          (rule) =>
            rule instanceof CSSStyleRule && rule.selectorText === ":root"
        ) as CSSStyleRule;

        if (rootRule) {
          const originalStyle = rootRule.style;
          colorTokens.forEach((token) => {
            const originalValue = originalStyle.getPropertyValue(token.name);
            if (originalValue) {
              document.documentElement.style.setProperty(
                token.name,
                originalValue
              );
            }
          });
          loadColorTokens(); // Reload the current values
        }
      } catch (error) {
        console.error("Error resetting colors:", error);
      }
    }
  };

  const loadAnimations = () => {
    // TODO: Load animation configurations
    setAnimations([
      {
        name: "window-open",
        duration: "300ms",
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        description: "Window opening animation",
      },
      // Add more animations
    ]);
  };

  const loadSoundMappings = () => {
    // TODO: Load sound mappings
    setSoundMappings([
      { event: "window-open", soundFile: "/sounds/open.mp3", volume: 0.5 },
      // Add more sound mappings
    ]);
  };

  const loadLocalStorage = () => {
    const items: Record<string, string> = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        items[key] = window.localStorage.getItem(key) || "";
      }
    }
    setLocalStorage(items);
  };

  const toggleFPS = () => {
    setShowFPS(!showFPS);
    // TODO: Implement FPS counter toggle
  };

  return (
    <div className="p-4 h-full">
      <Tabs defaultValue="colors" className="h-full">
        <TabsList className="grid w-full grid-cols-6 mb-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="animations">Animations</TabsTrigger>
          <TabsTrigger value="sounds">Sounds</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

        <TabsContent
          value="colors"
          className="h-[calc(100%-60px)] overflow-auto"
        >
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Color Tokens</h3>
              <Button onClick={resetColors} variant="outline">
                Reset Colors
              </Button>
            </div>
            <div className="space-y-6">
              {Array.from(
                new Set(colorTokens.map((token) => token.category))
              ).map((category) => (
                <div key={category} className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-500">
                    {category}
                  </h4>
                  {colorTokens
                    .filter((token) => token.category === category)
                    .map((token) => (
                      <div key={token.name} className="flex items-center gap-4">
                        <Label className="w-48 text-sm">{token.name}</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={token.value}
                            onChange={(e) =>
                              handleColorChange(token.name, e.target.value)
                            }
                            className="w-16 h-8"
                          />
                          <Input
                            type="text"
                            value={token.value}
                            onChange={(e) =>
                              handleColorChange(token.name, e.target.value)
                            }
                            className="w-24 text-sm"
                          />
                        </div>
                        <span className="text-sm text-gray-500">
                          {token.description}
                        </span>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent
          value="animations"
          className="h-[calc(100%-60px)] overflow-auto"
        >
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              Animation Configurations
            </h3>
            <div className="space-y-4">
              {animations.map((anim) => (
                <div key={anim.name} className="space-y-2">
                  <Label>{anim.name}</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={anim.duration}
                      onChange={(e) => {
                        // TODO: Implement duration change handler
                      }}
                    />
                    <Input
                      value={anim.easing}
                      onChange={(e) => {
                        // TODO: Implement easing change handler
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent
          value="sounds"
          className="h-[calc(100%-60px)] overflow-auto"
        >
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Sound Mappings</h3>
            <div className="space-y-4">
              {soundMappings.map((sound) => (
                <div key={sound.event} className="grid grid-cols-3 gap-4">
                  <Label>{sound.event}</Label>
                  <Input value={sound.soundFile} readOnly />
                  <Input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={sound.volume}
                    onChange={(e) => {
                      // TODO: Implement volume change handler
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent
          value="components"
          className="h-[calc(100%-60px)] overflow-auto"
        >
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Component Analysis</h3>
            {/* TODO: Implement component tree visualization */}
          </Card>
        </TabsContent>

        <TabsContent
          value="performance"
          className="h-[calc(100%-60px)] overflow-auto"
        >
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              Performance Monitoring
            </h3>
            <Button onClick={toggleFPS}>
              {showFPS ? "Hide FPS Counter" : "Show FPS Counter"}
            </Button>
          </Card>
        </TabsContent>

        <TabsContent
          value="storage"
          className="h-[calc(100%-60px)] overflow-auto"
        >
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">LocalStorage Manager</h3>
            <div className="space-y-4">
              {Object.entries(localStorage).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-4">
                  <Label>{key}</Label>
                  <Input
                    value={value}
                    onChange={(e) => {
                      // TODO: Implement localStorage value change handler
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
