/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Matrix4 = {
    'IDENTITY': function () {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }, makePerspective: function (fieldOfViewInRadians, aspect, near, far) {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        var rangeInv = 1.0 / (near - far);
        var m = new Float32Array( [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ]);
        return m;
    },
    'm': [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 1
    ],
    'm00': function () {
        return this.m[0];
    }, 'm01': function () {
        return this.m[1];
    }, 'm02': function () {
        return this.m[2];
    }, 'm03': function () {
        return this.m[3];
    }, 'm10': function () {
        return this.m[4];
    }, 'm11': function () {
        return this.m[5];
    }, 'm12': function () {
        return this.m[6];
    }, 'm13': function () {
        return this.m[7];
    }, 'm20': function () {
        return this.m[8];
    }, 'm21': function () {
        return this.m[9];
    }, 'm22': function () {
        return this.m[10];
    }, 'm23': function () {
        return this.m[11];
    }, 'm30': function () {
        return this.m[12];
    }, 'm31': function () {
        return this.m[13];
    }, 'm32': function () {
        return this.m[14];
    }, 'm33': function () {
        return this.m[15];
    },
    setRowColToVal: function (r, c, v) {
        this.m[r * 4 + c] = v;
    },
    set: function (matrix)  {
        for (var i = 0; i < 16; ++i) {
            this.m[i] = matrix[i];
        }
    }
};

//var m = Matrix4.IDENTITY;


var Vector3 = {
    v: [
        0, 0, 0
    ], x: function () {
        return v[0];
    }, y: function () {
        return v[1];
    }, z: function () {
        return v[2];
    }
};