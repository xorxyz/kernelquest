# host

## OS 

Processes
A Linux process can be in one of the following states:

Process states
R	Running or runnable (on run queue)
D	Uninterruptible sleep (waiting for some event)
S	Interruptible sleep (waiting for some event or signal)
T	Stopped, either by a job control signal or because it is being traced by a debugger.
Z	Zombie process, terminated but not yet reaped by its parent.

Jobs and sessions
Job control is what happens when you press ^Z to suspend a program, or when you start a program in the background using &. A job is the same as a process group. Internal shell commands like jobs, fg and bg can be used to manipulate the existing jobs within a session. Each session is managed by a session leader, the shell, which is cooperating tightly with the kernel using a complex protocol of signals and system calls.
