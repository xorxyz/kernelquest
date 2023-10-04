import { createHash } from "crypto";
import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import path, { basename } from "path";
import { fileURLToPath } from 'url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, '../', 'dist');
const srcDir = path.join(__dirname, '../', 'src');

main();

export async function main () {
  const configFileName = ts.findConfigFile("./", ts.sys.fileExists, "tsconfig.json");
  if (!configFileName) throw new Error('Could not find TS config file');
  const configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
  const compilerOptions = ts.parseJsonConfigFileContent(configFile.config, ts.sys, "./");

  await mkdir(outDir, { recursive: true });

  const files = await readdir(srcDir);

  for (const file of files) {
    console.log('file:', file)
    const contents = await readFile(path.join(srcDir, file), 'utf8');
    const hash = getHash(file);
    const output = await ts.transpileModule(contents, compilerOptions.raw);

    await writeFile(path.join(outDir, hash + '.js'), output.outputText);
  }
}

function getHash (filepath) {
  const levelId = basename(filepath)
  const salt = 'borrow recognize cable piece circumstance soul';
  const plaintext = `${levelId} ${salt}`
  const hash = createHash('sha256').update(plaintext).digest('hex');
  
  return hash;
}

