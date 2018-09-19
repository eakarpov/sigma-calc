const {Sigma, Expression, Field, FieldUpdate, Float, Function, Int, Lambda, lazy, Method, MethodCall, MethodUpdate, ObjectType, Parameter, Type} = require('./types');

const sigma = new Sigma(
    new ObjectType([
        new Field('x', new Type('Int'), new Int(0)),
        new Method(
            'move',
            new Type('Int','Obj'),
            'this',
            new Lambda(
                ['dx'],
                new Expression(
                    null,
                    [new FieldUpdate(
                        'this',
                        'x',
                        new Type('Int'),
                        new Expression(
                            null,
                            [new Function(
                                new Parameter('this', new MethodCall(null, 'x')),
                                '+',
                                new Parameter('dx')
                            )]
                        )
                    )]
                ),
            )
        )
    ]), [
        new MethodCall(null, 'move', [new Int(5)]),
        new MethodCall(null, 'move', [new Int(6)]),
        new MethodCall(null, 'move', [new Int(-4)]),
        new MethodCall(null, "move", [new Int(-13)]),
        new MethodCall(null, 'x')
]);

const sigma2 = new Sigma(
    new ObjectType([
        new Field("arg", new Type('Real'), new Float(0.0)),
        new Field('acc', new Type('Real'), new Float(0.0)),
        new Method('clear', new Type('Obj'), 'this', new Expression(
            new Expression(
                new Expression(
                    null,
                    [new FieldUpdate('this', 'arg', new Type('Real'), new Float(0.0))]
                ),
                [new FieldUpdate(null, 'acc', new Type('Real'),  new Float(0.0))]
            ),
            [new MethodUpdate(null, 'equals', new Type('Real'), 'self', new Expression(
                null,
                [new MethodCall('self', 'arg')]
            ))]
        )),
        new Method('enter', new Type('Real', 'Obj'), 'this', new Lambda(['n'], new Expression(
            null,
            [new FieldUpdate('this', 'arg', new Type('Real'), new Parameter('n'))]
        ))),
        new Method('add', new Type('Obj'), 'this', new Expression(
            new Expression(
                null,
                [new FieldUpdate('this', 'acc', new Type('Real'), new Expression(
                    null,
                    [new MethodCall('this', 'equals')]
                ))]
            ),
            [new MethodUpdate(null, 'equals', new Type('Real'), 'self', new Expression(
                null,
                [new Function(
                    new Parameter('self', new MethodCall(null, 'acc')),
                    '+',
                    new Parameter('self', new MethodCall(null, 'arg'))
                )]
            ))]
        )),
        new Method('sub', new Type('Obj'), 'this', new Expression(
            new Expression(
                null,
                [new FieldUpdate('this', 'acc', new Type('Real'), new Expression(
                    null,
                    [new MethodCall('this', 'equals')]
                ))]
            ),
            [new MethodUpdate(null, 'equals', new Type('Real'), 'self', new Expression(
                null,
                [new Function(
                    new Parameter('self', new MethodCall(null, 'acc')),
                    '-',
                    new Parameter('self', new MethodCall(null, 'arg'))
                )]
            ))]
        )),
        new Method('equals', new Type('Real'), 'this', new Expression(
            null,
            [new MethodCall('this', 'arg')]
        ))
    ]),[
        new MethodCall(null, 'enter', [new Float(5.0)]),
        new MethodCall(null, 'add'),
            // new MethodCall(null, 'add'),
        new MethodCall(null, 'enter', [new Float(3.0)]),
        new MethodCall(null, 'sub'),
        new MethodCall(null, 'enter', [new Float(-2.2)]),
        new MethodCall(null, 'equals')
    ]
);


const sigma3 = new Sigma(
    new ObjectType([
        new Method('retrieve', new Type('Obj'), 's', new Expression(
            null,
            [ new Parameter('s') ]
        )),
        new Method('backup', new Type('Obj'), 'b', new Expression(
            null,
            [ new MethodUpdate('b', 'retrieve', new Type('Obj'), 's', new Expression(
                null,
                [ new Parameter('b') ]
                ))
            ]
        )),
        new Field('value', new Type('Int'), new Int(10)),
    ]), [
        new MethodCall(null, 'backup'),
        new FieldUpdate(null, 'value', new Type('Int'), new Int(15)),
        new MethodCall(null, 'backup'),
        new FieldUpdate(null, 'value', new Type('Int'), new Int(25)),
        new MethodCall(null, 'retrieve'),
        new MethodCall(null, 'retrieve'),
        new MethodCall(null, 'value')
    ]
);


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

const sigma4 = new Sigma(
  new ObjectType(
      [
          new Method('zero', new Type('Obj'), 'global', new ObjectType([
              new Method('succ', new Type('Obj'), 'this', new Expression(new Expression(new Expression(null, [
                  new FieldUpdate('this', 'ifzero', new Type('Obj'), new Expression(null, [
                      new MethodCall('global', 'false')
                  ]))
              ]), [
                  new FieldUpdate(null, 'pred', new Type('Obj'), new Expression(null, new Parameter('this')))
              ]), [
                  new FieldUpdate(null, 'num', new Type('Int'), new Expression(null, [
                      new Function(new Parameter('this', new MethodCall(null, 'num')), '+', new Parameter(new Int(1)))
                  ]))
              ]))
          ])),
          new Field('ifzero', new Type('Obj'), new Expression(null, [
              new MethodCall('global', 'true')
          ])),
          new Field('num', new Type('Int'), new Expression(null, [
              new Parameter(new Int(0))
          ])),
          new Method('true', new Type('Obj'), 'global', new ObjectType([
              new Method('then', new Type('Obj'), 'this', new Expression(null, [
                  new Parameter('this')
              ])),
              new Method('val', new Type('Obj'), 'this', new Expression(null, [
                  new MethodCall('this', 'then')
              ]))
          ])),
          new Method('false', new Type('Obj'), 'global', new ObjectType([
              new Method('else', new Type('Obj'), 'this', new Expression(null, [
                  new Parameter('this')
              ])),
              new Method('val', new Type('Obj'), 'this', new Expression(null, [
                  new MethodCall('this', 'else')
              ]))
          ])),
          new Method('prog', new Type('Int'), 'global', new Expression(null, [
              new MethodCall('global', 'zero'),
              new MethodCall(null, 'succ'),
              new MethodCall(null, 'succ'),
              new MethodCall(null, 'succ'),
              new MethodCall(null, 'succ'),
              new MethodCall(null, 'pred'),
              new MethodCall(null, 'num')
          ]))
      ]), [
          new MethodCall(null, 'prog')
      ]
);

module.exports = {
    sigma,
    sigma2,
    sigma3,
    sigma4
};
