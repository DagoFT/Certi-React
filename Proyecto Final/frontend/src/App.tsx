import { useEffect, useState } from "react";
import "./App.css";

type Direction = "up" | "down" | "left" | "right";

interface Player {
    x: number;
    y: number;
    health: number;
    score: number;
}

interface Crystal {
    id: number;
    x: number;
    y: number;
}

interface Game {
    id: string;
    status: "playing" | "player_won" | "ai_won" | "draw";
    turn: number;
    maxTurns: number;
    player: Player;
    ai: Player;
    crystals: Crystal[];
    message: string;
}

interface AIAction {
    type: "move" | "attack";
    direction?: Direction;
}

interface ActionResponse {
    playerAction: {
        type: "move" | "attack";
        direction?: Direction;
    };
    aiAction: AIAction | null;
    game: Game;
}

function App() {
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);

    async function createGame(): Promise<void> {
        setLoading(true);

        const response = await fetch("/api/games", {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        });

        const data: Game = await response.json();

        setGame(data);
        setLoading(false);
    }

    async function performAction(
        action: "move" | "attack",
        direction?: Direction,
    ): Promise<void> {
        if (!game || game.status !== "playing") {
            return;
        }

        const response = await fetch(
            `/api/games/${game.id}/action`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    action,
                    direction,
                }),
            },
        );

        const data: ActionResponse = await response.json();

        if (!response.ok) {
            setGame({
                ...game,
                message: data.game?.message ?? "Acción inválida",
            });

            return;
        }

        setGame(data.game);
    }

    useEffect(() => {
        void createGame();
    }, []);

    if (loading || !game) {
        return <h1>Cargando Neon Salvage...</h1>;
    }

    return (
        <main>
            <h1>NEON SALVAGE</h1>

            <section className="info">
                <div>
                    <strong>Jugador</strong>
                    <p>❤️ {game.player.health}</p>
                    <p>💎 {game.player.score}</p>
                </div>

                <div>
                    <strong>Turno</strong>
                    <p>
                        {game.turn} / {game.maxTurns}
                    </p>
                </div>

                <div>
                    <strong>IA</strong>
                    <p>❤️ {game.ai.health}</p>
                    <p>💎 {game.ai.score}</p>
                </div>
            </section>

            <section className="board">
                {Array.from({
                    length: 8 * 6,
                }).map((_, index) => {
                    const x = index % 8;
                    const y = Math.floor(index / 8);

                    const playerHere =
                        game.player.x === x &&
                        game.player.y === y;

                    const aiHere =
                        game.ai.x === x &&
                        game.ai.y === y;

                    const crystalHere =
                        game.crystals.some(
                            (crystal) =>
                                crystal.x === x &&
                                crystal.y === y,
                        );

                    return (
                        <div
                            className="cell"
                            key={`${x}-${y}`}
                        >
                            {playerHere && "👤"}
                            {aiHere && "🤖"}
                            {!playerHere &&
                                !aiHere &&
                                crystalHere &&
                                "💎"}
                        </div>
                    );
                })}
            </section>

            <section className="controls">
                <button
                    onClick={() =>
                        void performAction("move", "up")
                    }
                >
                    ↑
                </button>

                <div>
                    <button
                        onClick={() =>
                            void performAction("move", "left")
                        }
                    >
                        ←
                    </button>

                    <button
                        onClick={() =>
                            void performAction("move", "down")
                        }
                    >
                        ↓
                    </button>

                    <button
                        onClick={() =>
                            void performAction("move", "right")
                        }
                    >
                        →
                    </button>
                </div>

                <button
                    onClick={() =>
                        void performAction("attack")
                    }
                >
                    ⚔️ ATACAR
                </button>
            </section>

            <p className="message">{game.message}</p>

            {game.status !== "playing" && (
                <button onClick={() => void createGame()}>
                    JUGAR DE NUEVO
                </button>
            )}
        </main>
    );
}

export default App;