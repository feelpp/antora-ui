/*
Language: GMSH
Contributors: Christophe Trophime <christophe.trophime@lncmi.cnrs.fr>
Description: GMSH language
Website: https://gmsh.info/
*/

export default function (hljs) {
    "use strict";

    const Built_in_functions = "Acos Asin Atan Atan2 Ceil Cos Cosh Exp Fabs Floor Fmod Hypot Log Log10 Max Min Modulo Rand Round Sin Sinh Sqrt Tan Tanh ";
    const Points = "'Physical Point' Point ";
    const Curves = "Bezier BSpline Circle Compound Spline BSpline 'Curve Loop' Ellipse Line 'Physical Curve' Spline Wire ";
    const Surfaces = "'Bezier Surface' 'BSpline Surface' Disk 'Physical Surface' 'Plane Surface' Rectangle Surface 'Surface Loop' ";
    const Volumes = "Box, Cone Cylinder 'Physical Volume' 'Ruled ThruSections' Sphere ThruSections Torus Volume Wedge ";
    const Macros = "Call Macro Return ";
    const Conditionals = "Else ElseIf EndFor EndIf For If ";

    const DATATYPES = "BOOL FLOAT INT LIST ";


    const LITERALS = "Pi GMSH_MAJOR_VERSION GMSH_MINOR_VERSION GMSH_PATCH_VERSION MPI_Size MPI_Rank FALSE TRUE ";


    return {
        name: "GMSH",
        case_insensitive: true,
        keywords: {
            keyword: Built_in_functions + Points + Curves + Surfaces + Volumes + Macros + Conditionals,
            type: DATATYPES,
            literal: LITERALS
        },
        contains: [
            hljs.QUOTE_STRING_MODE,
            hljs.HASH_COMMENT_MODE,
            hljs.NUMBER_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            hljs.COMMENT('//', '$'),
            {
                className: 'keyword',
                begin: /\$\(/,
                end: /\)/,
            },
            {
                className: 'variable',
                begin: '@@?[a-zA-Z0-9_]+'
            },
            {
                className: 'meta',
                begin: "-\\(|\\)->|\\)-|'"
            },
            {
                className: 'symbol',
                begin: "\\+=|-=|>=|<=|!=|>>|<<|->|=|\\+|-|\\*|\\/|%|<|>|\\||&"
            },
            {
                className: 'punctuation',
                begin: "\\.|,|:|;|\\(|\\)|\\{|\\}|\\[|\\]"
            }]
    };
}
