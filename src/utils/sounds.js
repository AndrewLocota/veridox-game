// Create and cache audio elements
const tickSound = new Audio("/sounds/tick.mp3");
tickSound.volume = 0.5; // Set volume to 50%

export const playTickSound = () => {
  // Reset the sound to start and play
  tickSound.currentTime = 0;
  const playPromise = tickSound.play();

  // Handle play() promise to avoid errors
  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.log("Audio play failed:", error);
    });
  }
};
