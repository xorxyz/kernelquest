// malloc(): Allocate memory
// free(): Deallocate memory
// atoi(): Convert a string to an integer
// qsort(): Quick sort
// rand(): Generate a random number

import { IAction } from '../../shared/interfaces';

// environment
// getenv(): Get an environment variable
// setenv(): Set an environment variable

// file operations
// close(): Close a file descriptor
// read(): Read data from a file descriptor

export const STDIN_FILENO = 0;
export const STDOUT_FILENO = 1;
export const STDERR_FILENO = 2;

export function read(fd: number, offset: number): IAction {
  return {
    name: 'read',
    args: {
      fd,
      offset,
    },
  };
}

export const O_RDONLY = 'O_RDONLY';
export const O_WRONLY = 'O_WRONLY';
export const O_RDWR = 'O_RDWR';
export const O_CREAT = 'O_CREAT';
export const O_EXCL = 'O_EXCL';

export const FD_FLAGS = [O_RDONLY, O_WRONLY, O_RDWR, O_CREAT, O_EXCL] as const;

export type FdFlag = typeof FD_FLAGS[number]

// write(): Write data to a file descriptor
// lseek(): Move the read/write file offset

// open(): Open a file
export function open(name: string, flag: FdFlag): IAction {
  return {
    name: 'open',
    args: {
      name,
      flag,
    },
  };
}
// fcntl(): Perform various operations on a file descriptor, such as getting or setting its flags.
// flags: O_RDONLY, O_WRONLY, O_RDWR, O_CREAT, O_EXCL

// process management
// fork(): Create a new process
// exec(): Execute a new program in a process
// getpid(): Get the process ID
// wait(): Wait for a process to change state
// exit(): Terminate the calling process

// time
// sleep(): Sleep for a specified number of seconds
// usleep(): Sleep for a specified number of microseconds

// basic i/o
// printf(): Output formatted string
// scanf(): Input formatted data

// signal handling
// signal(): Signal handling (at least basic support)
// kill(): Send a signal to a process

// error handling
// perror(): Print a description for the last error that occurred
// errno: Global variable used by syscalls and lib functions to indicate why an error has occurred
