// Test file for dialogue

INCLUDE lib.ink

-> intro

== intro ==
He says: "Hello, world." # these are tags

*   "Interesting[."]", you reply. -> the_end
+   "I love the world[."], you say. -> intro

== the_end ==
"Isn't it?"

-> END
