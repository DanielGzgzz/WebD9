class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x; this.y = y; this.z = z;
    }
    set(x, y, z) {
        this.x = x; this.y = y; this.z = z; return this;
    }
    clone() { return new Vector3(this.x, this.y, this.z); }
    add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
    sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }
    multiplyScalar(s) { this.x *= s; this.y *= s; this.z *= s; return this; }
    lengthSq() { return this.x * this.x + this.y * this.y + this.z * this.z; }
    length() { return Math.sqrt(this.lengthSq()); }
    normalize() {
        let len = this.length();
        if (len > 0) { this.x /= len; this.y /= len; this.z /= len; }
        return this;
    }
    distanceTo(v) { return Math.sqrt((this.x - v.x)**2 + (this.y - v.y)**2 + (this.z - v.z)**2); }
    copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
}

class Matrix4 {
    constructor() {
        this.elements = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    identity() {
        this.elements.set([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
        return this;
    }
    copy(m) {
        this.elements.set(m.elements);
        return this;
    }
    multiplyMatrices(a, b) {
        let ae = a.elements;
        let be = b.elements;
        let te = this.elements;
        let a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
        let a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
        let a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
        let a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

        let b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
        let b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
        let b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
        let b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

        return this;
    }
    multiply(m) {
        return this.multiplyMatrices(this.clone(), m);
    }
    clone() {
        let te = this.elements;
        let m = new Matrix4();
        m.elements.set(te);
        return m;
    }
    makeTranslation(x, y, z) {
        this.elements.set([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]);
        return this;
    }
    makeRotationX(theta) {
        let c = Math.cos(theta), s = Math.sin(theta);
        this.elements.set([
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ]);
        return this;
    }
    makeRotationY(theta) {
        let c = Math.cos(theta), s = Math.sin(theta);
        this.elements.set([
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]);
        return this;
    }
    makeRotationZ(theta) {
        let c = Math.cos(theta), s = Math.sin(theta);
        this.elements.set([
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        return this;
    }
    makeScale(x, y, z) {
        this.elements.set([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ]);
        return this;
    }
    makePerspective(fov, aspect, near, far) {
        let f = 1.0 / Math.tan(fov / 2);
        let nf = 1 / (near - far);
        this.elements.set([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, (2 * far * near) * nf, 0
        ]);
        return this;
    }
    makeLookAt(eye, center, up) {
        let z0 = eye.x - center.x, z1 = eye.y - center.y, z2 = eye.z - center.z;
        let len = Math.sqrt(z0*z0 + z1*z1 + z2*z2);
        if (len > 0) { z0 /= len; z1 /= len; z2 /= len; }
        let x0 = up.y * z2 - up.z * z1, x1 = up.z * z0 - up.x * z2, x2 = up.x * z1 - up.y * z0;
        len = Math.sqrt(x0*x0 + x1*x1 + x2*x2);
        if (len > 0) { x0 /= len; x1 /= len; x2 /= len; }
        let y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0;
        this.elements.set([
            x0, y0, z0, 0,
            x1, y1, z1, 0,
            x2, y2, z2, 0,
            -(x0 * eye.x + x1 * eye.y + x2 * eye.z),
            -(y0 * eye.x + y1 * eye.y + y2 * eye.z),
            -(z0 * eye.x + z1 * eye.y + z2 * eye.z),
            1
        ]);
        return this;
    }
}
const VS_SOURCE = `
attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
    vec4 pos = uModelViewMatrix * aVertexPosition;
    vPosition = pos.xyz;
    gl_Position = uProjectionMatrix * pos;
    vNormal = mat3(uNormalMatrix) * aVertexNormal;
}
`;

const FS_SOURCE = `
precision mediump float;
varying vec3 vNormal;
varying vec3 vPosition;
uniform vec4 uColor;
uniform int uIsGround;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.5));
    float diff = max(dot(normal, lightDir), 0.2);

    vec4 finalColor = uColor;

    if (uIsGround == 1) {
        // Procedural grid
        float gx = fract(vPosition.x * 0.5);
        float gz = fract(vPosition.z * 0.5);
        if (gx < 0.05 || gz < 0.05) {
            finalColor.rgb *= 0.8;
        }
    }

    gl_FragColor = vec4(finalColor.rgb * diff, finalColor.a);
}
`;

let gl, program;
let positionBuffer, normalBuffer, indexBuffer;

function initWebGL() {
    const canvas = document.getElementById("glcanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl = canvas.getContext("webgl");
    if (!gl) { alert("WebGL not supported"); return; }

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, VS_SOURCE);
    gl.compileShader(vs);

    let fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, FS_SOURCE);
    gl.compileShader(fs);

    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    initBuffers();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    });
}

function initBuffers() {
    const positions = [
        // Front
        -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,  0.5,
        // Back
        -0.5, -0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5, -0.5,
        // Top
        -0.5,  0.5, -0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5, -0.5,
        // Bottom
        -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5,  0.5, -0.5, -0.5,  0.5,
        // Right
         0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,
        // Left
        -0.5, -0.5, -0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5,
    ];

    const normals = [
        // Front
         0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,
        // Back
         0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,
        // Top
         0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,
        // Bottom
         0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,
        // Right
         1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,
        // Left
        -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0,
    ];

    const indices = [
        0,  1,  2,      0,  2,  3,
        4,  5,  6,      4,  6,  7,
        8,  9,  10,     8,  10, 11,
        12, 13, 14,     12, 14, 15,
        16, 17, 18,     16, 18, 19,
        20, 21, 22,     20, 22, 23,
    ];

    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}

class Node {
    constructor(name) {
        this.name = name;
        this.position = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3(1, 1, 1);
        this.matrix = new Matrix4();
        this.color = [1, 1, 1, 1];
        this.children = [];
        this.velocity = new Vector3();
        this.isSleeping = false;
        this.life = 0;
        this.isSmoke = false;
        this.isBuilding = false;
        this.isDestroyed = false;
        this.health = 100;
        this.carried = false;
    }

    add(child) {
        this.children.push(child);
    }

    updateMatrix(parentMatrix) {
        let m = new Matrix4();
        m.multiply(new Matrix4().makeTranslation(this.position.x, this.position.y, this.position.z));
        m.multiply(new Matrix4().makeRotationY(this.rotation.y));
        m.multiply(new Matrix4().makeRotationX(this.rotation.x));
        m.multiply(new Matrix4().makeRotationZ(this.rotation.z));
        m.multiply(new Matrix4().makeScale(this.scale.x, this.scale.y, this.scale.z));

        if (parentMatrix) {
            this.matrix.multiplyMatrices(parentMatrix, m);
        } else {
            this.matrix.copy(m);
        }

        for (let child of this.children) {
            child.updateMatrix(this.matrix);
        }
    }

    draw(gl, program, viewMatrix, projectionMatrix) {
        let mv = new Matrix4().multiplyMatrices(viewMatrix, this.matrix);
        let norm = new Matrix4().copy(mv);

        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uModelViewMatrix'), false, mv.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uProjectionMatrix'), false, projectionMatrix.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uNormalMatrix'), false, norm.elements);
        gl.uniform4fv(gl.getUniformLocation(program, 'uColor'), this.color);
        gl.uniform1i(gl.getUniformLocation(program, 'uIsGround'), 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(gl.getAttribLocation(program, 'aVertexPosition'), 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(gl.getAttribLocation(program, 'aVertexPosition'));

        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(gl.getAttribLocation(program, 'aVertexNormal'), 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(gl.getAttribLocation(program, 'aVertexNormal'));

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

        for (let child of this.children) {
            child.draw(gl, program, viewMatrix, projectionMatrix);
        }
    }

    getGlobalPosition(parentMatrix) {
        let m = new Matrix4();
        m.multiply(new Matrix4().makeTranslation(this.position.x, this.position.y, this.position.z));
        let worldMatrix = new Matrix4();
        if (parentMatrix) {
            worldMatrix.multiplyMatrices(parentMatrix, m);
        } else {
            worldMatrix.copy(m);
        }
        return new Vector3(worldMatrix.elements[12], worldMatrix.elements[13], worldMatrix.elements[14]);
    }
}

// Variables
let d9Root, chassisNode, bladeArms, bladeNode, ripperNode, ripperPivot;
let treadOffset = 0;

function buildD9() {
    d9Root = new Node("D9_Root");

    // Chassis
    chassisNode = new Node("Chassis");
    chassisNode.scale.set(2.5, 1.5, 4.0);
    chassisNode.color = [0.95, 0.8, 0.1, 1.0];
    chassisNode.position.set(0, 1.0, 0);
    d9Root.add(chassisNode);

    // Cab
    let cab = new Node("Cab");
    cab.scale.set(1.5, 1.2, 1.5);
    cab.position.set(0, 1.35, -0.5);
    cab.color = [0.2, 0.2, 0.2, 1.0];
    chassisNode.add(cab);

    // Exhaust Pipe
    let pipe = new Node("Exhaust");
    pipe.scale.set(0.2, 1.5, 0.2);
    pipe.position.set(0.6, 1.0, 1.0);
    pipe.color = [0.1, 0.1, 0.1, 1.0];
    chassisNode.add(pipe);

    // Treads
    let treadL = new Node("TreadL");
    treadL.scale.set(0.8, 1.2, 4.5);
    treadL.position.set(-1.6, -0.2, 0);
    treadL.color = [0.15, 0.15, 0.15, 1.0];
    chassisNode.add(treadL);

    let treadR = new Node("TreadR");
    treadR.scale.set(0.8, 1.2, 4.5);
    treadR.position.set(1.6, -0.2, 0);
    treadR.color = [0.15, 0.15, 0.15, 1.0];
    chassisNode.add(treadR);

    // Blade Arms (Pivot at center of chassis)
    bladeArms = new Node("BladeArms");
    bladeArms.position.set(0, 0.5, 0);
    d9Root.add(bladeArms);

    // Arm Beams
    let armL = new Node("ArmL");
    armL.scale.set(0.2, 0.4, 3.0);
    armL.position.set(-1.8, 0, 1.5);
    armL.color = [0.8, 0.6, 0.1, 1.0];
    bladeArms.add(armL);

    let armR = new Node("ArmR");
    armR.scale.set(0.2, 0.4, 3.0);
    armR.position.set(1.8, 0, 1.5);
    armR.color = [0.8, 0.6, 0.1, 1.0];
    bladeArms.add(armR);

    // Blade Pivot (Front of arms)
    let bladePivot = new Node("BladePivot");
    bladePivot.position.set(0, 0, 3.0);
    bladeArms.add(bladePivot);

    // Blade Center
    bladeNode = new Node("BladeCenter");
    bladeNode.scale.set(3.8, 1.5, 0.3);
    bladeNode.position.set(0, 0.2, 0);
    bladeNode.rotation.x = -Math.PI / 8; // Slightly curved back
    bladeNode.color = [0.7, 0.7, 0.7, 1.0];
    bladePivot.add(bladeNode);

    // Blade Edges (Curve forward slightly)
    let bladeEdgeL = new Node("BladeL");
    bladeEdgeL.scale.set(0.5, 1.5, 0.4);
    bladeEdgeL.position.set(-1.9, 0, 0.1);
    bladeEdgeL.rotation.y = -Math.PI / 16;
    bladeEdgeL.color = [0.7, 0.7, 0.7, 1.0];
    bladeNode.add(bladeEdgeL);

    let bladeEdgeR = new Node("BladeR");
    bladeEdgeR.scale.set(0.5, 1.5, 0.4);
    bladeEdgeR.position.set(1.9, 0, 0.1);
    bladeEdgeR.rotation.y = Math.PI / 16;
    bladeEdgeR.color = [0.7, 0.7, 0.7, 1.0];
    bladeNode.add(bladeEdgeR);

    // Rear Ripper Shank Assembly
    ripperPivot = new Node("RipperPivot");
    ripperPivot.position.set(0, 0.5, -2.0); // Back of chassis
    ripperPivot.rotation.x = Math.PI / 8; // Default raised position
    d9Root.add(ripperPivot);

    // Shank arm extending back and down
    let shankArm = new Node("ShankArm");
    shankArm.scale.set(0.3, 0.3, 1.5);
    shankArm.position.set(0, 0, -0.75);
    shankArm.color = [0.8, 0.6, 0.1, 1.0];
    shankArm.rotation.x = Math.PI / 4;
    ripperPivot.add(shankArm);

    // The actual ripper claw digging in
    ripperNode = new Node("RipperClaw");
    ripperNode.scale.set(0.2, 1.0, 0.2);
    ripperNode.position.set(0, -0.5, -0.5);
    ripperNode.color = [0.4, 0.4, 0.4, 1.0];
    ripperNode.rotation.x = -Math.PI / 6;
    shankArm.add(ripperNode);

    d9Root.position.set(0, 1.0, 0);
}

const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

let d9Velocity = 0;
let d9VelocityY = 0;
let d9AngularVelocity = 0;
const CHAIN_LENGTH = 15.0;
let chainedVehicle = null;

let engineFuel = 100;
let maxFuel = 100;
let engineHeat = 0;
let enginePower = 1.0;
let baseMoveSpeed = 10.0;
let bladeDragReduction = 0;
let isEngineDead = false;

// Helpers
function buildFuelTruck() {
    let root = new Node("Oshkosh");
    let cab = new Node("TruckCab");
    cab.scale.set(2.2, 1.8, 2.5);
    cab.position.set(0, 0, 2);
    cab.color = [0.8, 0.7, 0.2, 1.0];
    root.add(cab);
    let tank = new Node("FuelTank");
    tank.scale.set(2.0, 2.0, 5.0);
    tank.position.set(0, 0, -2);
    tank.color = [0.7, 0.6, 0.2, 1.0];
    root.add(tank);
    for(let i=0; i<3; i++) {
        let zPos = 2.5 - i * 2.5;
        let wL = new Node("WheelL"); wL.scale.set(0.5, 1.0, 1.0); wL.position.set(-1.3, -0.6, zPos); wL.color = [0.1, 0.1, 0.1, 1.0]; root.add(wL);
        let wR = new Node("WheelR"); wR.scale.set(0.5, 1.0, 1.0); wR.position.set(1.3, -0.6, zPos); wR.color = [0.1, 0.1, 0.1, 1.0]; root.add(wR);
    }
    return root;
}

function buildTank() {
    let t = new Node("Tank");
    let body = new Node("TankBody");
    body.scale.set(3, 1.2, 5);
    body.color = [0.3, 0.4, 0.2, 1.0];
    t.add(body);
    let turret = new Node("TankTurret");
    turret.scale.set(2, 1, 2.5);
    turret.position.set(0, 1.1, -0.5);
    turret.color = [0.25, 0.35, 0.15, 1.0];
    t.add(turret);
    let barrel = new Node("TankBarrel");
    barrel.scale.set(0.4, 0.4, 3.5);
    barrel.position.set(0, 1.4, 1.5);
    barrel.color = [0.2, 0.3, 0.1, 1.0];
    t.add(barrel);

    let muzzleFlash = new Node("MuzzleFlash");
    muzzleFlash.scale.set(1.5, 1.5, 1.5);
    muzzleFlash.position.set(0, 1.4, 3.5);
    muzzleFlash.color = [1.0, 0.5, 0.0, 0.0]; // invisible by default
    t.add(muzzleFlash);
    t.muzzleFlashNode = muzzleFlash;
    t.lastFire = 0;
    return t;
}

function buildSoldier(isEnemy=true, x=0, z=0) {
    let sRoot = new Node(isEnemy ? "EnemyRoot" : "AllyRoot");
    sRoot.position.set(x, 1.0, z);
    let body = new Node("Body");
    body.scale.set(0.8, 1.2, 0.8);
    body.color = isEnemy ? [0.8, 0.0, 0.0, 1.0] : [0.0, 0.0, 0.8, 1.0];
    sRoot.add(body);
    let head = new Node("Head");
    head.scale.set(0.5, 0.5, 0.5);
    head.position.set(0, 0.8, 0);
    head.color = isEnemy ? [0.8, 0.0, 0.0, 1.0] : [0.0, 0.0, 0.8, 1.0];
    sRoot.add(head);
    sRoot.isEnemy = isEnemy;
    sRoot.isDead = false;
    return sRoot;
}

function updateControls(dt) {
    if (gameState !== "PLAYING" || isEngineDead) return;

    let moveForce = 0;
    let turnForce = 0;

    // Up/Down Arrows: Translate along local Z
    if (keys['ArrowUp']) moveForce = (baseMoveSpeed * enginePower) * dt;
    if (keys['ArrowDown']) moveForce = -(baseMoveSpeed * enginePower * 0.5) * dt; // slower reverse

    // Left/Right Arrows: Skid steer rotation around local Y
    if (keys['ArrowLeft']) turnForce = 2.0 * dt;
    if (keys['ArrowRight']) turnForce = -2.0 * dt;

    d9Velocity += (moveForce - d9Velocity) * 5 * dt;
    d9AngularVelocity += (turnForce - d9AngularVelocity) * 10 * dt;

    d9Root.position.x += Math.sin(d9Root.rotation.y) * d9Velocity;
    d9Root.position.z += Math.cos(d9Root.rotation.y) * d9Velocity;
    d9Root.rotation.y += d9AngularVelocity;

    // < / > : Raise/Lower Blade
    if (keys[','] || keys['<']) {
        bladeArms.rotation.x -= 1.0 * dt; // Tip up
        if (bladeArms.rotation.x < -Math.PI / 6) bladeArms.rotation.x = -Math.PI / 6;
    }
    if (keys['.'] || keys['>']) {
        bladeArms.rotation.x += 1.0 * dt; // Tip down
        if (bladeArms.rotation.x > Math.PI / 8) bladeArms.rotation.x = Math.PI / 8;
    }

    // ; / ' : Raise/Lower Ripper Shank
    if (keys[';'] || keys[':']) {
        ripperPivot.rotation.x -= 2.0 * dt;
        if (ripperPivot.rotation.x < -Math.PI / 4) ripperPivot.rotation.x = -Math.PI / 4;
    }
    if (keys["'"] || keys['"']) {
        ripperPivot.rotation.x += 2.0 * dt;
        if (ripperPivot.rotation.x > Math.PI / 4) ripperPivot.rotation.x = Math.PI / 4;
    }

    // G: Garage
    if (keys['g'] || keys['G']) {
        openGarage();
        keys['g'] = false;
        keys['G'] = false;
    }

    // F: Refuel Truck
    if (keys['f'] || keys['F']) {
        if (!gameFuelTruck && gameState === "PLAYING") {
            gameFuelTruck = buildFuelTruck();
            gameFuelTruck.position.set(d9Root.position.x - 10, d9Root.position.y, d9Root.position.z - 30);
        }
        keys['f'] = false;
    }

    // C: Rope Towing to Shank
    if (keys['c'] || keys['C']) {
        if (chainedVehicle) {
            chainedVehicle = null;
        } else {
            let vehicles = [gameTank, gameAPC, gameFuelTruck].filter(v => v !== null);
            let closest = null;
            let minDist = CHAIN_LENGTH * CHAIN_LENGTH;
            d9Root.updateMatrix(null);
            let shankPos = ripperNode.getGlobalPosition(d9Root.matrix);
            for (let v of vehicles) {
                let distSq = new Vector3().copy(v.position).sub(shankPos).lengthSq();
                if (distSq < minDist) {
                    minDist = distSq;
                    closest = v;
                }
            }
            if (closest) chainedVehicle = closest;
        }
        keys['c'] = false;
        keys['C'] = false;
    }

    // Heat & Fuel simulation
    if (Math.abs(d9Velocity) > 0.05) {
        engineFuel -= 0.5 * dt;
        if (engineFuel < 0) engineFuel = 0;
        engineHeat += (Math.abs(d9Velocity) * 2.0) * dt;
        if (engineHeat > 100) engineHeat = 100;
    } else {
        engineHeat -= 5.0 * dt;
        if (engineHeat < 0) engineHeat = 0;
    }

    if (engineHeat >= 100 || engineFuel <= 0) {
        isEngineDead = true;
    }
}

let sceneBuildings = [];
let dirtBoxes = [];
let limbs = [];
let particles = [];
let soldiers = [];
let gameTank = null;
let gameAPC = null;
let gameFuelTruck = null;

let currentLevel = 0;
let gameState = "MENU";
let gameWon = false;
let coffeeCurrency = 0;

function addCoffee(amount) {
    coffeeCurrency += amount;
    let ui = document.getElementById("coffeeCount");
    if (ui) ui.innerText = coffeeCurrency;
}

function getTerrainHeightBase(x, z) {
    return 0; // Flat terrain to perfectly match the visual ground plane
}

function getTerrainHeight(x, z) {
    let baseH = getTerrainHeightBase(x, z);
    // Add soft ramp over sleeping dirt piles
    for(let d of dirtBoxes) {
        if (!d.isSleeping || d.isSmoke) continue;
        let dist = Math.sqrt((d.position.x - x)**2 + (d.position.z - z)**2);
        if (dist < d.radius * 2.5) {
            let pileTop = d.position.y + (d.scale.y / 2);
            if (pileTop > baseH + 0.5) {
                return pileTop;
            }
        }
    }
    return baseH;
}

function checkAABBCollision(posA, sizeA, posB, sizeB) {
    return (Math.abs(posA.x - posB.x) * 2 < (sizeA.x + sizeB.x)) &&
           (Math.abs(posA.y - posB.y) * 2 < (sizeA.y + sizeB.y)) &&
           (Math.abs(posA.z - posB.z) * 2 < (sizeA.z + sizeB.z));
}

function spawnDirt(pos) {
    let d = new Node("Dirt");
    let s = 1.0 + Math.random();
    d.scale.set(s, s, s);
    d.position.copy(pos);
    d.color = [0.4, 0.25, 0.15, 1.0];
    d.velocity = new Vector3((Math.random()-0.5)*2, 2.0+Math.random()*2, (Math.random()-0.5)*2);
    d.radius = s * 0.6;
    d.isSleeping = false;
    dirtBoxes.push(d);
}

function initParticles() {
    for (let i = 0; i < 50; i++) {
        let p = {
            node: new Node("Particle" + i),
            velocity: new Vector3(),
            life: 0,
            maxLife: 1.0,
            active: false
        };
        p.node.scale.set(0.3, 0.3, 0.3);
        particles.push(p);
    }
}

function createBuilding(name, w, h, d, x, z, color) {
    let b = new Node(name);
    b.scale.set(w, h, d);
    let terrainY = getTerrainHeightBase(x, z);
    b.position.set(x, terrainY + h / 2, z);
    b.color = color;
    b.isBuilding = true;
    b.health = 100;
    b.maxHealth = 100;

    // Procedural details
    let door = new Node("Door");
    door.scale.set(2.0, 3.0, 0.3);
    door.position.set(0, -h/2 + 1.5, d/2 + 0.1);
    door.color = [0.3, 0.2, 0.1, 1.0];
    b.add(door);

    let nX = Math.max(1, Math.floor(w / 3));
    let nY = Math.max(1, Math.floor(h / 4));
    for(let i=0; i<nX; i++) {
        for(let j=0; j<nY; j++) {
            if (j === 0 && Math.abs((i - nX/2 + 0.5) * 3) < 1.5) continue; // skip door
            if (Math.random() > 0.2) {
                let wx = (i - nX/2 + 0.5) * 3;
                let wy = (j - nY/2 + 0.5) * 4;
                let wz = d/2 + 0.1;

                let isArc = Math.random() > 0.5;
                let wF = new Node("WindowF");
                wF.scale.set(1.5, isArc ? 2.0 : 1.5, 0.2);
                wF.position.set(wx, wy, wz);
                wF.color = [0.2, 0.2, 0.3, 1.0];
                b.add(wF);

                if (Math.random() > 0.7) {
                    let blanket = new Node("Blanket");
                    blanket.scale.set(1.6, 1.8, 0.3);
                    blanket.position.set(wx, wy + 0.1, wz + 0.1);
                    blanket.color = [0.6, 0.5, 0.4, 1.0];
                    b.add(blanket);
                }
            }
        }
    }
    return b;
}

function openGarage() {
    gameState = "GARAGE";
    document.getElementById('garageMenu').style.display = 'block';
    updateGarageUI();
}
function closeGarage() {
    gameState = "PLAYING";
    document.getElementById('garageMenu').style.display = 'none';
}

const garageUpgrades = {
    engine: { cost: 10, level: 0, maxLevel: 5 },
    fuel: { cost: 15, level: 0, maxLevel: 5 },
    cooling: { cost: 15, level: 0, maxLevel: 5 },
    blade: { cost: 20, level: 0, maxLevel: 5 }
};

function buyUpgrade(type) {
    const upg = garageUpgrades[type];
    if (upg && coffeeCurrency >= upg.cost && upg.level < upg.maxLevel) {
        addCoffee(-upg.cost);
        upg.level++;
        upg.cost = Math.floor(upg.cost * 1.5);
        updateGarageUI();
        if (type === 'fuel') engineFuel = 100;
        if (type === 'cooling') engineHeat = 0;
    }
}

function updateGarageUI() {
    for (const [key, upg] of Object.entries(garageUpgrades)) {
        const btn = document.querySelector(`#upg${key.charAt(0).toUpperCase() + key.slice(1)} button`);
        if (btn) {
            if (upg.level >= upg.maxLevel) {
                btn.innerHTML = "MAXED";
                btn.disabled = true;
            } else {
                btn.innerHTML = `Buy (${upg.cost} <svg width="1em" height="1.3em" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style="vertical-align: -0.25em;"><rect x="10" y="20" width="80" height="90" rx="5" fill="#C1121F"/><rect x="10" y="20" width="80" height="20" fill="#1A1A1A"/><path d="M10 20 Q 50 10 90 20 Z" fill="#1A1A1A"/><path d="M30 60 L50 45 L70 60 L60 85 L40 85 Z" fill="#FDF0D5"/><rect x="10" y="40" width="80" height="4" fill="#1A1A1A"/><rect x="10" y="100" width="80" height="4" fill="#1A1A1A"/></svg>)`;
                btn.disabled = coffeeCurrency < upg.cost;
            }
        }
    }
}

function loadLevel(levelIndex) {
    currentLevel = levelIndex;
    gameWon = false;
    gameState = "PLAYING";

    d9Root.position.set(0, 1, 0);
    d9Root.rotation.set(0, 0, 0);
    d9Velocity = 0;
    d9AngularVelocity = 0;

    dirtBoxes = [];
    limbs = [];
    particles.forEach(p => p.active = false);
    sceneBuildings = [];
    soldiers = [];
    gameTank = null;
    gameAPC = null;
    gameFuelTruck = null;

    if (levelIndex === 1) {
        currentMissionType = 1;
        document.getElementById("objectiveText").innerText = `Mission 1: Clear the rubble!`;
        // Spawn dirt right in front
        for(let i=0; i<30; i++) {
            let d = new Node("Dirt");
            let s = 1.0 + Math.random()*2.0;
            d.scale.set(s,s,s);
            d.position.set(-5 + Math.random()*10, 5, 10 + Math.random()*10);
            d.color = [0.8, 0.4, 0.2, 1.0];
            d.velocity = new Vector3();
            d.isSleeping = false;
            d.radius = s*0.6;
            dirtBoxes.push(d);
        }
    } else {
        currentMissionType = 2;
        document.getElementById("objectiveText").innerText = `Mission ${levelIndex}: Escort the Tank through Ambush!`;
        gameTank = buildTank();
        gameTank.position.set(0, 1.5, -15);
        for(let i=0; i<10 + (levelIndex*2); i++) {
            soldiers.push(buildSoldier(true, (Math.random()-0.5)*40, 20 + Math.random()*30));
        }
        for(let i=0; i<5; i++) {
            let x = (Math.random()-0.5)*60;
            let z = 20 + Math.random()*50;
            sceneBuildings.push(createBuilding("Bldg", 10, 20, 10, x, z, [0.5, 0.5, 0.5, 1.0]));
        }
    }
}

function advanceLevel() {
    if (gameWon) return; // Prevent multiple triggers
    gameWon = true;
    addCoffee(50); // Big reward for beating level

    setTimeout(() => {
        let lMenu = document.getElementById("levelCompleteMenu");
        if(lMenu) lMenu.style.display = "flex";

        // Spawn fuel truck and refuel
        if (!gameFuelTruck) {
            gameFuelTruck = buildFuelTruck();
            if(d9Root) gameFuelTruck.position.set(d9Root.position.x - 10, d9Root.position.y, d9Root.position.z - 30);
        }

        setTimeout(() => {
            let rStats = document.getElementById("refuelStats");
            if(rStats) rStats.innerHTML += "<p style='color: #00ff00; font-weight: bold;'>Refueled and Repaired!</p>";
            engineHeat = 0;
            engineFuel = maxFuel;
            isEngineDead = false;
            let nBtn = document.getElementById("nextLevelBtn");
            if(nBtn) nBtn.style.display = "block";

            if(gameFuelTruck) gameFuelTruck.leaving = true;
        }, 3000);

    }, 2000);
}
let lastTime = 0;

function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    let dt = (timestamp - lastTime) / 1000.0;
    if (dt > 0.1) dt = 0.1;

    updateControls(dt);

    // D9 Ground Collision & Pitch/Roll
    let d9Forward = new Vector3(Math.sin(d9Root.rotation.y), 0, Math.cos(d9Root.rotation.y));
    let d9Right = new Vector3(Math.sin(d9Root.rotation.y + Math.PI / 2), 0, Math.cos(d9Root.rotation.y + Math.PI / 2));
    let chassisPos = d9Root.position;

    let frontY = getTerrainHeightBase(chassisPos.x + d9Forward.x * 3.0, chassisPos.z + d9Forward.z * 3.0);
    let backY  = getTerrainHeightBase(chassisPos.x - d9Forward.x * 3.0, chassisPos.z - d9Forward.z * 3.0);
    let leftY  = getTerrainHeightBase(chassisPos.x + d9Right.x * 2.0,   chassisPos.z + d9Right.z * 2.0);
    let rightY = getTerrainHeightBase(chassisPos.x - d9Right.x * 2.0,   chassisPos.z - d9Right.z * 2.0);

    let targetPitch = Math.atan2(frontY - backY, 6.0) * 0.5;
    let targetRoll  = Math.atan2(leftY - rightY, 4.0) * 0.5;

    d9Root.rotation.x += (targetPitch - d9Root.rotation.x) * 5 * dt;
    d9Root.rotation.z += (targetRoll - d9Root.rotation.z) * 5 * dt;

    let centerTerrainY = getTerrainHeight(chassisPos.x, chassisPos.z);
    d9Root.position.y += (centerTerrainY + 1.0 - d9Root.position.y) * 15 * dt;

    d9Root.updateMatrix(null);
    let bladeWorldPos = bladeNode.getGlobalPosition(d9Root.matrix);

    // Ripper Digging
    let ripperWorldPos = ripperNode.getGlobalPosition(d9Root.matrix);
    let ripperTerrainY = getTerrainHeightBase(ripperWorldPos.x, ripperWorldPos.z);
    if (ripperWorldPos.y < ripperTerrainY && d9Velocity > 0.5 && Math.random() < 0.2) {
        spawnDirt(new Vector3(ripperWorldPos.x, ripperTerrainY + 0.5, ripperWorldPos.z));
    }

    // Dirt Physics
    for (let i = 0; i < dirtBoxes.length; i++) {
        let d = dirtBoxes[i];
        if (d.isSmoke) {
            d.life -= dt;
            d.position.y += 2.0 * dt;
            d.color[3] = Math.max(0, d.life / 2.0);
            if (d.life <= 0) { dirtBoxes.splice(i, 1); i--; }
            continue;
        }

        if (d.isSleeping && d.position.y < bladeWorldPos.y) continue; // Optimization

        if (!d.carried) {
            d.velocity.y -= 9.8 * dt; // Gravity
            d.position.add(d.velocity.clone().multiplyScalar(dt)); // Use clone so we don't mutate velocity
            d.velocity.x *= 0.95;
            d.velocity.z *= 0.95;
        }

        // Blade Collision
        let bladeTilt = bladeArms.rotation.x;
        let diff = new Vector3().copy(d.position).sub(bladeWorldPos);
        if (diff.lengthSq() < 16.0) { // Broad phase
            let dx = d.position.x - bladeWorldPos.x;
            let dy = d.position.y - bladeWorldPos.y;
            let dz = d.position.z - bladeWorldPos.z;

            // Simple box check vs blade
            if (Math.abs(dx) < 2.0 && Math.abs(dz) < 1.0 && Math.abs(dy) < 1.5) {
                if (bladeTilt > 0.1) {
                    // Carry mode
                    d.position.x = bladeWorldPos.x + dx * 0.5;
                    d.position.z = bladeWorldPos.z + dz * 0.5;
                    d.position.y = bladeWorldPos.y + 0.8;
                    d.carried = true;
                } else {
                    // Push mode
                    d.carried = false;
                    let pushDir = new Vector3(dx, 0, dz).normalize();
                    let pushSpeed = (enginePower * 2) * dt * 1.5;
                    if (bladeTilt < -0.1) pushSpeed *= 0.1; // precise drop

                    d.position.x += (pushDir.x + d9Forward.x * 2.0) * pushSpeed;
                    d.position.z += (pushDir.z + d9Forward.z * 2.0) * pushSpeed;
                    if (bladeTilt > -0.1) {
                        d.position.y += 2.0 * dt;
                    }
                }
            } else {
                d.carried = false;
            }
        } else {
            d.carried = false;
        }

        // Debris vs Debris stacking
        for (let j = i + 1; j < dirtBoxes.length; j++) {
            let d2 = dirtBoxes[j];
            if (d2.isSmoke) continue;
            let distY = Math.abs(d.position.y - d2.position.y);
            let distX = Math.abs(d.position.x - d2.position.x);
            let distZ = Math.abs(d.position.z - d2.position.z);

            if (distX < d.radius * 1.5 && distZ < d.radius * 1.5) { // Loosen horizontal tolerance for stacking
                if (distY < d.radius * 2.0) {
                    if (d.position.y > d2.position.y) {
                        d.position.y = d2.position.y + d2.radius * 2.0;
                        d.velocity.y = 0;
                    } else {
                        d2.position.y = d.position.y + d.radius * 2.0;
                        d2.velocity.y = 0;
                    }
                }
            } else {
                let dist = d.position.distanceTo(d2.position);
                let minDist = d.radius + d2.radius;
                if (dist < minDist && dist > 0.01) {
                    let overlap = minDist - dist;
                    let pushDir = new Vector3().copy(d.position).sub(d2.position);
                    pushDir.y = 0; pushDir.normalize();
                    let pushForce = pushDir.multiplyScalar(overlap * 2.0 * dt);
                    d.position.add(pushForce);
                    d2.position.sub(pushForce);
                }
            }
        }

        // Terrain Collision
        let ty = getTerrainHeightBase(d.position.x, d.position.z);
        if (d.position.y <= ty + d.radius) {
            d.position.y = ty + d.radius;
            d.velocity.y = 0;
            if (Math.abs(d.velocity.x) < 0.2 && Math.abs(d.velocity.z) < 0.2) {
                d.isSleeping = true;
                d.velocity.set(0,0,0);
            }
        }
    }

    // Vehicle AI updates
    if (gameFuelTruck) {
        if (gameFuelTruck.leaving) {
            gameFuelTruck.position.z += 30.0 * dt;
            gameFuelTruck.position.y = getTerrainHeight(gameFuelTruck.position.x, gameFuelTruck.position.z) + 1.5;
            if (gameFuelTruck.position.z > d9Root.position.z + 200) gameFuelTruck = null;
        }
    }

    if (gameTank && !gameWon) {
        if (gameTank.position.z < d9Root.position.z - 20) {
            gameTank.position.z += 5.0 * dt;
        }
        if (Math.random() < 0.2) {
            spawnDirt(new Vector3(gameTank.position.x, gameTank.position.y + 3.0, gameTank.position.z - 2.0));
            let smoke = dirtBoxes[dirtBoxes.length-1];
            smoke.color = [0.1, 0.1, 0.1, 0.8];
            smoke.scale.set(0.5, 0.5, 0.5);
            smoke.isSmoke = true;
            smoke.life = 2.0;
        }
        if (timestamp - gameTank.lastFire > 2000) {
            gameTank.lastFire = timestamp;
            if (gameTank.muzzleFlashNode) {
                gameTank.muzzleFlashNode.color[3] = 1.0;
                setTimeout(() => { if (gameTank && gameTank.muzzleFlashNode) gameTank.muzzleFlashNode.color[3] = 0.0; }, 100);
            }
        }
        gameTank.position.y = getTerrainHeight(gameTank.position.x, gameTank.position.z) + 1.5;
    }

    if (chainedVehicle) {
        let shankPos = ripperNode.getGlobalPosition(d9Root.matrix);
        let diff = new Vector3().copy(chainedVehicle.position).sub(shankPos);
        let dist = diff.length();
        if (dist > CHAIN_LENGTH) {
            diff.normalize();
            chainedVehicle.position.copy(shankPos).add(diff.multiplyScalar(CHAIN_LENGTH));
        }
        chainedVehicle.position.y = getTerrainHeight(chainedVehicle.position.x, chainedVehicle.position.z) + 1.5;
    }

    soldiers.forEach(s => {
        if (s.isEnemy && !s.isDead && gameTank && s.position.distanceTo(gameTank.position) < 30.0) {
            let nearestBuilding = null;
            let minDist = 999;
            sceneBuildings.forEach(h => {
                let d = s.position.distanceTo(h.position);
                if (d < minDist && d < 40.0 && !h.isDestroyed) { minDist = d; nearestBuilding = h; }
            });
            if (nearestBuilding) {
                let toH = new Vector3().copy(nearestBuilding.position).sub(s.position);
                toH.y = 0;
                if (toH.length() > 2.0) {
                    toH.normalize();
                    s.position.add(toH.multiplyScalar(4.0 * dt));
                }
            }
        }
        s.position.y = getTerrainHeight(s.position.x, s.position.z) + 0.9;
    });

    // Check Win Condition
    let remain = 0;
    if (currentMissionType === 1) {
        for(let d of dirtBoxes) {
            if (d.position.z > 0 && Math.abs(d.position.x) < 5) remain++;
        }
        if (remain === 0 && !gameWon) advanceLevel();
    }

    // UI Updates
    document.getElementById("gaugeSpeed").style.width = Math.min(100, Math.abs(d9Velocity) * 10) + "%";
    document.getElementById("gaugeRPM").style.width = Math.min(100, Math.abs(d9Velocity) * 8 + 20) + "%";
    document.getElementById("gaugeHeat").style.width = engineHeat + "%";
    document.getElementById("gaugeFuel").style.width = engineFuel + "%";

    render();
    updateMinimap();

    lastTime = timestamp;
    requestAnimationFrame(gameLoop);
}

function updateMinimap() {
    let canvas = document.getElementById("minimapCanvas");
    if (!canvas) return;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let mapScale = 1.3;
    let offsetX = canvas.width / 2;
    let offsetY = canvas.height / 2;

    if (!d9Root) return;
    let px = -d9Root.position.x * mapScale + offsetX;
    let pz = -d9Root.position.z * mapScale + offsetY;

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    sceneBuildings.forEach(b => {
        if (!b.isDestroyed) ctx.fillRect(px + b.position.x * mapScale - 2, pz + b.position.z * mapScale - 2, 4, 4);
    });

    ctx.fillStyle = "#8B4513";
    dirtBoxes.forEach(d => {
        if (!d.isSmoke) ctx.fillRect(px + d.position.x * mapScale, pz + d.position.z * mapScale, 1.5, 1.5);
    });

    ctx.fillStyle = "red";
    soldiers.forEach(s => {
        if (s.isEnemy && !s.isDead) {
            ctx.beginPath();
            ctx.arc(px + s.position.x * mapScale, pz + s.position.z * mapScale, 2, 0, Math.PI*2);
            ctx.fill();
        }
    });

    ctx.save();
    ctx.translate(px + d9Root.position.x * mapScale, pz + d9Root.position.z * mapScale);
    ctx.rotate(d9Root.rotation.y);
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(3, 3);
    ctx.lineTo(-3, 3);
    ctx.fill();
    ctx.restore();
}

function render() {
    gl.clearColor(0.5, 0.7, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let viewMatrix = new Matrix4();
    let projectionMatrix = new Matrix4().makePerspective(Math.PI / 4, gl.canvas.width / gl.canvas.height, 0.1, 1000.0);

    // Camera
    let camOffset = new Vector3(Math.sin(d9Root.rotation.y) * -20, 10, Math.cos(d9Root.rotation.y) * -20);
    let cameraPos = new Vector3().copy(d9Root.position).add(camOffset);
    let targetPos = new Vector3().copy(d9Root.position);
    targetPos.y += 2.0;

    let terrainHeightAtCamera = getTerrainHeightBase(cameraPos.x, cameraPos.z);
    if (cameraPos.y < terrainHeightAtCamera + 0.5) cameraPos.y = terrainHeightAtCamera + 0.5;

    viewMatrix.makeLookAt(cameraPos, targetPos, new Vector3(0,1,0));

    if (d9Root) {
        gl.useProgram(program);
        d9Root.draw(gl, program, viewMatrix, projectionMatrix);
    }

    dirtBoxes.forEach(d => d.draw(gl, program, viewMatrix, projectionMatrix));
    sceneBuildings.forEach(b => { b.updateMatrix(null); b.draw(gl, program, viewMatrix, projectionMatrix); });
    soldiers.forEach(s => { s.updateMatrix(null); s.draw(gl, program, viewMatrix, projectionMatrix); });

    if (gameTank) { gameTank.updateMatrix(null); gameTank.draw(gl, program, viewMatrix, projectionMatrix); }
    if (gameFuelTruck) { gameFuelTruck.updateMatrix(null); gameFuelTruck.draw(gl, program, viewMatrix, projectionMatrix); }

    // Ground Plane
    let groundScale = 100;
    let groundMat = new Matrix4().makeScale(groundScale, 0.1, groundScale).multiply(new Matrix4().makeTranslation(0, -0.05, 0));
    let groundModelViewMatrix = new Matrix4().multiplyMatrices(viewMatrix, groundMat);
    let groundNormalMatrix = new Matrix4().copy(groundModelViewMatrix);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uModelViewMatrix'), false, groundModelViewMatrix.elements);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uProjectionMatrix'), false, projectionMatrix.elements);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uNormalMatrix'), false, groundNormalMatrix.elements);
    gl.uniform4fv(gl.getUniformLocation(program, 'uColor'), [0.3, 0.5, 0.2, 1.0]);
    gl.uniform1i(gl.getUniformLocation(program, 'uIsGround'), 1);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, 'aVertexPosition'), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, 'aVertexPosition'));
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, 'aVertexNormal'), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, 'aVertexNormal'));
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}

window.onload = () => {
    initWebGL();
    buildD9();
    initParticles();

    document.getElementById("startBtn").addEventListener("click", () => {
        document.getElementById("mainMenu").style.display = "none";
        document.getElementById("hud").style.display = "block";
        document.getElementById("minimapContainer").style.display = "block";
        loadLevel(1);
        requestAnimationFrame(gameLoop);
    });

    document.getElementById("helpBtn").addEventListener("click", () => {
        document.getElementById("helpMenu").style.display = "flex";
    });
    document.getElementById("closeHelpBtn").addEventListener("click", () => {
        document.getElementById("helpMenu").style.display = "none";
    });

    document.getElementById("nextLevelBtn").addEventListener("click", () => {
        document.getElementById("levelCompleteMenu").style.display = "none";
        document.getElementById("nextLevelBtn").style.display = "none";
        document.getElementById("refuelStats").innerHTML = `<p style="font-size: 20px; color: yellow;">Reward: <span style="font-weight: bold;">+50 Elite Coffee</span> <svg width="24" height="24" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;"><rect x="10" y="20" width="80" height="90" rx="5" fill="#C1121F"/><rect x="10" y="20" width="80" height="20" fill="#1A1A1A"/><path d="M10 20 Q 50 10 90 20 Z" fill="#1A1A1A"/><path d="M30 60 L50 45 L70 60 L60 85 L40 85 Z" fill="#FDF0D5"/><rect x="10" y="40" width="80" height="4" fill="#1A1A1A"/><rect x="10" y="100" width="80" height="4" fill="#1A1A1A"/></svg></p><p id="truckStatus">The Fuel Truck (Oshkosh) is arriving...</p>`;
        gameFuelTruck = null;
        loadLevel(currentLevel + 1);
    });

    document.getElementById("closeGarageBtn").addEventListener("click", closeGarage);
};
