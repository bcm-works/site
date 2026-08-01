export function fileExists(localFilePath: string): boolean {
  try {
    const localFileCheck = Deno.lstatSync(localFilePath);
    return localFileCheck.isFile;
  } catch (_error) {
    return false;
  }
}

export function dirExists(localDirPath: string): boolean {
  try {
    const localDirCheck = Deno.lstatSync(localDirPath);
    return localDirCheck.isDirectory;
  } catch (_error) {
    return false;
  }
}
