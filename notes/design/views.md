# design of views

- [tldr](#tldr)
- [example](#example)
- [notes](#notes)
- [reference](#reference)

# tldr

- 80x24 characters screens

# example

```txt
^xor4  john @ king valley  T 2038, 1st 1/4 
028fa8cafe1754f0a028fa8cafe1754f0a028fa8cafe1754f0a028fa8cafe1754f0a028fa8cafe17

  ................................  0000 0000 0000
  ................................  name john
  ................................  class wizard
  ................................  level 1
  ..............@@@@..............
  ................................  L empty
  ................................  R empty
  ................................  A empty


9x 60 characters lines                                      ;
                                                            ;
There is a sign here you can read.                          ;
A wooden chest is here                                      ;  
                                                            ;  L 99
                                                            ;  X 100%
                                                            ;  H 100%
                                                            ;  S 100%
                                                            ;  M 100%
                                                            ;  $ 100000000
$_
```

Testycre's workroom [e,d]
You are standing in the workroom of the mighty Testycre!
You may return to the Creators' Hall by going down.
A sample room is east.
There is a sign here you can read.
There is a sheet here you can read.
A wooden chest is here.

# notes

- Terminal emulators almost always support ANSI escape codes
- termcap or terminfo
- ASCII escape character (`\x1B` or `^[` or just `27`)
- Escape sequences
  - `Fe` C1 control codes for general use
    - ESC[0x9B  CSI  Control Sequence Introducer
    - ESC\0x9C  ST  String Terminator
    - ESC ]	0x9D	OSC	Operating System Command
  - `Fs` control functions individually registered with the ISO-IR registry
    - ESC c	RIS	Reset to Initial State
  - `Fp` private-use control functions
  - `nF` ANSI/ISO code-switching mechanisms
  - Terminal output sequences
  - SGR parameters
    - Bold, faint, italic, 
    - Slow Blink, Rapid Blink
    - Reverse video
    - colors
- DEC VT102?

# reference

- https://en.wikipedia.org/wiki/Signaling_(telecommunications)
- https://en.wikipedia.org/wiki/In-band_signaling
- https://en.wikipedia.org/wiki/ISO/IEC_2022
- https://en.wikipedia.org/wiki/C0_and_C1_control_codes
- http://bjh21.me.uk/all-escapes/all-escapes.txt
- https://invisible-island.net/xterm/ctlseqs/ctlseqs.html
- https://vt100.net/docs/vt102-ug/
