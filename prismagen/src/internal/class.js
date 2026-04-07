import * as runtime from "@prisma/client/runtime/client";
const config = {
    "previewFeatures": [],
    "clientVersion": "7.6.0",
    "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
    "activeProvider": "postgresql",
    "inlineSchema": "generator client {\n  provider            = \"prisma-client\"\n  output              = \"../../prismagen/src\"\n  moduleFormat        = \"esm\"\n  importFileExtension = \"ts\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel User {\n  id        Int      @id @default(autoincrement())\n  handle    String   @unique\n  email     String   @unique\n  password  String\n  createdAt DateTime @default(now())\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    },
    "parameterizationSchema": {
        "strings": [],
        "graph": ""
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"handle\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"User.findUnique\",\"User.findUniqueOrThrow\",\"orderBy\",\"cursor\",\"User.findFirst\",\"User.findFirstOrThrow\",\"User.findMany\",\"data\",\"User.createOne\",\"User.createMany\",\"User.createManyAndReturn\",\"User.updateOne\",\"User.updateMany\",\"User.updateManyAndReturn\",\"create\",\"update\",\"User.upsertOne\",\"User.deleteOne\",\"User.deleteMany\",\"having\",\"_count\",\"_avg\",\"_sum\",\"_min\",\"_max\",\"User.groupBy\",\"User.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"handle\",\"email\",\"password\",\"createdAt\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"contains\",\"startsWith\",\"endsWith\",\"set\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "MAsQCBwAACUAMB0AAAQAEB4AACUAMB8CAAAAASABAAAAASEBAAAAASIBACcAISNAACgAIQEAAAABACABAAAAAQAgCBwAACUAMB0AAAQAEB4AACUAMB8CACYAISABACcAISEBACcAISIBACcAISNAACgAIQADAAAABAAgAwAABQAwBAAAAQAgAwAAAAQAIAMAAAUAMAQAAAEAIAMAAAAEACADAAAFADAEAAABACAFHwIAAAABIAEAAAABIQEAAAABIgEAAAABI0AAAAABAQgAAAkAIAUfAgAAAAEgAQAAAAEhAQAAAAEiAQAAAAEjQAAAAAEBCAAACwAwAQgAAAsAMAUfAgAwACEgAQAuACEhAQAuACEiAQAuACEjQAAvACECAAAAAQAgCAAADgAgBR8CADAAISABAC4AISEBAC4AISIBAC4AISNAAC8AIQIAAAAEACAIAAAQACACAAAABAAgCAAAEAAgAwAAAAEAIA8AAAkAIBAAAA4AIAEAAAABACABAAAABAAgBRUAACkAIBYAACoAIBcAAC0AIBgAACwAIBkAACsAIAgcAAAaADAdAAAXABAeAAAaADAfAgAbACEgAQAcACEhAQAcACEiAQAcACEjQAAdACEDAAAABAAgAwAAFgAwFAAAFwAgAwAAAAQAIAMAAAUAMAQAAAEAIAgcAAAaADAdAAAXABAeAAAaADAfAgAbACEgAQAcACEhAQAcACEiAQAcACEjQAAdACENFQAAHwAgFgAAJAAgFwAAHwAgGAAAHwAgGQAAHwAgJAIAAAABJQIAAAAEJgIAAAAEJwIAAAABKAIAAAABKQIAAAABKgIAAAABKwIAIwAhDhUAAB8AIBgAACIAIBkAACIAICQBAAAAASUBAAAABCYBAAAABCcBAAAAASgBAAAAASkBAAAAASoBAAAAASsBACEAISwBAAAAAS0BAAAAAS4BAAAAAQsVAAAfACAYAAAgACAZAAAgACAkQAAAAAElQAAAAAQmQAAAAAQnQAAAAAEoQAAAAAEpQAAAAAEqQAAAAAErQAAeACELFQAAHwAgGAAAIAAgGQAAIAAgJEAAAAABJUAAAAAEJkAAAAAEJ0AAAAABKEAAAAABKUAAAAABKkAAAAABK0AAHgAhCCQCAAAAASUCAAAABCYCAAAABCcCAAAAASgCAAAAASkCAAAAASoCAAAAASsCAB8AIQgkQAAAAAElQAAAAAQmQAAAAAQnQAAAAAEoQAAAAAEpQAAAAAEqQAAAAAErQAAgACEOFQAAHwAgGAAAIgAgGQAAIgAgJAEAAAABJQEAAAAEJgEAAAAEJwEAAAABKAEAAAABKQEAAAABKgEAAAABKwEAIQAhLAEAAAABLQEAAAABLgEAAAABCyQBAAAAASUBAAAABCYBAAAABCcBAAAAASgBAAAAASkBAAAAASoBAAAAASsBACIAISwBAAAAAS0BAAAAAS4BAAAAAQ0VAAAfACAWAAAkACAXAAAfACAYAAAfACAZAAAfACAkAgAAAAElAgAAAAQmAgAAAAQnAgAAAAEoAgAAAAEpAgAAAAEqAgAAAAErAgAjACEIJAgAAAABJQgAAAAEJggAAAAEJwgAAAABKAgAAAABKQgAAAABKggAAAABKwgAJAAhCBwAACUAMB0AAAQAEB4AACUAMB8CACYAISABACcAISEBACcAISIBACcAISNAACgAIQgkAgAAAAElAgAAAAQmAgAAAAQnAgAAAAEoAgAAAAEpAgAAAAEqAgAAAAErAgAfACELJAEAAAABJQEAAAAEJgEAAAAEJwEAAAABKAEAAAABKQEAAAABKgEAAAABKwEAIgAhLAEAAAABLQEAAAABLgEAAAABCCRAAAAAASVAAAAABCZAAAAABCdAAAAAAShAAAAAASlAAAAAASpAAAAAAStAACAAIQAAAAAAAS8BAAAAAQEvQAAAAAEFLwIAAAABMAIAAAABMQIAAAABMgIAAAABMwIAAAABAAAAAAUVAAYWAAcXAAgYAAkZAAoAAAAAAAUVAAYWAAcXAAgYAAkZAAoBAgECAwEFBgEGBwEHCAEJCgEKDAILDQMMDwENEQIOEgQREwESFAETFQIaGAUbGQs"
};
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await import('node:buffer');
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
export function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map