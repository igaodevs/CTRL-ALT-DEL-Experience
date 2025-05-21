// Sound controller for managing audio effects throughout the experience

type SoundType =
  | "glitch"
  | "click"
  | "hover"
  | "transition"
  | "error"
  | "success"
  | "ambient";

class SoundController {
  private audioContext: AudioContext | null = null;
  private sounds: Record<string, AudioBuffer> = {};
  private isMuted: boolean = false;
  private isLoaded: boolean = false;
  private loadPromise: Promise<void> | null = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      window.AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContext();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser", e);
    }
  }

  public async loadSounds() {
    if (this.isLoaded || this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise(async (resolve) => {
      try {
        const soundFiles = {
          glitch: "/sounds/glitch.mp3",
          click: "/sounds/click.mp3",
          hover: "/sounds/hover.mp3",
          transition: "/sounds/transition.mp3",
          error: "/sounds/error.mp3",
          success: "/sounds/success.mp3",
          ambient: "/sounds/ambient.mp3",
        };

        // Create placeholder sounds if real ones aren't available
        for (const [name, path] of Object.entries(soundFiles)) {
          this.sounds[name] = await this.createPlaceholderSound(
            name as SoundType,
          );
        }

        this.isLoaded = true;
        resolve();
      } catch (error) {
        console.error("Failed to load sounds:", error);
        resolve();
      }
    });

    return this.loadPromise;
  }

  private async createPlaceholderSound(type: SoundType): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error("AudioContext not initialized");

    const sampleRate = this.audioContext.sampleRate;
    const duration = type === "ambient" ? 3.0 : 0.5; // seconds
    const buffer = this.audioContext.createBuffer(
      2,
      sampleRate * duration,
      sampleRate,
    );

    // Fill the buffer with different sounds based on type
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);

      switch (type) {
        case "glitch":
          for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
            if (i % 1000 < 50) data[i] = 0; // Create gaps
          }
          break;

        case "click":
          for (let i = 0; i < data.length; i++) {
            data[i] = i < data.length / 10 ? Math.random() * 0.5 : 0;
          }
          break;

        case "hover":
          for (let i = 0; i < data.length; i++) {
            data[i] = Math.sin(i * 0.01) * 0.2;
          }
          break;

        case "transition":
          for (let i = 0; i < data.length; i++) {
            const t = i / data.length;
            data[i] = Math.sin(i * 0.1) * (1 - t) * 0.5;
          }
          break;

        case "error":
          for (let i = 0; i < data.length; i++) {
            data[i] = Math.sin(i * 0.2) * Math.sin(i * 0.1) * 0.5;
          }
          break;

        case "success":
          for (let i = 0; i < data.length; i++) {
            const t = i / data.length;
            data[i] = Math.sin(i * 0.05) * t * 0.5;
          }
          break;

        case "ambient":
          for (let i = 0; i < data.length; i++) {
            data[i] = (Math.sin(i * 0.01) + Math.sin(i * 0.023)) * 0.1;
          }
          break;
      }
    }

    return buffer;
  }

  public play(
    type: SoundType,
    options: { volume?: number; loop?: boolean } = {},
  ) {
    if (!this.audioContext || this.isMuted || !this.sounds[type]) return;

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = this.sounds[type];
      source.loop = options.loop || false;

      gainNode.gain.value = options.volume || 0.5;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start(0);

      return {
        stop: () => {
          try {
            source.stop();
          } catch (e) {
            // Ignore errors when stopping
          }
        },
      };
    } catch (e) {
      console.error("Error playing sound:", e);
      return { stop: () => {} };
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public setMute(mute: boolean) {
    this.isMuted = mute;
  }

  public isSoundMuted() {
    return this.isMuted;
  }
}

// Create a singleton instance
export const soundController = new SoundController();
