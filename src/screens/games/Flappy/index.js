import AsyncStorage from "@react-native-async-storage/async-storage";
import Matter from "matter-js";
import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    ImageBackground,
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { GameEngine } from "react-native-game-engine";

import Bird from "./Bird";
import Pipe from "./Pipe";
import {
    COLORS,
    GAME_STATES,
    PIPE_SPEED,
    PIPE_WIDTH,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    SPAWN_INTERVAL,
} from "./constants";
import {
    createBird,
    createPipe,
    moveBird,
    Physics,
    playSound,
    setupBirdVelocityClamping,
    setupWorld,
} from "./physics";

// Extend Matter.Body type to include our custom properties

function Flappy({ navigation }) {
    const [gameState, setGameState] = useState(GAME_STATES.READY);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [lastPipeSpawn, setLastPipeSpawn] = useState(0);
    const [entities, setEntities] = useState(null);
    const gameEngineRef = useRef(null);
    const engineRef = useRef(setupWorld());
    const birdRef = useRef(createBird());

    useEffect(() => {
        const initializeGame = async () => {
            try {
                // Initialize AsyncStorage
                const savedScore = await AsyncStorage.getItem("FaceFly:highScore");
                if (savedScore !== null) {
                    setHighScore(parseInt(savedScore, 10));
                }
            } catch (error) {
                // Silently handle storage errors - default to 0
                console.log("Storage not available, using default high score");
            }

            // Create initial entities
            const engine = engineRef.current;
            const bird = birdRef.current;
            Matter.World.add(engine.world, [bird]);

            // Setup velocity clamping for Flappy Bird physics
            setupBirdVelocityClamping(engine, bird);

            setEntities({
                physics: { engine, world: engine.world },
                bird: {
                    body: bird,
                    size: 40,
                    renderer: Bird,
                },
                pipes: [],
                score: {
                    value: 0,
                    highScore: 0,
                },
                gameState: {
                    current: GAME_STATES.READY,
                },
            });
        };

        initializeGame();
    }, []);

    // Keep highScore in entities in sync
    useEffect(() => {
        if (entities) {
            setEntities({ ...entities, score: { ...entities.score, highScore } });
        }
    }, [highScore]);

    // Add keyboard controls for simulator
    useEffect(() => {
        if (__DEV__ && Platform.OS === "ios") {
            const handleKeyboardShow = (event) => {
                // Space key press simulation for development
                if (!entities || !entities.bird || !entities.bird.body) return;
                if (gameState === GAME_STATES.READY) {
                    startGame();
                    moveBird(entities.bird.body);
                }
                if (gameState === GAME_STATES.PLAYING) {
                    moveBird(entities.bird.body);
                }
            };

            const keyboardShowListener = Keyboard.addListener("keyboardWillShow", handleKeyboardShow);

            return () => {
                keyboardShowListener.remove();
            };
        }
    }, [gameState, entities]);

    const saveHighScore = async (newHighScore) => {
        try {
            await AsyncStorage.setItem("FaceFly:highScore", newHighScore.toString());
        } catch (error) {
            // Silently handle storage errors
            console.log("Unable to save high score");
        }
    };

    const onEvent = (e) => {
        if (e.type === "game-over") {
            setGameState(GAME_STATES.GAME_OVER);

            // Check and save high score
            if (score > highScore) {
                // console.log(`New high score! ${score} > ${highScore}`);
                setHighScore(score);
                saveHighScore(score).catch(console.log);
            }
        }
    };

    const handleRestart = () => {
        resetGame();
    };

    const resetGame = () => {
        // Step 1: Clear out old Matter.js world and engine state
        const oldEngine = engineRef.current;
        if (oldEngine && oldEngine.world) {
            Matter.World.clear(oldEngine.world, false);
            Matter.Engine.clear(oldEngine);
        }

        const freshEngine = setupWorld();
        const freshBird = createBird();

        Matter.Body.setPosition(freshBird, {
            x: SCREEN_WIDTH / 4,
            y: SCREEN_HEIGHT / 2,
        });
        Matter.Body.setVelocity(freshBird, { x: 0, y: 0 });
        Matter.Body.setAngle(freshBird, 0);

        engineRef.current = freshEngine;
        birdRef.current = freshBird;

        Matter.World.add(freshEngine.world, [freshBird]);
        setupBirdVelocityClamping(freshEngine, freshBird);

        setScore(0);
        setGameState(GAME_STATES.READY);
        setLastPipeSpawn(0);

        const freshEntities = {
            physics: {
                engine: freshEngine,
                world: freshEngine.world,
            },
            bird: {
                body: freshBird,
                size: 40,
                renderer: Bird,
            },
            pipes: [], // Completely empty - pipes will respawn when game starts
            score: {
                value: 0, // Reset score counter
                highScore: highScore, // Preserve high score
            },
            gameState: {
                current: GAME_STATES.READY, // Reset to ready state
            },
        };

        gameEngineRef.current?.swap(freshEntities);
        setEntities(freshEntities);
    };

    const startGame = () => {
        setGameState(GAME_STATES.PLAYING);
        setLastPipeSpawn(0); // Reset spawn timer

        if (entities) {
            entities.gameState.current = GAME_STATES.PLAYING;
        }
    };

    // Pipe spawning system
    const SpawnPipes = (entities, { time }) => {
        if (!entities || !gameState || gameState !== GAME_STATES.PLAYING) {
            return entities;
        }

        const currentTime = time.current;
        if (!lastPipeSpawn || currentTime - lastPipeSpawn >= SPAWN_INTERVAL) {
            // Create pipes
            const { top, bottom } = createPipe(SCREEN_WIDTH + PIPE_WIDTH);

            Matter.World.add(entities.physics.engine.world, [top, bottom]);

            const pipeId = Date.now();
            const topPipeKey = `pipe_top_${pipeId}`;
            const bottomPipeKey = `pipe_bottom_${pipeId}`;

            entities[topPipeKey] = {
                body: top,
                renderer: Pipe,
            };
            entities[bottomPipeKey] = {
                body: bottom,
                renderer: Pipe,
            };

            entities.pipes = [
                ...entities.pipes,
                { body: top, renderer: Pipe, isTop: true },
                { body: bottom, renderer: Pipe, isTop: false },
            ];

            setLastPipeSpawn(currentTime);
        }

        // Move existing pipes
        if (entities.pipes.length > 0) {
            const moveAmount = (PIPE_SPEED * time.delta) / 16.667;
            entities.pipes.forEach((pipe, index) => {
                const oldX = pipe.body.position.x;
                Matter.Body.translate(pipe.body, { x: -moveAmount, y: 0 });
                const newX = pipe.body.position.x;
            });

            // Clean up pipes that have moved off screen
            const pipeKeysToRemove = [];
            Object.keys(entities).forEach((key) => {
                if (
                    key.startsWith("pipe_") &&
                    entities[key].body &&
                    entities[key].body.position.x < -PIPE_WIDTH
                ) {
                    Matter.World.remove(entities.physics.engine.world, entities[key].body);
                    pipeKeysToRemove.push(key);
                }
            });

            // Remove off-screen pipes from entities
            pipeKeysToRemove.forEach((key) => {
                delete entities[key];
            });

            // Update tracking array
            entities.pipes = entities.pipes.filter((pipe) => pipe.body.position.x > -PIPE_WIDTH);
        }

        return entities;
    };

    // Scoring system
    const ScoreSystem = (entities) => {
        if (gameState === GAME_STATES.PLAYING) {
            const bird = entities.bird.body;
            let newScore = entities.score.value;

            // Check if bird has passed any pipes
            entities.pipes.forEach((pipe) => {
                // Only check bottom pipes to avoid double counting
                if (!pipe.body.isTop && !pipe.body.scored) {
                    // Check if bird has passed the pipe
                    if (bird.position.x > pipe.body.position.x + PIPE_WIDTH / 2) {
                        playSound("point.mp3", 0.5);
                        pipe.body.scored = true;
                        newScore += 1;
                    }
                }
            });

            // Update score in entities
            entities.score.value = newScore;
            setScore(newScore);
        }
        return entities;
    };

    // Touch handler always uses the current bird body
    const handleFlap = () => {
        if (!entities || !entities.bird || !entities.bird.body) return;
        if (gameState === GAME_STATES.READY) {
            startGame();
            moveBird(entities.bird.body);
        } else if (gameState === GAME_STATES.PLAYING) {
            moveBird(entities.bird.body);
        }
    };

    if (!entities) return null;

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../../../assets/images/background-night.png")}
                style={[StyleSheet.absoluteFill]}
                resizeMode="cover"
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={{ zIndex: 5 }}
                >
                    <Image
                        style={{
                            height: 24,
                            width: 24,
                            resizeMode: "contain",
                            marginLeft: 10,
                            marginTop: 10,
                        }}
                        source={require("../../../../assets/images/blackBack.png")}
                    ></Image>
                </TouchableOpacity>
                <GameEngine
                    ref={gameEngineRef}
                    style={[
                        styles.gameContainer,
                        {
                            backgroundColor: "transparent",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        },
                    ]}
                    systems={[
                        (entities, args) => Physics(entities, { ...args, gameState }),
                        SpawnPipes,
                        ScoreSystem,
                    ]}
                    entities={entities}
                    onEvent={onEvent}
                    running={gameState === GAME_STATES.PLAYING}
                >
                    <TouchableWithoutFeedback onPress={handleFlap}>
                        <View
                            style={[
                                styles.touchableArea,
                                {
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: "transparent",
                                },
                            ]}
                        >
                        <Image style={{position:"absolute",height:200,width:200,resizeMode:"contain", alignSelf:"center"}} source={require('../../../../assets/images/saathi.png')}></Image>
                        
                            {gameState === GAME_STATES.READY && (
                                <View style={styles.readyContainer}>
                                    <Text style={[styles.readyText, styles.textShadow]}>
                                        {__DEV__ && Platform.OS === "ios"
                                            ? "Tap or Press Space to Start"
                                            : "Tap to Start"}
                                    </Text>
                                </View>
                            )}
                            {gameState === GAME_STATES.PLAYING && (
                                <Text style={[styles.scoreText, styles.textShadow]}>{score}</Text>
                            )}
                            {gameState === GAME_STATES.GAME_OVER && (
                                <View style={styles.gameOverContainer}>
                                    <Text style={[styles.gameOverText, styles.textShadow]}>Game Over</Text>
                                    <Text style={[styles.scoreText, styles.textShadow]}>Score: {score}</Text>
                                    <Text style={[styles.highScoreText, styles.textShadow]}>
                                        High Score: {highScore}
                                    </Text>
                                    <TouchableWithoutFeedback onPress={handleRestart}>
                                        <View style={styles.restartButton}>
                                            <Text style={[styles.restartButtonText, styles.textShadow]}>Restart</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </GameEngine>
            </ImageBackground>
        </View>
    );
}

export default Flappy;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
    },
    gameContainer: {
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    touchableArea: {
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    readyContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        zIndex: 1,
    },
    readyText: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.TEXT,
    },
    scoreText: {
        position: "absolute",
        top: 50,
        width: "100%",
        textAlign: "center",
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.TEXT,
    },
    textShadow: {
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
    },
    gameOverContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1,
    },
    gameOverText: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.TEXT,
    },
    highScoreText: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.TEXT,
    },
    restartButton: {
        marginTop: 30,
        paddingHorizontal: 30,
        paddingVertical: 15,
        backgroundColor: COLORS.BIRD,
        borderRadius: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    restartButtonText: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.TEXT,
    },
});
