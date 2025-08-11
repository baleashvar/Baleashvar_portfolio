class AudioManager {
  constructor() {
    this.currentAudio = null
    this.audioCache = new Map()
  }

  async loadAudio(url, loop = true) {
    if (this.audioCache.has(url)) {
      return this.audioCache.get(url)
    }

    const audio = new Audio(url)
    audio.loop = loop
    audio.volume = 0.3
    this.audioCache.set(url, audio)
    return audio
  }

  async playAmbient(url) {
    try {
      if (this.currentAudio) {
        this.currentAudio.pause()
        this.currentAudio.currentTime = 0
      }

      const audio = await this.loadAudio(url)
      this.currentAudio = audio
      await audio.play()
    } catch (error) {
      console.log('Audio play failed:', error)
    }
  }

  stopCurrent() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
    }
  }

  setVolume(volume) {
    if (this.currentAudio) {
      this.currentAudio.volume = Math.max(0, Math.min(1, volume))
    }
  }
}

export const audioManager = new AudioManager()