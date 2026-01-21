import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Matter from 'matter-js';

@Component({
  selector: 'app-snow-globe-shake',
  standalone: true,
  imports: [],
  templateUrl: './snow-globe-shake.html',
  styleUrl: './snow-globe-shake.scss',
})
export class SnowGlobeShake implements AfterViewInit, OnDestroy {

@ViewChild('snowGlobeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private engine!: Matter.Engine;
  private renderLoop!: number;
  private globeBody!: Matter.Body;
  private snowflakes: Matter.Body[] = [];
  private ringSegments: Matter.Body[] = [];

  // Assets
  private images: { [key: string]: HTMLImageElement } = {};
  private shakeAudio: HTMLAudioElement | null = null;

  // State
  private isDragging = false;
  private lastMousePos = { x: 0, y: 0 };
  private dragOffset = { x: 0, y: 0 };
  private currentMousePos = { x: 0, y: 0 };
  private currentDragVelocity = { x: 0, y: 0 };
  private homePosition = { x: 512, y: 492 }; // Center of 1024x1024, shifted up 20px
  private radius = 384; // 320 + 20% = 384
  private debugMode = false;
  private frames = 0;
  private shakeStrength = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAssets().then(() => {
        this.initPhysics();
        this.initInteraction();
        this.startLoop();
      });
    }
  }

  ngOnDestroy() {
    if (this.renderLoop) {
      cancelAnimationFrame(this.renderLoop);
    }
    if (this.engine) {
      Matter.Engine.clear(this.engine);
    }
  }

  private async loadAssets() {
    const assetNames = ['component-background', 'globe-background', 'castle', 'glass', 'reflection', 'base'];
    const promises = assetNames.map(name => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = `assets/snowglobe/${name}.png`;
        img.onload = () => {
          this.images[name] = img;
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load ${name}.png`); // Proceed anyway
          resolve();
        };
      });
    });

    // Audio
    this.shakeAudio = new Audio('assets/snowglobe/shake.mp3');

    await Promise.all(promises);
  }

  private initPhysics() {
    this.engine = Matter.Engine.create({
      enableSleeping: true,
      constraintIterations: 1, // Lower iterations reduces "bouncing" behavior
      positionIterations: 4    // Keeps the stacking stable
    });
    this.engine.gravity.y = 0.5; // Default gravity

    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Body = Matter.Body;

    // Categories (32-bit)
    const CAT_GLOBE = 0x0001;
    const CAT_FLOOR = 0x0002;
    const CAT_WALL = 0x0004;
    const CAT_SNOW = 0x0008;

    // 1. Globe Body
    this.globeBody = Bodies.circle(this.homePosition.x, this.homePosition.y, 400, {
      isStatic: true,
      isSensor: false, // Collides with floor
      label: 'globe',
      collisionFilter: {
        category: CAT_GLOBE,
        mask: CAT_FLOOR // Only collide with floor
      }
    });
    Matter.Body.setMass(this.globeBody, 100);

    // 2. Floor
    const floor = Bodies.rectangle(512, 1024 + 50, 2000, 100, {
      isStatic: true,
      label: 'floor',
      collisionFilter: {
        category: CAT_FLOOR,
        mask: CAT_GLOBE
      }
    });
    // Prompt: "Physical Floor... prevent globe from falling".
    // If globeBody is not static, it needs to hit the floor?
    // Actually, if we DRAG the globe, we control position.
    // Maybe the globeBody falls if we let go?
    // "prevent the globe from falling or being dragged off-screen"
    // So globeBody should react to gravity?
    // Let's enable gravity for globeBody.

    // 3. Hollow Ring (Thick Walls 100px)
    // 48 segments. Radius Dynamic.
    const segmentCount = 48;
    const radius = this.radius; // Use class property
    const innerRadius = radius - 60; // Keep flakes clear of the wall thickness
    for (let i = 0; i < segmentCount; i++) {
      const angle = (i / segmentCount) * Math.PI * 2;
      const cx = this.homePosition.x + Math.cos(angle) * (radius);
      const cy = this.homePosition.y + Math.sin(angle) * (radius);

      const w = (Math.PI * 2 * radius) / segmentCount + 10;
      const h = 100;

      const segment = Bodies.rectangle(cx, cy, w, h, {
        isStatic: true,
        angle: angle,
        label: 'wall',
        render: { visible: false },
        collisionFilter: {
          category: CAT_WALL,
          mask: CAT_SNOW
        }
      });
      this.ringSegments.push(segment);
    }

    // 4. Snowflakes
    // 200 Particles resting at the bottom
    for (let i = 0; i < 400; i++) {
      // Spawn in bottom semi-circle, inside the inner radius
      const x = this.homePosition.x + (Math.random() - 0.5) * (this.radius * 1.4);
      // const y = this.homePosition.y + this.radius - 50 - (Math.random() * 30);
      const y = this.homePosition.y + (Math.random() * (innerRadius * 0.8));

      // Strict check inside the inner boundary
      if (Math.hypot(x - this.homePosition.x, y - this.homePosition.y) < innerRadius) {
        const flake = Bodies.circle(x, y, 3 + Math.random() * 3, {
          frictionAir: 0.05,
          friction: 0.0,
          isSleeping: true,
          frictionStatic: 0.0,
          restitution: 0.3,
          sleepThreshold: 60,
          density: 0.001,
          render: { fillStyle: '#ffffff' },
          label: `flake-${i}`,
          collisionFilter: { group: -1 }
        });
        // Monkey-patch custom properties for flutter & depth
        (flake as any).flutterPhase = Math.random() * Math.PI * 2;
        (flake as any).flutterSpeed = 0.6 + Math.random() * 0.6;
        (flake as any).depth = Math.random(); // 0 = Front (Glass), 1 = Back (Center/Deep)

        this.snowflakes.push(flake);
      }
    }

    World.add(this.engine.world, [this.globeBody, floor, ...this.ringSegments, ...this.snowflakes]);
  }

  private initInteraction() {
    const canvas = this.canvasRef.nativeElement;

    canvas.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent text selection/scrolling
      const pos = this.getMousePos(e);

      // Check if mouse is inside the globe (approximate)
      const dx = pos.x - this.globeBody.position.x;
      const dy = pos.y - this.globeBody.position.y;
      if (Math.hypot(dx, dy) < this.radius) {
        this.isDragging = true;

        // Make static to remove gravity influence while dragging (Perfect Grip)
        Matter.Body.setStatic(this.globeBody, true);
        this.currentDragVelocity = { x: 0, y: 0 }; // Reset

        // Calculate the offset between the mouse and the globe center
        // This ensures the globe stays "pinned" to the mouse cursor at the grab point
        this.dragOffset = {
          x: this.globeBody.position.x - pos.x,
          y: this.globeBody.position.y - pos.y
        };
        this.currentMousePos = pos;
        this.lastMousePos = pos;
      }
    });

    window.addEventListener('mousemove', (e) => {
      const pos = this.getMousePos(e);
      this.currentMousePos = pos;

      if (!this.isDragging) return;

      // Audio trigger calculation (moved from drag logic effectively, but we can keep it simpler)
      // We calculate "instant" speed for audio
      const dx = pos.x - this.lastMousePos.x;
      const dy = pos.y - this.lastMousePos.y;

      const speed = Math.hypot(dx, dy);
      if (speed > 15 && this.shakeAudio) {
        if (this.shakeAudio.paused) {
          this.shakeAudio.currentTime = 0;
          this.shakeAudio.play().catch(() => { });
        }
      }

      this.lastMousePos = pos;
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        // Keep the globe pinned in place when released
        Matter.Body.setStatic(this.globeBody, true);
        Matter.Body.setVelocity(this.globeBody, { x: 0, y: 0 });
      }
    });

    // Toggle Debug (D key)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'd') {
        this.debugMode = !this.debugMode;
        this.ringSegments.forEach(seg => {
          seg.render.visible = this.debugMode;
        });
      }
    });
  }

  private getMousePos(e: MouseEvent | TouchEvent) {
    // Handle touch/mouse
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let cx, cy;
    if (e instanceof MouseEvent) {
      cx = e.clientX;
      cy = e.clientY;
    } else {
      cx = e.touches[0].clientX;
      cy = e.touches[0].clientY;
    }
    return {
      x: (cx - rect.left) * scaleX,
      y: (cy - rect.top) * scaleY
    };
  }

  private startLoop() {
    let lastDragTime = 0;

    this.ngZone.runOutsideAngular(() => {
      const update = () => {
        const now = Date.now();
        const t = now * 0.001;

        // 1. Manual Drag Control
        if (this.isDragging) {
          lastDragTime = now;
          let targetX = this.currentMousePos.x + this.dragOffset.x;
          let targetY = this.currentMousePos.y + this.dragOffset.y;
          if (targetY + this.radius > 1024) targetY = 1024 - this.radius;

          const currentPos = this.globeBody.position;
          const velocity = { x: targetX - currentPos.x, y: targetY - currentPos.y };

          Matter.Body.setVelocity(this.globeBody, velocity);
          Matter.Body.setPosition(this.globeBody, { x: targetX, y: targetY });

          this.snowflakes.forEach(flake => {
            if (Math.hypot(velocity.x, velocity.y) > 0.5) {
              Matter.Sleeping.set(flake, false);
              Matter.Body.applyForce(flake, flake.position, {
                x: velocity.x * 0.00002,
                y: velocity.y * 0.00002
              });
            }
          });
        }

        // 2. State & Fluid Tracking
        const globeVel = this.globeBody.velocity;
        const globeSpeed = Math.hypot(globeVel.x, globeVel.y);

        if (this.isDragging) {
          this.shakeStrength = Math.min(1, this.shakeStrength + 0.08 + globeSpeed * 0.02);
        } else {
          const msSinceDrag = now - lastDragTime;
          if (msSinceDrag < 15000) {
            this.shakeStrength = Math.max(0.4, this.shakeStrength * 0.998);
          } else {
            this.shakeStrength *= 0.90; // Slightly faster decay for the very end
          }
        }

        const isActuallyShaking = this.shakeStrength > 0.02;
        const forceMultiplier = Math.max(0, Math.min(1, this.shakeStrength * 5));
        const center = this.globeBody.position;
        const fv = (this as any).fluidVelocity || { x: 0, y: 0 };

        // 3. Snowflakes Physics & Behavior
        this.snowflakes.forEach(flake => {
          const speed = Math.hypot(flake.velocity.x, flake.velocity.y);
          const distFromBottom = (center.y + this.radius) - flake.position.y;

          // KILL SWITCH: If the flake is near the bottom and moving slowly, freeze it.
          // This prevents the "stacking toward center" and "popping"
          if (!isActuallyShaking && speed < 0.25 && distFromBottom < 60) {
            Matter.Body.setVelocity(flake, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(flake, 0);
            Matter.Sleeping.set(flake, true);
            return;
          }

          if (flake.isSleeping) return;

          // A. Gravity & Buoyancy
          const gravityBase = flake.mass * (this.engine.gravity.y * (this.engine.gravity.scale || 0.001));
          const fallRate = isActuallyShaking ? 0.3 : 0.15;
          Matter.Body.applyForce(flake, flake.position, { x: 0, y: gravityBase * fallRate });

          // B. Fluid Drag
          const dragEffect = isActuallyShaking ? 0.002 : 0.05; // High drag helps settling
          const fx = (fv.x - flake.velocity.x) * dragEffect * flake.mass * forceMultiplier;
          const fy = (fv.y - flake.velocity.y) * dragEffect * flake.mass * forceMultiplier;
          Matter.Body.applyForce(flake, flake.position, { x: fx, y: fy });

          // C. Consistent Side-to-Side Sway
          if (forceMultiplier > 0.15) {
            const depth = (flake as any).depth || 0.5;
            const wave = Math.sin(flake.position.y * 0.02 + t * 3.5 + depth * Math.PI);
            Matter.Body.applyForce(flake, flake.position, {
              x: wave * (0.00025 * forceMultiplier),
              y: (Math.random() - 0.5) * 0.0001 * forceMultiplier
            });
          }

          // D. Boundary check
          const dx = flake.position.x - center.x;
          const dy = flake.position.y - center.y;
          const dist = Math.hypot(dx, dy);
          if (dist > this.radius - 45) {
            const push = (dist - (this.radius - 45)) * 0.0012;
            Matter.Body.applyForce(flake, flake.position, { x: -dx / dist * push, y: -dy / dist * push });
          }
        });

        // 4. Repulsion logic
        // INCREASED THRESHOLD: We disable repulsion much earlier (0.4) 
        // so flakes don't push each other once they start landing.
        if (forceMultiplier > 0.4) {
          const repelRadius = 12 + (25 * this.shakeStrength);
          const repelSq = repelRadius * repelRadius;
          for (let i = 0; i < this.snowflakes.length; i++) {
            const a = this.snowflakes[i];
            if (a.isSleeping) continue;
            for (let j = i + 1; j < this.snowflakes.length; j++) {
              const b = this.snowflakes[j];
              if (b.isSleeping) continue;
              const dx = b.position.x - a.position.x;
              const dy = b.position.y - a.position.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < repelSq && d2 > 0) {
                const d = Math.sqrt(d2);
                const push = (repelRadius - d) * 0.00008 * forceMultiplier;
                Matter.Body.applyForce(b, b.position, { x: (dx / d) * push, y: (dy / d) * push });
                Matter.Body.applyForce(a, a.position, { x: -(dx / d) * push, y: -(dy / d) * push });
              }
            }
          }
        }

        Matter.Engine.update(this.engine, 1000 / 60);

        this.ringSegments.forEach((seg, i) => {
          const angle = (i / 48) * Math.PI * 2;
          Matter.Body.setPosition(seg, {
            x: center.x + Math.cos(angle) * this.radius,
            y: center.y + Math.sin(angle) * this.radius
          });
          Matter.Body.setVelocity(seg, globeVel);
        });

        this.draw();
        this.renderLoop = requestAnimationFrame(update);
      };
      this.renderLoop = requestAnimationFrame(update);
    });
  }

  private draw() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // NEW: Full Component Background (User Request)
    if (this.images['component-background']) {
      ctx.drawImage(this.images['component-background'], 0, 0, canvas.width, canvas.height);
    }

    // "Draw the background.png without this translation."
    // UPDATE: "This layer should always move with the globe."
    // So we remove it from here and put it inside the translation.

    // "The Fix for Alignment: ... ctx.translate(globeBody.position.x - homePosition.x, ...)"
    const gx = this.globeBody.position.x;
    const gy = this.globeBody.position.y;
    const dx = gx - this.homePosition.x;
    const dy = gy - this.homePosition.y;

    ctx.save();
    ctx.translate(dx, dy);

    // Draw Everything else at (0,0) (relative to home?) 
    // Actually, if we translate context, we should draw images at their Home/Initial positions?
    // Prompt: "then draw all layers at (0, 0)."
    // If we draw castle at (0,0), it will be at Top-Left + dx, dy.
    // But castle should be centered.
    // "Assume assets (1024x1024) and centered".
    // So drawing at (0,0) means drawing the image at 0,0 which covers the 1024x1024 canvas.
    // With translation, it moves with the globe. Correct.

    // Order: background -> castle -> snowflakes -> glass -> reflection -> base
    if (this.images['globe-background']) ctx.drawImage(this.images['globe-background'], 0, 0);

    if (this.images['castle']) ctx.drawImage(this.images['castle'], 0, 0);

    // Debug: Draw Ring Limits (Segments only)
    if (this.debugMode) {
      //ctx.strokeStyle = 'red';
      //ctx.lineWidth = 2;
      this.ringSegments.forEach(seg => {
        const pos = seg.position;
        // Relative draw
        ctx.strokeRect(pos.x - dx - 5, pos.y - dy - 10, 10, 20); // Approx
      });
    }

    // Requested: Permanent Red Boundary Line
    //ctx.beginPath();
    //ctx.strokeStyle = 'red';
    //ctx.lineWidth = 2;
    //ctx.arc(this.globeBody.position.x - dx, this.globeBody.position.y - dy, this.radius, 0, 2 * Math.PI);
    //ctx.stroke();

    // Snowflakes
    // Snowflakes are physics bodies. Their positions are Absolute in world.
    // If we translated the context by (dx, dy), and snowflakes are World Absolute,
    // we need to draw them relative?
    // Wait. The prompt says: "use ctx.save(), ctx.translate(globeBody.position.x - homePosition.x, ...), then draw all layers at (0, 0)."
    // Just for LAYERS (images).
    // snowflakes need to be drawn at their position.
    // Use logic: The Globe moved by dx, dy. The layers move by dx, dy.
    // The snowflakes move physically.
    // If I apply ctx.translate(dx, dy), and then draw a snowflake at `flake.position`, 
    // it will be double-moved if `flake.position` is already updated?
    // No. `flake.position` is absolute world coord.
    // If context is shifted, `flake.position` drawing will be shifted.
    // WE SHOULD NOT translate for snowflakes if strict physics rendering is used?
    // OR: The "World" of the snowglobe renders inside the container.
    // If I translate, I shift the coordinate system.
    // If I draw a flake at (512, 512) and translate by (100, 0), it appears at (612, 512).
    // Correct.
    // BUT: The snowflakes physical position...
    // If the ring moves, the snowflakes are pushed.
    // So snowflakes `position` IS absolute.
    // If I translate context, I must Subtract translation when drawing world bodies?
    // OR: The prompt implies the "View" is following the Globe?
    // "draw all layers at (0,0)". This refers to the static IMAGES (Castle, Glass, etc).
    // They are drawn at 0,0 locally, but translated by globe move.
    // Snowflakes: We should draw them where they are relative to the globe?
    // No, MatterJS positions are World.
    // If I translate the context, I am effectively moving the camera?
    // If I move the globe right, the globe images move right.
    // The snowflakes (inside) move right (pushed).
    // So if I draw snowflakes at their `body.position`, AND translate context, they will run away twice as fast?
    // Wait.
    // If globe is at 612 (moved 100).
    // Flake is at 612.
    // Context translated +100.
    // Drawing flake at 612 -> Appears at 712.
    // WRONG.
    // So: ctx.restore() before drawing snowflakes?
    // "Layer Order: background -> castle -> snowflakes -> glass..."
    // Castle, Glass, Base are Images. They follow the globe.
    // Snowflakes are dynamic.
    // So:
    // 1. Draw Background (No translate).
    // 2. Translate.
    // 3. Draw Castle (0,0).
    // 4. Draw Snowflakes?
    //    If I draw snowflakes here, I need to inverse-translate their coordinates?
    //    OR: Calculate local position? transform world -> local.
    //    `local = world - globePos + homePos`?
    //    Or just `ctx.restore()` -> draw flakes -> `ctx.save(); ctx.translate(...)`?
    //    But Snowflakes need to be sandwiched between Castle and Glass.
    //    So I should probably:
    //    `ctx.translate(-dx, -dy)` (undo) -> Draw Flakes -> `ctx.translate(dx, dy)` (redo)?
    //    Or better: Draw flakes at `flake.pos.x - dx`, `flake.pos.y - dy`.

    // Shadow blur/glow for snowflakes
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'white';

    this.snowflakes.forEach(flake => {
      ctx.beginPath();
      // Draw relative to the translated context
      // coordinate = body.position - translation
      ctx.arc(flake.position.x - dx, flake.position.y - dy, (flake as any).circleRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.shadowBlur = 0; // Reset

    if (this.images['glass']) ctx.drawImage(this.images['glass'], 0, 0);
    if (this.images['reflection']) ctx.drawImage(this.images['reflection'], 0, 0);
    if (this.images['base']) ctx.drawImage(this.images['base'], 0, 0);

    ctx.restore();
  }
}
