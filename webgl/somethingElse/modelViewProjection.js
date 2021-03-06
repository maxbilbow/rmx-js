/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global Matrix4 */

var rmx = {
    'log': "", 'gl': null, 'mode': null, 'time': 0, 'canvas': null, 'V_SHADER': "", 'F_SHADER': "", 'start': Date.now(),
    'cubeVertexIndices': null, 'cubeVerticesIndexBuffer': null, 'cubeVerticesColorBuffer': null, 'triangleBuffer': null,
    'vertexShader': null, 'fragmentShader': null, 'background': false, 'local':false,
    'viewMatrix' : Matrix4.IDENTITY()
};
 

function toggleBackground() {
    rmx.background = !rmx.background;
}



function move(key) {
    var speed = 0.5;
//    alert(key);
    switch (key) {
        case 'w':
            rmx.viewMatrix.m[14] += speed;
            break;
        case 's':
            rmx.viewMatrix.m[14] -= speed;
            break;
        case 'a':
            rmx.viewMatrix.m[12] += speed;
            break;
        case 'd':
            rmx.viewMatrix.m[12] -= speed;
            break;
        case 'e':
            rmx.viewMatrix.m[13] += speed;
            break;
        case 'q':
            rmx.viewMatrix.m[13] -= speed;
            break;
                 
    }
}

function glrun(mode, local) {
    if (local) {
        rmx.local = local;
    }
    rmx.canvas = document.querySelector("canvas");
    if (rmx.local) {
     rmx.canvas.width = 600 * window.devicePixelRatio; 
     rmx.canvas.height = 400 * window.devicePixelRatio;
    }
    rmx.gl = rmx.canvas.getContext("webgl");
    window.stop();
    var gl = rmx.gl;
    switch (mode) {
        case "wireframe":
            rmx.mode = gl.LINE_STRIP;
            break;
        case "triangles":
            rmx.mode = gl.TRIANGLES;
            break;
        case "points":
            rmx.mode = gl.POINTS;
            break;
        case "triangle_strips":
        default:
            rmx.mode = gl.TRIANGLE_STRIP;
            break;
    }
    gl.viewport(0, 0, rmx.canvas.width, rmx.canvas.height);
    loadAssets();
    animate();

}

function animate() {
    window.requestAnimationFrame(animate);
    render();

}

function loadAssets() {
    rmx.log = "";
    var gl = rmx.gl;
    var getSourceSynch = function (url) {
        var req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.send(null);
        return new String((req.status === 200) ? req.responseText : '');
    };

    var localDir = rmx.local ? 'shaders/' : 'https://raw.githubusercontent.com/maxbilbow/rmx-js/master/webgl/modelViewProjection/shaders/';
    rmx.V_SHADER = getSourceSynch(localDir + 'Shader.vsh');

    rmx.F_SHADER = getSourceSynch(localDir + 'Shader.fsh');





    var vertices = [
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,
        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,
        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0
    ];

    rmx.cubeVerticesIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rmx.cubeVerticesIndexBuffer);


    var colors = [
        [0.8, 0.8, 0.8, 1.0], // Front face: white
        [1.0, 0.0, 0.0, 1.0], // Back face: red
        [0.0, 1.0, 0.0, 1.0], // Top face: green
        [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0], // Right face: yellow
        [1.0, 0.0, 1.0, 1.0]     // Left face: purple
    ];

    var generatedColors = [];

    for (j = 0; j < 6; j++) {
        var c = colors[j];

        for (var i = 0; i < 4; i++) {
            generatedColors = generatedColors.concat(c);
        }
    }


// This array defines each face as two triangles, using the
// indices into the vertex array to specify each triangle's
// position.

    rmx.cubeVertexIndices = [
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // back
        8, 9, 10, 8, 10, 11, // top
        12, 13, 14, 12, 14, 15, // bottom
        16, 17, 18, 16, 18, 19, // right
        20, 21, 22, 20, 22, 23    // left
    ];

    rmx.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(rmx.vertexShader, rmx.V_SHADER);
    gl.compileShader(rmx.vertexShader);


    rmx.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(rmx.fragmentShader, rmx.F_SHADER);
    gl.compileShader(rmx.fragmentShader);

    rmx.program = gl.createProgram();
    var program = rmx.program;
    gl.attachShader(program, rmx.vertexShader);
    gl.attachShader(program, rmx.fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);



    rmx.triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rmx.triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    var positionAttribute = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);// xyxyxy 2 at  tim

    rmx.cubeVerticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rmx.cubeVerticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);
    var colorAttribute = gl.getAttribLocation(program, "colors");
    gl.enableVertexAttribArray(colorAttribute);
//    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rmx.cubeVerticesColorBuffer);
    gl.vertexAttribPointer(colorAttribute, 4, gl.FLOAT, false, 0, 0);


    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(rmx.cubeVertexIndices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rmx.cubeVerticesIndexBuffer);


    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

}

function render() {

    rmx.log = "";

    var gl = rmx.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var program = rmx.program;

//setMatrixUniforms();

    rmx.time = (Date.now() - rmx.start) / 5000;
//    window.log += rmx.time;
    var timeUniform = gl.getUniformLocation(program, "time");
    gl.uniform1f(timeUniform, rmx.time);

    var fov = 45; aspect =  rmx.canvas.width / rmx.canvas.height; var near = 0.01; var far = 1000;
    var projectionMatrix = gl.getUniformLocation(program,"projectionMatrix");
    var m = Matrix4.makePerspective(fov, aspect, near, far);
    gl.uniformMatrix4fv(projectionMatrix, false, m );
   
   var viewMatrix = gl.getUniformLocation(program,"viewMatrix");
    var m = rmx.viewMatrix;
    gl.uniformMatrix4fv(viewMatrix, false, m );
   
            // Compute the matrices
   


    // ---- DRAWING ----
// Clear to black.
    if (rmx.background) {
        gl.clearColor(0, 0, 0, 1);
    } else {
        gl.clearColor(0, 0, 0, 0);
    }
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawElements(rmx.mode, 36, gl.UNSIGNED_SHORT, 0);



    var vshLog = gl.getShaderInfoLog(rmx.vertexShader);
    var fshLog = gl.getShaderInfoLog(rmx.fragmentShader);
    var progLog = gl.getProgramInfoLog(program);
    if (vshLog !== "")
        rmx.log += "\nV_SHADER ERROR: " + vshLog + "\nV_SHADER:\n" + rmx.V_SHADER;
    if (fshLog !== "")
        rmx.log += "\nF_SHADER ERROR: " + fshLog + "\nF_SHADER:\n" + rmx.F_SHADER;
    if (progLog !== "")
        rmx.log += "\nPROGRAM_ERROR: " + progLog;
    if (rmx.log !== "")
        rmx.log = "--- NEW LOG ---\n" + rmx.log;
    else
        rmx.log = "No Errors";
}

function showLog() {
    alert(rmx.log);
}