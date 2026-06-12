function ok() {
  return true;
}
function notOk() {
  return false;
}
function undef() {
  return void 0;
}
const NOT_TYPED_FUNCTION = "Argument is not a typed-function.";
function create() {
  function isPlainObject(x) {
    return typeof x === "object" && x !== null && x.constructor === Object;
  }
  const _types = [{
    name: "number",
    test: function(x) {
      return typeof x === "number";
    }
  }, {
    name: "string",
    test: function(x) {
      return typeof x === "string";
    }
  }, {
    name: "boolean",
    test: function(x) {
      return typeof x === "boolean";
    }
  }, {
    name: "Function",
    test: function(x) {
      return typeof x === "function";
    }
  }, {
    name: "Array",
    test: Array.isArray
  }, {
    name: "Date",
    test: function(x) {
      return x instanceof Date;
    }
  }, {
    name: "RegExp",
    test: function(x) {
      return x instanceof RegExp;
    }
  }, {
    name: "Object",
    test: isPlainObject
  }, {
    name: "null",
    test: function(x) {
      return x === null;
    }
  }, {
    name: "undefined",
    test: function(x) {
      return x === void 0;
    }
  }];
  const anyType = {
    name: "any",
    test: ok,
    isAny: true
  };
  let typeMap;
  let typeList;
  let nConversions = 0;
  let typed = {
    createCount: 0
  };
  function findType(typeName) {
    const type = typeMap.get(typeName);
    if (type) {
      return type;
    }
    let message = 'Unknown type "' + typeName + '"';
    const name = typeName.toLowerCase();
    let otherName;
    for (otherName of typeList) {
      if (otherName.toLowerCase() === name) {
        message += '. Did you mean "' + otherName + '" ?';
        break;
      }
    }
    throw new TypeError(message);
  }
  function addTypes(types) {
    let beforeSpec = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "any";
    const beforeIndex = beforeSpec ? findType(beforeSpec).index : typeList.length;
    const newTypes = [];
    for (let i = 0; i < types.length; ++i) {
      if (!types[i] || typeof types[i].name !== "string" || typeof types[i].test !== "function") {
        throw new TypeError("Object with properties {name: string, test: function} expected");
      }
      const typeName = types[i].name;
      if (typeMap.has(typeName)) {
        throw new TypeError('Duplicate type name "' + typeName + '"');
      }
      newTypes.push(typeName);
      typeMap.set(typeName, {
        name: typeName,
        test: types[i].test,
        isAny: types[i].isAny,
        index: beforeIndex + i,
        conversionsTo: []
        // Newly added type can't have any conversions to it
      });
    }
    const affectedTypes = typeList.slice(beforeIndex);
    typeList = typeList.slice(0, beforeIndex).concat(newTypes).concat(affectedTypes);
    for (let i = beforeIndex + newTypes.length; i < typeList.length; ++i) {
      typeMap.get(typeList[i]).index = i;
    }
  }
  function clear() {
    typeMap = /* @__PURE__ */ new Map();
    typeList = [];
    nConversions = 0;
    addTypes([anyType], false);
  }
  clear();
  addTypes(_types);
  function clearConversions() {
    let typeName;
    for (typeName of typeList) {
      typeMap.get(typeName).conversionsTo = [];
    }
    nConversions = 0;
  }
  function findTypeNames(value) {
    const matches = typeList.filter((name) => {
      const type = typeMap.get(name);
      return !type.isAny && type.test(value);
    });
    if (matches.length) {
      return matches;
    }
    return ["any"];
  }
  function isTypedFunction(entity) {
    return entity && typeof entity === "function" && "_typedFunctionData" in entity;
  }
  function findSignature(fn, signature, options) {
    if (!isTypedFunction(fn)) {
      throw new TypeError(NOT_TYPED_FUNCTION);
    }
    const exact = options && options.exact;
    const stringSignature = Array.isArray(signature) ? signature.join(",") : signature;
    const params = parseSignature(stringSignature);
    const canonicalSignature = stringifyParams(params);
    if (!exact || canonicalSignature in fn.signatures) {
      const match = fn._typedFunctionData.signatureMap.get(canonicalSignature);
      if (match) {
        return match;
      }
    }
    const nParams = params.length;
    let remainingSignatures;
    if (exact) {
      remainingSignatures = [];
      let name;
      for (name in fn.signatures) {
        remainingSignatures.push(fn._typedFunctionData.signatureMap.get(name));
      }
    } else {
      remainingSignatures = fn._typedFunctionData.signatures;
    }
    for (let i = 0; i < nParams; ++i) {
      const want = params[i];
      const filteredSignatures = [];
      let possibility;
      for (possibility of remainingSignatures) {
        const have = getParamAtIndex(possibility.params, i);
        if (!have || want.restParam && !have.restParam) {
          continue;
        }
        if (!have.hasAny) {
          const haveTypes = paramTypeSet(have);
          if (want.types.some((wtype) => !haveTypes.has(wtype.name))) {
            continue;
          }
        }
        filteredSignatures.push(possibility);
      }
      remainingSignatures = filteredSignatures;
      if (remainingSignatures.length === 0) break;
    }
    let candidate;
    for (candidate of remainingSignatures) {
      if (candidate.params.length <= nParams) {
        return candidate;
      }
    }
    throw new TypeError("Signature not found (signature: " + (fn.name || "unnamed") + "(" + stringifyParams(params, ", ") + "))");
  }
  function find(fn, signature, options) {
    return findSignature(fn, signature, options).implementation;
  }
  function convert(value, typeName) {
    const type = findType(typeName);
    if (type.test(value)) {
      return value;
    }
    const conversions = type.conversionsTo;
    if (conversions.length === 0) {
      throw new Error("There are no conversions to " + typeName + " defined.");
    }
    for (let i = 0; i < conversions.length; i++) {
      const fromType = findType(conversions[i].from);
      if (fromType.test(value)) {
        return conversions[i].convert(value);
      }
    }
    throw new Error("Cannot convert " + value + " to " + typeName);
  }
  function stringifyParams(params) {
    let separator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ",";
    return params.map((p) => p.name).join(separator);
  }
  function parseParam(param) {
    const restParam = param.indexOf("...") === 0;
    const types = !restParam ? param : param.length > 3 ? param.slice(3) : "any";
    const typeDefs = types.split("|").map((s) => findType(s.trim()));
    let hasAny = false;
    let paramName = restParam ? "..." : "";
    const exactTypes = typeDefs.map(function(type) {
      hasAny = type.isAny || hasAny;
      paramName += type.name + "|";
      return {
        name: type.name,
        typeIndex: type.index,
        test: type.test,
        isAny: type.isAny,
        conversion: null,
        conversionIndex: -1
      };
    });
    return {
      types: exactTypes,
      name: paramName.slice(0, -1),
      // remove trailing '|' from above
      hasAny,
      hasConversion: false,
      restParam
    };
  }
  function expandParam(param) {
    const typeNames = param.types.map((t) => t.name);
    const matchingConversions = availableConversions(typeNames);
    let hasAny = param.hasAny;
    let newName = param.name;
    const convertibleTypes = matchingConversions.map(function(conversion) {
      const type = findType(conversion.from);
      hasAny = type.isAny || hasAny;
      newName += "|" + conversion.from;
      return {
        name: conversion.from,
        typeIndex: type.index,
        test: type.test,
        isAny: type.isAny,
        conversion,
        conversionIndex: conversion.index
      };
    });
    return {
      types: param.types.concat(convertibleTypes),
      name: newName,
      hasAny,
      hasConversion: convertibleTypes.length > 0,
      restParam: param.restParam
    };
  }
  function paramTypeSet(param) {
    if (!param.typeSet) {
      param.typeSet = /* @__PURE__ */ new Set();
      param.types.forEach((type) => param.typeSet.add(type.name));
    }
    return param.typeSet;
  }
  function parseSignature(rawSignature) {
    const params = [];
    if (typeof rawSignature !== "string") {
      throw new TypeError("Signatures must be strings");
    }
    const signature = rawSignature.trim();
    if (signature === "") {
      return params;
    }
    const rawParams = signature.split(",");
    for (let i = 0; i < rawParams.length; ++i) {
      const parsedParam = parseParam(rawParams[i].trim());
      if (parsedParam.restParam && i !== rawParams.length - 1) {
        throw new SyntaxError('Unexpected rest parameter "' + rawParams[i] + '": only allowed for the last parameter');
      }
      if (parsedParam.types.length === 0) {
        return null;
      }
      params.push(parsedParam);
    }
    return params;
  }
  function hasRestParam(params) {
    const param = last(params);
    return param ? param.restParam : false;
  }
  function compileTest(param) {
    if (!param || param.types.length === 0) {
      return ok;
    } else if (param.types.length === 1) {
      return findType(param.types[0].name).test;
    } else if (param.types.length === 2) {
      const test0 = findType(param.types[0].name).test;
      const test1 = findType(param.types[1].name).test;
      return function or(x) {
        return test0(x) || test1(x);
      };
    } else {
      const tests = param.types.map(function(type) {
        return findType(type.name).test;
      });
      return function or(x) {
        for (let i = 0; i < tests.length; i++) {
          if (tests[i](x)) {
            return true;
          }
        }
        return false;
      };
    }
  }
  function compileTests(params) {
    let tests, test0, test1;
    if (hasRestParam(params)) {
      tests = initial(params).map(compileTest);
      const varIndex = tests.length;
      const lastTest = compileTest(last(params));
      const testRestParam = function(args) {
        for (let i = varIndex; i < args.length; i++) {
          if (!lastTest(args[i])) {
            return false;
          }
        }
        return true;
      };
      return function testArgs(args) {
        for (let i = 0; i < tests.length; i++) {
          if (!tests[i](args[i])) {
            return false;
          }
        }
        return testRestParam(args) && args.length >= varIndex + 1;
      };
    } else {
      if (params.length === 0) {
        return function testArgs(args) {
          return args.length === 0;
        };
      } else if (params.length === 1) {
        test0 = compileTest(params[0]);
        return function testArgs(args) {
          return test0(args[0]) && args.length === 1;
        };
      } else if (params.length === 2) {
        test0 = compileTest(params[0]);
        test1 = compileTest(params[1]);
        return function testArgs(args) {
          return test0(args[0]) && test1(args[1]) && args.length === 2;
        };
      } else {
        tests = params.map(compileTest);
        return function testArgs(args) {
          for (let i = 0; i < tests.length; i++) {
            if (!tests[i](args[i])) {
              return false;
            }
          }
          return args.length === tests.length;
        };
      }
    }
  }
  function getParamAtIndex(params, index) {
    return index < params.length ? params[index] : hasRestParam(params) ? last(params) : null;
  }
  function getTypeSetAtIndex(params, index) {
    const param = getParamAtIndex(params, index);
    if (!param) {
      return /* @__PURE__ */ new Set();
    }
    return paramTypeSet(param);
  }
  function isExactType(type) {
    return type.conversion === null || type.conversion === void 0;
  }
  function mergeExpectedParams(signatures, index) {
    const typeSet = /* @__PURE__ */ new Set();
    signatures.forEach((signature) => {
      const paramSet = getTypeSetAtIndex(signature.params, index);
      let name;
      for (name of paramSet) {
        typeSet.add(name);
      }
    });
    return typeSet.has("any") ? ["any"] : Array.from(typeSet);
  }
  function createError(name, args, signatures) {
    let err, expected;
    const _name = name || "unnamed";
    let matchingSignatures = signatures;
    let index;
    for (index = 0; index < args.length; index++) {
      const nextMatchingDefs = [];
      matchingSignatures.forEach((signature) => {
        const param = getParamAtIndex(signature.params, index);
        const test = compileTest(param);
        if ((index < signature.params.length || hasRestParam(signature.params)) && test(args[index])) {
          nextMatchingDefs.push(signature);
        }
      });
      if (nextMatchingDefs.length === 0) {
        expected = mergeExpectedParams(matchingSignatures, index);
        if (expected.length > 0) {
          const actualTypes = findTypeNames(args[index]);
          err = new TypeError("Unexpected type of argument in function " + _name + " (expected: " + expected.join(" or ") + ", actual: " + actualTypes.join(" | ") + ", index: " + index + ")");
          err.data = {
            category: "wrongType",
            fn: _name,
            index,
            actual: actualTypes,
            expected
          };
          return err;
        }
      } else {
        matchingSignatures = nextMatchingDefs;
      }
    }
    const lengths = matchingSignatures.map(function(signature) {
      return hasRestParam(signature.params) ? Infinity : signature.params.length;
    });
    if (args.length < Math.min.apply(null, lengths)) {
      expected = mergeExpectedParams(matchingSignatures, index);
      err = new TypeError("Too few arguments in function " + _name + " (expected: " + expected.join(" or ") + ", index: " + args.length + ")");
      err.data = {
        category: "tooFewArgs",
        fn: _name,
        index: args.length,
        expected
      };
      return err;
    }
    const maxLength = Math.max.apply(null, lengths);
    if (args.length > maxLength) {
      err = new TypeError("Too many arguments in function " + _name + " (expected: " + maxLength + ", actual: " + args.length + ")");
      err.data = {
        category: "tooManyArgs",
        fn: _name,
        index: args.length,
        expectedLength: maxLength
      };
      return err;
    }
    const argTypes = [];
    for (let i = 0; i < args.length; ++i) {
      argTypes.push(findTypeNames(args[i]).join("|"));
    }
    err = new TypeError('Arguments of type "' + argTypes.join(", ") + '" do not match any of the defined signatures of function ' + _name + ".");
    err.data = {
      category: "mismatch",
      actual: argTypes
    };
    return err;
  }
  function getLowestTypeIndex(param) {
    let min = typeList.length + 1;
    for (let i = 0; i < param.types.length; i++) {
      min = Math.min(min, param.types[i].typeIndex);
    }
    return min;
  }
  function getLowestConversionIndex(param) {
    let min = nConversions + 1;
    for (let i = 0; i < param.types.length; i++) {
      if (!isExactType(param.types[i])) {
        min = Math.min(min, param.types[i].conversionIndex);
      }
    }
    return min;
  }
  function compareParams(param1, param2) {
    if (param1.hasAny) {
      if (!param2.hasAny) {
        return 0.1;
      }
    } else if (param2.hasAny) {
      return -0.1;
    }
    if (param1.restParam) {
      if (!param2.restParam) {
        return 0.01;
      }
    } else if (param2.restParam) {
      return -0.01;
    }
    const typeDiff = getLowestTypeIndex(param1) - getLowestTypeIndex(param2);
    if (typeDiff < 0) {
      return -1e-3;
    }
    if (typeDiff > 0) {
      return 1e-3;
    }
    const conv1 = getLowestConversionIndex(param1);
    const conv2 = getLowestConversionIndex(param2);
    if (param1.hasConversion) {
      if (!param2.hasConversion) {
        return (1 + conv1) * 1e-6;
      }
    } else if (param2.hasConversion) {
      return -(1 + conv2) * 1e-6;
    }
    const convDiff = conv1 - conv2;
    if (convDiff < 0) {
      return -1e-7;
    }
    if (convDiff > 0) {
      return 1e-7;
    }
    return 0;
  }
  function compareSignatures(signature1, signature2) {
    const pars1 = signature1.params;
    const pars2 = signature2.params;
    const last1 = last(pars1);
    const last2 = last(pars2);
    const hasRest1 = hasRestParam(pars1);
    const hasRest2 = hasRestParam(pars2);
    if (hasRest1 && last1.hasAny) {
      if (!hasRest2 || !last2.hasAny) {
        return 1e7;
      }
    } else if (hasRest2 && last2.hasAny) {
      return -1e7;
    }
    let any1 = 0;
    let conv1 = 0;
    let par;
    for (par of pars1) {
      if (par.hasAny) ++any1;
      if (par.hasConversion) ++conv1;
    }
    let any2 = 0;
    let conv2 = 0;
    for (par of pars2) {
      if (par.hasAny) ++any2;
      if (par.hasConversion) ++conv2;
    }
    if (any1 !== any2) {
      return (any1 - any2) * 1e6;
    }
    if (hasRest1 && last1.hasConversion) {
      if (!hasRest2 || !last2.hasConversion) {
        return 1e5;
      }
    } else if (hasRest2 && last2.hasConversion) {
      return -1e5;
    }
    if (conv1 !== conv2) {
      return (conv1 - conv2) * 1e4;
    }
    if (hasRest1) {
      if (!hasRest2) {
        return 1e3;
      }
    } else if (hasRest2) {
      return -1e3;
    }
    const lengthCriterion = (pars1.length - pars2.length) * (hasRest1 ? -100 : 100);
    if (lengthCriterion !== 0) {
      return lengthCriterion;
    }
    const comparisons = [];
    let tc = 0;
    for (let i = 0; i < pars1.length; ++i) {
      const thisComparison = compareParams(pars1[i], pars2[i]);
      comparisons.push(thisComparison);
      tc += thisComparison;
    }
    if (tc !== 0) {
      return (tc < 0 ? -10 : 10) + tc;
    }
    let c;
    let bonus = 9;
    const decrement = bonus / (comparisons.length + 1);
    for (c of comparisons) {
      if (c !== 0) {
        return (c < 0 ? -bonus : bonus) + c;
      }
      bonus -= decrement;
    }
    return 0;
  }
  function availableConversions(typeNames) {
    if (typeNames.length === 0) {
      return [];
    }
    const types = typeNames.map(findType);
    if (typeNames.length === 1) return types[0].conversionsTo;
    const knownTypes = new Set(typeNames);
    const convertibleTypes = /* @__PURE__ */ new Set();
    for (let i = 0; i < types.length; ++i) {
      for (const match of types[i].conversionsTo) {
        if (!knownTypes.has(match.from)) convertibleTypes.add(match.from);
      }
    }
    const matches = [];
    for (const typeName of convertibleTypes) {
      let bestIndex = nConversions + 1;
      let bestConversion = null;
      for (let i = 0; i < types.length; ++i) {
        for (const match of types[i].conversionsTo) {
          if (match.from === typeName && match.index < bestIndex) {
            bestIndex = match.index;
            bestConversion = match;
          }
        }
      }
      matches.push(bestConversion);
    }
    return matches;
  }
  function compileArgsPreprocessing(params, fn) {
    let fnConvert = fn;
    let name = "";
    if (params.some((p) => p.hasConversion)) {
      const restParam = hasRestParam(params);
      const compiledConversions = params.map(compileArgConversion);
      name = compiledConversions.map((conv) => conv.name).join(";");
      fnConvert = function convertArgs() {
        const args = [];
        const last2 = restParam ? arguments.length - 1 : arguments.length;
        for (let i = 0; i < last2; i++) {
          args[i] = compiledConversions[i](arguments[i]);
        }
        if (restParam) {
          args[last2] = arguments[last2].map(compiledConversions[last2]);
        }
        return fn.apply(this, args);
      };
    }
    let fnPreprocess = fnConvert;
    if (hasRestParam(params)) {
      const offset = params.length - 1;
      fnPreprocess = function preprocessRestParams() {
        return fnConvert.apply(this, slice(arguments, 0, offset).concat([slice(arguments, offset)]));
      };
    }
    if (name) Object.defineProperty(fnPreprocess, "name", {
      value: name
    });
    return fnPreprocess;
  }
  function compileArgConversion(param) {
    let test0, test1, conversion0, conversion1;
    const tests = [];
    const conversions = [];
    let name = "";
    param.types.forEach(function(type) {
      if (type.conversion) {
        name += type.conversion.from + "~>" + type.conversion.to + ",";
        tests.push(findType(type.conversion.from).test);
        conversions.push(type.conversion.convert);
      }
    });
    if (name) name = name.slice(0, -1);
    else name = "pass";
    let convertor = (arg) => arg;
    switch (conversions.length) {
      case 0:
        break;
      case 1:
        test0 = tests[0];
        conversion0 = conversions[0];
        convertor = function convertArg(arg) {
          if (test0(arg)) {
            return conversion0(arg);
          }
          return arg;
        };
        break;
      case 2:
        test0 = tests[0];
        test1 = tests[1];
        conversion0 = conversions[0];
        conversion1 = conversions[1];
        convertor = function convertArg(arg) {
          if (test0(arg)) {
            return conversion0(arg);
          }
          if (test1(arg)) {
            return conversion1(arg);
          }
          return arg;
        };
        break;
      default:
        convertor = function convertArg(arg) {
          for (let i = 0; i < conversions.length; i++) {
            if (tests[i](arg)) {
              return conversions[i](arg);
            }
          }
          return arg;
        };
    }
    Object.defineProperty(convertor, "name", {
      value: name
    });
    return convertor;
  }
  function splitParams(params) {
    function _splitParams(params2, index, paramsSoFar) {
      if (index < params2.length) {
        const param = params2[index];
        let resultingParams = [];
        if (param.restParam) {
          const exactTypes = param.types.filter(isExactType);
          if (exactTypes.length < param.types.length) {
            resultingParams.push({
              types: exactTypes,
              name: "..." + exactTypes.map((t) => t.name).join("|"),
              hasAny: exactTypes.some((t) => t.isAny),
              hasConversion: false,
              restParam: true
            });
          }
          resultingParams.push(param);
        } else {
          resultingParams = param.types.map(function(type) {
            return {
              types: [type],
              name: type.name,
              hasAny: type.isAny,
              hasConversion: type.conversion,
              restParam: false
            };
          });
        }
        return flatMap(resultingParams, function(nextParam) {
          return _splitParams(params2, index + 1, paramsSoFar.concat([nextParam]));
        });
      } else {
        return [paramsSoFar];
      }
    }
    return _splitParams(params, 0, []);
  }
  function conflicting(params1, params2) {
    const ii = Math.max(params1.length, params2.length);
    for (let i = 0; i < ii; i++) {
      const typeSet1 = getTypeSetAtIndex(params1, i);
      const typeSet2 = getTypeSetAtIndex(params2, i);
      let overlap = false;
      let name;
      for (name of typeSet2) {
        if (typeSet1.has(name)) {
          overlap = true;
          break;
        }
      }
      if (!overlap) {
        return false;
      }
    }
    const len1 = params1.length;
    const len2 = params2.length;
    const restParam1 = hasRestParam(params1);
    const restParam2 = hasRestParam(params2);
    return restParam1 ? restParam2 ? len1 === len2 : len2 >= len1 : restParam2 ? len1 >= len2 : len1 === len2;
  }
  function clearResolutions(functionList) {
    return functionList.map((fn) => {
      if (isReferToSelf(fn)) {
        return referToSelf(fn.referToSelf.callback);
      }
      if (isReferTo(fn)) {
        return makeReferTo(fn.referTo.references, fn.referTo.callback);
      }
      return fn;
    });
  }
  function collectResolutions(references, functionList, signatureMap) {
    const resolvedReferences = [];
    let reference;
    for (reference of references) {
      let resolution = signatureMap[reference];
      if (typeof resolution !== "number") {
        throw new TypeError('No definition for referenced signature "' + reference + '"');
      }
      resolution = functionList[resolution];
      if (typeof resolution !== "function") {
        return false;
      }
      resolvedReferences.push(resolution);
    }
    return resolvedReferences;
  }
  function resolveReferences(functionList, signatureMap, self) {
    const resolvedFunctions = clearResolutions(functionList);
    const isResolved = new Array(resolvedFunctions.length).fill(false);
    let leftUnresolved = true;
    while (leftUnresolved) {
      leftUnresolved = false;
      let nothingResolved = true;
      for (let i = 0; i < resolvedFunctions.length; ++i) {
        if (isResolved[i]) continue;
        const fn = resolvedFunctions[i];
        if (isReferToSelf(fn)) {
          resolvedFunctions[i] = fn.referToSelf.callback(self);
          resolvedFunctions[i].referToSelf = fn.referToSelf;
          isResolved[i] = true;
          nothingResolved = false;
        } else if (isReferTo(fn)) {
          const resolvedReferences = collectResolutions(fn.referTo.references, resolvedFunctions, signatureMap);
          if (resolvedReferences) {
            resolvedFunctions[i] = fn.referTo.callback.apply(this, resolvedReferences);
            resolvedFunctions[i].referTo = fn.referTo;
            isResolved[i] = true;
            nothingResolved = false;
          } else {
            leftUnresolved = true;
          }
        }
      }
      if (nothingResolved && leftUnresolved) {
        throw new SyntaxError("Circular reference detected in resolving typed.referTo");
      }
    }
    return resolvedFunctions;
  }
  function validateDeprecatedThis(signaturesMap) {
    const deprecatedThisRegex = /\bthis(\(|\.signatures\b)/;
    Object.keys(signaturesMap).forEach((signature) => {
      const fn = signaturesMap[signature];
      if (deprecatedThisRegex.test(fn.toString())) {
        throw new SyntaxError("Using `this` to self-reference a function is deprecated since typed-function@3. Use typed.referTo and typed.referToSelf instead.");
      }
    });
  }
  function createTypedFunction(name, rawSignaturesMap) {
    typed.createCount++;
    if (Object.keys(rawSignaturesMap).length === 0) {
      throw new SyntaxError("No signatures provided");
    }
    if (typed.warnAgainstDeprecatedThis) {
      validateDeprecatedThis(rawSignaturesMap);
    }
    const parsedParams = [];
    const originalFunctions = [];
    const signaturesMap = {};
    const preliminarySignatures = [];
    let signature;
    for (signature in rawSignaturesMap) {
      if (!Object.prototype.hasOwnProperty.call(rawSignaturesMap, signature)) {
        continue;
      }
      const params = parseSignature(signature);
      if (!params) continue;
      parsedParams.forEach(function(pp) {
        if (conflicting(pp, params)) {
          throw new TypeError('Conflicting signatures "' + stringifyParams(pp) + '" and "' + stringifyParams(params) + '".');
        }
      });
      parsedParams.push(params);
      const functionIndex = originalFunctions.length;
      originalFunctions.push(rawSignaturesMap[signature]);
      const conversionParams = params.map(expandParam);
      let sp;
      for (sp of splitParams(conversionParams)) {
        const spName = stringifyParams(sp);
        preliminarySignatures.push({
          params: sp,
          name: spName,
          fn: functionIndex
        });
        if (sp.every((p) => !p.hasConversion)) {
          signaturesMap[spName] = functionIndex;
        }
      }
    }
    preliminarySignatures.sort(compareSignatures);
    const resolvedFunctions = resolveReferences(originalFunctions, signaturesMap, theTypedFn);
    let s;
    for (s in signaturesMap) {
      if (Object.prototype.hasOwnProperty.call(signaturesMap, s)) {
        signaturesMap[s] = resolvedFunctions[signaturesMap[s]];
      }
    }
    const signatures = [];
    const internalSignatureMap = /* @__PURE__ */ new Map();
    for (s of preliminarySignatures) {
      if (!internalSignatureMap.has(s.name)) {
        s.fn = resolvedFunctions[s.fn];
        signatures.push(s);
        internalSignatureMap.set(s.name, s);
      }
    }
    const ok0 = signatures[0] && signatures[0].params.length <= 2 && !hasRestParam(signatures[0].params);
    const ok1 = signatures[1] && signatures[1].params.length <= 2 && !hasRestParam(signatures[1].params);
    const ok2 = signatures[2] && signatures[2].params.length <= 2 && !hasRestParam(signatures[2].params);
    const ok3 = signatures[3] && signatures[3].params.length <= 2 && !hasRestParam(signatures[3].params);
    const ok4 = signatures[4] && signatures[4].params.length <= 2 && !hasRestParam(signatures[4].params);
    const ok5 = signatures[5] && signatures[5].params.length <= 2 && !hasRestParam(signatures[5].params);
    const allOk = ok0 && ok1 && ok2 && ok3 && ok4 && ok5;
    for (let i = 0; i < signatures.length; ++i) {
      signatures[i].test = compileTests(signatures[i].params);
    }
    const test00 = ok0 ? compileTest(signatures[0].params[0]) : notOk;
    const test10 = ok1 ? compileTest(signatures[1].params[0]) : notOk;
    const test20 = ok2 ? compileTest(signatures[2].params[0]) : notOk;
    const test30 = ok3 ? compileTest(signatures[3].params[0]) : notOk;
    const test40 = ok4 ? compileTest(signatures[4].params[0]) : notOk;
    const test50 = ok5 ? compileTest(signatures[5].params[0]) : notOk;
    const test01 = ok0 ? compileTest(signatures[0].params[1]) : notOk;
    const test11 = ok1 ? compileTest(signatures[1].params[1]) : notOk;
    const test21 = ok2 ? compileTest(signatures[2].params[1]) : notOk;
    const test31 = ok3 ? compileTest(signatures[3].params[1]) : notOk;
    const test41 = ok4 ? compileTest(signatures[4].params[1]) : notOk;
    const test51 = ok5 ? compileTest(signatures[5].params[1]) : notOk;
    for (let i = 0; i < signatures.length; ++i) {
      signatures[i].implementation = compileArgsPreprocessing(signatures[i].params, signatures[i].fn);
    }
    const fn0 = ok0 ? signatures[0].implementation : undef;
    const fn1 = ok1 ? signatures[1].implementation : undef;
    const fn2 = ok2 ? signatures[2].implementation : undef;
    const fn3 = ok3 ? signatures[3].implementation : undef;
    const fn4 = ok4 ? signatures[4].implementation : undef;
    const fn5 = ok5 ? signatures[5].implementation : undef;
    const len0 = ok0 ? signatures[0].params.length : -1;
    const len1 = ok1 ? signatures[1].params.length : -1;
    const len2 = ok2 ? signatures[2].params.length : -1;
    const len3 = ok3 ? signatures[3].params.length : -1;
    const len4 = ok4 ? signatures[4].params.length : -1;
    const len5 = ok5 ? signatures[5].params.length : -1;
    const iStart = allOk ? 6 : 0;
    const iEnd = signatures.length;
    const tests = signatures.map((s2) => s2.test);
    const fns = signatures.map((s2) => s2.implementation);
    const generic = function generic2() {
      for (let i = iStart; i < iEnd; i++) {
        if (tests[i](arguments)) {
          return fns[i].apply(this, arguments);
        }
      }
      return typed.onMismatch(name, arguments, signatures);
    };
    function theTypedFn(arg0, arg1) {
      if (arguments.length === len0 && test00(arg0) && test01(arg1)) {
        return fn0.apply(this, arguments);
      }
      if (arguments.length === len1 && test10(arg0) && test11(arg1)) {
        return fn1.apply(this, arguments);
      }
      if (arguments.length === len2 && test20(arg0) && test21(arg1)) {
        return fn2.apply(this, arguments);
      }
      if (arguments.length === len3 && test30(arg0) && test31(arg1)) {
        return fn3.apply(this, arguments);
      }
      if (arguments.length === len4 && test40(arg0) && test41(arg1)) {
        return fn4.apply(this, arguments);
      }
      if (arguments.length === len5 && test50(arg0) && test51(arg1)) {
        return fn5.apply(this, arguments);
      }
      return generic.apply(this, arguments);
    }
    try {
      Object.defineProperty(theTypedFn, "name", {
        value: name
      });
    } catch (err) {
    }
    theTypedFn.signatures = signaturesMap;
    theTypedFn._typedFunctionData = {
      signatures,
      signatureMap: internalSignatureMap
    };
    return theTypedFn;
  }
  function _onMismatch(name, args, signatures) {
    throw createError(name, args, signatures);
  }
  function initial(arr) {
    return slice(arr, 0, arr.length - 1);
  }
  function last(arr) {
    return arr[arr.length - 1];
  }
  function slice(arr, start, end) {
    return Array.prototype.slice.call(arr, start, end);
  }
  function findInArray(arr, test) {
    for (let i = 0; i < arr.length; i++) {
      if (test(arr[i])) {
        return arr[i];
      }
    }
    return void 0;
  }
  function flatMap(arr, callback) {
    return Array.prototype.concat.apply([], arr.map(callback));
  }
  function referTo() {
    const references = initial(arguments).map((s) => stringifyParams(parseSignature(s)));
    const callback = last(arguments);
    if (typeof callback !== "function") {
      throw new TypeError("Callback function expected as last argument");
    }
    return makeReferTo(references, callback);
  }
  function makeReferTo(references, callback) {
    return {
      referTo: {
        references,
        callback
      }
    };
  }
  function referToSelf(callback) {
    if (typeof callback !== "function") {
      throw new TypeError("Callback function expected as first argument");
    }
    return {
      referToSelf: {
        callback
      }
    };
  }
  function isReferTo(objectOrFn) {
    return objectOrFn && typeof objectOrFn.referTo === "object" && Array.isArray(objectOrFn.referTo.references) && typeof objectOrFn.referTo.callback === "function";
  }
  function isReferToSelf(objectOrFn) {
    return objectOrFn && typeof objectOrFn.referToSelf === "object" && typeof objectOrFn.referToSelf.callback === "function";
  }
  function checkName(nameSoFar, newName) {
    if (!nameSoFar) {
      return newName;
    }
    if (newName && newName !== nameSoFar) {
      const err = new Error("Function names do not match (expected: " + nameSoFar + ", actual: " + newName + ")");
      err.data = {
        actual: newName,
        expected: nameSoFar
      };
      throw err;
    }
    return nameSoFar;
  }
  function getObjectName(obj) {
    let name;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && (isTypedFunction(obj[key]) || typeof obj[key].signature === "string")) {
        name = checkName(name, obj[key].name);
      }
    }
    return name;
  }
  function mergeSignatures(dest, source) {
    let key;
    for (key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (key in dest) {
          if (source[key] !== dest[key]) {
            const err = new Error('Signature "' + key + '" is defined twice');
            err.data = {
              signature: key,
              sourceFunction: source[key],
              destFunction: dest[key]
            };
            throw err;
          }
        }
        dest[key] = source[key];
      }
    }
  }
  const saveTyped = typed;
  typed = function(maybeName) {
    const named = typeof maybeName === "string";
    const start = named ? 1 : 0;
    let name = named ? maybeName : "";
    const allSignatures = {};
    for (let i = start; i < arguments.length; ++i) {
      const item = arguments[i];
      let theseSignatures = {};
      let thisName;
      if (typeof item === "function") {
        thisName = item.name;
        if (typeof item.signature === "string") {
          theseSignatures[item.signature] = item;
        } else if (isTypedFunction(item)) {
          theseSignatures = item.signatures;
        }
      } else if (isPlainObject(item)) {
        theseSignatures = item;
        if (!named) {
          thisName = getObjectName(item);
        }
      }
      if (Object.keys(theseSignatures).length === 0) {
        const err = new TypeError("Argument to 'typed' at index " + i + " is not a (typed) function, nor an object with signatures as keys and functions as values.");
        err.data = {
          index: i,
          argument: item
        };
        throw err;
      }
      if (!named) {
        name = checkName(name, thisName);
      }
      mergeSignatures(allSignatures, theseSignatures);
    }
    return createTypedFunction(name || "", allSignatures);
  };
  typed.create = create;
  typed.createCount = saveTyped.createCount;
  typed.onMismatch = _onMismatch;
  typed.throwMismatchError = _onMismatch;
  typed.createError = createError;
  typed.clear = clear;
  typed.clearConversions = clearConversions;
  typed.addTypes = addTypes;
  typed._findType = findType;
  typed.referTo = referTo;
  typed.referToSelf = referToSelf;
  typed.convert = convert;
  typed.findSignature = findSignature;
  typed.find = find;
  typed.isTypedFunction = isTypedFunction;
  typed.warnAgainstDeprecatedThis = true;
  typed.addType = function(type, beforeObjectTest) {
    let before = "any";
    if (beforeObjectTest !== false && typeMap.has("Object")) {
      before = "Object";
    }
    typed.addTypes([type], before);
  };
  function _validateConversion(conversion) {
    if (!conversion || typeof conversion.from !== "string" || typeof conversion.to !== "string" || typeof conversion.convert !== "function") {
      throw new TypeError("Object with properties {from: string, to: string, convert: function} expected");
    }
    if (conversion.to === conversion.from) {
      throw new SyntaxError('Illegal to define conversion from "' + conversion.from + '" to itself.');
    }
  }
  typed.addConversion = function(conversion) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      override: false
    };
    _validateConversion(conversion);
    const to = findType(conversion.to);
    const existing = to.conversionsTo.find((other) => other.from === conversion.from);
    if (existing) {
      if (options && options.override) {
        typed.removeConversion({
          from: existing.from,
          to: conversion.to,
          convert: existing.convert
        });
      } else {
        throw new Error('There is already a conversion from "' + conversion.from + '" to "' + to.name + '"');
      }
    }
    to.conversionsTo.push({
      from: conversion.from,
      to: to.name,
      convert: conversion.convert,
      index: nConversions++
    });
  };
  typed.addConversions = function(conversions, options) {
    conversions.forEach((conversion) => typed.addConversion(conversion, options));
  };
  typed.removeConversion = function(conversion) {
    _validateConversion(conversion);
    const to = findType(conversion.to);
    const existingConversion = findInArray(to.conversionsTo, (c) => c.from === conversion.from);
    if (!existingConversion) {
      throw new Error("Attempt to remove nonexistent conversion from " + conversion.from + " to " + conversion.to);
    }
    if (existingConversion.convert !== conversion.convert) {
      throw new Error("Conversion to remove does not match existing conversion");
    }
    const index = to.conversionsTo.indexOf(existingConversion);
    to.conversionsTo.splice(index, 1);
  };
  typed.resolve = function(tf, argList) {
    if (!isTypedFunction(tf)) {
      throw new TypeError(NOT_TYPED_FUNCTION);
    }
    const sigs = tf._typedFunctionData.signatures;
    for (let i = 0; i < sigs.length; ++i) {
      if (sigs[i].test(argList)) {
        return sigs[i];
      }
    }
    return null;
  };
  return typed;
}
const typedFunction = create();
export {
  typedFunction as t
};
