import fs from 'fs';

export function readFile(directory: string): Promise<string> {
  return new Promise((res, rej) => {
    fs.readFile(directory, 'utf8', (err, data) => {
      if (err) {
        rej(err);
      }

      res(data);
    });
  })
}

export function readDir(directory: string): Promise<string[]> {
  return new Promise((res, rej) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        rej(err);
      }

      res(files);
    })
  });
}

export function writeFile(directory: string, data: string | NodeJS.ArrayBufferView): Promise<void> {
  return new Promise((res, rej) => {
    fs.writeFile(directory, data, (err) => {
      if (err) {
        rej(err);
      }

      res();
    })
  });
}

export function moveFile(src: string, dest: string): Promise<void> {
  return new Promise((res, rej) => {
    fs.rename(src, dest, (err) => {
      if (err) {
        rej(err);
      }

      res();
    })
  })
}

export function removeFile(file: string): Promise<void> {
  return new Promise((res, rej) => {
    fs.rm(file, (err) => {
      if (err) {
        rej(err);
      }

      res();
    })
  })
}
