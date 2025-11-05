import Matter from 'matter-js';
import {
    BIRD_ROTATION_FACTOR,
    BIRD_SIZE,
    GRAVITY,
    JUMP_FORCE,
    MIN_PIPE_HEIGHT,
    PIPE_GAP,
    PIPE_WIDTH,
    SCREEN_HEIGHT,
    SCREEN_WIDTH
} from './constants';
const { Events } = Matter;
import Sound from 'react-native-sound';


export const playSound = (sound, volume=1) => {
    const soundInstance = new Sound(sound, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log('Failed to load the sound', error);
            return;
        }
        soundInstance.setVolume(volume);
        soundInstance.play((success) => {
            if (!success) {
                console.log('Sound playback failed');
            }
            soundInstance.release();
        });
    });
}



// Physics setup
export const setupWorld = () => {
    const engine = Matter.Engine.create({
        enableSleeping: false,
    });
    
    // Set floaty Flappy Bird gravity
    engine.world.gravity.y = GRAVITY;
    
    return engine;
};

// Bird creation
export const createBird = () => {
    return Matter.Bodies.circle(
        SCREEN_WIDTH / 4,
        SCREEN_HEIGHT / 2,
        BIRD_SIZE / 2,
        {
            label: 'Bird',
            density: 0.002,
            frictionAir: 0.02,
            restitution: 0,
        }
    );
};

// Setup velocity clamping for the bird
export const setupBirdVelocityClamping = (engine, bird) => {
    // Remove any existing beforeUpdate listeners to prevent accumulation
    Events.off(engine, 'beforeUpdate');
    
    // Add the velocity clamping listener
    Events.on(engine, 'beforeUpdate', () => {
        const vy = bird.velocity.y;
        if (vy > 15) Matter.Body.setVelocity(bird, { x: 0, y: 15 });
        if (vy < -12) Matter.Body.setVelocity(bird, { x: 0, y: -12 });
    });
};

// Pipe creation
export const createPipe = (x) => {
    // Calculate heights ensuring pipes are visible
    const gapPosition = MIN_PIPE_HEIGHT + Math.random() * (SCREEN_HEIGHT - 2 * MIN_PIPE_HEIGHT - PIPE_GAP);
    
    // Create top pipe
    const topHeight = gapPosition;
    const topPipe = Matter.Bodies.rectangle(
        x,
        topHeight / 2,
        PIPE_WIDTH,
        topHeight,
        { 
            isStatic: true,
            label: 'Pipe',
            friction: 1,
            restitution: 0.2,
        }
    );

    // Create bottom pipe
    const bottomHeight = SCREEN_HEIGHT - gapPosition - PIPE_GAP;
    const bottomPipe = Matter.Bodies.rectangle(
        x,
        SCREEN_HEIGHT - bottomHeight / 2,
        PIPE_WIDTH,
        bottomHeight,
        { 
            isStatic: true,
            label: 'Pipe',
            friction: 1,
            restitution: 0.2,
        }
    );

    // Add custom property to identify pipes
    Matter.Body.set(topPipe, { isTop: true });
    Matter.Body.set(bottomPipe, { isTop: false });
    return { top: topPipe, bottom: bottomPipe };
};

// Game systems
export const Physics = (entities, { time, dispatch, gameState }) => {
    const engine = entities.physics.engine;
    // Cap delta time at 16.667ms (60 FPS)
    const cappedDelta = Math.min(time.delta, 16.667);
    Matter.Engine.update(engine, cappedDelta);

    // Update bird rotation based on velocity
    const bird = entities.bird.body;
    const rotation = Math.min(Math.max(bird.velocity.y * BIRD_ROTATION_FACTOR, -Math.PI / 4), Math.PI / 2);
    Matter.Body.setAngle(bird, rotation);

    // Only check collisions and boundaries when game is actively playing
    if (gameState === 'PLAYING') {
        // Check collisions
        const collisions = Matter.Query.collides(bird, entities.pipes.map(pipe => pipe.body));
        if (collisions.length > 0) {
            dispatch({ type: 'game-over' });
            playSound('hit.mp3');
        }

        // Check if bird is out of bounds
        if (bird.position.y > SCREEN_HEIGHT || bird.position.y < 0) {
            dispatch({ type: 'game-over' });
            playSound('hit.mp3');
        }
    }

    return entities;
};

// Bird movement with Flappy Bird feel
export const moveBird = (body) => {
    // Play wing audio

    Matter.Body.setVelocity(body, {
        x: 0,
        y: JUMP_FORCE, // Moderate flap impulse
    });
    playSound('wing.mp3');
    // Add a slight upward rotation when jumping
    Matter.Body.setAngle(body, -Math.PI / 8);
}; 