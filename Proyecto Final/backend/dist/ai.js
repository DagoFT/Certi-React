const directions = ["up", "down", "left", "right"];
function distance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
function directionToTarget(from, target) {
    const dx = target.x - from.x;
    const dy = target.y - from.y;
    if (Math.abs(dx) > Math.abs(dy)) {
        return dx > 0 ? "right" : "left";
    }
    return dy > 0 ? "down" : "up";
}
export function decideAIAction(ai, player, crystals) {
    // Si el jugador está al lado, atacar.
    if (distance(ai, player) <= 1) {
        return {
            type: "attack",
        };
    }
    // Si existen cristales, buscar el más cercano.
    if (crystals.length > 0) {
        let closest = crystals[0];
        let closestDistance = distance(ai, closest);
        for (const crystal of crystals) {
            const currentDistance = distance(ai, crystal);
            if (currentDistance < closestDistance) {
                closest = crystal;
                closestDistance = currentDistance;
            }
        }
        return {
            type: "move",
            direction: directionToTarget(ai, closest),
        };
    }
    // Si no hay cristales, movimiento aleatorio.
    const direction = directions[Math.floor(Math.random() * directions.length)];
    return {
        type: "move",
        direction,
    };
}
