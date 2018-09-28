function Field(name, type, body) {
    this.type = type;
    this.name= name;
    this.body = body;
}

function Method(name, type, ctx, body) {
    this.ctx = ctx;
    this.name = name;
    this.type = type;
    this.body = body;
}

function Lambda(args, body) {
    this.args = args;
    this.body = body;
}

function LambdaArg(name, type) {
    this.name = name;
    this.type = type;
}

function FieldUpdate(ctx, method, type, content) {
    this.ctx = ctx;
    this.method = method;
    this.type = type;
    this.content = content;
}

function MethodUpdate(ctx, name, type, _ctx, body) {
    this.ctx = ctx;
    this.method = name;
    this.type = type;
    this._ctx = _ctx;
    this.content = body;
}

function Function(arg1, operand, arg2) {
    this.arg1 = arg1;
    this.operand = operand;
    this.arg2 = arg2;
}

function Parameter(ctx, methodCall) {
    this.ctx = ctx;
    this.methodCall = methodCall;
}

function MethodCall(ctx, name, args) {
    this.name = name;
    this.ctx = ctx;
    this.args = args || [];
}

function ObjectType(properties) {
    this.properties = properties
}

function Sigma(objectType, calls) {
    this.objectType = objectType;
    this.calls = calls;
}

function Type(...args) {
    this.args = args;
}

function Expression(ctx, args) {
    this.args = args;
    this.ctx = ctx;
}

function Int(arg) {
    this.value = arg;
}

function Float(arg) {
    this.value = arg;
}

const lazy = function (creator) {
    let res;
    let processed = false;
    return function () {
        if (processed) return res;
        res = creator.apply(this, arguments);
        processed = true;
        return res;
    };
};

const sigma = new Sigma(
    new ObjectType([
        new Field('x', new Type('Int'), new Int(0)),
        new Method(
            'move',
            new Type('Int','Obj'),
            'this',
            new Lambda(
                [new LambdaArg('dx', new Type('Int'))],
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
        new Method('enter', new Type('Real', 'Obj'), 'this', new Lambda([new LambdaArg('n', new Type('float'))], new Expression(
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
                    new FieldUpdate(null, 'pred', new Type('Obj'), new Expression(null, [new Parameter('this')]))
                ]), [
                    new FieldUpdate(null, 'num', new Type('Int'), new Expression(null, [
                        new Function(new Parameter('this', new MethodCall(null, 'num')), '+', new Parameter(new Int(1)))
                    ]))
                ])),
                new Field('ifzero', new Type('Obj'), new Expression(null, [
                    new MethodCall('global', 'true')
                ])),
                new Field('num', new Type('Int'), new Expression(null, [
                    new Parameter(new Int(0))
                ])),
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

const sigma5 = new Sigma(new ObjectType([
    new Method('numeral', new Type('Obj'), 'top', new ObjectType([
        new Method('zero', new Type('Obj'), 'numeral', new ObjectType([
            new Method('case', new Type('Obj', 'Obj', 'Obj'), 'this',
                new Lambda([new LambdaArg('z', new Type('Obj')), new LambdaArg('s', new Type('Obj'))],
                    new Expression(null, [new Parameter('z')]))),
            new Method('succ', new Type('Obj'), 'this', new Expression(new Expression(null, [
                new MethodUpdate('this', 'case', new Type('Obj', 'Obj', 'Obj'), 'tt',
                    new Lambda([new LambdaArg('z', new Type('Obj')), new LambdaArg('s', new Type('Obj'))],
                        new Expression(null, [
                            new MethodCall('s', null, [new Parameter('this')])
                        ])))
            ]), [
                new FieldUpdate(null, 'val', new Type('Int'), new Expression(null, [
                    new Function(new Parameter('this', new MethodCall(null, 'val')), '+', new Parameter(new Int(1)))
                ]))
            ])),
            new Field('val', new Type('Int'), new Expression(null, [
                new Parameter(new Int(0))
            ])),
            new Method('pred', new Type('Obj'), 'this', new Expression(null, [
                new MethodCall('this', 'case', [
                    new Parameter('numeral', new MethodCall(null, 'zero')),
                    new Lambda([new LambdaArg('x', new Type('Obj', 'Obj'))], new Expression(null, [
                        new Parameter('x')
                    ]))
                ])
            ])),
            new Method('add', new Type('Obj', 'Int'), 'this', new Lambda([
                new LambdaArg('that', new Type('Obj'))
            ], new Expression(null, [
                new MethodCall('this', 'case', [
                    new Parameter('that'),
                    new Lambda([new LambdaArg('x', new Type('Obj'))], new Expression(null, [
                        new MethodCall('x', 'add', [
                            new Parameter('that', new MethodCall(null, 'succ'))
                        ])
                    ]))
                ])
            ])))
        ])),
        new Method('fib', new Type('Obj'), 'numeral', new Lambda([new LambdaArg('n', new Type('Obj'))], new Expression(null, [
            new MethodCall('n', 'case', [
                new Parameter('numeral', new MethodCall(null, 'zero')),
                new Lambda([new LambdaArg('x', new Type('Obj'))],
                    new Expression(null, [
                        new MethodCall('x', 'case', [
                            new Parameter('n'),
                            new Lambda([ new LambdaArg('y', new Type('Obj'))],
                                new Expression(new Expression(null, [
                                    new MethodCall('numeral', 'fib', [
                                        new Parameter('x'),
                                        new MethodCall(null, 'add', [
                                            new Parameter('numeral', new MethodCall(null, 'fib', [new Parameter('y')]))
                                        ])
                                    ])
                                ])))
                        ])
                    ]))
            ])
        ]))),
    ])),
    new Method('main', new Type('Int'), 'top',
        new Expression(
            new Expression(null, [
                new MethodCall('top', 'numeral')
            ]), [
                new MethodCall(null, 'fib', [
                    new Parameter('top', [
                        new MethodCall(null, 'numeral'),
                        new MethodCall(null, 'zero'),
                        new MethodCall(null, 'succ'),
                        // new MethodCall(null, 'succ'),
                        // new MethodCall(null, 'succ'),
                        // new MethodCall(null, 'succ'),
                        // new MethodCall(null, 'succ'),
                        // new MethodCall(null, 'succ'),
                        // new MethodCall(null, 'succ'),
                        // new MethodCall(null, 'succ'),
                        // new MethodCall(null, 'succ'),
                        // new MethodCall(null, 'succ'),
                        // new MethodCall(null, 'succ'),
                        // new MethodCall(null, 'succ'),
                        // new MethodCall(null, 'succ'),
                        // new MethodCall(null, 'succ'),
                        // new MethodCall(null, 'succ'),
                    ])
                ]),
                new MethodCall(null, 'val')
            ]))
]), [
    new MethodCall(null, 'main')
]);

// [
//     numeral: Obj = @top => [
//         zero: Obj = @numeral => [case: Obj -> Obj -> Obj = @zero => \(z: Obj) => \(s: Obj) => z, succ: Obj = @zero => (zero.case: Obj -> Obj -> Obj <= @tt => \(z: Obj) => \(s: Obj) => s.zero).val: Int := zero.val + 1, val: Int := 0, pred: Obj = @this => this.case(numeral.zero)(\(x: Obj -> Obj) => x), add: Obj -> Int = @this => \(that: Obj) => this.case(that)(\(x: Obj) => x.add(that.succ))],
//         fib: Obj = @ numeral => \(n: Obj) => n.case(numeral.zero)(\(x: Obj) => x.case(n)(\(y: Obj) => (numeral.fib(x)).add(numeral.fib(y))))
//     ],
//     main: Int = @ top => (top.numeral.fib(top.numeral.zero.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ.succ)).val
// ].main

function findMethodByName(ctx, name) {
    if (ctx instanceof ObjectType) {
        for (const prop of ctx.properties) {
            if (prop.name === name) return prop;
        }
    } else {
        for (const ctxEl of Object.keys(ctx)) {
            if (ctx[ctxEl] instanceof ObjectType) {
                for (const prop of ctx[ctxEl].properties) {
                    if (prop.name === name) return prop;
                }
            } else {
                for (const key of Object.keys(ctx[ctxEl])) {
                    if (ctx[ctxEl][key] instanceof ObjectType) {
                        return findMethodByName(ctx[ctxEl][key], name);
                    }
                    if (key === name) return ctx[ctxEl][key];
                }
            }
        }
    }
}

function _findVariable(ctx, name) {
    if (ctx._args && ctx._args[name]) {
        return ctx._args[name];
    } else {
        if (ctx instanceof ObjectType) {
            for (const prop of ctx.properties) {
                if (prop.name === name) return prop;
            }
        } else {
            for (const ctxEl of Object.keys(ctx)) {
                if (ctxEl === name) return ctx[ctxEl];
            }
        }
    }
}

function findVariable(ctx, name) {
    const a = _findVariable(ctx, name);
    if (a) return a;
    throw new Error(`variable ${name} not found in the scope`);
}

function findIndex(ctx, name) {
    for (let i =0; i<ctx.properties.length; i++) {
        if (ctx.properties[i].name === name) return i;
    }
    return -1;
}

function d(ctx, body) {
    if (!body.methodCall) {
        if (body.ctx instanceof Int) return body.ctx;
        if (body.ctx instanceof Float) return body.ctx;
        return findVariable(ctx, body.ctx);
    } else {
        ctx._ctx = body.ctx;
        if (Array.isArray(body.methodCall)) {
            const result = evalExprArr({ args: body.methodCall, context: ctx });
            return result;
        } else {
            return evalMethodCall(ctx, body.methodCall);
        }
    }
}

function b(body) {
    if (body instanceof Int || body instanceof Float) return body.value;
    return body;
}

function evalFunction(ctx, body) {
    return eval(`${b(d(ctx, body.arg1))} ${body.operand} ${b(d(ctx, body.arg2))}`);
}

function a(ctx, method) {
    if (method.content instanceof Parameter) {
        if (!method.content.methodCall) {
            return ctx._args[method.content.ctx];
        } else {
            return evalMethodCall(ctx, method.content.methodCall);
        }
    } else if (method.content instanceof Lambda) {
        return method.content;
    } else {
        return evalBodyParse(ctx, method.content);
    }
}

function c(method, body) {
    if (method.type.args[method.type.args.length - 1] === 'Int') return new Int(body);
    if (method.type.args[method.type.args.length - 1] === 'Real') return new Float(body);
    return body;
}


function validateType(type, args) {
    for (let i = 0; i < type.length; i++) {
        if (type[i] !== args[i]) throw new Error(`type [${args[i]}] does not equal to [${type[i]}] type`);
    }
}

function substitute(outer, ctx, name, newValue) {
    if (outer) {
        const index = findIndex(outer[ctx], name);
        outer[ctx].properties.splice(index, 1);
        outer[ctx].properties.push(newValue);
        return outer;
    } else {
        const index = findIndex(ctx[ctx._ctx], name);
        ctx[ctx._ctx].properties.splice(index, 1);
        ctx[ctx._ctx].properties.push(newValue);
        return ctx;
    }
}

function getCtx(ctx, method) {
    return (!method.ctx || typeof method.ctx === 'string') ? (ctx[method.ctx] || ctx) : method.ctx;
}

function clone(obj) {
    if (Array.isArray(obj)) {
        const res = [];
        for (const el of obj) {
            const elem = clone(el);
            res.push(elem);
        }
        return res;
    } else {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        const res = new obj.constructor();
        for (const key of Object.keys(obj)) {
            const elem = clone(obj[key]);
            res[key] = elem;
        }
        return res;
    }
}

function addMethod(outer, ctx, name, newValue) {
    if (outer) {
        outer[ctx].properties.push(newValue);
        return outer;
    } else {
        ctx[ctx._ctx].properties.push(newValue);
        return ctx;
    }
}

function evalExprBody(ctx, method, args) {
    if (method instanceof Int) return method.body.value;
    if (method instanceof Float) return method.body.value;
    if (typeof method === 'string') return method;
    if (method instanceof FieldUpdate) {
        const context = getCtx(ctx, method);
        const newMethod = clone(method);
        const body = c(newMethod, b(a(clone(ctx), newMethod)));
        const mtd = findMethodByName(ctx, method.method);
        // if (!mtd) throw new Error(`Method ${method.method} not found error`);
        if (mtd) {
            validateType([...mtd.type.args].slice(0, mtd.type.args.length - 1), method.type.args);
            const field = new Field(method.method, method.type, body);
            validateType([mtd.type.args[mtd.type.args.length - 1]], [method.type.args[method.type.args.length - 1]]);
            return substitute(method.ctx && ctx, method.ctx || context, method.method, field);
        } else {
            const field = new Field(method.method, method.type, body);
            return addMethod(method.ctx && ctx, method.ctx || context, method.method, field);
        }
    }
    if (method instanceof MethodUpdate) {
        const context = getCtx(ctx, method);
        const newContext = clone(context);
        const newMethod = clone(method);
        // console.log(context);
        const bodyB = lazy(() => c(newMethod, b(a(clone(ctx), newMethod))));
        const body = typeof method.ctx === 'string' ? bodyB() : bodyB;
        const mtd = findMethodByName(ctx, method.method);
        // if (!mtd) throw new Error(`Method ${method.method} not found error`);
        if (mtd) {
            validateType([...mtd.type.args].slice(0, mtd.type.args.length - 1), method.type.args);
            const method2 = new Method(method.method, method.type, (method.ctx === null || method.ctx === method._ctx) ? method.ctx : ctx._ctx, body);
            validateType([mtd.type.args[mtd.type.args.length - 1]], [method.type.args[method.type.args.length - 1]]);
            return substitute(method.ctx && ctx, method.ctx || context, method.method, method2);
        } else {
            const method2 = new Method(method.method, method.type, (method.ctx === null || method.ctx === method._ctx) ? method.ctx : newContext, body);
            return addMethod(method.ctx && ctx, method.ctx || context, method.method, method2);
        }
    }
    if (method instanceof MethodCall) {
        return evalMethodCall(ctx, method);
    }
    if (method instanceof Expression) {
        return evalExpr(ctx, method, args);
    }
    if (method instanceof Function) {
        return evalFunction(ctx, method);
    }
    if (method instanceof Parameter) {
        const astra = b(d(ctx, method));
        return astra;
    }
}

function e(ctx, expr, args) {
    if (expr.ctx) {
        return evalExpr(ctx, expr.ctx, args);
    }
    return void 0;
}

function evalExpr(ctx, expr, args) {
    return evalExprArr({ context: e(ctx, expr, args) || expr.ctx || ctx, args: expr.args, _args: args || [] });
}

function evalBodyParse(ctx, method, args) {
    // console.log(method);
    if (method instanceof Int) return method.value;
    if (method instanceof Float) return method.value;
    if (typeof method === 'string') return method;
    if (method instanceof ObjectType) {
        const prop = Array.isArray(method.properties) &&  method.properties[0];
        if (ctx[prop.ctx]) {
            ctx[prop.ctx] = setCtx(ctx[prop.ctx], method);
            ctx._ctx = prop.ctx;
        } else {
            ctx[prop.ctx] = method;
            ctx._ctx = prop.ctx;
        }
        return ctx;
    }
    if (method instanceof Lambda) {
        if (args) {
            const argObj = {};
            method.args.forEach((e, i) => {
                let res = void 0;
                // if (args[i] instanceof Parameter) {
                //     res = evalExprBody(ctx, args[i], args);
                //     if (!(res instanceof ObjectType)) {
                //         res = res[res._ctx];
                //     }
                // } else {
                res = args[i];
                // }
                argObj[e.name] = res;
            });
            return evalBodyParse({...ctx, _args: { ...ctx._args, ...argObj }}, method.body);
        }

    }
    if (method instanceof Expression) {
        return evalExpr(ctx, method, args);
    }
    if (method instanceof Function) {
        return evalFunction(ctx, method);
    }
    if (typeof method === 'function') {
        return evalBodyParse(ctx, method(), args);
    }
}

function validateArgs(type, mtd) {
    const innerArgs = [...mtd.args];
    // correlate each type arg with args array
    for (const t of type) {
        if (t === 'Obj') continue;
        if (t === 'Int') {
            const arg = innerArgs.pop();
            if (arg === void 0) throw new Error(`not enough arguments for method ${mtd.name}`);
            if (!(arg instanceof Int || Number.isInteger(arg))) {
                throw new Error(`${arg.value || arg} is not of a required [${t}] type`);
            }
        }
        if (t === 'Real') {
            const arg = innerArgs.pop();
            if (arg === void 0) throw new Error(`not enough arguments for method ${mtd.name}`);
            if (!(arg instanceof Float || !Number.isNaN(Number.parseFloat(arg)))) {
                throw new Error(`${arg.value || arg} is not of a required [${t}] type`);
            }
        }
    }
}

function f(ctx) {
    if (ctx.properties) {
        let a = {};
        ctx.properties.forEach(e => {
            if (e instanceof Method) {
                a[e.ctx] = ctx;
            }
        });
        return a;
    } else {
        return ctx;
    }
}

function h(ctx, method) {
    // const contextName = method.ctx || ctx._ctx;
    const context = (!method.ctx || typeof method.ctx === 'string') ? (ctx[method.ctx] || ctx[ctx._ctx] || ctx) : method.ctx;
    const mtd = findMethodByName(context, method.name);
    if (mtd) {
        return mtd;
    } else {
        // return void 0;
        return findMethodByName(ctx, method.name);
    }
}

function evalMethodCall(ctx, mtd) {
    if (mtd.args) {
        let index = 0;
        for (let arg of mtd.args) {
            if (arg instanceof Parameter) {
                arg = evalExprBody(ctx, arg);
                if (!(arg instanceof ObjectType)) {
                    arg = arg[arg._ctx];
                }
                mtd.args[index] = arg;
            }
            index++;
        }
    }
    // ctx._ctx = ctx._ctx && (mtd.ctx || ctx._ctx);
    const method = h(ctx, mtd);
    if (method) {
        const type = method.type.args;
        validateArgs([...type].slice(0, type.length - 1), mtd);
        const context = method.ctx
            ? typeof method.ctx === 'string'
                ? ctx[method.ctx]
                    ? ctx
                    : mtd.args.length > 1
                        ? ctx
                        : { [method.ctx]: ctx }
                : { ...ctx, ...f(method.ctx) }
            : ctx;
        // const context = method.ctx ? typeof method.ctx === 'string' ? ctx : method.ctx : ctx;
        context._ctx = mtd.ctx || method.ctx || context._ctx;
        const result = evalBodyParse(context, method.body, mtd.args);
        const outputType = type[type.length - 1];
        validateArgs([outputType], { name: mtd.name, args: [result] });
        return result;
    } else {
        const execCtx = ctx._args && ctx._args[mtd.ctx];

        if (execCtx) {
            switch (execCtx.__proto__) {
                case Lambda.prototype: return evalBodyParse(ctx, execCtx, mtd.args);
                default: throw new Error(`Method ${mtd.name} not found error`);
            }
        }
    }
}

function g(ctx, call) {
    switch (call.__proto__) {
        case MethodCall.prototype: return evalMethodCall(ctx, call);
        case MethodUpdate.prototype: return evalExprBody(ctx, call);
        case FieldUpdate.prototype: return evalExprBody(ctx, call);
    }
}

function setCtx(...contexts) {
    let context = {};
    for (const el of contexts) {
        // // for scala not required
        // if (el instanceof ObjectType) {
        //     el.__proto__ = ObjectType;
        // }
        if (el instanceof ObjectType) {
            context = new ObjectType();
        }
        for (const key of Object.keys(el)) {
            if (el[key] instanceof ObjectType) {
                context[key] = new ObjectType();
            }
            context[key] = el[key];
        }
    }
    return context;
}

function evalExprArr(sigma) {
    let newContext;
    for (let i = 0; i < sigma.args.length; i++) {
        newContext = evalExprBody(setCtx(sigma.context, newContext || {}), sigma.args[i], sigma._args);
    }
    return newContext;
}

function evalMain(sigma) {
    let newContext;
    for (let i = 0; i < sigma.calls.length; i++) {
        newContext = g(newContext || sigma.objectType, sigma.calls[i]);
    }
    return newContext;
}

// function evaluator(sigma) {
//     return evalExpr(sigma.objectType, sigma.calls);
// }


// console.log(evalMain(sigma));
// console.log(evalMain(sigma2));
// console.log(evalMain(sigma3));
// console.log(evalMain(sigma4));
console.log(evalMain(sigma5));
