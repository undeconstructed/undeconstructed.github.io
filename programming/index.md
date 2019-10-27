# Thinking about programming

There will be two themes to this:

* What makes programming go well
* Where things went wrong with programming

Hopefully I will manage in some way to bring them together.

## Networks

When people design networks, they will generally think about control plane and data plane. The intent is to separate the management of the network, from the actual job of that network.

When these concerns are not separated, there are extra risks. For example, if a badly configured network node is rejecting traffic, how do you get a message to that node to reconfigure it, if your message is regarded as traffic?

In practice, nobody ever completely separates these concerns. Nobody wants to have to run two cables to every node, so that control can be isolated. And even then, where would that control data go? It needs to be processed, so add another processor for it, but then it needs to access the local data plane machinery at some point, or it can't control it. It's impossible to completely isolate those functions.

Instead, people normally rely on the foundations that are already in place. A node with an operating system is able to fairly well isolate processes. Each process can believe it has its own network connection, because the internet is designed to to behave as though there are infinitely many cables, connecting any two points, regardless of you only having one physical cable.

As long as the foundation is relatively solid, virtual control and data planes can be built, which are as isolated from each other as is generally required.

## Systems

In fact, most systems benefit from a similar division of concerns. All actions can be categorised into either: 1) deciding what to do, or 2) doing it.

This distinction is observed almost everywhere. Networks people talk about data and control planes. Organisations talk about managers and non-managers. Operating systems have kernel (system) and user (program) space.

And in people there is brain and body. Approximately. That perhaps indicates why the same model appears all over the place. It's basically how we get things done. We decide what to do, and then we do it.

Maybe we decide to eat a whole chocolate cake, and then set the body to the task. The body might at some point give a signal that this was a bad idea, but it can't decide to stop. The brain needs to receive that signal and decide what to do next.

Yet somehow programming doesn't follow this rule. Programming languages have been created that mean decisions can be made anywhere at any time, without there being a brain in control. Is that a fair analogy? Let's see.

## Programs

When the first computer programs were written, they were very simple. The processor could only do a very small number of things, and it did them in the order it was instructed to. If a program were to say:

```
a = 1
b = a + 2
```

Then the processor would first put the number 1 into a, then it would read a, add 2 to it, and store the answer into b. At the end, b would _always_ contain 3. There was no question about that.

In order to manage this sequence of actions, the processor would keep a program counter (PC) which said which instruction to run next. After each instruction it would add 1 to PC. That was the whole operation of computer. More or less.

Programming languages came to be created that followed this example. Whenever the programmer wrote two lines of code next to each other, she could be sure that whatever state the world was in after the first line was finished, that was how it would be as the second line started.

## Processes

As computers became more advanced and powerful, it was useful to find a way for them to run multiple programs at the same time. In fact, a processor on its own can't do that, because it can only do the basic of running and instruction, then incrementing PC and starting again.

With some more advanced processors, which contained some special features just for this purpose, people could create operating systems. The idea of an operation system is to allow multiple programs to run on the same processor. The OS will use special processor instructions to interrupt and pause one process (instance of a program) and resume another.

The beauty of this system is that each process is very much like a whole computer. It appears (to the program) as though a processor is following the same loop of running one instruction, incrementing the PC and starting again. As it happens, there are now lots of program counters, one for each process, but only the OS knows about that.

Because of this subterfuge, there was no need for new programming languages, everyone could carry on using the languages that assumed each instruction was run in turn, just as before.

As if by magic, lots of programs could be run at the same time on a single computer, all completely isolated from each other.

## Threads

Once an operating system has the ability to run more than one process at a time, its an easy enough step to allow it to run multiple parts of the same program at once. This is threads.

Multiple threads of execution can be active within a single process. They are just like processes, except that they aren't independent. Actually, they are just like processes except:

* they share the same memory
* they share the same permissions
* the programmer knows about them all upfront
* the programmer links them all together into one unit to deploy

So they aren't really anything like processes, and yet they are implemented in almost exactly the same way. Why?

As far as I can tell, it's because people didn't want to make new programming languages. Instead of making their compilers produce instructions for doing multiple things at once, they asked the operating system to do it.

As it happens, they completely broke their programming languages in the process. Now it is possible that a program contains the instructions:

```
a = 1
b = a + 2
```

But another bit of the program contains `a = 5`, and that gets run in the middle, and that assumption from earlier about the state of the word not changing between instructions is wrong. Now nobody knows what is going to happen. So more gets added to the operating system, and now it's possible for a programmer to tell the system not to run some instructions at some time. Where that time is already known by the programmer, but his programming language doesn't let him express it, so he tells the operating system instead, and he has to do that every single time the program runs.

## Control

Back to brains and bodies now. Within a single program, there will almost always be parts that are brain, and parts that are body. Let's call these our control plane, and our process plane.

A processor is made to do things in order, without thinking about it, so how is it possible to have an overview of what is happening in a our program, from inside it? From a low-level perspective, the only option is to occasionally stop what we are doing and think about it for a moment. Perhaps a program could be something like:

```
do_some_work()
consider_what_happens_next()
```

That will work okay. It's a bit annoying that instead of defining control and process planes we instead have to tell the one processor to switch back and forth between them, but that's an artefact of this programming language being very closely bound to the processor underneath it.

But suppose that work might take a very long time to run. Maybe we should be considering what to do before it finishes. Maybe we might even want to cancel it if is taking too long. Well, then we will have to break it into multiple parts:

```
do_work_part_1()
consider_what_happens_next()
do_work_part_2()
consider_what_happens_next()
do_work_part_3()
consider_what_happens_next()
```

Or in other words, we will have to be a compiler. Our programming language doesn't support the idea of control and process planes, so instead we have to do the work ourself.

## Digressions

* Unix had a solution for this, of course. If a program could be pushed solely into the process plane, then the OS is the control plane. It doesn't necessarily work, because if the OS doesn't have the control functionality required for some program, or is not efficient enough, then the program must control itself.

* Object oriented languages have the opposite of a solution for this. If it's practically forbidden to know what will happen when you call a function, then how are you supposed to control it?

* Functional languages have massive advantages in terms of correctness, and in terms of allowing the programmer to concentrate on definition instead of the implementation. Conversely they are limited in terms of control, as they approximately assume that operations take no time to complete. This defines away the control/process dichotomy, but doesn't solve it in the real world.

* JavaScript, with its single thread execution, provides a relatively easy way to decompose a program's control and process planes, and so interleave their execution, but this is at the cost of having the programmer do that work, and of scattering the control plane definition throughout the source.

## Communication

Communicating sequential processes (CSP) describes a way of modelling systems in terms of independent processes, that communicate. It turns out to be possible to model almost anything in this way. In fact it's incredibly natural, since most things that people do involve multiple people getting on with their own jobs, and occasionally talking to other people.

Programming languages modelled on CSP define their own processes, as logical constructs, not as things tied to computer hardware. A programmer can rely on the old principle that the state of the world does not change between instructions, because that state is not a physical thing, and doesn't depend on external factors.

In a program of many small processes, the control and process planes are the sum of the processes deemed to be serving those purposes. Because the processes can communicate they can be arrange into whatever form of hierarchy or network provides control in a way the programmer can understand.

## Future

Operating systems began as simple process multiplexors, and have broadly remained that way. Might it be interesting to try a different model, where it is accepted from the start that a program is under the supervision of the OS, and is not just running one instruction after another?

## Conclusion

Things could be better. That's always the conclusion.