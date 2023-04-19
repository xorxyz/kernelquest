
import ffi from 'ffi-napi';

const libc = ffi.Library('libc', {
  'open': ['int', ['string', 'int']],
  'read': ['int', ['int', 'string', 'uint']],
  'close': ['int', ['int']]
});

function fileToString(filename: string): string {
  const fd = libc.open(filename, 0);
  if (fd < 0) {
    throw new Error(`Failed to open file: ${filename}`);
  }

  const buffer = Buffer.alloc(1024);
  let bytesRead = 0;
  let content = '';

  do {
    bytesRead = libc.read(fd, buffer, buffer.length);
    if (bytesRead < 0) {
      throw new Error(`Failed to read file: ${filename}`);
    }
    content += buffer.slice(0, bytesRead).toString();
  } while (bytesRead > 0);

  if (libc.close(fd) < 0) {
    throw new Error(`Failed to close file: ${filename}`);
  }

  return content;
}