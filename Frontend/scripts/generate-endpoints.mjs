import fs from "fs";
import path from "path";

const backendRoot = process.env.BACKEND_ROOT
  ? path.resolve(process.env.BACKEND_ROOT)
  : path.resolve(process.cwd(), "..");

const outputPath = path.resolve(
  process.cwd(),
  "src/data/endpoints.generated.json"
);

const isDirectory = (filePath) => {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
};

const readProperties = (filePath) => {
  const props = {};
  if (!fs.existsSync(filePath)) return props;
  const content = fs.readFileSync(filePath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...rest] = trimmed.split("=");
    if (!key) return;
    props[key.trim()] = rest.join("=").trim();
  });
  return props;
};

const walk = (dir, matcher = () => true, acc = []) => {
  if (!isDirectory(dir)) return acc;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath, matcher, acc);
    } else if (matcher(entryPath)) {
      acc.push(entryPath);
    }
  });
  return acc;
};

const extractPath = (mappingArgs) => {
  if (!mappingArgs) return "";
  const stringMatch = mappingArgs.match(/"([^"]+)"/);
  return stringMatch ? stringMatch[1] : "";
};

const normalizePath = (base, endpointPath) => {
  const join = `${base || ""}${endpointPath || ""}`;
  if (!join.startsWith("/")) return `/${join}`;
  return join.replace(/\/+/g, "/");
};

const slugify = (value) =>
  value
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const buildClassIndex = (root) => {
  const index = new Map();
  const javaFiles = walk(root, (file) => file.endsWith(".java"));
  javaFiles.forEach((file) => {
    const name = path.basename(file, ".java");
    if (!index.has(name)) {
      index.set(name, file);
    }
  });
  return index;
};

const parseDtoFields = (filePath) => {
  if (!filePath || !fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf8");
  const fields = [];
  const fieldRegex = /private\s+([\w<>.]+)\s+(\w+)\s*;/g;
  let match;
  while ((match = fieldRegex.exec(content))) {
    const [, type, name] = match;
    if (!name) continue;
    fields.push({ name, type });
  }
  return fields;
};

const fieldTypeToInput = (type) => {
  if (!type) return { type: "string" };
  const normalized = type.replace(/\s/g, "");
  if (normalized.startsWith("List<")) {
    const inner = normalized.slice(5, -1);
    if (["Integer", "Long", "Double", "Float", "BigDecimal"].includes(inner)) {
      return { type: "list-number" };
    }
    return { type: "list-string" };
  }
  if (normalized.endsWith("[]")) {
    return { type: "list-string" };
  }
  if (["int", "Integer", "long", "Long", "double", "Double", "float", "Float", "BigDecimal"].includes(normalized)) {
    return { type: "number" };
  }
  if (["boolean", "Boolean"].includes(normalized)) {
    return { type: "boolean" };
  }
  return { type: "string" };
};

const parseController = (filePath, classIndex) => {
  const content = fs.readFileSync(filePath, "utf8");
  if (!content.includes("@RestController")) return [];

  const classIndexPos = content.search(/class\s+\w+/);
  const beforeClass = classIndexPos >= 0 ? content.slice(0, classIndexPos) : "";
  const classMappingMatch = beforeClass.match(/@RequestMapping\(([^)]*)\)/);
  const basePath = extractPath(classMappingMatch?.[1] || "");

  const endpoints = [];
  const mappingRegex = /@(Get|Post|Put|Delete)Mapping\s*(\(([^)]*)\))?/g;
  let match;
  while ((match = mappingRegex.exec(content))) {
    const [, verb, , args] = match;
    const method = verb.toUpperCase();
    const pathPart = extractPath(args || "");

    const after = content.slice(match.index + match[0].length);
    const sigMatch = after.match(/\s*(public|protected|private)[\s\S]*?\(([^)]*)\)/);
    if (!sigMatch) continue;
    const paramsString = sigMatch[2] || "";

    const pathParams = [];
    const queryParams = [];
    let bodyType = null;
    let bodyVar = null;

    const paramParts = paramsString
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    paramParts.forEach((param) => {
      if (param.includes("@RequestBody")) {
        const bodyMatch = param.match(/@RequestBody\s+([\w<>.]+)\s+(\w+)/);
        if (bodyMatch) {
          bodyType = bodyMatch[1];
          bodyVar = bodyMatch[2];
        }
      }

      if (param.includes("@PathVariable")) {
        const matchVar = param.match(
          /@PathVariable(?:\("?([\w-]+)"?\))?\s+[\w<>.]+\s+(\w+)/
        );
        if (matchVar) {
          pathParams.push(matchVar[1] || matchVar[2]);
        }
      }

      if (param.includes("@RequestParam")) {
        const matchVar = param.match(
          /@RequestParam(?:\("?([\w-]+)"?\))?\s+[\w<>.]+\s+(\w+)/
        );
        if (matchVar) {
          queryParams.push(matchVar[1] || matchVar[2]);
        }
      }
    });

    const fields = [];
    pathParams.forEach((name) => {
      fields.push({ name, in: "path", ...fieldTypeToInput("String") });
    });
    queryParams.forEach((name) => {
      fields.push({ name, in: "query", ...fieldTypeToInput("String") });
    });

    if (bodyType) {
      const typeInfo = fieldTypeToInput(bodyType);
      if (bodyType.startsWith("List<") || bodyType.endsWith("[]")) {
        fields.push({
          name: bodyVar || "items",
          in: "body",
          ...typeInfo,
          helper: "Comma-separated values"
        });
      } else if (
        [
          "String",
          "Integer",
          "Long",
          "Double",
          "Float",
          "BigDecimal",
          "Boolean",
          "int",
          "long",
          "double",
          "float",
          "boolean"
        ].includes(bodyType)
      ) {
        fields.push({
          name: bodyVar || "value",
          in: "body",
          ...typeInfo
        });
      } else {
        const dtoFile = classIndex.get(bodyType);
        const dtoFields = parseDtoFields(dtoFile);
        dtoFields.forEach((field) => {
          fields.push({
            name: field.name,
            in: "body",
            ...fieldTypeToInput(field.type)
          });
        });
      }
    }

    const pathValue = normalizePath(basePath, pathPart || "");
    const id = slugify(`${method}-${pathValue}`);

    endpoints.push({
      id,
      method,
      path: pathValue,
      fields
    });
  }

  return endpoints;
};

const discoverServices = (root) => {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(root, entry.name))
    .filter((dir) => isDirectory(path.join(dir, "src/main/java")));
};

const resolveServicesRoot = (root) => {
  const backendDir = path.join(root, "Backend");
  if (!isDirectory(backendDir)) return root;

  const entries = fs.readdirSync(backendDir, { withFileTypes: true });
  const hasServiceDirs = entries.some((entry) => {
    if (!entry.isDirectory()) return false;
    return isDirectory(path.join(backendDir, entry.name, "src/main/java"));
  });

  return hasServiceDirs ? backendDir : root;
};

const servicesRoot = resolveServicesRoot(backendRoot);
const classIndex = buildClassIndex(servicesRoot);

const services = discoverServices(servicesRoot)
  .map((serviceRoot) => {
    const props = readProperties(
      path.join(serviceRoot, "src/main/resources/application.properties")
    );

    const name = props["spring.application.name"] || path.basename(serviceRoot);
    const port = props["server.port"] ? Number(props["server.port"]) : null;
    const baseUrl = port ? `http://localhost:${port}` : null;

    const controllerFiles = walk(
      path.join(serviceRoot, "src/main/java"),
      (file) => file.endsWith("Controller.java")
    );

    const endpoints = controllerFiles
      .map((file) => parseController(file, classIndex))
      .flat();

    if (endpoints.length === 0) return null;

    return {
      id: slugify(name),
      name,
      baseUrl,
      port,
      endpoints
    };
  })
  .filter(Boolean);

const output = {
  generatedAt: new Date().toISOString(),
  backendRoot,
  services
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`Generated endpoints at ${outputPath}`);
