import * as gs from "gs-json";
import * as mathjs from "mathjs";
import * as roots from "poly-roots";
import * as quadratic from "solve-quadratic-equation";

/**
 * Calculates distance between two points or two clusters of points
 * @param points_1 Point 1 or first cluster of points
 * @param points_2 Point 2 or second cluster of points
 * @param min Returns minimum distance between two clusters of points if true, maximum distance if false
 * @returns Distance between points if successful, none if unsuccessful or on error
 */
export function distBetweenPoints(point_1: gs.IPoint[], point_2: gs.IPoint[], minimum: boolean=true ) {
        let min: number = 0;
        let max: number = 0;
        let distance: number = 0;
        for(const p1 of point_1) {
            for(const p2 of point_2) {
                        distance = Math.sqrt(
                        (p1.getPosition()[0] - p2.getPosition()[0])*(p1.getPosition()[0] - p2.getPosition()[0])
                       + (p1.getPosition()[1] - p2.getPosition()[1])*(p1.getPosition()[1] - p2.getPosition()[1])
                       + (p1.getPosition()[2] - p2.getPosition()[2])*(p1.getPosition()[2] - p2.getPosition()[2]) );
                        if( distance > max) { max = distance;}
                        if( distance < min) { min = distance;}
            }
        }
        if( minimum === true) {return min;}
        return max;
}

export function identifier(coeff: number[]): number[] {
    if(!(coeff.length === 5)) {throw new Error("5 coefficients expected");}
    if( coeff[0] === 0 && coeff[1] === 0 && coeff[2] === 0 && coeff[3] === 0 && coeff[4] === 0 ) { coeff = [] ;}
    if( coeff[0] === 0 && coeff[1] === 0 && coeff[2] === 0 && coeff[3] === 0 ) { coeff.splice(0,4) ;}
    if( coeff[0] === 0 && coeff[1] === 0 && coeff[2] === 0 ) { coeff.splice(0,3) ;}
    if( coeff[0] === 0 && coeff[1] === 0 ) { coeff.splice(0,2) ;}
    if( coeff[0] === 0 ) { coeff.splice(0,1) ;}
    switch(coeff.length) {
        case 5: {
            const root: number[] = [];
//            const threshold1: number = 1e-10; // to couple with an additional test
            // if ( Math.abs(roots([coeff[0],coeff[1],coeff[2],coeff[3],coeff[4]])[1][0]) < threshold1)
            // {root.push(roots([coeff[0],coeff[1],coeff[2],coeff[3],coeff[4]])[0][0]);}
            // if ( Math.abs(roots([coeff[0],coeff[1],coeff[2],coeff[3],coeff[4]])[1][1]) < threshold1)
            // {root.push(roots([coeff[0],coeff[1],coeff[2],coeff[3],coeff[4]])[0][1]);}
            // if ( Math.abs(roots([coeff[0],coeff[1],coeff[2],coeff[3],coeff[4]])[1][2]) < threshold1)
            // {root.push(roots([coeff[0],coeff[1],coeff[2],coeff[3],coeff[4]])[0][2]);}
            // if ( Math.abs(roots([coeff[0],coeff[1],coeff[2],coeff[3],coeff[4]])[1][3]) < threshold1)
            // {root.push(roots([coeff[0],coeff[1],coeff[2],coeff[3],coeff[4]])[0][3]);}

            root.push(roots([coeff[0],coeff[1],coeff[2],coeff[3],coeff[4]])[0][0]);
            root.push(roots([coeff[0],coeff[1],coeff[2],coeff[3],coeff[4]])[0][1]);
            root.push(roots([coeff[0],coeff[1],coeff[2],coeff[3],coeff[4]])[0][2]);
            root.push(roots([coeff[0],coeff[1],coeff[2],coeff[3],coeff[4]])[0][3]);

            return root;
        }
        case 4: {
            let root: number[] = [];
            if( coeff[3] === 0) {
            root = quadratic(coeff[0],coeff[1],coeff[2]);
            root.push(0);
            return root;}
            // Third degree polynomial has at least 1 real root
            // root: number[] = [];
            const threshold: number = 1e-10;
            if ( Math.abs(roots([coeff[0],coeff[1],coeff[2],coeff[3]])[1][0])
                < threshold) {root.push(roots([coeff[0],coeff[1],coeff[2],coeff[3]])[0][0]);}
            if ( Math.abs(roots([coeff[0],coeff[1],coeff[2],coeff[3]])[1][1])
                < threshold) { root.push(roots([coeff[0],coeff[1],coeff[2],coeff[3]])[0][1]);}
            if ( Math.abs(roots([coeff[0],coeff[1],coeff[2],coeff[3]])[1][2])
                < threshold) { root.push(roots([coeff[0],coeff[1],coeff[2],coeff[3]])[0][2]);}
            if(root.length === 0) {throw new Error("Smaller threshold required in solver");}
            return root;
       }
        case 3: {
            // return quadratic(coeff[0],coeff[1],coeff[2]);
            const a: number = coeff[0];
            const b: number = coeff[1];
            const c: number = coeff[2];
            const delta: number = b*b - 4*a*c;
            // console.log("delta is " + delta);
            if (delta === 0) {return [-b/(2*a)];}
            if (delta < 0) {return [];}
            if (delta > 0) {return [(-b - Math.sqrt(delta))/(2*a), (-b + Math.sqrt(delta))/(2*a)];}
        }
        case 2: {
            if(coeff[0] === 0) {return [];}
            return [-coeff[1]/coeff[0]];
        }
        case 1: {
            return [];
        }
        case 0: {
            return [];
        }
        default: {throw new Error(" ");}
        }
}

///////////////////////////////
// 4 types of conics, individually expressed as [a,b,p,e]
// e = +1 : ellipse/circle & {a,b}
// e = -1 : hyperbola & {a,b}
// e = 0 : parabola & p
///////////////////////////////

export function General_Form(conic1: number[], origin1: number[], origin2: number[], alpha: number): number[] {
 // change of coordinates of orthonormal basis (angle + translation) with an appearing x.y term due to the Alpha
    // General form of C1 expressed in R2

    // change of coordinates of orthonormal basis (angle + translation) with an appearing x.y term due to the Alpha
    // General form of C1 expressed in R2
    // We use the reducted form of the C1 expression in R1 that we
    // transform by translating (x0,y0) (in R1'),
    // then rotating (by alpha degrees, alpha is the Direct Angle from R2 to R1')
    // The general form is then C1 in R2.
    // Alpha is espressed in degrees, we convert it into radians

    const alpha_rd: number = alpha * ( 2* Math.PI) /360;

    const a: number = conic1[0];
    const b: number = conic1[1];
    const p: number = conic1[2];
    const e: number = conic1[3];
    const x0: number = origin1[0] - origin2[0];
    const y0: number = origin1[1] - origin2[1];
    let A: number = null;
    let B: number = null;
    let C: number = null;
    let D: number = null;
    let E: number = null;
    let F: number = null;
    switch(e) {
        case 1:
            A = (Math.cos(alpha_rd)/a)*(Math.cos(alpha_rd)/a) + e*(Math.sin(alpha_rd)/b)*(Math.sin(alpha_rd)/b);
            B = Math.sin(2 * alpha_rd)*( 1/(a*a) - e/(b*b) );
            C = (Math.sin(alpha_rd)/a)*(Math.sin(alpha_rd)/a) + e*(Math.cos(alpha_rd)/b)*(Math.cos(alpha_rd)/b);
            D = -2*x0*Math.cos(alpha_rd)/(a*a) + e*2*y0*Math.sin(alpha_rd)/(b*b);
            E = -2*x0*Math.sin(alpha_rd)/(a*a) - e*2*y0*Math.cos(alpha_rd)/(b*b);
            F = x0*x0/(a*a) + e*y0*y0/(b*b) - 1;
            return [A,B,C,D,E,F];
        case -1:
            A = (Math.cos(alpha_rd)/a)*(Math.cos(alpha_rd)/a) + e*(Math.sin(alpha_rd)/b)*(Math.sin(alpha_rd)/b);
            B = Math.sin(2 * alpha_rd)*( 1/(a*a) - e/(b*b) );
            C = (Math.sin(alpha_rd)/a)*(Math.sin(alpha_rd)/a) + e*(Math.cos(alpha_rd)/b)*(Math.cos(alpha_rd)/b);
            D = -2*x0*Math.cos(alpha_rd)/(a*a) + e*2*y0*Math.sin(alpha_rd)/(b*b);
            E = -2*x0*Math.sin(alpha_rd)/(a*a) - e*2*y0*Math.cos(alpha_rd)/(b*b);
            F = x0*x0/(a*a) + e*y0*y0/(b*b) - 1;
            return [A,B,C,D,E,F];
        case 0:
            A = 1;
            B = 0;
            C = 0;
            D = -2*x0;
            E = -2*p ;
            F = 2*p*y0 + Math.pow(x0,2);
            return [A,B,C,D,E,F];
        default:
            throw new Error("e must be +1, -1 or 0");
    }
}

export function Split(conic1: number[], conic2: number[], origin1: number[], origin2: number[], alpha: number): number[][] {
    // Results expressed in R2
    const a: number = conic2[0];
    const b: number = conic2[1];
    const p: number = conic2[2];
    const e: number = conic2[3];
    const A: number = General_Form(conic1,origin1,origin2,alpha)[0];
    const B: number = General_Form(conic1,origin1,origin2,alpha)[1];
    const C: number = General_Form(conic1,origin1,origin2,alpha)[2];
    const D: number = General_Form(conic1,origin1,origin2,alpha)[3];
    const E: number = General_Form(conic1,origin1,origin2,alpha)[4];
    const F: number = General_Form(conic1,origin1,origin2,alpha)[5];
    const L1: number = null;
    const L2: number = null;
    const L3: number = null;
    const L4: number = null;
    const L5: number = null;
    const R1: number = null;
    const R2: number = null;
    const R3: number = null;
    const R4: number = null;
    const R5: number = null;
    let x1: number = null;
    let x2: number = null;
    let x3: number = null;
    let x4: number = null;
    let x5: number = null;
    let x11: number = null;
    let x12: number = null;
    let x13: number = null;
    let x14: number = null;
    let x15: number = null;
    const x21: number = null;
    const x22: number = null;
    const x23: number = null;
    const x24: number = null;
    const x25: number = null;
    let identify_x: number[] = null;
    let identify_y: number[] = null;
    const sol: number[][] = [];
    const threshold_x_y: number = 1e-4;
    const precision: number = 1000 ;

    switch(e) {
        case 1:
            x1 = Math.pow(A, 2) + Math.pow(C, 2) * Math.pow(b / a, 4)
            - 2 * A * C * e * Math.pow(b / a, 2) + e * Math.pow(B * b / a, 2);
            x2 = 2 * A * D - 2 * C * D * e * Math.pow(b / a, 2) + 2 * e * E * B * Math.pow(b / a, 2);
            x3 = Math.pow(D, 2) + 2 * A * C * e + 2 * A * F - 2 * Math.pow(C * b * b / a, 2)
            - 2 * C * F * e * Math.pow(b / a, 2) - e * Math.pow(b * B, 2) + e * Math.pow(E * b / a, 2);
            x4 = 2 * C * D * e * Math.pow(b, 2) + 2 * D * F - 2 * e * E * B * Math.pow(b, 2);
            x5 = Math.pow(C, 2) * Math.pow(b, 4) + Math.pow(F, 2)
            + 2 * e * C * F * Math.pow(b, 2) - e * Math.pow(b * E, 2);
            identify_x = identifier([x1, x2, x3, x4, x5]) ;
            for (const x of identify_x) {
                // is on C1 ?
                // console.log(identify_x)
                x11 = 0;
                x12 = 0;
                x13 = C;
                x14 = B * x + E;
                x15 = A * x * x + D * x + F;
                identify_y = identifier([x11, x12, x13, x14, x15]);
                for(const y of identify_y) {
                // is on C2 ?
                if (Math.abs((x / a) * (x / a) + e * (y / b) * (y / b) * e - 1) < threshold_x_y) {
                sol.push([Math.round(x * precision) / precision, Math.round(y * precision) / precision]);}
                }
                }
            return sol;
        case -1:
            x1 = Math.pow(A, 2) + Math.pow(C, 2) * Math.pow(b / a, 4)
            - 2 * A * C * e * Math.pow(b / a, 2) + e * Math.pow(B * b / a, 2);
            x2 = 2 * A * D - 2 * C * D * e * Math.pow(b / a, 2) + 2 * e * E * B * Math.pow(b / a, 2);
            x3 = Math.pow(D, 2) + 2 * A * C * e + 2 * A * F - 2 * Math.pow(C * b * b / a, 2)
            - 2 * C * F * e * Math.pow(b / a, 2) - e * Math.pow(b * B, 2) + e * Math.pow(E * b / a, 2);
            x4 = 2 * C * D * e * Math.pow(b, 2) + 2 * D * F - 2 * e * E * B * Math.pow(b, 2);
            x5 = Math.pow(C, 2) * Math.pow(b, 4) + Math.pow(F, 2)
            + 2 * e * C * F * Math.pow(b, 2) - e * Math.pow(b * E, 2);
            identify_x = identifier([x1, x2, x3, x4, x5]) ;
            for (const x of identify_x) {
                // is on C1 ?
                // console.log(identify_x)
                x11 = 0;
                x12 = 0;
                x13 = C;
                x14 = B * x + E;
                x15 = A * x * x + D * x + F;
                identify_y = identifier([x11, x12, x13, x14, x15]);
                for(const y of identify_y) {
                // is on C2 ?
                if (Math.abs((x / a) * (x / a) + e * (y / b) * (y / b) * e - 1) < threshold_x_y) {
                sol.push([Math.round(x * precision) / precision, Math.round(y * precision) / precision]);}
                }
                }
            return sol;
        case 0:
            x1 = C/(4*p*p);
            x2 = B/(2*p);
            x3 = (A + E/(2*p));
            x4 = D;
            x5 = F;
            identify_x = identifier([x1, x2, x3, x4, x5]) ;
            for (const x of identify_x) {
                // is on C1 ?
                x11 = 0;
                x12 = 0;
                x13 = C;
                x14 = B * x + E;
                x15 = A * x * x + D * x + F;
                identify_y = identifier([x11, x12, x13, x14, x15]);
                for(const y of identify_y) {
                    // is on C2 ?
                    if (Math.abs(2*p*y - x*x) < threshold_x_y) {
                        sol.push([Math.round(x * precision) / precision, Math.round(y * precision) / precision]);}
                        // sol.push([Math.round(x * precision) / precision, y]) }
                }
                }
            return sol;
    }
}

// let conic1:number[] = [7,0.5,0,1];
// let origin1:number[] = [5,0];
// let conic2:number[] = [1,1,0,1];
// let origin2:number[] = [0,0];
// let alpha:number = 45;

// // Unit test = OK
// // no sol if a<4
// // 1 sol if a = 4
// // 2 sols if 4<a<6
// // 3 sols if a = 6
// // 4 sols if a>6

// console.log("Split Conics");
// //console.log(General_Form(conic1,origin1,origin2,alpha));
// console.log(Split(conic1,conic2,origin1,origin2,alpha));

// Next steps:
// (1) r, theta instead of x0,y0
// (2) plug-in
// (3) check "solve-quadratic-equation" & "poly-roots" (2nd order polynomial & Jenkins Traub)
// (4) further robustness checking
// Looks to work well

//////

export function Function_F(x: number): number {
    let y: number = null;
    const t1: number = Math.sqrt(1 + x*x);
    y = (1/2)* ( x*t1 + Math.log( x + t1 )  );
    return y;
}

export function parabola_lenght(conic: number[] , x1: number, x2: number): number {
    const a: number = conic[0];
    const b: number = conic[1];
    const p: number = conic[2];
    const e: number = conic[3];
    let distance: number = null;
    if (!(e === 0)) { throw new Error("Parabola required");}
    distance = p * ( Function_F(x2/p) - Function_F(x1/p)  ) ;
    return Math.abs(distance);
}

// console.log("parabola length is " + parabola_length([1,1,0.5,0],0,1))
// 1.47, looks ok
// Next step: Unit test + plug

/////////////////////////////////// old functions no longer in API list///////////////////////////////////////////////

/**
 * Returns length of a polyline object
 * @param m Model
 * @param polyline Polyline object.
 * @param segment_index Polyline segment index.
 * @param sub_domain List of two numbers identifying the subdomain of the curve to calculate.
 * Ascending order. If omitted, entire polyline length is used. (optional, omit?)
 * @returns Length of polyline as number if successful, none if unsuccessful or on error
 */
export function plineLength(m: gs.IModel, pline: gs.IPolyline, segment_index: number, sub_domain: [number,number] ) {
    throw new Error("Method not implemented");
}
