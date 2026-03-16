// Math Library

class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        let len = this.length();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
        }
        return this;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        let x = this.x, y = this.y, z = this.z;
        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;
        return this;
    }
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
        this.elements.set([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        return this;
    }

    copy(m) {
        this.elements.set(m.elements);
        return this;
    }

    multiply(m) {
        return this.multiplyMatrices(this, m);
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

    makeLookAt(eye, target, up) {
        let z = new Vector3(eye.x - target.x, eye.y - target.y, eye.z - target.z).normalize();
        if (z.length() === 0) {
            z.z = 1;
        }
        let x = new Vector3().copy(up).cross(z).normalize();
        if (x.length() === 0) {
            if (Math.abs(up.z) === 1) z.x += 0.0001;
            else z.z += 0.0001;
            z.normalize();
            x.copy(up).cross(z).normalize();
        }
        let y = new Vector3().copy(z).cross(x);

        this.elements.set([
            x.x, y.x, z.x, 0,
            x.y, y.y, z.y, 0,
            x.z, y.z, z.z, 0,
            0, 0, 0, 1
        ]);

        let translation = new Matrix4().makeTranslation(-eye.x, -eye.y, -eye.z);
        return this.multiply(translation);
    }
}
// Add copy to Vector3
Vector3.prototype.copy = function(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
}

// WebGL Pipeline

let gl;
let program;
let positionBuffer;
let normalBuffer;
let colorBuffer;
let indexBuffer;

const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uNormalMatrix;
    uniform vec4 uColor;

    varying highp vec3 vLighting;
    varying lowp vec4 vColor;

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = uColor;

        // Apply lighting effect
        highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        highp vec3 directionalLightColor = vec3(1, 1, 1);
        highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 0.0);
        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        vLighting = ambientLight + (directionalLightColor * directional);
    }
`;

const fsSource = `
    varying highp vec3 vLighting;
    varying lowp vec4 vColor;

    void main(void) {
        gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
    }
`;

function initWebGL() {
    const canvas = document.getElementById('glcanvas');
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    // Resize canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    // Compile shaders
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create shader program
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
    }

    // Initialize Box Geometry Buffers
    initBuffers(gl);

    gl.clearColor(0.53, 0.81, 0.92, 1.0); // Sky blue
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initBuffers(gl) {
    // Basic cube geometry (1x1x1) centered at origin
    const positions = [
        // Front face
        -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,  0.5,
        // Back face
        -0.5, -0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5, -0.5,
        // Top face
        -0.5,  0.5, -0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5, -0.5,
        // Bottom face
        -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5,  0.5, -0.5, -0.5,  0.5,
        // Right face
         0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,
        // Left face
        -0.5, -0.5, -0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5,
    ];

    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const normals = [
        // Front
         0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,
        // Back
         0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,
        // Top
         0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,
        // Bottom
         0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,
        // Right
         1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,
        // Left
        -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0,
    ];

    normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];

    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}


// Scene Graph Node
class Node {
    constructor(name) {
        this.name = name;
        this.position = new Vector3();
        this.rotation = new Vector3(); // Euler angles (x,y,z)
        this.scale = new Vector3(1, 1, 1);

        this.localMatrix = new Matrix4();
        this.worldMatrix = new Matrix4();

        this.children = [];
        this.parent = null;

        this.color = [0.8, 0.8, 0.8, 1.0];
        this.isDrawable = true;
    }

    add(child) {
        this.children.push(child);
        child.parent = this;
    }

    updateMatrix(parentWorldMatrix) {
        // Compute local matrix
        let transMat = new Matrix4().makeTranslation(this.position.x, this.position.y, this.position.z);

        let rotXMat = new Matrix4().makeRotationX(this.rotation.x);
        let rotYMat = new Matrix4().makeRotationY(this.rotation.y);
        let rotZMat = new Matrix4().makeRotationZ(this.rotation.z);

        let rotMat = new Matrix4().multiplyMatrices(rotYMat, rotXMat).multiply(rotZMat);

        let scaleMat = new Matrix4().makeScale(this.scale.x, this.scale.y, this.scale.z);

        this.localMatrix.identity().multiply(transMat).multiply(rotMat).multiply(scaleMat);

        if (parentWorldMatrix) {
            this.worldMatrix.multiplyMatrices(parentWorldMatrix, this.localMatrix);
        } else {
            this.worldMatrix.copy(this.localMatrix);
        }

        for (let child of this.children) {
            child.updateMatrix(this.worldMatrix);
        }
    }

    draw(gl, program, viewMatrix, projectionMatrix) {
        if (this.isDrawable) {
            // uModelViewMatrix = viewMatrix * worldMatrix
            let modelViewMatrix = new Matrix4().multiplyMatrices(viewMatrix, this.worldMatrix);

            // Calculate normal matrix (transpose of inverse of modelViewMatrix)
            // For simple translation/rotation/uniform scale, modelViewMatrix is fine for normals if we just want basics
            // Actually, we should extract rotation/scale for normals. For now, modelViewMatrix works for non-skewed.
            let normalMatrix = new Matrix4().copy(modelViewMatrix);

            gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uModelViewMatrix'), false, modelViewMatrix.elements);
            gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uProjectionMatrix'), false, projectionMatrix.elements);
            gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uNormalMatrix'), false, normalMatrix.elements);
            gl.uniform4fv(gl.getUniformLocation(program, 'uColor'), this.color);

            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(gl.getAttribLocation(program, 'aVertexPosition'), 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(gl.getAttribLocation(program, 'aVertexPosition'));

            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            gl.vertexAttribPointer(gl.getAttribLocation(program, 'aVertexNormal'), 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(gl.getAttribLocation(program, 'aVertexNormal'));

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        }

        for (let child of this.children) {
            child.draw(gl, program, viewMatrix, projectionMatrix);
        }
    }
}

// Build D9
let d9Root;
let d9BladeArms;
let d9Blade;

function buildD9() {
    // Colors
    const yellow = [0.95, 0.76, 0.05, 1.0];
    const darkGray = [0.2, 0.2, 0.2, 1.0];
    const black = [0.1, 0.1, 0.1, 1.0];

    // Root: Chassis
    d9Root = new Node("Chassis");
    d9Root.scale.set(2, 1.5, 4); // Width, Height, Length
    d9Root.position.set(0, 1, 0);
    d9Root.color = yellow;

    // Child 1: Tracks
    let trackLeft = new Node("TrackLeft");
    trackLeft.scale.set(0.6, 1.2, 4.5);
    trackLeft.position.set(-1.4, -0.2, 0); // Local to chassis
    trackLeft.color = black;
    d9Root.add(trackLeft);

    let trackRight = new Node("TrackRight");
    trackRight.scale.set(0.6, 1.2, 4.5);
    trackRight.position.set(1.4, -0.2, 0);
    trackRight.color = black;
    d9Root.add(trackRight);

    // Child 2: Cab/Engine
    let cab = new Node("Cab");
    cab.scale.set(1.5, 1.5, 1.5);
    cab.position.set(0, 1.5, -0.5); // Towards the back
    cab.color = yellow;
    d9Root.add(cab);

    let engine = new Node("Engine");
    engine.scale.set(1.2, 1.0, 1.8);
    engine.position.set(0, 1.2, 1.2); // Towards the front
    engine.color = yellow;
    d9Root.add(engine);

    let exhaust = new Node("Exhaust");
    exhaust.scale.set(0.15, 1.0, 0.15);
    exhaust.position.set(0.4, 2.0, 1.5);
    exhaust.color = darkGray;
    d9Root.add(exhaust);

    // Child 3: Blade Arms
    d9BladeArms = new Node("BladeArms");
    // Pivot point near the middle of chassis
    d9BladeArms.position.set(0, 0, 0);
    d9BladeArms.isDrawable = false; // Just a pivot group
    d9Root.add(d9BladeArms);

    let armLeft = new Node("ArmLeft");
    armLeft.scale.set(0.2, 0.2, 3.5);
    armLeft.position.set(-1.1, 0, 1.5); // Extend forward
    armLeft.color = yellow;
    d9BladeArms.add(armLeft);

    let armRight = new Node("ArmRight");
    armRight.scale.set(0.2, 0.2, 3.5);
    armRight.position.set(1.1, 0, 1.5);
    armRight.color = yellow;
    d9BladeArms.add(armRight);

    // Child 4: Blade
    d9Blade = new Node("Blade");
    // Attach to the end of the arms
    d9Blade.position.set(0, 0, 3.2);
    d9Blade.isDrawable = false; // Group for blade parts
    d9BladeArms.add(d9Blade);

    let bladeCenter = new Node("BladeCenter");
    bladeCenter.scale.set(3.5, 1.5, 0.2);
    bladeCenter.position.set(0, 0, 0);
    bladeCenter.color = darkGray;
    d9Blade.add(bladeCenter);

    let bladeTop = new Node("BladeTop");
    bladeTop.scale.set(3.5, 0.4, 0.2);
    bladeTop.position.set(0, 0.8, -0.1);
    bladeTop.rotation.x = -0.3; // Curve forward slightly
    bladeTop.color = darkGray;
    d9Blade.add(bladeTop);

    let bladeBottom = new Node("BladeBottom");
    bladeBottom.scale.set(3.5, 0.4, 0.2);
    bladeBottom.position.set(0, -0.8, -0.1);
    bladeBottom.rotation.x = 0.3; // Curve backward slightly
    bladeBottom.color = darkGray;
    d9Blade.add(bladeBottom);
}


// Control Scheme & Kinematics
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function updateKinematics(dt) {
    if (!d9Root) return;

    const moveSpeed = 5.0 * dt;
    const turnSpeed = 1.5 * dt;
    const bladeSpeed = 1.0 * dt;

    // Left/Right: Rotation Y
    if (keys['ArrowLeft']) {
        d9Root.rotation.y += turnSpeed;
    }
    if (keys['ArrowRight']) {
        d9Root.rotation.y -= turnSpeed;
    }

    // Up/Down: Translate forward/backward along local Z
    let forward = new Vector3(Math.sin(d9Root.rotation.y), 0, Math.cos(d9Root.rotation.y));

    if (keys['ArrowUp']) {
        d9Root.position.add(new Vector3().copy(forward).multiplyScalar(moveSpeed));
    }
    if (keys['ArrowDown']) {
        d9Root.position.sub(new Vector3().copy(forward).multiplyScalar(moveSpeed));
    }

    // < / > : Raise/Lower Blade (Rotation X on BladeArms)
    if (keys[','] || keys['<']) {
        d9BladeArms.rotation.x -= bladeSpeed;
    }
    if (keys['.'] || keys['>']) {
        d9BladeArms.rotation.x += bladeSpeed;
    }

    // Clamp blade rotation to realistic limits
    d9BladeArms.rotation.x = Math.max(-0.4, Math.min(0.2, d9BladeArms.rotation.x));
}


// Dirt Pile & Physics Logic
let dirtBoxes = [];
const DIRT_COUNT = 150;
const DIRT_SIZE = 0.4;
const GRAVITY = 9.8;

function initDirt() {
    for (let i = 0; i < DIRT_COUNT; i++) {
        let x = (Math.random() - 0.5) * 6; // Cluster spread X
        let z = 8 + (Math.random() - 0.5) * 6; // Cluster spread Z (in front of start pos)
        let y = DIRT_SIZE / 2 + Math.random() * 2; // Initial fall height

        let dirt = new Node(`Dirt${i}`);
        dirt.position.set(x, y, z);
        dirt.scale.set(DIRT_SIZE, DIRT_SIZE, DIRT_SIZE);
        // Random brown color
        dirt.color = [0.4 + Math.random()*0.1, 0.2 + Math.random()*0.1, 0.1, 1.0];
        // Physics state
        dirt.velocity = new Vector3(0, 0, 0);
        dirt.isSleeping = false;

        dirtBoxes.push(dirt);
    }
}

// AABB collision utility
function checkAABBCollision(posA, sizeA, posB, sizeB) {
    return (
        Math.abs(posA.x - posB.x) < (sizeA.x + sizeB.x) / 2 &&
        Math.abs(posA.y - posB.y) < (sizeA.y + sizeB.y) / 2 &&
        Math.abs(posA.z - posB.z) < (sizeA.z + sizeB.z) / 2
    );
}

// We need to extract world position from the Blade matrix for AABB
// Since worldMatrix applies to unit cube, its translation column is the world position.
function getMatrixTranslation(matrix) {
    let e = matrix.elements;
    return new Vector3(e[12], e[13], e[14]);
}

function updatePhysics(dt) {
    if (!d9Blade) return;

    // Ensure matrices are up to date for D9
    d9Root.updateMatrix(null);

    // Blade world pos
    let bladeWorldPos = getMatrixTranslation(d9Blade.worldMatrix);

    // Approximate Blade AABB size in world space based on local scales.
    // The main blade center is 3.5 wide, 1.5 high, 0.2 deep.
    // This is an approximation as AABB should expand on rotation.
    // But for simplicity of this requirement:
    let bladeSize = new Vector3(3.5, 1.5, 0.2);
    // Expand a bit to catch dirt easily
    bladeSize.add(new Vector3(0.5, 0.5, 0.5));

    // Calculate D9 Forward Vector in World Space
    let forward = new Vector3(Math.sin(d9Root.rotation.y), 0, Math.cos(d9Root.rotation.y)).normalize();

    // Check collisions and push
    for (let dirt of dirtBoxes) {
        // Dirt size
        let dirtSize = new Vector3(DIRT_SIZE, DIRT_SIZE, DIRT_SIZE);

        // Simple AABB against the blade center world position
        // This acts like a bounding box around the blade's world center
        let hit = checkAABBCollision(dirt.position, dirtSize, bladeWorldPos, bladeSize);

        if (hit) {
            // Wake up
            dirt.isSleeping = false;

            // Push displacement: Match D9 forward vector + upward bias
            let pushForce = 5.0; // How hard we push
            let upwardBias = 2.0;

            dirt.velocity.x = forward.x * pushForce;
            dirt.velocity.z = forward.z * pushForce;
            // Add upward bias only if it's low down relative to blade
            if (dirt.position.y < bladeWorldPos.y + 0.5) {
               dirt.velocity.y = upwardBias;
            }
        } else {
            // Apply Gravity and damping
            if (!dirt.isSleeping) {
                dirt.velocity.y -= GRAVITY * dt;
            }
        }

        // Update Position
        if (!dirt.isSleeping) {
            let displacement = new Vector3().copy(dirt.velocity).multiplyScalar(dt);
            dirt.position.add(displacement);

            // Damping (Friction)
            dirt.velocity.x *= 0.9;
            dirt.velocity.z *= 0.9;

            // Ground collision
            if (dirt.position.y < DIRT_SIZE / 2) {
                dirt.position.y = DIRT_SIZE / 2;
                dirt.velocity.y = 0;

                // If moving very slow, sleep
                if (Math.abs(dirt.velocity.x) < 0.1 && Math.abs(dirt.velocity.z) < 0.1) {
                    dirt.isSleeping = true;
                    dirt.velocity.set(0,0,0);
                }
            }
        }

        dirt.updateMatrix(null);
    }
}

// Main Loop
let lastTime = 0;
let viewMatrix = new Matrix4();
let projectionMatrix = new Matrix4();

function render(now) {
    now *= 0.001; // convert to seconds
    const dt = now - lastTime;
    lastTime = now;

    // Update
    updateKinematics(dt);
    updatePhysics(dt);

    // Draw
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Camera setup
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    projectionMatrix.makePerspective(fieldOfView, aspect, zNear, zFar);

    // Make camera follow D9 loosely
    let cameraOffset = new Vector3(
        -Math.sin(d9Root.rotation.y) * 12,
        6,
        -Math.cos(d9Root.rotation.y) * 12
    );
    let cameraPos = new Vector3().copy(d9Root.position).add(cameraOffset);
    let targetPos = new Vector3().copy(d9Root.position);
    let up = new Vector3(0, 1, 0);

    viewMatrix.makeLookAt(cameraPos, targetPos, up);

    // Draw D9
    if (d9Root) {
        gl.useProgram(program);
        d9Root.draw(gl, program, viewMatrix, projectionMatrix);
    }

    // Draw Dirt
    for (let dirt of dirtBoxes) {
        dirt.draw(gl, program, viewMatrix, projectionMatrix);
    }

    // Ground plane (just a big flat box)
    let groundMat = new Matrix4().makeScale(100, 0.1, 100).multiply(new Matrix4().makeTranslation(0, -0.05, 0));
    let groundColor = [0.3, 0.5, 0.2, 1.0]; // Grass green

    let groundModelViewMatrix = new Matrix4().multiplyMatrices(viewMatrix, groundMat);
    let groundNormalMatrix = new Matrix4().copy(groundModelViewMatrix);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uModelViewMatrix'), false, groundModelViewMatrix.elements);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uProjectionMatrix'), false, projectionMatrix.elements);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uNormalMatrix'), false, groundNormalMatrix.elements);
    gl.uniform4fv(gl.getUniformLocation(program, 'uColor'), groundColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, 'aVertexPosition'), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, 'aVertexPosition'));

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, 'aVertexNormal'), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, 'aVertexNormal'));

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);


    requestAnimationFrame(render);
}

// Bootstrap
window.onload = () => {
    initWebGL();
    buildD9();
    initDirt();
    requestAnimationFrame(render);
};
