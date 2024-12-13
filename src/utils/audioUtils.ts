import { Howl } from 'howler';

// Create Howl instances for our sounds
const turnSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
  volume: 0.3,
  preload: true
});

const drawSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/1530/1530-preview.mp3'],
  volume: 0.3,
  preload: true
});

const playCardSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3'],
  volume: 0.2,
  preload: true
});

export const playTurnSound = () => {
  turnSound.play();
};

export const playDrawSound = () => {
  drawSound.play();
};

export const playCardPlaySound = () => {
  playCardSound.play();
};