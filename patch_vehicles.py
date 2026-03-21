with open('app.js', 'r') as f:
    js = f.read()

# 1. Tank logic (reduce speed, add muzzle flash, add black smoke)
js = js.replace('''    // Tank Barrel
    let barrel = new Node("TankBarrel");
    barrel.scale.set(0.4, 0.4, 3.5);
    barrel.position.set(0, 1.4, 1.5);
    barrel.color = [0.2, 0.3, 0.1, 1.0];
    tankRoot.add(barrel);''', '''    // Tank Barrel
    let barrel = new Node("TankBarrel");
    barrel.scale.set(0.4, 0.4, 3.5);
    barrel.position.set(0, 1.4, 1.5);
    barrel.color = [0.2, 0.3, 0.1, 1.0];
    tankRoot.add(barrel);

    let muzzleFlash = new Node("MuzzleFlash");
    muzzleFlash.scale.set(1.5, 1.5, 1.5);
    muzzleFlash.position.set(0, 1.4, 3.5);
    muzzleFlash.color = [1.0, 0.5, 0.0, 0.0]; // invisible by default
    tankRoot.add(muzzleFlash);
    tankRoot.muzzleFlashNode = muzzleFlash;''')

js = js.replace('''        if (gameTank && !gameWon) {
            // Tank follows D9 loosely but stays behind
            if (gameTank.position.z < targetZ) {
                gameTank.position.z += 5.0 * dt;
            }''', '''        if (gameTank && !gameWon) {
            // Tank follows D9 loosely but stays behind
            if (gameTank.position.z < targetZ) {
                gameTank.position.z += 5.0 * dt;
            }
            // Emit black smoke
            if (Math.random() < 0.2) {
                spawnDirt(new Vector3(gameTank.position.x, gameTank.position.y + 3.0, gameTank.position.z - 2.0));
                let smoke = dirtBoxes[dirtBoxes.length-1];
                smoke.color = [0.1, 0.1, 0.1, 0.8]; // Black smoke
                smoke.scale.set(0.5, 0.5, 0.5);
                smoke.isSmoke = true;
                smoke.life = 2.0;
            }''')

js = js.replace('''                // Firing logic
                if (timestamp - gameTank.lastFire > 2000) {
                    gameTank.lastFire = timestamp;''', '''                // Firing logic
                if (timestamp - gameTank.lastFire > 2000) {
                    gameTank.lastFire = timestamp;
                    gameTank.muzzleFlashNode.color[3] = 1.0; // Show flash
                    setTimeout(() => { if (gameTank && gameTank.muzzleFlashNode) gameTank.muzzleFlashNode.color[3] = 0.0; }, 100); // Hide''')

# 2. Enemy visible blobs and hiding AI
js = js.replace('''function buildSoldier(isEnemy=true, x=0, z=0) {
    let sRoot = new Node(isEnemy ? "EnemyRoot" : "AllyRoot");
    sRoot.position.set(x, getTerrainHeight(x, z) + 0.9, z);

    // Body
    let body = new Node("Body");
    body.scale.set(0.6, 1.2, 0.4);
    body.position.set(0, 0, 0);
    // Green (Friendly) vs Orange/Brown (Enemy)
    body.color = isEnemy ? [0.8, 0.4, 0.1, 1.0] : [0.2, 0.6, 0.2, 1.0];
    sRoot.add(body);

    // Head
    let head = new Node("Head");
    head.scale.set(0.4, 0.4, 0.4);
    head.position.set(0, 0.8, 0);
    head.color = [0.9, 0.7, 0.6, 1.0];
    sRoot.add(head);''', '''function buildSoldier(isEnemy=true, x=0, z=0) {
    let sRoot = new Node(isEnemy ? "EnemyRoot" : "AllyRoot");
    sRoot.position.set(x, getTerrainHeight(x, z) + 0.9, z);

    // Body (Capsule-like blob)
    let body = new Node("Body");
    body.scale.set(0.8, 1.2, 0.8);
    body.color = isEnemy ? [0.8, 0.0, 0.0, 1.0] : [0.0, 0.0, 0.8, 1.0];
    sRoot.add(body);

    // Head
    let head = new Node("Head");
    head.scale.set(0.5, 0.5, 0.5);
    head.position.set(0, 0.8, 0);
    head.color = isEnemy ? [0.8, 0.0, 0.0, 1.0] : [0.0, 0.0, 0.8, 1.0];
    sRoot.add(head);''')

# Hiding AI and Smoke decay
js = js.replace('''            }
        }
    }

    // 1. Build spatial grid for fast repulsion checks''', '''            }

            // AI hiding behavior: if near tank, move to nearest building
            if (s.isEnemy && !s.isDead && gameTank && sRoot.position.distanceTo(gameTank.position) < 30.0) {
                let nearestBuilding = null;
                let minDist = 999;
                sceneBuildings.forEach(h => {
                    let d = sRoot.position.distanceTo(h.position);
                    if (d < minDist && d < 40.0 && !h.isDestroyed) {
                        minDist = d;
                        nearestBuilding = h;
                    }
                });
                if (nearestBuilding) {
                    let toH = new Vector3().copy(nearestBuilding.position).sub(sRoot.position);
                    toH.y = 0; // Move horizontally
                    if (toH.length() > 2.0) {
                        toH.normalize();
                        sRoot.position.add(toH.multiplyScalar(4.0 * dt)); // Run to building
                    }
                }
            }
        }
    }

    // Handle Smoke decay
    for (let i = dirtBoxes.length - 1; i >= 0; i--) {
        let d = dirtBoxes[i];
        if (d.isSmoke) {
            d.life -= dt;
            d.position.y += 2.0 * dt; // Float up
            d.color[3] = Math.max(0, d.life / 2.0); // Fade out
            if (d.life <= 0) {
                dirtBoxes.splice(i, 1);
            }
        }
    }

    // 1. Build spatial grid for fast repulsion checks''')

with open('app.js', 'w') as f:
    f.write(js)
