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

    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    distanceToSquared(v) {
        let dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
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
    distanceTo(v) {
        return Math.sqrt((this.x - v.x)**2 + (this.y - v.y)**2 + (this.z - v.z)**2);
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
    varying highp vec4 vWorldPos; // Expose world pos for checkerboard

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = uColor;
        vWorldPos = aVertexPosition; // We'll pass the scaled vertex pos for the ground

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
    varying highp vec4 vWorldPos;

    uniform bool uIsGround;

    void main(void) {
        highp vec4 baseColor = vColor;

        // Procedural Grid/Checkerboard for the ground plane to show scale/speed
        if (uIsGround) {
            // Scale world position for the grid size
            highp vec2 grid = floor(vWorldPos.xz * 1.0); // 1 unit grid blocks
            highp float checker = mod(grid.x + grid.y, 2.0);
            if (checker == 0.0) {
                baseColor.rgb *= 0.9; // Darken alternating squares slightly
            }
        }

        gl_FragColor = vec4(baseColor.rgb * vLighting, baseColor.a);
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

    // Dynamic sky color is handled in clear during render loop, set default here
    gl.clearColor(0.53, 0.81, 0.92, 1.0); // Sky blue
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Enable blending for transparent smoke
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
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

    // --- Generate Wavy Ground Mesh ---
    const size = 300;
    const segments = 50;
    const halfSize = size / 2;
    const segmentSize = size / segments;

    let groundPositions = [];
    let groundNormals = [];
    let groundIndices = [];

    for (let i = 0; i <= segments; i++) {
        let z = (i * segmentSize) - halfSize;
        for (let j = 0; j <= segments; j++) {
            let x = (j * segmentSize) - halfSize;
            let y = Math.sin(x * 0.1) * 2.0 + Math.cos(z * 0.1) * 2.0;

            groundPositions.push(x, y, z);

            // Analytical derivatives for normal
            // f(x,z) = 2*sin(0.1*x) + 2*cos(0.1*z)
            // df/dx = 0.2 * cos(0.1*x)
            // df/dz = -0.2 * sin(0.1*z)
            let dx = 0.2 * Math.cos(x * 0.1);
            let dz = -0.2 * Math.sin(z * 0.1);

            // Normal vector is (-df/dx, 1, -df/dz) normalized
            let nx = -dx;
            let ny = 1.0;
            let nz = -dz;
            let len = Math.sqrt(nx*nx + ny*ny + nz*nz);
            groundNormals.push(nx/len, ny/len, nz/len);
        }
    }

    for (let i = 0; i < segments; i++) {
        for (let j = 0; j < segments; j++) {
            let a = i * (segments + 1) + j;
            let b = a + 1;
            let c = (i + 1) * (segments + 1) + j;
            let d = c + 1;

            groundIndices.push(a, c, b);
            groundIndices.push(b, c, d);
        }
    }

    groundIndexCount = groundIndices.length;

    groundPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, groundPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(groundPositions), gl.STATIC_DRAW);

    groundNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, groundNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(groundNormals), gl.STATIC_DRAW);

    groundIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, groundIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(groundIndices), gl.STATIC_DRAW);
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
            // Default uIsGround to false for nodes
            gl.uniform1i(gl.getUniformLocation(program, 'uIsGround'), 0);

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
let d9Exhaust;


let d9TreadsLeft = [];
let d9TreadsRight = [];
let treadOffset = 0;

// Helper to define the triangular perimeter
const trackLength = 2.8;
const trackHeight = 1.5;
const sprocketY = 0.5; // Top wheel
const wheelR = 0.3;

function buildTreads(parentNode, color) {
    // Top elevated drive sprocket
    let topWheel = new Node("TopWheel");
    topWheel.scale.set(0.7, wheelR * 2, wheelR * 2);
    topWheel.position.set(0, sprocketY, -trackLength / 2 + 0.5);
    topWheel.color = [0.15, 0.15, 0.15, 1.0];
    parentNode.add(topWheel);

    // Front bottom idler
    let frontWheel = new Node("FrontWheel");
    frontWheel.scale.set(0.7, wheelR * 2, wheelR * 2);
    frontWheel.position.set(0, -trackHeight / 2 + wheelR, trackLength / 2);
    frontWheel.color = [0.15, 0.15, 0.15, 1.0];
    parentNode.add(frontWheel);

    // Rear bottom idler
    let rearWheel = new Node("RearWheel");
    rearWheel.scale.set(0.7, wheelR * 2, wheelR * 2);
    rearWheel.position.set(0, -trackHeight / 2 + wheelR, -trackLength / 2);
    rearWheel.color = [0.15, 0.15, 0.15, 1.0];
    parentNode.add(rearWheel);

    // Inner small rollers along the bottom
    for(let w = 1; w < 4; w++) {
        let roller = new Node("Roller" + w);
        roller.scale.set(0.65, 0.3, 0.3);
        let zPos = -trackLength/2 + (trackLength / 4) * w;
        roller.position.set(0, -trackHeight / 2 + 0.15, zPos);
        roller.color = [0.2, 0.2, 0.2, 1.0];
        parentNode.add(roller);
    }

    // Create individual treads
    let treadsArray = (parentNode.name === "TrackLeft") ? d9TreadsLeft : d9TreadsRight;
    const numTreads = 30; // More treads for triangular shape
    for (let i = 0; i < numTreads; i++) {
        let tread = new Node("Tread" + i);
        tread.scale.set(0.8, 0.1, 0.25);
        tread.color = [0.05, 0.05, 0.05, 1.0];
        parentNode.add(tread);
        treadsArray.push(tread);
    }
}

function updateTreadPositions(treadsArray, offset) {
    // Define the three points of the triangle (centers of the main wheels)
    let pTop = new Vector3(0, sprocketY, -trackLength / 2 + 0.5);
    let pFront = new Vector3(0, -trackHeight / 2 + wheelR, trackLength / 2);
    let pRear = new Vector3(0, -trackHeight / 2 + wheelR, -trackLength / 2);

    // Calculate segment lengths
    let lenTopFront = Math.hypot(pFront.z - pTop.z, pFront.y - pTop.y);
    let lenFrontRear = trackLength;
    let lenRearTop = Math.hypot(pTop.z - pRear.z, pTop.y - pRear.y);

    // Total perimeter length (approximate without curved corners for simplicity)
    let totalLength = lenTopFront + lenFrontRear + lenRearTop;
    const numTreads = treadsArray.length;

    for (let i = 0; i < numTreads; i++) {
        let p = ((i / numTreads) * totalLength + offset) % totalLength;
        if (p < 0) p += totalLength;

        let tread = treadsArray[i];

        if (p < lenTopFront) {
            // Top to Front
            let t = p / lenTopFront;
            tread.position.set(0, pTop.y + (pFront.y - pTop.y) * t, pTop.z + (pFront.z - pTop.z) * t);
            tread.rotation.x = Math.atan2(pTop.y - pFront.y, pTop.z - pFront.z);
            // offset normal outwards
            tread.position.y += Math.cos(tread.rotation.x) * wheelR;
            tread.position.z -= Math.sin(tread.rotation.x) * wheelR;
        } else if (p < lenTopFront + lenFrontRear) {
            // Front to Rear (Bottom)
            let t = (p - lenTopFront) / lenFrontRear;
            tread.position.set(0, pFront.y, pFront.z - lenFrontRear * t);
            tread.rotation.x = Math.PI;
            tread.position.y -= wheelR;
        } else {
            // Rear to Top
            let t = (p - (lenTopFront + lenFrontRear)) / lenRearTop;
            tread.position.set(0, pRear.y + (pTop.y - pRear.y) * t, pRear.z + (pTop.z - pRear.z) * t);
            tread.rotation.x = Math.atan2(pRear.y - pTop.y, pRear.z - pTop.z);
            tread.position.y -= Math.cos(tread.rotation.x) * wheelR;
            tread.position.z += Math.sin(tread.rotation.x) * wheelR;
        }
    }
}

function buildD9() {
    // Colors
    const yellow = [0.95, 0.76, 0.05, 1.0];
    const darkGray = [0.2, 0.2, 0.2, 1.0];
    const black = [0.1, 0.1, 0.1, 1.0];

    // Root: Chassis
    d9Root = new Node("Chassis");
    d9Root.scale.set(2, 1.5, 3.5); // Width, Height, Length
    d9Root.position.set(0, 1, 0);
    d9Root.color = yellow;

    // Child 1: Tracks
    let trackLeft = new Node("TrackLeft");
    trackLeft.position.set(-1.4, -0.2, 0); // Local to chassis
    d9Root.add(trackLeft);

    let trackRight = new Node("TrackRight");
    trackRight.position.set(1.4, -0.2, 0);
    d9Root.add(trackRight);

    buildTreads(trackLeft, black);
    buildTreads(trackRight, black);

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

    d9Exhaust = new Node("Exhaust");
    d9Exhaust.scale.set(0.15, 1.0, 0.15);
    d9Exhaust.position.set(0.4, 2.0, 1.5);
    d9Exhaust.color = darkGray;
    d9Root.add(d9Exhaust);

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

    // Check for single-press keys
    if (e.key === 'g' || e.key === 'G') {
        const garage = document.getElementById('garageMenu');
        if (garage.style.display === 'none') {
            openGarage();
        } else {
            closeGarage();
        }
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

let d9Velocity = 0;
let d9AngularVelocity = 0;
let d9VelocityY = 0; // vertical velocity for jumping

// Dashboard logic
let engineHeat = 0; // 0 to 100
let engineFuel = 100; // 0 to 100
let isEngineDead = false;

function updateDashboard(speed, rpm, psi) {
    let heatEl = document.getElementById('gaugeHeat');
    let fuelEl = document.getElementById('gaugeFuel');
    let speedEl = document.getElementById('gaugeSpeed');
    let rpmEl = document.getElementById('gaugeRPM');
    let psiEl = document.getElementById('gaugePSI');

    if(!heatEl || !fuelEl || !speedEl || !rpmEl || !psiEl) return;

    // Normalize logic for gauges
    let speedPct = Math.min(100, Math.abs(speed) / 15.0 * 100);
    let rpmPct = Math.min(100, rpm);
    let psiPct = Math.min(100, psi);

    speedEl.style.setProperty('--val', speedPct + '%');
    let spdVal = speedEl.querySelector('.gauge-value');
    if(spdVal) spdVal.innerText = Math.floor(speedPct);

    rpmEl.style.setProperty('--val', rpmPct + '%');
    let rpmVal = rpmEl.querySelector('.gauge-value');
    if(rpmVal) rpmVal.innerText = Math.floor(rpmPct);

    psiEl.style.setProperty('--val', psiPct + '%');
    let psiVal = psiEl.querySelector('.gauge-value');
    if(psiVal) psiVal.innerText = Math.floor(psiPct);

    heatEl.style.setProperty('--val', engineHeat + '%');
    let heatVal = heatEl.querySelector('.gauge-value');
    if(heatVal) heatVal.innerText = Math.floor(engineHeat);

    fuelEl.style.setProperty('--val', engineFuel + '%');
    let fuelVal = fuelEl.querySelector('.gauge-value');
    if(fuelVal) fuelVal.innerText = Math.floor(engineFuel);
}

function updateKinematics(dt) {
    if (!d9Root) return;

    const baseMoveSpeed = 15.0; // Much faster base speed for fun gameplay
    const maxTurnSpeed = 1.5;
    const turnAccel = 5.0;
    const bladeSpeed = 2.0 * dt;

    let chassisWorldPos = getMatrixTranslation(d9Root.worldMatrix);
    let chassisAABB = new Vector3(2.8, 1.5, 4.5);
    let dirtDrag = 0;
    let bladePushCount = 0;

    d9Blade.updateMatrix(d9BladeArms.worldMatrix);
    let bladeWorldPos = getMatrixTranslation(d9Blade.worldMatrix);
    let bladeSize = new Vector3(3.5, 1.5, 1.5);

    for (let dirt of dirtBoxes) {
        let size = dirt.scale;
        if (checkAABBCollision(dirt.position, size, chassisWorldPos, chassisAABB)) dirtDrag += 1;
        if (checkAABBCollision(dirt.position, size, bladeWorldPos, bladeSize)) bladePushCount += 1;
    }

    // Lower resistance for more arcade-like pushing feel
    let pushResistance = Math.min(0.6, bladePushCount * 0.015);
    let dragFactor = Math.min(0.5, dirtDrag * 0.02);

    let combinedResistance = Math.min(0.7, dragFactor + pushResistance);
    let currentMaxSpeed = baseMoveSpeed * (1.0 - combinedResistance);

    let targetVelocity = 0;
    if (keys['ArrowUp']) targetVelocity = currentMaxSpeed;
    if (keys['ArrowDown']) targetVelocity = -currentMaxSpeed;

    // Disable movement if engine is dead
    if (isEngineDead) targetVelocity = 0;

    // Faster acceleration
    let accel = 10.0 * dt;
    if (d9Velocity < targetVelocity) {
        d9Velocity = Math.min(d9Velocity + accel, targetVelocity);
    } else if (d9Velocity > targetVelocity) {
        d9Velocity = Math.max(d9Velocity - accel, targetVelocity);
    }

    // Gauge Logic Computations
    let rpmBase = (Math.abs(d9Velocity) / baseMoveSpeed) * 60.0;
    // Add RPM spike when pushing heavy objects
    let rpmLoad = (combinedResistance * 100.0) * (keys['ArrowUp'] || keys['ArrowDown'] ? 1 : 0);
    let currentRPM = rpmBase + rpmLoad;
    let currentPSI = bladePushCount * 3.0; // scale PSI to blade load

    // Calculate Heat & Fuel
    if (!isEngineDead) {
        // High RPM generates heat
        if (currentRPM > 80) engineHeat += (currentRPM - 80) * 0.1 * dt;
        else engineHeat -= 15.0 * dt; // Cooling

        // Consuming Fuel
        engineFuel -= (1.0 + currentRPM * 0.02) * dt;

        engineHeat = Math.max(0, Math.min(100, engineHeat));
        engineFuel = Math.max(0, Math.min(100, engineFuel));

        if (engineHeat >= 100 || engineFuel <= 0) {
            isEngineDead = true;
        }
    }

    updateDashboard(d9Velocity, currentRPM, currentPSI);

    // Left/Right: Rotation Y (with momentum)
    let targetTurn = 0;
    if (keys['ArrowLeft']) {
        targetTurn = maxTurnSpeed;
    } else if (keys['ArrowRight']) {
        targetTurn = -maxTurnSpeed;
    }

    // Slightly smoother turn acceleration
    if (d9AngularVelocity < targetTurn) {
        d9AngularVelocity = Math.min(d9AngularVelocity + turnAccel * dt, targetTurn);
    } else if (d9AngularVelocity > targetTurn) {
        d9AngularVelocity = Math.max(d9AngularVelocity - turnAccel * dt, targetTurn);
    }

    d9Root.rotation.y += d9AngularVelocity * dt;

    // Up/Down: Translate forward/backward along local Z
    let forward = new Vector3(Math.sin(d9Root.rotation.y), 0, Math.cos(d9Root.rotation.y));

    if (Math.abs(d9Velocity) > 0.01) {
        d9Root.position.add(new Vector3().copy(forward).multiplyScalar(d9Velocity * dt));
    }

    // Jump / Terrain matching physics + Vibrations from rubble
    let wheelBase = 4.5;
    let frontTrackZ = d9Root.position.z + forward.z * (wheelBase / 2);
    let frontTrackX = d9Root.position.x + forward.x * (wheelBase / 2);
    let backTrackZ = d9Root.position.z - forward.z * (wheelBase / 2);
    let backTrackX = d9Root.position.x - forward.x * (wheelBase / 2);

    // Add high-frequency noise/shake if driving over rubble
    let shakeOffset = 0;
    let pitchShake = 0;
    if (dirtDrag > 0 && Math.abs(d9Velocity) > 0.5) {
        shakeOffset = (Math.random() - 0.5) * 0.1; // +/- 0.05 units Y
        pitchShake = (Math.random() - 0.5) * 0.05; // +/- 0.025 rad pitch
    }

    let heightFront = getTerrainHeightBase(frontTrackX, frontTrackZ);
    let heightBack = getTerrainHeightBase(backTrackX, backTrackZ);

    // Desired base height (average of front and back tracks)
    let targetY = (heightFront + heightBack) / 2 + 1; // +1 for chassis center offset from ground
    // Negate the pitch difference because our rotation X is inverted visually
    let targetPitch = -Math.atan2(heightFront - heightBack, wheelBase);

    // Calculate lateral height differences for Roll (Side flip)
    let trackWidth = 4.0;
    // Left Track Pos
    let leftTrackX = d9Root.position.x - Math.cos(d9Root.rotation.y) * (trackWidth / 2);
    let leftTrackZ = d9Root.position.z + Math.sin(d9Root.rotation.y) * (trackWidth / 2);
    // Right Track Pos
    let rightTrackX = d9Root.position.x + Math.cos(d9Root.rotation.y) * (trackWidth / 2);
    let rightTrackZ = d9Root.position.z - Math.sin(d9Root.rotation.y) * (trackWidth / 2);

    let heightLeft = getTerrainHeightBase(leftTrackX, leftTrackZ);
    let heightRight = getTerrainHeightBase(rightTrackX, rightTrackZ);

    // Negative roll because positive Z rotation raises the right side
    let targetRoll = -Math.atan2(heightLeft - heightRight, trackWidth);

    // Apply Gravity to D9 Vertical velocity
    d9VelocityY -= 15.0 * dt;
    d9Root.position.y += d9VelocityY * dt;

    if (d9Root.position.y <= targetY + 0.1) {
        // We hit the ground, interpolate position instead of snapping to prevent jitter
        d9Root.position.y += (targetY - d9Root.position.y) * 10 * dt + shakeOffset;
        if (d9Root.position.y < targetY) d9Root.position.y = targetY + shakeOffset;
        d9VelocityY = 0; // stop falling

        // Match pitch to terrain only if grounded
        // Interpolate pitch to target
        d9Root.rotation.x += (targetPitch - d9Root.rotation.x) * 5 * dt; // Smoother pitch interpolation
        d9Root.rotation.x += pitchShake; // add shake

        // Interpolate roll to target
        d9Root.rotation.z += (targetRoll - d9Root.rotation.z) * 5 * dt;
    } else {
        // Airborne! Maintain current pitch (or slowly level out)
        d9Root.rotation.x *= 0.99;
        d9Root.rotation.z *= 0.99;
    }

    // Clamp pitch and roll limits to avoid violent flipping on small debris hits
    d9Root.rotation.x = Math.max(-0.6, Math.min(0.6, d9Root.rotation.x));
    d9Root.rotation.z = Math.max(-0.6, Math.min(0.6, d9Root.rotation.z));

    // Ground penetration check for blade (See-Saw effect)
    if (d9Blade) {
        d9Root.updateMatrix(null); // Ensure matrices are ready
        let bladeWorldPos = getMatrixTranslation(d9Blade.worldMatrix);
        let bladeTerrainY = getTerrainHeight(bladeWorldPos.x, bladeWorldPos.z);
        // If the blade bottom (approx -0.5 local Y offset) hits the ground, lift the chassis
        let bladeBottomY = bladeWorldPos.y - 0.5;
        if (bladeBottomY < bladeTerrainY) {
            let penetration = bladeTerrainY - bladeBottomY;
            // Only lift slightly to prevent glitching through
            d9Root.position.y += penetration * 0.2;
            // Also pitch back a bit to simulate see-saw
            d9Root.rotation.x -= penetration * 0.1;
            // Stop falling if we hit via blade
            if (d9VelocityY < 0) d9VelocityY = 0;

        }
    }

    // Chassis Collision to prevent going *through* the ramp sideways
    chassisWorldPos = getMatrixTranslation(d9Root.worldMatrix);
    // Smart trick for ramp collision: instead of just checking center, check front/back bounds
    let centerTerrainY = getTerrainHeight(chassisWorldPos.x, chassisWorldPos.z);
    let chassisBottom = centerTerrainY + 1.0; // Keep the whole base above terrain

    // Smoothly lift the chassis up if it dips below the terrain level
    if (d9Root.position.y < chassisBottom) {
        // Fast upward interpolation to avoid jittering when snapping
        d9Root.position.y += (chassisBottom - d9Root.position.y) * 15 * dt;
        if (d9VelocityY < 0) d9VelocityY = 0;
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


    // [ / ] : Camera Pitch (0 to 90 degrees)
    const pitchSpeed = 1.0 * dt;
    if (keys['[']) {
        cameraPitch -= pitchSpeed;
    }
    if (keys[']']) {
        cameraPitch += pitchSpeed;
    }
    cameraPitch = Math.max(0, Math.min(Math.PI / 2 - 0.01, cameraPitch)); // Clamp 0 to ~90 deg

    // Key 'f' - Spawn Fuel Truck
    if (keys['f'] || keys['F']) {
        if (!gameFuelTruck) {
            gameFuelTruck = buildFuelTruck();
            // Start it somewhat near but behind the D9
            gameFuelTruck.position.set(d9Root.position.x - 10, d9Root.position.y, d9Root.position.z - 20);
        }
        keys['f'] = false; // debounce
        keys['F'] = false;
    }

    // Key 'c' - Chain / Unchain nearest vehicle
    if (keys['c'] || keys['C']) {
        keys['c'] = false; // debounce
        keys['C'] = false;

        if (chainedVehicle) {
            chainedVehicle = null; // Unchain
        } else {
            // Find closest vehicle
            let vehicles = [...gameTanks, gameAPC, gameFuelTruck].filter(v => v !== null);
            let closest = null;
            let minDist = CHAIN_LENGTH * CHAIN_LENGTH;
            for (let v of vehicles) {
                let distSq = d9Root.position.distanceToSquared(v.position);
                if (distSq < minDist) {
                    minDist = distSq;
                    closest = v;
                }
            }
            if (closest) {
                chainedVehicle = closest;
            }
        }
    }

    // Dynamic Chaining UI Prompt
    let promptEl = document.getElementById("chainPrompt");
    if (promptEl) {
        if (chainedVehicle) {
            promptEl.style.display = "none";
        } else {
            let vehicles = [...gameTanks, gameAPC, gameFuelTruck].filter(v => v !== null);
            let showPrompt = false;
            let minDistSq = CHAIN_LENGTH * CHAIN_LENGTH;
            let shankPos = getMatrixTranslation(d9Root.worldMatrix);
            for (let v of vehicles) {
                if (new Vector3().copy(v.position).sub(shankPos).lengthSq() < minDistSq) {
                    showPrompt = true;
                    break;
                }
            }
            promptEl.style.display = showPrompt ? "block" : "none";
        }
    }
    // Chain Towing Logic & Fuel Truck Refueling
    if (gameFuelTruck) {
        if (typeof gameFuelTruck.aiState === 'undefined') gameFuelTruck.aiState = "arriving";

        let toD9 = new Vector3().copy(d9Root.position).sub(gameFuelTruck.position);
        let dist = toD9.length();

        if (gameFuelTruck.aiState === "arriving") {
            if (dist > 8.0) {
                toD9.normalize();
                gameFuelTruck.position.x += toD9.x * 8.0 * dt;
                gameFuelTruck.position.z += toD9.z * 8.0 * dt;
                gameFuelTruck.rotation.y = Math.atan2(toD9.x, toD9.z);
            } else {
                gameFuelTruck.aiState = "refueling";
                gameFuelTruck.refuelTimer = 0;
            }
        } else if (gameFuelTruck.aiState === "refueling") {
            gameFuelTruck.refuelTimer += dt;
            engineFuel += 10 * dt;
            engineHeat -= 20 * dt;
            if (engineFuel > 100) engineFuel = 100;
            if (engineHeat < 0) engineHeat = 0;
            if (engineFuel > 15 && engineHeat < 85) isEngineDead = false;

            // Refuel for 3 seconds then leave
            if (gameFuelTruck.refuelTimer > 3.0) {
                gameFuelTruck.aiState = "reversing";
                gameFuelTruck.reverseTimer = 0;
            }
        } else if (gameFuelTruck.aiState === "reversing") {
            gameFuelTruck.reverseTimer += dt;
            if (gameFuelTruck.reverseTimer < 1.5) {
                // Reverse straight
                gameFuelTruck.position.x -= Math.sin(gameFuelTruck.rotation.y) * 8.0 * dt;
                gameFuelTruck.position.z -= Math.cos(gameFuelTruck.rotation.y) * 8.0 * dt;
            } else if (gameFuelTruck.reverseTimer < 4.0) {
                // Turn 180 degrees while reversing slowly
                gameFuelTruck.position.x -= Math.sin(gameFuelTruck.rotation.y) * 4.0 * dt;
                gameFuelTruck.position.z -= Math.cos(gameFuelTruck.rotation.y) * 4.0 * dt;
                gameFuelTruck.rotation.y += Math.PI * 0.4 * dt;
            } else {
                gameFuelTruck.aiState = "leaving";
            }
        } else if (gameFuelTruck.aiState === "leaving") {
            // Drive forward (now facing away)
            gameFuelTruck.position.x += Math.sin(gameFuelTruck.rotation.y) * 20.0 * dt;
            gameFuelTruck.position.z += Math.cos(gameFuelTruck.rotation.y) * 20.0 * dt;

            if (dist > 150.0) {
                gameFuelTruck = null; // Despawn
            }
        }

        if (gameFuelTruck) {
            gameFuelTruck.position.y = getTerrainHeightBase(gameFuelTruck.position.x, gameFuelTruck.position.z) + 1.5;
        }
    }

    if (chainedVehicle) {
        // Constrain chained vehicle distance
        let diff = new Vector3().copy(chainedVehicle.position).sub(d9Root.position);
        let dist = diff.length();
        if (dist > CHAIN_LENGTH) {
            diff.normalize();
            // Pull the vehicle to the max chain length
            let pullPos = new Vector3().copy(d9Root.position).add(diff.multiplyScalar(CHAIN_LENGTH));
            chainedVehicle.position.x = pullPos.x;
            chainedVehicle.position.z = pullPos.z;
            chainedVehicle.rotation.y = Math.atan2(-diff.x, -diff.z);

            // Towing heavy objects limits max speed
            currentMaxSpeed *= 0.7;
        }
        chainedVehicle.position.y = getTerrainHeight(chainedVehicle.position.x, chainedVehicle.position.z) + 1.5;
    }

    // Animate treads
    treadOffset += d9Velocity * 0.5 * dt;
    // Differential steering: if turning in place or moving, spin tracks opposite directions
    let leftTurnDiff = 0;
    let rightTurnDiff = 0;
    if (Math.abs(d9Velocity) < 0.1 && Math.abs(d9AngularVelocity) > 0.1) {
        // Turning in place (skid steer)
        leftTurnDiff = d9AngularVelocity * 2.0 * dt;
        rightTurnDiff = -d9AngularVelocity * 2.0 * dt;
    } else {
        // Moving and turning
        leftTurnDiff = d9AngularVelocity * 1.5 * dt;
        rightTurnDiff = -d9AngularVelocity * 1.5 * dt;
    }

    // Scale the tread offset differently since the animation is a wrap-around length,
    // tread positions are determined by mapping p from [0..totalLength]
    // treadOffset is the continuous offset mapping to `offset` in updateTreadPositions
    // It's scaled up by totalLength logic later, so this magnitude determines speed.
    updateTreadPositions(d9TreadsLeft, treadOffset + leftTurnDiff);
    updateTreadPositions(d9TreadsRight, treadOffset + rightTurnDiff);
}


// Dirt Pile & Physics Logic
let dirtBoxes = [];
const DIRT_COUNT = 300; // Fewer blocks but physically simulated
const DIRT_SIZE = 0.6;
const GRAVITY = 15.0; // Snappier gravity
let limbs = [];

// A uniform spatial grid to quickly find nearby debris
let debrisGrid = new Map();
const GRID_CELL_SIZE = 2.0;

function getGridKey(x, z) {
    let gridX = Math.floor(x / GRID_CELL_SIZE);
    let gridZ = Math.floor(z / GRID_CELL_SIZE);
    return `${gridX},${gridZ}`;
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

    d9Root.updateMatrix(null);
    let bladeWorldPos = getMatrixTranslation(d9Blade.worldMatrix);
    let bladeSize = new Vector3(3.5, 1.5, 1.5);
    let chassisWorldPos = getMatrixTranslation(d9Root.worldMatrix);
    let chassisSize = new Vector3(2.8, 1.5, 4.5);

    let forward = new Vector3(Math.sin(d9Root.rotation.y), 0, Math.cos(d9Root.rotation.y)).normalize();
    // Calculate lateral 'right' vector to push debris to the sides
    let rightVec = new Vector3(forward.z, 0, -forward.x);

    let scoopFloorY = bladeWorldPos.y - (bladeSize.y / 2) + (DIRT_SIZE / 2);

    // 0. Building Collisions & Destruction (Rigid Hit)
    for (let i = sceneBuildings.length - 1; i >= 0; i--) {
        let b = sceneBuildings[i];
        if (!b.isBuilding) continue;

        let hitBlade = checkAABBCollision(b.position, b.scale, bladeWorldPos, bladeSize);
        let hitChassis = checkAABBCollision(b.position, b.scale, chassisWorldPos, chassisSize);

        if (hitBlade || hitChassis) {
            // Strong rigid pushback to stop D9 from moving through the object
            let pushDir = new Vector3().copy(chassisWorldPos).sub(b.position).normalize();
            pushDir.y = 0;

            // Halt forward velocity immediately if we hit an object
            if (d9Velocity > 0) d9Velocity = 0;

            // Push D9 back out of intersection
            d9Root.position.add(pushDir.multiplyScalar(0.5));

            // Apply damage to building
            let damage = Math.abs(d9Velocity) * 20.0 * dt + 5.0; // static touch causes damage over time
            b.health -= damage;
            b.color[0] = Math.min(1.0, b.color[0] + 0.1); // flash red

            // Generate Heat from pushing a solid object
            engineHeat += 10.0 * dt;

            if (b.health <= 0) {
                explodeBuilding(b);
                addCoffee(10); // Reward for destruction
                sceneBuildings.splice(i, 1);
            }
        }
    }

    // -1. Soldier & Combat Physics
    for (let i = soldiers.length - 1; i >= 0; i--) {
        let s = soldiers[i];
        if (s.isDead) continue;

        let sPos = s.position;
        let sSize = new Vector3(0.6, 1.2, 0.4);

        let hitBlade = checkAABBCollision(sPos, sSize, bladeWorldPos, bladeSize);
        let hitChassis = checkAABBCollision(sPos, sSize, chassisWorldPos, chassisSize);

        if (hitBlade || hitChassis) {
            // Squish logic!
            s.isDead = true;
            s.state = "SQUISHED";

            s.children[0].color = [0.8, 0.1, 0.1, 1.0];
            s.children[1].color = [0.8, 0.1, 0.1, 1.0];
            s.scale.set(1.5, 0.05, 1.5);
            s.position.y = getTerrainHeight(s.position.x, s.position.z) + 0.05;

            // Reward Coffee for squishing enemies
            if (s.isEnemy) addCoffee(1);

        } else {
            // AI
            s.stateTimer -= dt;
            if (s.stateTimer <= 0) {
                s.stateTimer = 1.0 + Math.random() * 2.0;
                s.state = (s.state === "IDLE") ? "RUN" : "IDLE";
                if (s.state === "RUN") {
                    s.rotation.y = Math.random() * Math.PI * 2;
                }
            }
            if (s.state === "RUN") {
                let sFwd = new Vector3(Math.sin(s.rotation.y), 0, Math.cos(s.rotation.y));
                s.position.x += sFwd.x * s.speed * dt;
                s.position.z += sFwd.z * s.speed * dt;
                s.position.y = getTerrainHeight(s.position.x, s.position.z) + 0.6;
            }

            // AI hiding behavior: if near tank, move to nearest building
            let tankNear = gameTanks.find(t => s.position.distanceTo(t.position) < 30.0);
        if (s.isEnemy && !s.isDead && tankNear) {
                let nearestBuilding = null;
                let minDist = 999;
                sceneBuildings.forEach(h => {
                    let d = s.position.distanceTo(h.position);
                    if (d < minDist && d < 40.0 && !h.isDestroyed) {
                        minDist = d;
                        nearestBuilding = h;
                    }
                });
                if (nearestBuilding) {
                    let toH = new Vector3().copy(nearestBuilding.position).sub(s.position);
                    toH.y = 0; // Move horizontally
                    if (toH.length() > 2.0) {
                        toH.normalize();
                        s.position.add(toH.multiplyScalar(4.0 * dt)); // Run to building
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
                continue;
            }
        }
    }

    // 1. Build spatial grid for fast repulsion checks
    debrisGrid.clear();
    for (let dirt of dirtBoxes) {
        if (dirt.isSleeping) continue;
        let key = getGridKey(dirt.position.x, dirt.position.z);
        if (!debrisGrid.has(key)) debrisGrid.set(key, []);
        debrisGrid.get(key).push(dirt);
    }


    // 2. Physics & Collisions
    for (let dirt of dirtBoxes) {
        let dirtSize = dirt.scale;

        // --- Blade Collision (Snowplow Effect) ---
        let hit = checkAABBCollision(dirt.position, dirtSize, bladeWorldPos, bladeSize);
        if (hit) {
            dirt.isSleeping = false;

            // Lift mechanic
            if (scoopFloorY > DIRT_SIZE / 2 && dirt.position.y >= scoopFloorY - 0.2) {
                dirt.position.y = scoopFloorY;
                if (dirt.velocity.y < 0) dirt.velocity.y = 0;
            } else if (dirt.position.y < bladeWorldPos.y + 0.5) {
                dirt.velocity.y = 3.0;
            }

            // Calculate which side of the blade the debris is on
            let toDebris = new Vector3().copy(dirt.position).sub(bladeWorldPos);
            // Dot product with right vector: > 0 means right side, < 0 means left side
            let sideDot = rightVec.dot(toDebris);
            let lateralForce = (sideDot > 0) ? 1.0 : -1.0;

            // Pushing power (Forward + outward lateral arc)
            let pushForce = 8.0;
            dirt.velocity.x = forward.x * pushForce + rightVec.x * lateralForce * pushForce * 0.8;
            dirt.velocity.z = forward.z * pushForce + rightVec.z * lateralForce * pushForce * 0.8;

        } else {
            // Apply Gravity
            if (!dirt.isSleeping) {
                dirt.velocity.y -= GRAVITY * dt;
            }
        }

        // --- Particle Soft Body Repulsion ---
        if (!dirt.isSleeping) {
            let key = getGridKey(dirt.position.x, dirt.position.z);
            let nearby = debrisGrid.get(key) || [];

            for (let other of nearby) {
                if (dirt === other) continue;

                let distSq = dirt.position.distanceToSquared(other.position);
                let combinedRadii = dirt.radius + other.radius;

                if (distSq < combinedRadii * combinedRadii && distSq > 0.001) {
                    let dist = Math.sqrt(distSq);
                    let overlap = combinedRadii - dist;

                    // Push vector
                    let pushDir = new Vector3().copy(dirt.position).sub(other.position).normalize();

                    // Add gravity/settling logic to repulsion so they don't hover endlessly
                    if (pushDir.y > 0.5) pushDir.y = 0.5; // limit upward push

                    let force = overlap * 8.0 * dt; // Repulsion strength

                    dirt.velocity.add(new Vector3().copy(pushDir).multiplyScalar(force));
                    other.isSleeping = false; // wake up neighbors
                }
            }
        }

        // --- Velocity Integration ---
        if (!dirt.isSleeping) {
            let displacement = new Vector3().copy(dirt.velocity).multiplyScalar(dt);
            dirt.position.add(displacement);

            // Strong damping for dirt/mud
            dirt.velocity.x *= 0.85;
            dirt.velocity.z *= 0.85;
        }

        // --- Terrain Collision ---
        let terrainY = getTerrainHeight(dirt.position.x, dirt.position.z);
        let baseHeight = terrainY + (dirtSize.y / 2);

        if (dirt.position.y <= baseHeight) {
            dirt.position.y = baseHeight;
            dirt.velocity.y = 0;

            if (Math.abs(dirt.velocity.x) < 0.2 && Math.abs(dirt.velocity.z) < 0.2) {
                dirt.isSleeping = true;
                dirt.velocity.set(0,0,0);
            }
        } else {
            // High upward velocity damping to prevent anti-gravity hovering
            dirt.velocity.y -= GRAVITY * 0.5 * dt;
        }

        dirt.updateMatrix(null);
    }
}

// Particle Manager (Exhaust Smoke)
class Particle {
    constructor() {
        this.node = new Node("Particle");
        this.node.scale.set(0.2, 0.2, 0.2);
        this.node.color = [0.1, 0.1, 0.1, 0.7]; // Dark semi-transparent smoke
        this.velocity = new Vector3();
        this.life = 0;
        this.maxLife = 1.0;
        this.active = false;
    }
}

let particles = [];
const MAX_PARTICLES = 50;

function initParticles() {
    for (let i = 0; i < MAX_PARTICLES; i++) {
        particles.push(new Particle());
    }
}

let particleSpawnTimer = 0;
function updateParticles(dt) {
    if (!d9Exhaust) return;

    // Smoke generation is tied to D9 velocity/effort
    let spawnRate = 0.1;
    if (Math.abs(d9Velocity) > 0.1) spawnRate = 0.03; // Faster spawn when moving

    particleSpawnTimer += dt;
    if (particleSpawnTimer >= spawnRate) {
        particleSpawnTimer = 0;
        // Find inactive particle
        for (let p of particles) {
            if (!p.active) {
                p.active = true;
                p.life = 0;
                // Start at exhaust world pos (approx top of pipe)
                d9Root.updateMatrix(null);
                let exhaustPos = getMatrixTranslation(d9Exhaust.worldMatrix);
                // The exhaust local center is 0.5 up from its base (scale Y is 1)
                // We'll just add a bit to Y to spawn at the tip
                p.node.position.set(exhaustPos.x, exhaustPos.y + 0.5, exhaustPos.z);

                // Random upward velocity with slight spread
                p.velocity.set(
                    (Math.random() - 0.5) * 1.0,
                    2.0 + Math.random(),
                    (Math.random() - 0.5) * 1.0
                );
                p.maxLife = 1.0 + Math.random() * 0.5;
                break;
            }
        }
    }

    for (let p of particles) {
        if (p.active) {
            p.life += dt;
            if (p.life >= p.maxLife) {
                p.active = false;
            } else {
                p.node.position.add(new Vector3().copy(p.velocity).multiplyScalar(dt));
                // Expand
                let s = 0.2 + (p.life * 0.8);
                p.node.scale.set(s, s, s);
                // Fade out using alpha since blending is now enabled
                let fade = p.life / p.maxLife;
                // Fade from dark grey to lighter grey, with alpha dropping to 0
                p.node.color = [0.1 + fade*0.2, 0.1 + fade*0.2, 0.1 + fade*0.2, 0.7 - fade*0.7];
                p.node.updateMatrix(null);
            }
        }
    }
}

// Main Loop
let lastTime = 0;
let viewMatrix = new Matrix4();
let projectionMatrix = new Matrix4();
let cameraPitch = 0.2; // Initial pitch (in radians)

function render(now) {
    now *= 0.001; // convert to seconds
    const dt = now - lastTime;
    lastTime = now;

    // Update
    updateKinematics(dt);
    updatePhysics(dt);
    updateParticles(dt);

    // Add Game Objective Check
    updateGameLogic(dt);

    // Draw with dynamic sky gradient
    // We can simulate a gradient by changing clear color based on camera pitch
    let skyR = 0.53 - (cameraPitch * 0.2);
    let skyG = 0.81 - (cameraPitch * 0.1);
    let skyB = 0.92;
    gl.clearColor(skyR, skyG, skyB, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Camera setup
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    projectionMatrix.makePerspective(fieldOfView, aspect, zNear, zFar);

    // Make camera follow D9 loosely
    let distance = 35;
    let cameraOffset = new Vector3(
        -Math.sin(d9Root.rotation.y) * Math.cos(cameraPitch) * distance,
        Math.sin(cameraPitch) * distance + 2, // Base height offset
        -Math.cos(d9Root.rotation.y) * Math.cos(cameraPitch) * distance
    );
    let targetCameraPos = new Vector3().copy(d9Root.position).add(cameraOffset);
    if (typeof window.currentCameraPos === 'undefined') {
        window.currentCameraPos = targetCameraPos.clone();
    } else {
        window.currentCameraPos.x += (targetCameraPos.x - window.currentCameraPos.x) * 15 * dt;
        window.currentCameraPos.y += (targetCameraPos.y - window.currentCameraPos.y) * 15 * dt;
        window.currentCameraPos.z += (targetCameraPos.z - window.currentCameraPos.z) * 15 * dt;
    }
    let cameraPos = window.currentCameraPos;
    let targetPos = new Vector3().copy(d9Root.position);
    let up = new Vector3(0, 1, 0);

    // Ensure camera stays above the ground/terrain
    let terrainHeightAtCamera = getTerrainHeight(cameraPos.x, cameraPos.z);
    if (cameraPos.y < terrainHeightAtCamera + 0.5) {
        cameraPos.y = terrainHeightAtCamera + 0.5;
    }

    // Camera Collision against buildings
    for (let b of sceneBuildings) {
        let size = b.scale;
        let pos = b.position;

        // Treat camera like a point or small box to check collision
        let hit = checkAABBCollision(cameraPos, new Vector3(1, 1, 1), pos, size);
        if (hit) {
            // Push camera up above the building to stop it getting stuck inside
            cameraPos.y = pos.y + (size.y / 2) + 2.0;
        }
    }

    viewMatrix.makeLookAt(cameraPos, targetPos, up);

    // Draw D9
    if (d9Root) {
        gl.useProgram(program);
        d9Root.draw(gl, program, viewMatrix, projectionMatrix);
    }

    // Draw Dirt / Rubble / Limbs
    for (let dirt of dirtBoxes) {
        if (dirt.isLimb) {
            dirt.limbPhase += 5.0 * dt;
            // Flail animation
            dirt.rotation.z = Math.sin(dirt.limbPhase) * 0.5;
            dirt.rotation.x = Math.cos(dirt.limbPhase) * 0.5;
        }
        dirt.draw(gl, program, viewMatrix, projectionMatrix);
    }

    gameTanks.forEach(t => { t.updateMatrix(null); t.draw(gl, program, viewMatrix, projectionMatrix); });

    if (gameFuelTruck) {
        gameFuelTruck.updateMatrix(null);
        gameFuelTruck.draw(gl, program, viewMatrix, projectionMatrix);
    }

    // Draw Particles
    for (let p of particles) {
        if (p.active) {
            p.node.draw(gl, program, viewMatrix, projectionMatrix);
        }
    }

    for (let r of sceneRamps) {
        r.updateMatrix(null);
        r.draw(gl, program, viewMatrix, projectionMatrix);
    }

    for (let b of sceneBuildings) {
        b.updateMatrix(null);
        b.draw(gl, program, viewMatrix, projectionMatrix);
    }

    // --- Draw Wavy Ground Plane ---
    // Uses the newly generated ground buffers rather than the scaled default cube
    let groundModelViewMatrix = new Matrix4().copy(viewMatrix); // World coordinates
    let groundNormalMatrix = new Matrix4().copy(viewMatrix);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uModelViewMatrix'), false, groundModelViewMatrix.elements);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uProjectionMatrix'), false, projectionMatrix.elements);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uNormalMatrix'), false, groundNormalMatrix.elements);
    gl.uniform4fv(gl.getUniformLocation(program, 'uColor'), [0.3, 0.5, 0.2, 1.0]);
    gl.uniform1i(gl.getUniformLocation(program, 'uIsGround'), 1); // Keep grid shader flag on

    gl.bindBuffer(gl.ARRAY_BUFFER, groundPositionBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, 'aVertexPosition'), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, 'aVertexPosition'));

    gl.bindBuffer(gl.ARRAY_BUFFER, groundNormalBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(program, 'aVertexNormal'), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(program, 'aVertexNormal'));

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, groundIndexBuffer);
    gl.drawElements(gl.TRIANGLES, groundIndexCount, gl.UNSIGNED_SHORT, 0);

    // Road plane overlay
    gl.uniform1i(gl.getUniformLocation(program, 'uIsGround'), 0); // Disable procedural grid for road
    let roadScaleZ = 100;
    let roadScaleX = 8;
    let roadMat = new Matrix4().makeScale(roadScaleX, 0.1, roadScaleZ).multiply(new Matrix4().makeTranslation(0, -0.04, 0)); // Slightly above ground
    let roadColor = [0.25, 0.25, 0.25, 1.0]; // Dark grey asphalt

    let roadModelViewMatrix = new Matrix4().multiplyMatrices(viewMatrix, roadMat);
    let roadNormalMatrix = new Matrix4().copy(roadModelViewMatrix);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uModelViewMatrix'), false, roadModelViewMatrix.elements);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uNormalMatrix'), false, roadNormalMatrix.elements);
    gl.uniform4fv(gl.getUniformLocation(program, 'uColor'), roadColor);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);


    requestAnimationFrame(render);
}

// Game State & Level Manager
let currentLevel = 0;
let currentMissionType = 1;
let gameState = "MENU"; // MENU, PLAYING, WON, GARAGE

let coffeeCurrency = 0;

function addCoffee(amount) {
    coffeeCurrency += amount;
    let ui = document.getElementById("coffeeCount");
    if (ui) ui.innerText = coffeeCurrency;
}

const garageUpgrades = {
    engine: { cost: 10, level: 0, maxLevel: 5 },
    fuel: { cost: 15, level: 0, maxLevel: 5 },
    cooling: { cost: 15, level: 0, maxLevel: 5 },
    blade: { cost: 20, level: 0, maxLevel: 5 }
};

function openGarage() {
    gameState = "GARAGE";
    document.getElementById('garageMenu').style.display = 'block';
    updateGarageUI();
}

function closeGarage() {
    gameState = "PLAYING";
    document.getElementById('garageMenu').style.display = 'none';
}

function buyUpgrade(type) {
    const upg = garageUpgrades[type];
    if (upg && coffeeCurrency >= upg.cost && upg.level < upg.maxLevel) {
        addCoffee(-upg.cost);
        upg.level++;
        upg.cost = Math.floor(upg.cost * 1.5); // Increase cost
        updateGarageUI();

        // Apply immediate effects if any
        if (type === 'fuel') {
            engineFuel = 100; // Refuel on upgrade
        }
        if (type === 'cooling') {
            engineHeat = 0; // Cool down on upgrade
        }
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
                btn.innerHTML = `Buy (${upg.cost} <svg viewBox="0 0 100 130" width="1em" height="1.3em" style="vertical-align: -0.25em;"><polygon points="10,0 90,0 95,130 5,130" fill="#d32f2f"/><polygon points="10,0 90,0 92,60 8,60" fill="#111"/><rect x="10" y="0" width="80" height="6" fill="#333"/><path d="M35 50 Q50 20 65 50 Q50 60 35 50 Z" fill="#fbc02d"/><rect x="25" y="80" width="50" height="8" fill="#fff"/><rect x="20" y="100" width="60" height="8" fill="#fff"/></svg>)`;
                btn.disabled = coffeeCurrency < upg.cost;
            }
        }
    }
}

// Bootstrap
window.onload = () => {
    initWebGL();
    buildD9();
    initParticles();

    // Setup Menu
    let startBtn = document.getElementById("startBtn");
    if (startBtn) startBtn.addEventListener("click", () => {
        document.getElementById("mainMenu").style.display = "none";
        document.getElementById("gameHUD").style.display = "block";
        loadLevel(1);
    });

    // Setup Garage Button
    let closeGarageBtn = document.getElementById("closeGarageBtn");
    if (closeGarageBtn) {
        closeGarageBtn.addEventListener("click", () => {
            closeGarage();
        });
    }

    requestAnimationFrame(render);
};

function loadLevel(levelIndex) {
    currentLevel = levelIndex;

    // Generate Border Wall
    sceneBuildings = [];

    // Left Wall (long)
    let wl = createBuilding("WallL", 10, 20, 200, -30, 80, [0.3, 0.3, 0.3, 1.0]);
    wl.isDestroyed = false; // indestructible
    sceneBuildings.push(wl);

    // Right Wall (long)
    let wr = createBuilding("WallR", 10, 20, 200, 30, 80, [0.3, 0.3, 0.3, 1.0]);
    wr.isDestroyed = false;
    sceneBuildings.push(wr);

    // Front blockade (with gap at x=0)
    let wf1 = createBuilding("WallF1", 100, 20, 10, -55, 30, [0.3, 0.3, 0.3, 1.0]);
    let wf2 = createBuilding("WallF2", 100, 20, 10, 55, 30, [0.3, 0.3, 0.3, 1.0]);
    sceneBuildings.push(wf1);
    sceneBuildings.push(wf2);
    gameState = "PLAYING";
    gameWon = false;

    // Reset D9
    d9Root.position.set(0, 1, 0);
    d9Root.rotation.set(0, 0, 0);
    d9Velocity = 0;
    d9AngularVelocity = 0;

    // Clear old state
    dirtBoxes = [];
    limbs = [];
    debrisGrid.clear();
    particles.forEach(p => p.active = false);

    // Initialize arrays
    sceneRamps = [];
    sceneBuildings = [];
    soldiers = [];
    gameTanks = [];
    gameAPC = null;
    gameFuelTruck = null;
    initialDebrisInPath = 0;

    // Remove old objective styling
    document.getElementById("objectiveUI").classList.remove("success-pulse");
    let uiFill = document.getElementById("progressFill");
    uiFill.style.width = "0%";

    // Reset Engine state
    engineFuel = 100;
    engineHeat = 0;
    isEngineDead = false;
    chainedVehicle = null;

    // Randomize Mission Type (1: Escort Tank, 2: Demolition, 3: Ambush)
    currentMissionType = Math.floor(Math.random() * 3) + 1;

    if (currentMissionType === 1) {
        sceneRamps = buildRamp();
        // Skip buildScenery because we built the border wall above
        gameTanks = [];
        for(let i=0; i<3; i++) {
            let t = buildTank();
            t.position.set((Math.random()-0.5)*10, 1.5, -20 - (i*15));
            gameTanks.push(t);
        }
        document.getElementById("objectiveText").innerText = `Mission ${levelIndex}: Clear the debris blocking the wall gap!`;

        dirtBoxes = [];
        // Spawn dirt specifically blocking the gap between WallF1 and WallF2 (x=-5 to 5, z=28 to 32)
        for(let i=0; i<40; i++) {
            let d = new Node("Dirt");
            let s = 1.5 + Math.random()*2.5; // Bigger blocks
            d.scale.set(s,s,s);
            d.position.set(-5 + Math.random()*10, 5, 28 + Math.random()*4);
            d.color = [0.5, 0.4, 0.4, 1.0]; // Concrete colored rubble
            d.velocity = new Vector3();
            d.isSleeping = false;
            d.radius = s*0.6;
            dirtBoxes.push(d);
        }
    } else if (currentMissionType === 2) {
        sceneRamps = buildRamp();
        sceneBuildings = buildScenery();

        let targetHQ = createBuilding("EnemyHQ", 20, 30, 20, 0, 40, [0.3, 0.3, 0.3, 1.0]);
        targetHQ.isTarget = true;
        sceneBuildings.push(targetHQ);

        for(let i = 0; i < 5 + levelIndex; i++) {
            soldiers.push(buildSoldier(true, (Math.random()-0.5)*20, 30 + Math.random()*5));
        }

        document.getElementById("objectiveText").innerText = `Mission ${levelIndex}: Destroy the Enemy HQ at the end of the road!`;
    } else if (currentMissionType === 3) {
        sceneBuildings = buildScenery();
        gameAPC = buildAPC();
        gameTanks = [];
        for(let i=0; i<3; i++) {
            let t = buildTank();
            t.position.set((Math.random()-0.5)*10, 1.5, -20 - (i*15));
            gameTanks.push(t);
        }

        for(let i = 0; i < 6; i++) {
            soldiers.push(buildSoldier(false, (Math.random()-0.5)*10, -10 + Math.random()*5));
        }

        // Increase enemy count based on endless level
        for(let i = 0; i < 10 + (levelIndex * 2); i++) {
            soldiers.push(buildSoldier(true, (Math.random()-0.5)*40, 20 + Math.random()*30));
        }

        document.getElementById("objectiveText").innerText = `Mission ${levelIndex}: Lead the convoy through the ambush!`;
    }
}

function advanceLevel() {
    addCoffee(50); // Big reward for beating level
    setTimeout(() => {
        // Endless Campaign loop
        loadLevel(currentLevel + 1);
    }, 4000); // Wait 4 seconds after winning before transitioning
}

function spawnSmokeEffect(pos, size, count) {
    for (let i = 0; i < count; i++) {
        for (let p of particles) {
            if (!p.active) {
                p.active = true;
                p.life = 0;
                p.maxLife = 0.5 + Math.random() * 0.5;

                let spreadX = (Math.random() - 0.5) * size;
                let spreadY = Math.random() * size * 0.5;
                let spreadZ = (Math.random() - 0.5) * size;

                p.node.position.set(pos.x + spreadX, pos.y + spreadY, pos.z + spreadZ);
                p.node.color = [0.2, 0.2, 0.2, 1.0]; // thick dark smoke

                // Explode outwards rapidly
                p.velocity.set(spreadX * 5.0, 5.0 + Math.random() * 5.0, spreadZ * 5.0);
                break;
            }
        }
    }
}

function initDirt_Level1() {
    let index = 0;

    let blockCenterX = 0;
    let blockCenterZ = 20;
    let spreadX = 8;
    let spreadZ = 5;

    for (let i = 0; i < DIRT_COUNT; i++) {
        let rx = (Math.random() - 0.5) * spreadX * 2;
        let rz = (Math.random() - 0.5) * spreadZ * 2;

        let y = getTerrainHeight(blockCenterX + rx, blockCenterZ + rz) + (Math.random() * 5) + 0.5;

        let isLimb = Math.random() < 0.05 && index > 50;
        let isMud = Math.random() < 0.15 && !isLimb;

        let dirt = new Node(isLimb ? `Limb${index}` : (isMud ? `Mud${index}` : `Debris${index}`));
        dirt.position.set(blockCenterX + rx, y, blockCenterZ + rz);
        dirt.velocity = new Vector3(0, 0, 0);
        dirt.isSleeping = false;

        if (isLimb) {
            dirt.scale.set(DIRT_SIZE * 0.4, DIRT_SIZE * 1.5, DIRT_SIZE * 0.4);
            dirt.color = [0.8, 0.6, 0.5, 1.0];
            dirt.isLimb = true;
            dirt.isMud = false;
            dirt.limbPhase = Math.random() * Math.PI * 2;
            limbs.push(dirt);
        } else if (isMud) {
            dirt.scale.set(DIRT_SIZE * 2.0, DIRT_SIZE * 0.5, DIRT_SIZE * 2.0);
            dirt.color = [0.4, 0.25, 0.15, 1.0];
            dirt.isLimb = false;
            dirt.isMud = true;
        } else {
            let rType = Math.random();
            if (rType < 0.2) {
                dirt.scale.set(1.5, 0.3, 1.0);
                dirt.color = [0.6, 0.6, 0.6, 1.0];
            } else if (rType < 0.3) {
                dirt.scale.set(0.2, 0.2, 2.0);
                dirt.color = [0.4, 0.2, 0.1, 1.0];
            } else if (rType < 0.5) {
                dirt.scale.set(0.6, 0.3, 0.4);
                dirt.color = [0.6, 0.3, 0.2, 1.0];
            } else {
                let sMod = 0.5 + Math.random() * 0.8;
                dirt.scale.set(DIRT_SIZE * sMod, DIRT_SIZE * sMod, DIRT_SIZE * sMod);
                let g = 0.3 + Math.random() * 0.2;
                dirt.color = [g, g, g, 1.0];
            }
            dirt.isLimb = false;
        }

        dirt.radius = Math.max(dirt.scale.x, dirt.scale.y, dirt.scale.z) * 0.6;

        dirtBoxes.push(dirt);
        index++;
    }
}

// Terrain Logic
// Build a ramp in front of the D9 starting position
const RAMP_START = 15;
const RAMP_END = 25;
const RAMP_HEIGHT = 4.0;
const RAMP_WIDTH = 8.0;

function getTerrainHeightBase(x, z) {
    // Generate uneven terrain
    return Math.sin(x*0.1) * 2.0 + Math.cos(z*0.1) * 2.0;
}

function getTerrainHeight(x, z) {
    let baseH = getTerrainHeightBase(x, z);

    // Treat sleeping mud piles or heavily stacked dirt as terrain the D9 can drive over
    let gridKey = getGridKey(x, z);
    if (debrisGrid && debrisGrid.has(gridKey)) {
        let nearby = debrisGrid.get(gridKey);
        let maxPileHeight = baseH;
        for(let dirt of nearby) {
            if (!dirt.isSleeping) continue;
            let dirtTopY = dirt.position.y + (dirt.scale.y / 2);
            if (dirtTopY > maxPileHeight) {
                maxPileHeight = dirtTopY;
            }
        }
        if (maxPileHeight > baseH + 0.5) return maxPileHeight;
    }
    return baseH;
}

let rampNode;
function buildRamp() {
    let length = RAMP_END - RAMP_START;

    // Calculate hypotenuse to properly size the box to stretch from start to end
    let hypotenuse = Math.sqrt(RAMP_HEIGHT*RAMP_HEIGHT + length*length);
    let angle = Math.atan2(RAMP_HEIGHT, length);

    rampNode = new Node("Ramp");
    // Make it thin but stretch the full hypotenuse length
    rampNode.scale.set(RAMP_WIDTH, 0.2, hypotenuse);
    rampNode.rotation.x = -angle; // Lean up

    // Align visual top surface perfectly with the mathematical getTerrainHeight plane
    // Adjust y pos downwards by half its thickness to prevent hovering
    rampNode.position.set(0, (RAMP_HEIGHT / 2) - 0.1, (RAMP_START + RAMP_END) / 2);
    rampNode.color = [0.25, 0.45, 0.15, 1.0];

    // Flat top part
    let rampTopNode = new Node("RampTop");
    rampTopNode.scale.set(RAMP_WIDTH, RAMP_HEIGHT, 5);
    // Align the very top face to mathematically perfectly equal RAMP_HEIGHT
    rampTopNode.position.set(0, RAMP_HEIGHT / 2, RAMP_END + 2.5);
    rampTopNode.color = [0.2, 0.4, 0.1, 1.0];

    // We add them directly to the scene drawing logic later
    return [rampNode, rampTopNode];
}

let sceneRamps = [];

let sceneBuildings = [];
let gameTanks = [];
let gameAPC = null;
let gameFuelTruck = null;
let soldiers = [];
let gameWon = false;
let initialDebrisInPath = 0;

let chainedVehicle = null;
const CHAIN_LENGTH = 12.0;

function buildSoldier(isEnemy, x, z) {
    let sRoot = new Node(isEnemy ? "Enemy" : "Friendly");
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
    sRoot.add(head);

    sRoot.isEnemy = isEnemy;
    sRoot.isDead = false;
    sRoot.health = 20;
    sRoot.speed = 1.0 + Math.random() * 1.5;
    sRoot.state = "IDLE"; // IDLE, RUN, SQUISHED
    sRoot.stateTimer = Math.random() * 2;

    return sRoot;
}

function buildAPC() {
    let apcRoot = new Node("APC");
    apcRoot.position.set(0, 1.5, -20);

    let body = new Node("APCBody");
    body.scale.set(2.5, 1.5, 4.5);
    body.color = [0.2, 0.3, 0.4, 1.0]; // Dark blue/grey
    apcRoot.add(body);

    // Wheels (4 per side)
    for(let i=0; i<4; i++) {
        let zPos = -1.5 + i * 1.0;
        let wL = new Node("WheelL");
        wL.scale.set(0.4, 0.8, 0.8);
        wL.position.set(-1.4, -0.6, zPos);
        wL.color = [0.1, 0.1, 0.1, 1.0];
        apcRoot.add(wL);

        let wR = new Node("WheelR");
        wR.scale.set(0.4, 0.8, 0.8);
        wR.position.set(1.4, -0.6, zPos);
        wR.color = [0.1, 0.1, 0.1, 1.0];
        apcRoot.add(wR);
    }

    return apcRoot;
}

function explodeBuilding(b) {
    // Generate rubble based on building size
    let volume = b.scale.x * b.scale.y * b.scale.z;
    let rubbleCount = Math.min(100, Math.floor(volume / 5)); // Cap rubble count for performance

    for (let i = 0; i < rubbleCount; i++) {
        let rx = b.position.x + (Math.random() - 0.5) * b.scale.x;
        let ry = b.position.y + (Math.random() - 0.5) * b.scale.y;
        let rz = b.position.z + (Math.random() - 0.5) * b.scale.z;

        let dirt = new Node(`BuildingDebris${i}`);
        dirt.position.set(rx, ry, rz);

        // Explosive velocity outward from center
        let vx = (rx - b.position.x) * 2.0;
        let vy = 5.0 + Math.random() * 5.0; // Shoot up
        let vz = (rz - b.position.z) * 2.0;
        dirt.velocity = new Vector3(vx, vy, vz);

        dirt.isSleeping = false;

        let sMod = 0.5 + Math.random() * 1.5;
        dirt.scale.set(DIRT_SIZE * sMod, DIRT_SIZE * sMod, DIRT_SIZE * sMod);

        // Inherit building color loosely
        let cVar = (Math.random() - 0.5) * 0.2;
        dirt.color = [
            Math.max(0, Math.min(1, b.color[0] + cVar)),
            Math.max(0, Math.min(1, b.color[1] + cVar)),
            Math.max(0, Math.min(1, b.color[2] + cVar)),
            1.0
        ];

        dirt.radius = Math.max(dirt.scale.x, dirt.scale.y, dirt.scale.z) * 0.6;
        dirtBoxes.push(dirt);
    }
}

function buildFuelTruck() {
    let root = new Node("Oshkosh");
    root.position.set(-15, 1.5, -30);

    // Cab
    let cab = new Node("TruckCab");
    cab.scale.set(2.2, 1.8, 2.5);
    cab.position.set(0, 0, 2);
    cab.color = [0.8, 0.7, 0.2, 1.0]; // Desert tan
    root.add(cab);

    // Tanker
    let tank = new Node("FuelTank");
    tank.scale.set(2.0, 2.0, 5.0);
    tank.position.set(0, 0, -2);
    tank.color = [0.7, 0.6, 0.2, 1.0];
    root.add(tank);

    // Wheels
    for(let i=0; i<3; i++) {
        let zPos = 2.5 - i * 2.5;
        let wL = new Node("WheelL");
        wL.scale.set(0.5, 1.0, 1.0);
        wL.position.set(-1.3, -0.6, zPos);
        wL.color = [0.1, 0.1, 0.1, 1.0];
        root.add(wL);

        let wR = new Node("WheelR");
        wR.scale.set(0.5, 1.0, 1.0);
        wR.position.set(1.3, -0.6, zPos);
        wR.color = [0.1, 0.1, 0.1, 1.0];
        root.add(wR);
    }

    return root;
}

function buildTank() {
    let tankRoot = new Node("Tank");
    tankRoot.position.set(0, 1.5, -15); // Start far behind the bulldozer

    // Tank Body
    let body = new Node("TankBody");
    body.scale.set(3, 1.2, 5);
    body.color = [0.3, 0.4, 0.2, 1.0]; // Olive green
    tankRoot.add(body);

    // Tank Turret
    let turret = new Node("TankTurret");
    turret.scale.set(2, 1, 2.5);
    turret.position.set(0, 1.1, -0.5);
    turret.color = [0.25, 0.35, 0.15, 1.0];
    tankRoot.add(turret);

    // Tank Barrel
    let barrel = new Node("TankBarrel");
    barrel.scale.set(0.3, 0.3, 4);
    barrel.position.set(0, 1.1, 2.5);
    barrel.color = [0.2, 0.2, 0.2, 1.0];
    tankRoot.add(barrel);

    // Simple Tank Tracks
    let tLeft = new Node("TankTrackL");
    tLeft.scale.set(0.6, 1.0, 5.2);
    tLeft.position.set(-1.8, -0.1, 0);
    tLeft.color = [0.1, 0.1, 0.1, 1.0];
    tankRoot.add(tLeft);

    let tRight = new Node("TankTrackR");
    tRight.scale.set(0.6, 1.0, 5.2);
    tRight.position.set(1.8, -0.1, 0);
    tRight.color = [0.1, 0.1, 0.1, 1.0];
    tankRoot.add(tRight);

    return tankRoot;
}

function updateGameLogic(dt) {
    if (gameState !== "PLAYING") return;

    // Convoy Patrol AI State Machine
    for (let i = 0; i < gameTanks.length; i++) {
        let t = gameTanks[i];

        // Base convoy position (behind the D9)
        let targetZ = d9Root.position.z - 20 - (i * 15);
        let targetX = 0; // Center of road

        // State machine: 0 = follow convoy, 1 = patrol left, 2 = patrol right
        if (typeof t.aiState === 'undefined') {
            t.aiState = 0;
            t.stateTimer = Math.random() * 5.0;
        }

        t.stateTimer -= dt;
        if (t.stateTimer <= 0) {
            if (t.aiState === 0) {
                t.aiState = Math.random() > 0.5 ? 1 : 2;
                t.stateTimer = 4.0 + Math.random() * 3.0; // Patrol for 4-7 sec
            } else {
                t.aiState = 0;
                t.stateTimer = 5.0 + Math.random() * 5.0; // Follow for 5-10 sec
            }
        }

        if (t.aiState === 1) targetX = -20; // Patrol left
        if (t.aiState === 2) targetX = 20;  // Patrol right

        let tx = targetX - t.position.x;
        let tz = targetZ - t.position.z;
        let distToTarget = Math.sqrt(tx*tx + tz*tz);

        if (distToTarget > 2.0 && !gameWon) {
            let angle = Math.atan2(tx, tz);
            let angleDiff = angle - t.rotation.y;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

            t.rotation.y += angleDiff * 2.0 * dt;
            t.position.x += Math.sin(t.rotation.y) * 12.0 * dt;
            t.position.z += Math.cos(t.rotation.y) * 12.0 * dt;
        } else if (gameWon) {
            t.position.z += 25.0 * dt; // Push hard forward when level complete
        }

        // Emit smoke
        if (Math.random() < 0.1) {
            let smoke = new Node("Smoke");
            smoke.position.set(t.position.x, t.position.y + 3.0, t.position.z - 2.0);
            smoke.color = [0.1, 0.1, 0.1, 0.8]; // Black smoke
            smoke.scale.set(0.5, 0.5, 0.5);
            smoke.isSmoke = true;
            smoke.velocity = new Vector3(0, 0, 0);
            smoke.life = 2.0;
            dirtBoxes.push(smoke);
        }

        // Combat logic
        let aliveEnemies = soldiers.filter(s => s.isEnemy && !s.isDead && s.position.distanceTo(t.position) < 50.0);
        if (aliveEnemies.length > 0) {
            let targetEnemy = aliveEnemies[0];
            let tex = targetEnemy.position.x - t.position.x;
            let tez = targetEnemy.position.z - t.position.z;

            let turret = t.children.find(c => c.name === "TankTurret");
            if (turret) {
                turret.rotation.y = Math.atan2(tex, tez) - t.rotation.y;
            }

            // Firing
            if (typeof t.lastFire === 'undefined') t.lastFire = 0;
            if (typeof t.fireCooldown === 'undefined') t.fireCooldown = 0;
            t.fireCooldown -= dt;
            if (t.fireCooldown <= 0) {
                t.fireCooldown = 2.0; // fire every 2 seconds
                if (t.muzzleFlashNode) {
                    t.muzzleFlashNode.color[3] = 1.0;
                    let myFlash = t.muzzleFlashNode;
                    setTimeout(() => { myFlash.color[3] = 0.0; }, 100);
                }

                targetEnemy.isDead = true;
                targetEnemy.rotation.x = Math.PI / 2; // fall over
                targetEnemy.position.y = getTerrainHeightBase(targetEnemy.position.x, targetEnemy.position.z) + 0.05;
                spawnSmokeEffect(targetEnemy.position, 1.0, 5);
            }
        }

        let ty = getTerrainHeightBase(t.position.x, t.position.z);
        t.position.y += (ty + 1.5 - t.position.y) * 5 * dt;
    }




    let uiText = document.getElementById("objectiveText");
    let uiFill = document.getElementById("progressFill");

    if (currentMissionType === 0) {
        if (gameWon) return;

        let tutorialWall = sceneBuildings.find(b => b.isTarget);
        if (!tutorialWall) {
            gameWon = true;
            uiText.innerText = "Training Complete! Great job!";
            uiText.style.color = "#44ff44";
            document.getElementById("objectiveUI").classList.add("success-pulse");
            uiFill.style.width = "100%";
            advanceLevel();
        } else {
            let pct = Math.max(0, Math.min(100, ((tutorialWall.maxHealth - tutorialWall.health) / tutorialWall.maxHealth) * 100));
            uiFill.style.width = pct + "%";
            uiText.innerText = `Training: Drive forward and collapse the wall! (HP: ${Math.floor(tutorialWall.health)})`;
        }

    } else if (currentMissionType === 1) {
        if (gameWon) {

            return;
        }

        let remain = 0;
        for(let d of dirtBoxes) {
            // Check if gap is clear (z=25 to 35, x=-10 to 10)
            if (d.position.z > 25 && d.position.z < 35 && Math.abs(d.position.x) < 10) remain++;
        }
        let currentDebrisInPath = remain;

        if (initialDebrisInPath === 0 && currentDebrisInPath > 0) {
            initialDebrisInPath = currentDebrisInPath;
        }

        if (initialDebrisInPath > 0) {
            let cleared = initialDebrisInPath - currentDebrisInPath;
            let pct = Math.max(0, Math.min(100, (cleared / initialDebrisInPath) * 100));
            uiFill.style.width = pct + "%";

            if (currentDebrisInPath < initialDebrisInPath * 0.7) {
                gameWon = true;
                uiText.innerText = "Path Cleared! The tank is advancing!";
                uiText.style.color = "#44ff44";
                document.getElementById("objectiveUI").classList.add("success-pulse");
                uiFill.style.width = "100%";
                advanceLevel();
            } else {
                uiText.innerText = `Mission ${currentLevel}: Clear the rubble! (${currentDebrisInPath} blocks remain)`;
                uiText.style.color = "#fff";
            }
        }
    } else if (currentMissionType === 2) {
        if (gameWon) return;

        // Find Target HQ
        let targetHQ = sceneBuildings.find(b => b.isTarget);
        if (!targetHQ) {
            // Target destroyed!
            gameWon = true;
            uiText.innerText = "HQ Destroyed! Excellent work!";
            uiText.style.color = "#44ff44";
            document.getElementById("objectiveUI").classList.add("success-pulse");
            uiFill.style.width = "100%";
            advanceLevel();
        } else {
            // Update progress bar based on HQ health
            let pct = Math.max(0, Math.min(100, ((targetHQ.maxHealth - targetHQ.health) / targetHQ.maxHealth) * 100));
            uiFill.style.width = pct + "%";
            uiText.innerText = `Mission ${currentLevel}: Destroy Enemy HQ! (HP: ${Math.floor(targetHQ.health)})`;
        }
    } else if (currentMissionType === 3) {
        if (gameWon) {
            if (gameAPC) gameAPC.position.z += 25.0 * dt;


            // Friendlies charge forward
            soldiers.filter(s => !s.isEnemy && !s.isDead).forEach(s => {
                s.position.z += 10.0 * dt;
                s.position.y = getTerrainHeight(s.position.x, s.position.z) + 0.6;
            });
            return;
        }

        // Count squished enemies
        let totalEnemies = soldiers.filter(s => s.isEnemy).length;
        let deadEnemies = soldiers.filter(s => s.isEnemy && s.isDead).length;

        // Friendly Tank AI Combat Logic


        if (gameAPC) {
            let targetZ = d9Root.position.z - 20;
            if (gameAPC.position.z < targetZ) {
                gameAPC.position.z += 6.0 * dt;
            }
        }

        let pct = Math.max(0, Math.min(100, (deadEnemies / totalEnemies) * 100));
        uiFill.style.width = pct + "%";

        if (deadEnemies >= totalEnemies) {
            gameWon = true;
            uiText.innerText = "Ambush cleared! Convoy advancing!";
            uiText.style.color = "#44ff44";
            document.getElementById("objectiveUI").classList.add("success-pulse");
            uiFill.style.width = "100%";
            advanceLevel();
        } else {
            uiText.innerText = `Mission ${currentLevel}: Squish the ambush! (${totalEnemies - deadEnemies} enemies remain)`;
            uiText.style.color = "#fff";
        }
    }
}

function createBuilding(name, width, height, depth, x, z, color) {
    let b = new Node(name);
    b.scale.set(width, height, depth);
    // Position y based on terrain height so it sits properly
    let terrainY = getTerrainHeight(x, z);
    b.position.set(x, terrainY + height / 2, z);
    b.color = color;
    b.isBuilding = true;
    b.health = 100;
    b.maxHealth = 100;

    // Create some windows
    let numWindowsX = Math.max(1, Math.floor(width / 3));
    let numWindowsY = Math.max(1, Math.floor(height / 4));

    for (let wy = 0; wy < numWindowsY; wy++) {
        for (let wx = 0; wx < numWindowsX; wx++) {
            // Front windows
            let winF = new Node("WindowF");
            winF.scale.set(1.5, 2, 0.2);
            // Local space relative to building
            let lx = -width/2 + (width / numWindowsX) * (wx + 0.5);
            let ly = -height/2 + 3 + (height / numWindowsY) * wy;
            winF.position.set(lx, ly, depth/2 + 0.1);
            winF.color = [0.2, 0.2, 0.4, 1.0]; // Dark window color
            b.add(winF);

            // Back windows
            let winB = new Node("WindowB");
            winB.scale.set(1.5, 2, 0.2);
            winB.position.set(lx, ly, -depth/2 - 0.1);
            winB.color = [0.2, 0.2, 0.4, 1.0];
            b.add(winB);
        }
    }

    // Single Door
    let door = new Node("Door");
    door.scale.set(2, 3, 0.3);
    door.position.set(0, -height/2 + 1.5, depth/2 + 0.1);
    door.color = [0.3, 0.2, 0.1, 1.0]; // Brown door
    b.add(door);

    return b;
}

function buildScenery() {
    let buildings = [];

    // --- Add Blocking Objects (Concrete Slabs, Metal Rods) ---
    // Placed between buildings or in paths to act as large, solid obstacles
    let block1 = new Node("ConcreteBlock");
    block1.scale.set(6, 2, 2);
    let by1 = getTerrainHeight(-40, 27) + 1; // Exactly on ground
    block1.position.set(-40, by1, 27);
    block1.color = [0.5, 0.5, 0.5, 1.0];
    buildings.push(block1);

    let block2 = new Node("MetalRod");
    block2.scale.set(0.5, 0.5, 10);
    let by2 = getTerrainHeight(-10, 30) + 0.25;
    block2.position.set(-10, by2, 30);
    block2.color = [0.3, 0.2, 0.1, 1.0];
    block2.rotation.y = 0.5;
    buildings.push(block2);

    let block3 = new Node("FallenPillar");
    block3.scale.set(1.5, 1.5, 8);
    let by3 = getTerrainHeight(20, -10) + 0.75;
    block3.position.set(20, by3, -10);
    block3.color = [0.7, 0.7, 0.6, 1.0];
    block3.rotation.y = -0.3;
    buildings.push(block3);


    // The Main Hospital
    let hospital = createBuilding("Hospital", 15, 20, 15, -25, 20, [0.8, 0.8, 0.9, 1.0]);
    // Add Medical Cross to Hospital
    let crossH = new Node("CrossH");
    crossH.scale.set(3, 1, 0.5);
    crossH.position.set(0, 5, 15/2 + 0.3); // relative to hospital, pop out front
    crossH.color = [0.9, 0.1, 0.1, 1.0];
    hospital.add(crossH);
    let crossV = new Node("CrossV");
    crossV.scale.set(1, 3, 0.5);
    crossV.position.set(0, 5, 15/2 + 0.3);
    crossV.color = [0.9, 0.1, 0.1, 1.0];
    hospital.add(crossV);
    buildings.push(hospital);

    // Mini City blocks
    buildings.push(createBuilding("Apt1", 10, 30, 10, -45, 15, [0.7, 0.6, 0.5, 1.0]));
    buildings.push(createBuilding("Apt2", 12, 15, 12, -35, 40, [0.5, 0.6, 0.7, 1.0]));
    buildings.push(createBuilding("Office1", 15, 40, 15, -60, 25, [0.3, 0.4, 0.5, 1.0]));
    buildings.push(createBuilding("Warehouse", 25, 10, 20, 30, -30, [0.8, 0.7, 0.6, 1.0]));
    buildings.push(createBuilding("Tower", 8, 50, 8, 45, 15, [0.2, 0.2, 0.3, 1.0]));
    buildings.push(createBuilding("RuinedBlock", 12, 8, 12, 15, 45, [0.4, 0.4, 0.4, 1.0]));

    return buildings;
}
