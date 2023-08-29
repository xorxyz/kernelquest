EXTERNAL exec(code)

-> intro

== intro ==
MAN: Please, don't hurt me!

+   "What do you mean?"[], you reply. 
    -> scared
+   ["Goodbye."]
    You decide to leave him alone and walk away. 
    -> END

== scared ==
MAN: I'm scared!

~ exec("[[me hero] avoid] goal")
The man starts avoiding you.
-> END
