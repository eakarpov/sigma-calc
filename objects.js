"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
exports.sigma = new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.ObjectType([
    new types_1.Field('x', new types_1.Type('Int'), new types_1.Int(0)),
    new types_1.Method('move', new types_1.Type('Int', 'Obj'), 'this', new types_1.Lambda([new types_1.LambdaArg('dx', new types_1.Type('Int'))], new types_1.Expression(null, [new types_1.FieldUpdate('this', 'x', new types_1.Type('Int'), new types_1.Expression(null, [new types_1.Function(new types_1.Parameter('this', new types_1.MethodCall(null, 'x')), '+', new types_1.Parameter('dx'))]))])))
]), new types_1.MethodCall(null, 'move', [new types_1.Int(5)])), new types_1.MethodCall(null, 'move', [new types_1.Int(6)])), new types_1.MethodCall(null, 'move', [new types_1.Int(-4)])), new types_1.MethodCall(null, "move", [new types_1.Int(-13)])), new types_1.MethodCall(null, 'x'));
exports.sigma2 = new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.ObjectType([
    new types_1.Field("arg", new types_1.Type('Real'), new types_1.Float(0.0)),
    new types_1.Field('acc', new types_1.Type('Real'), new types_1.Float(0.0)),
    new types_1.Method('clear', new types_1.Type('Obj'), 'this', new types_1.Expression(new types_1.Expression(new types_1.Expression(null, [new types_1.FieldUpdate('this', 'arg', new types_1.Type('Real'), new types_1.Float(0.0))]), [new types_1.FieldUpdate(null, 'acc', new types_1.Type('Real'), new types_1.Float(0.0))]), [new types_1.MethodUpdate(null, 'equals', new types_1.Type('Real'), 'self', new types_1.Expression(null, [new types_1.MethodCall('self', 'arg')]))])),
    new types_1.Method('enter', new types_1.Type('Real', 'Obj'), 'this', new types_1.Lambda([new types_1.LambdaArg('n', new types_1.Type('float'))], new types_1.Expression(null, [new types_1.FieldUpdate('this', 'arg', new types_1.Type('Real'), new types_1.Parameter('n'))]))),
    new types_1.Method('add', new types_1.Type('Obj'), 'this', new types_1.Expression(new types_1.Expression(null, [new types_1.FieldUpdate('this', 'acc', new types_1.Type('Real'), new types_1.Expression(null, [new types_1.MethodCall('this', 'equals')]))]), [new types_1.MethodUpdate(null, 'equals', new types_1.Type('Real'), 'self', new types_1.Expression(null, [new types_1.Function(new types_1.Parameter('self', new types_1.MethodCall(null, 'acc')), '+', new types_1.Parameter('self', new types_1.MethodCall(null, 'arg')))]))])),
    new types_1.Method('sub', new types_1.Type('Obj'), 'this', new types_1.Expression(new types_1.Expression(null, [new types_1.FieldUpdate('this', 'acc', new types_1.Type('Real'), new types_1.Expression(null, [new types_1.MethodCall('this', 'equals')]))]), [new types_1.MethodUpdate(null, 'equals', new types_1.Type('Real'), 'self', new types_1.Expression(null, [new types_1.Function(new types_1.Parameter('self', new types_1.MethodCall(null, 'acc')), '-', new types_1.Parameter('self', new types_1.MethodCall(null, 'arg')))]))])),
    new types_1.Method('equals', new types_1.Type('Real'), 'this', new types_1.Expression(null, [new types_1.MethodCall('this', 'arg')]))
]), new types_1.MethodCall(null, 'enter', [new types_1.Float(5.0)])), new types_1.MethodCall(null, 'add')), new types_1.MethodCall(null, 'enter', [new types_1.Float(3.0)])), new types_1.MethodCall(null, 'sub')), new types_1.MethodCall(null, 'enter', [new types_1.Float(-2.2)])), new types_1.MethodCall(null, 'equals'));
exports.sigma3 = new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.Sigma(new types_1.ObjectType([
    new types_1.Method('retrieve', new types_1.Type('Obj'), 's', new types_1.Expression(null, [new types_1.Parameter('s')])),
    new types_1.Method('backup', new types_1.Type('Obj'), 'b', new types_1.Expression(null, [new types_1.MethodUpdate('b', 'retrieve', new types_1.Type('Obj'), 's', new types_1.Expression(null, [new types_1.Parameter('b')]))
    ])),
    new types_1.Field('value', new types_1.Type('Int'), new types_1.Int(10)),
]), new types_1.MethodCall(null, 'backup')), new types_1.FieldUpdate(null, 'value', new types_1.Type('Int'), new types_1.Int(15))), new types_1.MethodCall(null, 'backup')), new types_1.FieldUpdate(null, 'value', new types_1.Type('Int'), new types_1.Int(25))), new types_1.MethodCall(null, 'retrieve')), new types_1.MethodCall(null, 'retrieve')), new types_1.MethodCall(null, 'value'));
// const sigma4 = new Sigma(
//   new ObjectType([
//       new Method('zero', new Type('Obj'), 'global', new ObjectType(
//           new Method('succ', new Type('Obj'), 'this', new Expression(
//               new Expression(
//                   new Expression(
//                       null,
//                       new FieldUpdate('this', 'ifzero', new Type('Obj'), new Expression(
//                           null,
//                           new MethodCall('global','false'),
//                       ))
//                   ),
//                   new FieldUpdate(null, 'pred', new Type('Obj'), new Expression(null,
//                       new Parameter('this')
//                   ))
//               ),
//               new FieldUpdate(null, 'num', new Type('Int'), new Expression(null,
//                   new Function(new Parameter('this', new MethodCall(null, 'num')), '+', new Parameter(new Int(1)))
//               ))
//           )),
//           new Field('ifzero', new Type('Obj'), new Expression(
//               null, new MethodCall('global', 'true')
//           )),
//           new Field('num', new Type('Int'), new Int(0))
//       )),
//       new Method('true', new Type('Obj'), 'global', new ObjectType([
//           new Method('then', new Type('Obj'), 'this', new Expression(null, new Parameter('this'))),
//           new Method('val', new Type('Obj'), 'this', new Expression(
//               null,
//               new MethodCall('this', 'then')
//           ))
//       ])),
//       new Method('false', new Type('Obj'), 'global', new ObjectType([
//           new Method('else', new Type('Obj'), 'this', new Expression(null, new Parameter('this'))),
//           new Method('val', new Type('Obj'), 'this', new Expression(
//               null,
//               new MethodCall('this', 'else')
//           ))
//       ])),
//       new Method('prog', new Type('Int'), 'global', new Expression(
//           new Expression(
//               new Expression(
//                   new Expression(
//                       new Expression(null, new MethodCall('global', 'zero')),
//           new MethodCall(null, 'succ')),
//           new MethodCall(null, 'succ')),
//           new MethodCall(null, 'pred')),
//           new MethodCall(null, 'num'))
//       )
//   ]), new Expression(null, new MethodCall(null, 'prog'))
// );
exports.sigma4 = new types_1.Sigma(new types_1.ObjectType([
    new types_1.Method('zero', new types_1.Type('Obj'), 'global', new types_1.ObjectType([
        new types_1.Method('succ', new types_1.Type('Obj'), 'this', new types_1.Expression(new types_1.Expression(new types_1.Expression(null, [
            new types_1.FieldUpdate('this', 'ifzero', new types_1.Type('Obj'), new types_1.Expression(null, [
                new types_1.MethodCall('global', 'false')
            ]))
        ]), [
            new types_1.FieldUpdate(null, 'pred', new types_1.Type('Obj'), new types_1.Expression(null, [new types_1.Parameter('this')]))
        ]), [
            new types_1.FieldUpdate(null, 'num', new types_1.Type('Int'), new types_1.Expression(null, [
                new types_1.Function(new types_1.Parameter('this', new types_1.MethodCall(null, 'num')), '+', new types_1.Parameter(new types_1.Int(1)))
            ]))
        ])),
        new types_1.Field('ifzero', new types_1.Type('Obj'), new types_1.Expression(null, [
            new types_1.MethodCall('global', 'true')
        ])),
        new types_1.Field('num', new types_1.Type('Int'), new types_1.Expression(null, [
            new types_1.Parameter(new types_1.Int(0))
        ])),
    ])),
    new types_1.Method('true', new types_1.Type('Obj'), 'global', new types_1.ObjectType([
        new types_1.Method('then', new types_1.Type('Obj'), 'this', new types_1.Expression(null, [
            new types_1.Parameter('this')
        ])),
        new types_1.Method('val', new types_1.Type('Obj'), 'this', new types_1.Expression(null, [
            new types_1.MethodCall('this', 'then')
        ]))
    ])),
    new types_1.Method('false', new types_1.Type('Obj'), 'global', new types_1.ObjectType([
        new types_1.Method('else', new types_1.Type('Obj'), 'this', new types_1.Expression(null, [
            new types_1.Parameter('this')
        ])),
        new types_1.Method('val', new types_1.Type('Obj'), 'this', new types_1.Expression(null, [
            new types_1.MethodCall('this', 'else')
        ]))
    ])),
    new types_1.Method('prog', new types_1.Type('Int'), 'global', new types_1.Expression(null, [
        new types_1.MethodCall('global', 'zero'),
        new types_1.MethodCall(null, 'succ'),
        new types_1.MethodCall(null, 'succ'),
        new types_1.MethodCall(null, 'succ'),
        new types_1.MethodCall(null, 'succ'),
        new types_1.MethodCall(null, 'pred'),
        new types_1.MethodCall(null, 'num')
    ]))
]), new types_1.MethodCall(null, 'prog'));
exports.sigma5 = new types_1.Sigma(new types_1.ObjectType([
    new types_1.Method('numeral', new types_1.Type('Obj'), 'top', new types_1.ObjectType([
        new types_1.Method('zero', new types_1.Type('Obj'), 'numeral', new types_1.ObjectType([
            new types_1.Method('case', new types_1.Type('Obj', 'Obj', 'Obj'), 'this', new types_1.Lambda([new types_1.LambdaArg('z', new types_1.Type('Obj')), new types_1.LambdaArg('s', new types_1.Type('Obj'))], new types_1.Expression(null, [new types_1.Parameter('z')]))),
            new types_1.Method('succ', new types_1.Type('Obj'), 'this', new types_1.Expression(new types_1.Expression(null, [
                new types_1.MethodUpdate('this', 'case', new types_1.Type('Obj', 'Obj', 'Obj'), 'tt', new types_1.Lambda([new types_1.LambdaArg('z', new types_1.Type('Obj')), new types_1.LambdaArg('s', new types_1.Type('Obj'))], new types_1.Expression(null, [
                    new types_1.MethodCall('s', null, [new types_1.Parameter('this')])
                ])))
            ]), [
                new types_1.FieldUpdate(null, 'val', new types_1.Type('Int'), new types_1.Expression(null, [
                    new types_1.Function(new types_1.Parameter('this', new types_1.MethodCall(null, 'val')), '+', new types_1.Parameter(new types_1.Int(1)))
                ]))
            ])),
            new types_1.Field('val', new types_1.Type('Int'), new types_1.Expression(null, [
                new types_1.Parameter(new types_1.Int(0))
            ])),
            new types_1.Method('pred', new types_1.Type('Obj'), 'this', new types_1.Expression(null, [
                new types_1.MethodCall('this', 'case', [
                    new types_1.Parameter('numeral', new types_1.MethodCall(null, 'zero')),
                    new types_1.Lambda([new types_1.LambdaArg('x', new types_1.Type('Obj', 'Obj'))], new types_1.Expression(null, [
                        new types_1.Parameter('x')
                    ]))
                ])
            ])),
            new types_1.Method('add', new types_1.Type('Obj', 'Int'), 'this', new types_1.Lambda([
                new types_1.LambdaArg('that', new types_1.Type('Obj'))
            ], new types_1.Expression(null, [
                new types_1.MethodCall('this', 'case', [
                    new types_1.Parameter('that'),
                    new types_1.Lambda([new types_1.LambdaArg('x', new types_1.Type('Obj'))], new types_1.Expression(null, [
                        new types_1.MethodCall('x', 'add', [
                            new types_1.Parameter('that', new types_1.MethodCall(null, 'succ'))
                        ])
                    ]))
                ])
            ])))
        ])),
        new types_1.Method('fib', new types_1.Type('Obj'), 'numeral', new types_1.Lambda([new types_1.LambdaArg('n', new types_1.Type('Obj'))], new types_1.Expression(null, [
            new types_1.MethodCall('n', 'case', [
                new types_1.Parameter('numeral', new types_1.MethodCall(null, 'zero')),
                new types_1.Lambda([new types_1.LambdaArg('x', new types_1.Type('Obj'))], new types_1.Expression(null, [
                    new types_1.MethodCall('x', 'case', [
                        new types_1.Parameter('n'),
                        new types_1.Lambda([new types_1.LambdaArg('y', new types_1.Type('Obj'))], new types_1.Expression(new types_1.Expression(null, [
                            new types_1.MethodCall('numeral', 'fib', [new types_1.Parameter('x')]),
                        ]), [
                            new types_1.MethodCall(null, 'add', [
                                new types_1.Parameter('numeral', new types_1.MethodCall(null, 'fib', [new types_1.Parameter('y')]))
                            ])
                        ]))
                    ])
                ]))
            ])
        ]))),
    ])),
    new types_1.Method('main', new types_1.Type('Int'), 'top', new types_1.Expression(new types_1.Expression(null, [
        new types_1.MethodCall('top', 'numeral')
    ]), [
        new types_1.MethodCall(null, 'fib', [
            new types_1.Parameter('top', [
                new types_1.MethodCall(null, 'numeral'),
                new types_1.MethodCall(null, 'zero'),
                new types_1.MethodCall(null, 'succ'),
                new types_1.MethodCall(null, 'succ'),
            ])
        ]),
        new types_1.MethodCall(null, 'val')
    ]))
]), new types_1.MethodCall(null, 'main'));
// [
//     numeral: Obj = @top => [
//         zero: Obj = @numeral => [case: Obj -> Obj -> Obj = @zero => \(z: Obj) => \(s: Obj) => z, succ: Obj = @zero => (zero.case: Obj -> Obj -> Obj <= @tt => \(z: Obj) => \(s: Obj) => s.zero).val: Int := zero.val + 1, val: Int := 0, pred: Obj = @this => this.case(numeral.zero)(\(x: Obj -> Obj) => x), add: Obj -> Int = @this => \(that: Obj) => this.case(that)(\(x: Obj) => x.add(that.succ))],
//         fib: Obj = @ numeral => \(n: Obj) => n.case(numeral.zero)(\(x: Obj) => x.case(n)(\(y: Obj) => (numeral.fib(x)).add(numeral.fib(y))))
//     ],
//     main: Int = @ top => (top.numeral.fib(top.numeral.zero.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ)).val
// ].main
