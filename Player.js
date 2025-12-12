

export default class Player {
  WALK_ANIMATION_TIMER = 200;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  dinoRunImages = [];

  jumpPressed = false;
  jumpInProgress = false;
  falling = false;
  JUMP_SPEED = 0.6;
  GRAVITY = 0.4;

  constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.minJumpHeight = minJumpHeight;
    this.maxJumpHeight = maxJumpHeight;
    this.scaleRatio = scaleRatio;

    this.x = 10 * scaleRatio;
    this.y = this.canvas.height - this.height - 1.5 * scaleRatio;
    this.yStandingPosition = this.y;

    this.standingStillImage = new Image();
    this.standingStillImage.src = "images/standing_still.png";
    this.image = this.standingStillImage;

    const dinoRunImage1 = new Image();
    dinoRunImage1.src = "images/dino_run1.png";

    const dinoRunImage2 = new Image();
    dinoRunImage2.src = "images/dino_run2.png";

    this.dinoRunImages.push(dinoRunImage1);
    this.dinoRunImages.push(dinoRunImage2);

    // Keyboard events
    this.keydownHandler = this.keydown.bind(this);
    this.keyupHandler = this.keyup.bind(this);
    
    window.removeEventListener("keydown", this.keydownHandler);
    window.removeEventListener("keyup", this.keyupHandler);
    window.addEventListener("keydown", this.keydownHandler);
    window.addEventListener("keyup", this.keyupHandler);

    // Mouse events (for PC touchpad/mouse clicks)
    this.mousedownHandler = this.mousedown.bind(this);
    this.mouseupHandler = this.mouseup.bind(this);
    
    window.removeEventListener("mousedown", this.mousedownHandler);
    window.removeEventListener("mouseup", this.mouseupHandler);
    window.addEventListener("mousedown", this.mousedownHandler);
    window.addEventListener("mouseup", this.mouseupHandler);

    // Touch events (for mobile touchscreens)
    this.touchstartHandler = this.touchstart.bind(this);
    this.touchendHandler = this.touchend.bind(this);
    
    window.removeEventListener("touchstart", this.touchstartHandler);
    window.removeEventListener("touchend", this.touchendHandler);
    window.addEventListener("touchstart", this.touchstartHandler);
    window.addEventListener("touchend", this.touchendHandler);
  }

  // Mouse handlers for PC
  mousedown = (event) => {
    this.jumpPressed = true;
  };

  mouseup = (event) => {
    this.jumpPressed = false;
  };

  // Touch handlers for mobile
  touchstart = (event) => {
    event.preventDefault();
    this.jumpPressed = true;
  };

  touchend = (event) => {
    event.preventDefault();
    this.jumpPressed = false;
  };

  // Keyboard handlers
  keydown = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = true;
    }
  };

  keyup = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = false;
    }
  };

  update(gamespeed, frameTimeDelta) {
    this.jump(frameTimeDelta);

    if (this.jumpInProgress) {
      this.image = this.standingStillImage;
    } else {
      this.run(gamespeed, frameTimeDelta);
    }
  }

  jump(frameTimeDelta) {
    if (this.jumpPressed) {
      this.jumpInProgress = true;
    }

    if (this.jumpInProgress && !this.falling) {
      // Jump up until we reach max height OR (min height and button released)
      if (
        this.y > this.canvas.height - this.maxJumpHeight &&
        (this.jumpPressed || this.y > this.canvas.height - this.minJumpHeight)
      ) {
        this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
      } else {
        this.falling = true;
      }
    } else {
      // Falling or on ground
      if (this.y < this.yStandingPosition) {
        this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
        if (this.y + this.height > this.canvas.height) {
          this.y = this.yStandingPosition;
        }
      } else {
        this.falling = false;
        this.jumpInProgress = false;
      }
    }
  }

  run(gamespeed, frameTimeDelta) {
    if (this.walkAnimationTimer <= 0) {
      if (this.image === this.dinoRunImages[0]) {
        this.image = this.dinoRunImages[1];
      } else {
        this.image = this.dinoRunImages[0];
      }

      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }

    this.walkAnimationTimer -= frameTimeDelta * gamespeed;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

}

