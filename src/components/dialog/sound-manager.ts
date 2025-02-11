class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};

  constructor() {
    const soundFiles = ["select", "error"];
    soundFiles.forEach((sound) => {
      this.sounds[sound] = new Audio(`/sounds/${sound}.mp3`);
      this.sounds[sound].volume = 0.3;
    });

    this.sounds["defaultClick"] = new Audio(
      "https://sounds.pond5.com/button-click-subtle-sound-effect-010766096_nw_prev.m4a"
    );
    this.sounds["actionClick"] = new Audio(
      "https://sounds.pond5.com/8-bit-video-game-8-sound-effect-245305134_nw_prev.m4a"
    );
    this.sounds["hover"] = new Audio(
      "https://sounds.pond5.com/8-bit-ui-hover-sound-effect-193217987_nw_prev.m4a"
    );
    this.sounds["confirm"] = new Audio(
      "https://sounds.pond5.com/ui-user-interface-swipe-gesture-sound-effect-116409548_nw_prev.m4a"
    );
    this.sounds["success"] = new Audio(
      "https://sounds.pond5.com/warm-notification-accomplished-sound-effect-058788345_nw_prev.m4a"
    );

    // Set volume for all sounds
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = 0.3;
    });
    this.sounds["hover"].volume = 0.2;
    this.sounds["success"].volume = 0.4;
  }

  play(sound: string) {
    const audio = this.sounds[sound];
    if (audio) {
      audio.currentTime = 0;
      console.log(`Playing sound: ${sound}`);
      audio.play().catch((e) => {
        console.error(`Error playing sound ${sound}:`, e);
      });
    } else {
      console.warn(`Sound not found: ${sound}`);
    }
  }
}

export const soundManager = new SoundManager();
