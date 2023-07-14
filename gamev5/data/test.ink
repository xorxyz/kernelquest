EXTERNAL exec(code)

-> intro

== intro ==
MAN: Hello, world!

+   "Hello"[], you reply. 
    -> done
+   ["Goodbye."]
    You decide to leave this man alone and walk away. 
    -> END

== done ==
MAN: What a wonderful day.

~ exec("noop")
The sun appears over the horizon.
-> END
