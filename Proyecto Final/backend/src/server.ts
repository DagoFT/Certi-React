import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
    decideAIAction,
    type AIAction,
    type Crystal,
    type Direction,
} from "./ai.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

type GameStatus =
    | "playing"
    | "player_won"
    | "ai_won"
    | "draw";

interface Player {
    x: number;
    y: number;
    health: number;
    score: number;
}

interface Game {
    id: string;
    status: GameStatus;
    turn: number;
    maxTurns: number;
    player: Player;
    ai: Player;
    crystals: Crystal[];
    message: string;
}

const games = new Map<string, Game>();

const WIDTH = 8;
const HEIGHT = 6;
const MAX_TURNS = 15;

function randomPosition(): { x: number; y: number } {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    };
}

function createCrystals(
    player: Player,
    ai: Player,
): Crystal[] {
    const crystals: Crystal[] = [];

    while (crystals.length < 5) {
        const position = randomPosition();

        const occupiedByPlayer =
            player.x === position.x &&
            player.y === position.y;

        const occupiedByAI =
            ai.x === position.x &&
            ai.y === position.y;

        const alreadyExists = crystals.some(
            (crystal) =>
                crystal.x === position.x &&
                crystal.y === position.y,
        );

        if (
            occupiedByPlayer ||
            occupiedByAI ||
            alreadyExists
        ) {
            continue;
        }

        crystals.push({
            id: crystals.length + 1,
            ...position,
        });
    }

    return crystals;
}

function createGame(): Game {
    const player = randomPosition();
    let ai = randomPosition();

    while (
        ai.x === player.x &&
        ai.y === player.y
    ) {
        ai = randomPosition();
    }

    const playerData: Player = {
        ...player,
        health: 100,
        score: 0,
    };

    const aiData: Player = {
        ...ai,
        health: 100,
        score: 0,
    };

    return {
        id: crypto.randomUUID(),
        status: "playing",
        turn: 1,
        maxTurns: MAX_TURNS,
        player: playerData,
        ai: aiData,
        crystals: createCrystals(
            playerData,
            aiData,
        ),
        message: "La partida comenzó.",
    };
}

function isInsideMap(
    x: number,
    y: number,
): boolean {
    return (
        x >= 0 &&
        x < WIDTH &&
        y >= 0 &&
        y < HEIGHT
    );
}

function movePlayer(
    game: Game,
    direction: Direction,
): boolean {
    let x = game.player.x;
    let y = game.player.y;

    if (direction === "up") y--;
    if (direction === "down") y++;
    if (direction === "left") x--;
    if (direction === "right") x++;

    if (!isInsideMap(x, y)) {
        return false;
    }

    game.player.x = x;
    game.player.y = y;

    const crystalIndex = game.crystals.findIndex(
        (crystal) =>
            crystal.x === x &&
            crystal.y === y,
    );

    if (crystalIndex !== -1) {
        game.crystals.splice(crystalIndex, 1);
        game.player.score++;
        game.message = "¡Encontraste un cristal!";
    }

    return true;
}

function moveAI(
    game: Game,
    direction: Direction,
): void {
    let x = game.ai.x;
    let y = game.ai.y;

    if (direction === "up") y--;
    if (direction === "down") y++;
    if (direction === "left") x--;
    if (direction === "right") x++;

    if (!isInsideMap(x, y)) {
        return;
    }

    game.ai.x = x;
    game.ai.y = y;

    const crystalIndex = game.crystals.findIndex(
        (crystal) =>
            crystal.x === x &&
            crystal.y === y,
    );

    if (crystalIndex !== -1) {
        game.crystals.splice(crystalIndex, 1);
        game.ai.score++;
    }
}

function attack(
    attacker: Player,
    target: Player,
): boolean {
    const distance =
        Math.abs(attacker.x - target.x) +
        Math.abs(attacker.y - target.y);

    if (distance > 1) {
        return false;
    }

    target.health -= 20;

    if (target.health < 0) {
        target.health = 0;
    }

    return true;
}

function checkGameOver(game: Game): void {
    if (game.player.health <= 0) {
        game.status = "ai_won";
        game.message = "La IA ganó la partida.";
        return;
    }

    if (game.ai.health <= 0) {
        game.status = "player_won";
        game.message = "¡Ganaste la partida!";
        return;
    }

    if (game.turn > game.maxTurns) {
        if (game.player.score > game.ai.score) {
            game.status = "player_won";
            game.message = "Ganaste por puntuación.";
        } else if (game.ai.score > game.player.score) {
            game.status = "ai_won";
            game.message = "La IA ganó por puntuación.";
        } else {
            game.status = "draw";
            game.message = "Empate.";
        }
    }
}

app.get("/api/health", (_request, response) => {
    response.json({
        mensaje: "Neon Salvage API funcionando",
    });
});

app.post("/api/games", (_request, response) => {
    const game = createGame();

    games.set(game.id, game);

    response.status(201).json(game);
});

app.get("/api/games/:id", (request, response) => {
    const game = games.get(request.params.id);

    if (!game) {
        return response.status(404).json({
            mensaje: "Partida no encontrada",
        });
    }

    return response.json(game);
});

app.post("/api/games/:id/action", (request, response) => {
    const game = games.get(request.params.id);

    if (!game) {
        return response.status(404).json({
            mensaje: "Partida no encontrada",
        });
    }

    if (game.status !== "playing") {
        return response.status(400).json({
            mensaje: "La partida ya terminó",
        });
    }

    const { action, direction } = request.body as {
        action?: "move" | "attack";
        direction?: Direction;
    };

    let playerAction: {
        type: "move" | "attack";
        direction?: Direction;
    };

    if (action === "move") {
        if (
            direction !== "up" &&
            direction !== "down" &&
            direction !== "left" &&
            direction !== "right"
        ) {
            return response.status(400).json({
                mensaje: "Dirección inválida",
            });
        }

        const moved = movePlayer(
            game,
            direction,
        );

        if (!moved) {
            return response.status(400).json({
                mensaje: "No puedes salir del mapa",
            });
        }

        playerAction = {
            type: "move",
            direction,
        };
    } else if (action === "attack") {
        const attacked = attack(
            game.player,
            game.ai,
        );

        if (!attacked) {
            return response.status(400).json({
                mensaje:
                    "El enemigo debe estar al lado para atacar",
            });
        }

        playerAction = {
            type: "attack",
        };

        game.message = "Atacaste a la IA.";
    } else {
        return response.status(400).json({
            mensaje: "Acción inválida",
        });
    }

    checkGameOver(game);

    if (game.status !== "playing") {
        return response.json({
            playerAction,
            aiAction: null,
            game,
        });
    }

    const aiAction: AIAction = decideAIAction(
        game.ai,
        game.player,
        game.crystals,
    );

    if (aiAction.type === "attack") {
        attack(game.ai, game.player);
        game.message = "La IA te atacó.";
    } else if (aiAction.direction) {
        moveAI(game, aiAction.direction);
        game.message = "La IA se movió.";
    }

    game.turn++;

    checkGameOver(game);

    return response.json({
        playerAction,
        aiAction,
        game,
    });
});

const frontendPath = path.resolve(
    __dirname,
    "../../frontend/dist",
);

app.use(express.static(frontendPath));

app.get("/", (_request, response) => {
    response.sendFile(
        path.join(frontendPath, "index.html"),
    );
});

app.get("/{*splat}", (_request, response) => {
    response.sendFile(
        path.join(frontendPath, "index.html"),
    );
});

app.listen(PORT, () => {
    console.log(
        `Neon Salvage ejecutándose en el puerto ${PORT}`,
    );
});

