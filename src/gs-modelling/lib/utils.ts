import * as gs from "gs-json";
import * as three from "three";
// import * as mathjs from "mathjs";

//  ===============================================================================================================
//  Utils Functions ===============================================================================================
//  ===============================================================================================================

//////////////////////////////////////////////////////////////////////////////////////////
// For internal use only

export function transfromXYZ(xyz_list: number[][],
                             from_origin: number[], from_vectors: number[][],
                             to_origin: number[],   to_vectors: number[][]): number[][] {

    // mathjs.matrix
    // throw new Error("Method not implemented");

    const e1: three.Vector3 = new three.Vector3(from_vectors[0][0]).normalize();
    const e2: three.Vector3 = new three.Vector3(from_vectors[0][1]).normalize();
    const e3: three.Vector3 = new three.Vector3(from_vectors[0][2]).normalize();

    const b1: three.Vector3 = new three.Vector3(to_vectors[0][0]).normalize();
    const b2: three.Vector3 = new three.Vector3(to_vectors[0][1]).normalize();
    const b3: three.Vector3 = new three.Vector3(to_vectors[0][2]).normalize();

    if(e1.dot(e2) === 0) {throw new Error("Orthonormal initial basis required");}
    if(e1.dot(e3) === 0) {throw new Error("Orthonormal initial basis required");}
    if(e2.dot(e3) === 0) {throw new Error("Orthonormal initial basis required");}
    if(b1.dot(b2) === 0) {throw new Error("Orthonormal initial basis required");}
    if(b1.dot(b3) === 0) {throw new Error("Orthonormal initial basis required");}
    if(b2.dot(b3) === 0) {throw new Error("Orthonormal initial basis required");}

    const matrix: three.Matrix3 = new three.Matrix3();
    matrix.set(e1.dot(b1),e1.dot(b2),e1.dot(b3),
               e2.dot(b1),e2.dot(b2),e2.dot(b3),
               e3.dot(b1),e3.dot(b2),e3.dot(b3));

    const t_x: number = to_origin[0]- from_origin[0];
    const t_y: number = to_origin[1]- from_origin[1];
    const t_z: number = to_origin[2]- from_origin[2];

    return [[e1.dot(b1),e1.dot(b2),e1.dot(b3),t_x],
            [e2.dot(b1),e2.dot(b2),e2.dot(b3),t_y],
            [e3.dot(b1),e3.dot(b2),e3.dot(b3),t_z],
            [0,0,0,1]];
}

export function transfromXYZfromGlobal(xyz_list: number[][],
                                       to_origin: number[], to_vectors: number[][]): number[][] {
    return transfromXYZ(xyz_list, [0,0,0], [[1,0,0], [0,1,0], [0,0,1]], to_origin, to_vectors);
}
