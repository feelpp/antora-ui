/*
Language: GMSH
Contributors: Christophe Trophime <christophe.trophime@lncmi.cnrs.fr>
Description: GMSH language
Website: https://gmsh.info/
*/

module.exports = function (hljs) {
    "use strict";

    const Built_in_functions = "Acos Asin Atan Atan2 Ceil Cos Cosh Exp Fabs Floor Fmod Hypot Log Log10 Max Min Modulo Rand Round Sin Sinh Sqrt Tan Tanh ";
    const Points = "Point PointsOf";
    const Curves = "Bezier BSpline Circle Compound Spline BSpline Curve Ellipse Line Spline Wire ";
    const Surfaces = "Surface Disk Rectangle";
    const Volumes = "Box Cone Cylinder Sphere ThruSections Torus Volume Wedge ";
    const Macros = "Call Macro Return ";
    const Conditionals = "Else ElseIf EndFor EndIf For If In";
    const Composites = "Physical Loop Plane Ruled Transfinite Split Intersect Delete";
    const BooleanOperations = "BooleanDifference BooleanFragments BooleanIntersection BooleanUnion";
    const Transformations = "Affine Boundary CombinedBoundary Dilate Rotate Symmetry Translate Chamfer Extrude Fillet";
    const GlobalSettings = "SetFactory"
    const PrintFunction = "Printf";
    const OneLabDefs = "DefineConstant DefineNumber DefineString";
    
    const DATATYPES = "BOOL FLOAT INT LIST ";


    const LITERALS = "Pi GMSH_MAJOR_VERSION GMSH_MINOR_VERSION GMSH_PATCH_VERSION MPI_Size MPI_Rank FALSE TRUE ";


    return {
        name: "GMSH",
        case_insensitive: true,
        keywords: {
            keyword: Built_in_functions + Points + Curves + Surfaces + Volumes + Macros + Conditionals + Composites + BooleanOperations +  Transformations + GlobalSettings + PrintFunction + OneLabDefs,
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
