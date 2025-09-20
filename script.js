// Image Comparison Slider
class ImageSlider {
  constructor() {
    this.sliderThumb = document.getElementById("sliderThumb");
    this.sliderTrack = document.querySelector(".slider-track");
    this.photo1 = document.getElementById("photo1");
    this.photo2 = document.getElementById("photo2");

    this.isDragging = false;
    this.currentPosition = 0; // 0 = photo1, 1 = photo2

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateSlider(0);
  }

  setupEventListeners() {
    // Mouse events
    this.sliderThumb.addEventListener("mousedown", (e) => this.startDrag(e));
    this.sliderTrack.addEventListener("click", (e) => this.handleTrackClick(e));

    // Touch events
    this.sliderThumb.addEventListener("touchstart", (e) => this.startDrag(e));
    this.sliderTrack.addEventListener("touchstart", (e) =>
      this.handleTrackClick(e)
    );

    // Global events
    document.addEventListener("mousemove", (e) => this.drag(e));
    document.addEventListener("mouseup", () => this.endDrag());
    document.addEventListener("touchmove", (e) => this.drag(e));
    document.addEventListener("touchend", () => this.endDrag());
  }

  startDrag(e) {
    e.preventDefault();
    this.isDragging = true;
    this.sliderThumb.style.cursor = "grabbing";
  }

  endDrag() {
    this.isDragging = false;
    this.sliderThumb.style.cursor = "grab";
  }

  drag(e) {
    if (!this.isDragging) return;

    e.preventDefault();
    const rect = this.sliderTrack.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);

    if (clientX) {
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      this.updateSlider(percentage);
    }
  }

  handleTrackClick(e) {
    const rect = this.sliderTrack.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    this.updateSlider(percentage);
  }

  updateSlider(percentage) {
    this.currentPosition = percentage;

    // Update thumb position
    this.sliderThumb.style.left = `${percentage * 100}%`;

    // Update photo opacity directly for maximum performance
    this.photo1.style.opacity = 1 - this.currentPosition;
    this.photo2.style.opacity = this.currentPosition;
  }
}

// Initialize the slider when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ImageSlider();

  // Ensure video plays on mobile
  const video = document.querySelector(".video-background");
  if (video) {
    // Try to play the video
    const playVideo = () => {
      video.play().catch((e) => {
        console.log("Video autoplay failed:", e);
        // If autoplay fails, try again on user interaction
        document.addEventListener("touchstart", playVideo, { once: true });
        document.addEventListener("click", playVideo, { once: true });
      });
    };

    playVideo();

    // Ensure video plays when page becomes visible (mobile browsers pause videos when tab is not active)
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && video.paused) {
        video.play().catch((e) => console.log("Video resume failed:", e));
      }
    });
  }
});
