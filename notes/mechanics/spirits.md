# spirits

While a spell is a passive collection of instructions, a spirit does the actual execution of those instructions


process:
an image of the executable machine code
some region of virtual memory
process-specific data (input and output)
a call stack (to keep track of active subroutines and/or other events)
a heap to hold intermediate computation data generated during run time
file descriptors of resources that are allocated to the process
Security attributes (process owner and the process' set of permissions (allowable operations))
Processor state (content of registers and physical memory addressing

The state is typically stored in computer registers when the process is executing, and in memory otherwise

holds most of this information about active processes in data structures called process control blocks or process descriptor

Information in a process control block is updated during the transition of process states

When the process terminates, its PCB is returned to the pool from which new PCBs are drawn
Each process has a single PCB
they are accessed and/or modified by most utilities, particularly those involved with scheduling and resource management

Process identification
Process state
  the content of general-purpose CPU registers, the CPU process status word, stack and frame pointers, etc
  a unique identifier for the process (almost invariably an integer) and, in a multiuser-multitasking system, data such as the identifier of the parent process, user identifier, user group identifier, etc
Process control
  Process scheduling state
  Process structuring information
  flags, signals and messages
  Privileges–allowed/disallowed access to system resources
  State–new, ready, running, waiting, dead
  Process Number (PID)
  Program Counter
  CPU Registers
  CPU Scheduling Information
  Memory Management Information
  Accounting Information
  I/O Status
