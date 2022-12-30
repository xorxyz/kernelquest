// Test file for dialogue

// INCLUDE lib.ink

-> intro

== intro ==
MAN: Hey there. I'm just some man. Don't mind me! I'll just stand over here and wait for you to say something.
Don't worry, I'm not in a hurry!

+   "No problem!"[], you reply. 
    -> happy
+   "Who cares?"[], you say.
    -> intro
+   ["Goodbye."]
    You don't have much to say to this man.
    You decide to leave him alone and walk away. 
    -> END

== happy ==
MAN: That's nice of you to say! You made my day.

*   ["See you around."] The man waves at you as you leave.

-> END
