const {Sigma, Expression, Field, FieldUpdate, Float, Function, Int, Lambda, lazy, Method, MethodCall, MethodUpdate, ObjectType, Parameter, Type} = require('./types');
const {sigma, sigma2, sigma3, sigma4, sigma5} = require('./objects');

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
        if (ctx._args[name]._ctx) {
            return ctx._args[name][ctx._args[name]._ctx];
        }
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
    // if (body._default) {
    //     body = body._default;
    // }
    if (body instanceof Int || body instanceof Float) return body.value;
    return body;
}

function evalFunction(ctx, body) {
    return eval(`${b(d(ctx, body.arg1))} ${body.operand} ${b(d(ctx, body.arg2))}`);
}

function a(ctx, method) {
    if (method.content instanceof Parameter) {
        if (!method.content.methodCall) {
            let varble = ctx._args[method.content.ctx];
            if (varble._ctx) {
                varble = varble[varble._ctx];
            }
            return varble;
        } else {
            return evalMethodCall(ctx, method.content.methodCall);
        }
    } else if (method.content instanceof Lambda) {
        return attribution(ctx, method.content);
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
        if (typeof astra !== 'object') {
            return astra;
        }
        if (astra instanceof ObjectType) {
            ctx._ctx = '_default';
            ctx._default = astra;
            return ctx;
        }
        return astra;
        // return astra;
    }
}

function e(ctx, expr, args) {
    if (expr.ctx) {
        const res = evalExpr(ctx, expr.ctx, args);
        return res;
    }
    return void 0;
}

function evalExpr(ctx, expr, args) {
    return evalExprArr({ context: e(ctx, expr, args) || expr.ctx || ctx, args: expr.args, _args: args || [] });
}

function getFromArgs(args, mArg) {
    for (const arg of args) {
        if (arg.name === mArg.ctx) return true;
    }
    return false;
}

function attributeExpression(ctx, mtd, args) {
    let index = 0;
    for (let arg of mtd.args) {
        if (arg instanceof Parameter) {
            arg = evalExprBody(ctx, arg);
            if (!(arg instanceof ObjectType)) {
                arg = arg[arg._ctx];
            }
            mtd.args[index] = arg;
        }
        if (arg instanceof MethodCall) {
            // validate context
            for (const mArg of arg.args) {
                if (!getFromArgs(args, mArg)) {
                    if (mArg instanceof Parameter) {
                        // arg.args[index] = evalExprBody(ctx, mArg);
                        const res = evalExprBody(ctx, mArg);
                        arg.args[index] = res[res._ctx];
                    }
                }
            }
        }
        index++;
    }
    return mtd;
}

function attributeBody(ctx, body, args) {
    if (body instanceof Expression) {
        return attributeExpression(ctx, body, args);
    }
    return body;
}

function attribution(ctx,func) {
    const args = func.args;
    func.body = attributeBody(ctx, func.body, args);
    // something to do
    return func;
}

function evalBodyParse(ctx, method, args) {
    // console.log(method);
    if (method._default) {
        method = method._default;
    }
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
            const res =  evalBodyParse({...ctx, _args: { ...ctx._args, ...argObj }}, method.body);
            // do not use
            // for (const arg of Object.keys(argObj)) {
            //     if (ctx._args[arg]) {
            //         delete ctx._args[arg];
            //     }
            // }
            return res;
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
    const ctxVar = _findVariable(ctx, method.ctx || ctx._ctx);
    if (!ctxVar && ctx._ctx === '_default') return findMethodByName(ctx._default, method.name);
    const mtd = findMethodByName(ctxVar || context, method.name);
    if (mtd) {
        return mtd;
    } else {
        // return void 0;
        return findMethodByName(ctx, method.name);
    }
}

function evalMethodCall(ctx, mtd) {
    if (mtd.name === 'succ') {
        console.log(1);
    }
    if (mtd.args) {
        let index = 0;
        for (let arg of mtd.args) {
            if (arg instanceof Parameter) {
                const nCtx = clone(ctx);
                arg = evalExprBody(nCtx, arg);
                if (!(arg instanceof ObjectType)) {
                    arg = arg[arg._ctx];
                }
                mtd.args[index] = arg;
            }
            // if (arg instanceof Lambda) {
            //     arg = evalBodyParse(ctx, arg);
            //     if (!(arg instanceof ObjectType)) {
            //         arg = arg[arg._ctx];
            //     }
            //     mtd.args[index] = arg;
            // }
            index++;
        }
    }
    ctx._ctx = ctx._ctx === '_default' ? ctx._ctx : (mtd.ctx || ctx._ctx);
    const method = h(ctx, mtd);
    if (method) {
        const type = method.type.args;
        validateArgs([...type].slice(0, type.length - 1), mtd);
        const context = method.ctx
            ? typeof method.ctx === 'string'
                ? ctx[method.ctx]
                    ? ctx
                    // : ctx
                    : !(ctx instanceof ObjectType)
                        ? ctx
                        : { [method.ctx]: ctx }
                : { ...ctx, ...f(method.ctx) }
            : ctx;
        // const context = method.ctx ? typeof method.ctx === 'string' ? ctx : method.ctx : ctx;
        context._ctx = context._ctx === '_default' ? context._ctx : (mtd.ctx || method.ctx || context._ctx);
        const result = evalBodyParse(context, method.body, mtd.args);
        let checker = result;
        if (result._ctx === '_default') {
            checker = result._default;
        }
        const outputType = type[type.length - 1];
        validateArgs([outputType], { name: mtd.name, args: [checker] });
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

// function evalExprArr(sigma, i = 0, newContext) {
//     const call = sigma.args[i];
//     // const next = evalExprBody({...sigma.context, ...newContext }, call, sigma._args);
//     const next = evalExprBody(setCtx(sigma.context, newContext || {}), call, sigma._args);
//     if (i < sigma.args.length - 1) {
//         const rew = evalExprArr(sigma, i + 1, next);
//         return rew;
//     }
//     return next;
// }

function evalExprArr(sigma) {
    let newContext;
    if (!sigma.args) return sigma.context;
    for (let i = 0; i < sigma.args.length; i++) {
        newContext = evalExprBody(setCtx(sigma.context, newContext || {}), sigma.args[i], sigma._args);
    }
    return newContext;
}

function evalMain(sigma, i = 0, newContext) {
    const call = sigma.calls[i];
    const next = g(newContext || sigma.objectType, call);
    if (i < sigma.calls.length - 1) return evalMain(sigma, i + 1, next);
    return next;
}

// function evaluator(sigma) {
//     return evalExpr(sigma.objectType, sigma.calls);
// }


// console.log(evalMain(sigma));
// console.log(evalMain(sigma2));
// console.log(evalMain(sigma3));
// console.log(evalMain(sigma4));
console.log(evalMain(sigma5));
