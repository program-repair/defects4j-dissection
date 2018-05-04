# Defects4J Dissection

Defects4J Dissection presents data to help researchers and practitioners to better understand the Defects4J bug dataset. 
It is the open-science appendix of ["Dissection of a Bug Dataset: Anatomy of 395 Patches from Defects4J"](https://github.com/program-repair/defects4j-dissection/blob/master/2018.03.20%20-%20Defects4J%20Dissection%20-%20Oficial%20Pre-Print.pdf).

```bibtex
@inproceedings{defects4J-dissection,
    title = {{Dissection of a Bug Dataset: Anatomy of 395 Patches from Defects4J}},
    author = {Sobreira, Victor and Durieux, Thomas and Madeiral, Fernanda and Monperrus, Martin and Maia, Marcelo A.}
    booktitle = {Proceedings of SANER},
    year = {2018}
}
```

Main files:

* The file `defects4j-bugs.json` contains all the extracted information.
* The file [defects4j-patch.md](https://github.com/program-repair/defects4j-dissection/blob/master/defects4j-patch.md) gives link to the buggy and patched version as well as the diff.
* The website http://program-repair.github.io/defects4j-dissection/ is a user interface that presents the information contained in `defects4j-bugs.json` in a user-friendly manner.

## defects4j-bugs.json format

```js
[
 {
  "bugId": 27, 
  "diff": "--- a/src/main/java/org/joda/time/format/PeriodFormatterBuilder.java\n+++ b/src/main/java/org/joda/time/format/PeriodFormatterBuilder.java\n@@ -798,9 +798,11 @@ private static PeriodFormatter toFormatter(List<Object> elementPairs, boolean no\n         int size = elementPairs.size();\n         if (size >= 2 && elementPairs.get(0) instanceof Separator) {\n             Separator sep = (Separator) elementPairs.get(0);\n+            if (sep.iAfterParser == null && sep.iAfterPrinter == null) {\n                 PeriodFormatter f = toFormatter(elementPairs.subList(2, size), notPrinter, notParser);\n                 sep = sep.finish(f.getPrinter(), f.getParser());\n                 return new PeriodFormatter(sep, sep);\n+            }\n         }\n         Object[] comp = createComposite(elementPairs);\n         if (notPrinter) {\n", 
  "failingTests": [
   {
    "className": " org.joda.time.format.TestPeriodFormatterBuilder", 
    "error": "java.lang.IllegalArgumentException", 
    "message": "Invalid format: \"PT1003199059S\" is malformed at \"1003199059S\"", 
    "methodName": "testBug2495455"
   }
  ], 
  "metrics": {
   "chunks": 2, 
   "classes": 1, 
   "files": 1, 
   "linesAdd": 2, 
   "linesMod": 0, 
   "linesRem": 0, 
   "methods": 1, 
   "sizeInLines": 2, 
   "spreadAllLines": 3, 
   "spreadCodeOnly": 3
  }, 
  "observations": "", 
  "program": "joda-time", 
  "project": "Time", 
  "repairActions": [
   "condBranIfAdd"
  ], 
  "repairPatterns": [
   "missNullCheckP", 
   "wrapsIf"
  ], 
  "repairTools": [], 
  "revisionId": "e0559c503f65641b9546c37e7c84c866caf37e66"
 }
]
```

## defects4j-bugs.json acronyms

 |Acronym | Description  |
|--------------|--------------|
mdAdd | Method definition addition
mdRem | Method definition removal
mdRen | Method definition renaming
mdParAdd | Parameter addition in method definition
mdParRem | Parameter removal from method definition
mdRetTyChange | Method return type modification
mdParTyChange | Parameter type modification in method definition
mdModChange | Method modifier change
mdOverride | Method overriding addition or removal
mcAdd | Method call addition
mcRem | Method call removal
mcRepl | Method call replacement
mcParSwap | Method call parameter value swapping
mcParAdd | Method call parameter addition
mcParRem | Method call parameter removal
mcParValChange | Method call parameter value modification
mcMove | Method call moving
objInstAdd | Object instantiation addition
objInstRem | Object instantiation removal
objInstMod | Object instantiation modification
varAdd | Variable addition
varRem | Variable removal
varReplVar | Variable replacement by another variable
exTryCatchAdd | try-catch addition
exTryCatchRem | try-catch removal
exThrowsAdd | throw addition
exThrowsRem | throw removal
condExpRed | Conditional expression reduction
condExpExpand | Conditional expression expansion
condExpMod | Conditional expression modification
condBranIfAdd | Conditional (if) branch addition
condBranIfElseAdd | Conditional (if-else) branches addition
condBranElseAdd | Conditional (else) branch addition
condBranCaseAdd | Conditional (case in switch) branch addition
condBranRem | Conditional (if or else) branch removal
assignAdd | Assignment addition
assignRem | Assignment removal
assignExpChange | Assignment expression modification
loopAdd | Loop addition
loopRem | Loop removal
loopCondChange | Loop conditional expression modification
loopInitChange | Loop initialization field modification
varTyChange | Variable type change
varModChange | Variable modifier change
varReplMc | Variable replacement by method call
tyAdd | Type addition
tyImpInterf | Type implemented interface modification
retExpChange | Return expression modification
retBranchAdd | Return statement addition
retRem | Return statement removal
wrapsIf | Wraps-with if statement
wrapsIfElse | Wraps-with if-else statement
wrapsElse | Wraps-with else statement
wrapsTryCatch | Wraps-with try-catch block
wrapsMethod | Wraps-with method call
wrapsLoop | Wraps-with loop
unwrapIfElse | Unwraps-from if-else statement
unwrapMethod | Unwraps-from method call
unwrapTryCatch | Unwraps-from try-catch block
condBlockExcAdd | Conditional block addition with exception throwing
condBlockRetAdd | Conditional block addition with return statement
condBlockOthersAdd | Conditional block addition
condBlockRem | Conditional block removal
missNullCheckP | Missing null check addition
missNullCheckN | Missing non-null check addition
expLogicExpand | Logic expression expansion
expLogicReduce | Logic expression reduction
expLogicMod | Logic expression modification
expArithMod | Arithmetic expression modification
codeMove | Code Moving
wrongVarRef | Wrong Variable Reference
wrongMethodRef | Wrong Method Reference
singleLine | Single Line
notClassified | Not classified
copyPaste | Copy/Paste
constChange | Constant Change
rtAcs | Patched by ACS
rtCardumen | Patched by Cardumen
rtDeepRepair | Patched by DeepRepair
rtDynaMoth | Patched by DynaMoth
rtElixir | Patched by Elixir
rtGPFL | Patched by GPFL
rtHDRepair | Patched by HDRepair
rtGenProg | Patched by jGenProg
rtKali | Patched by jKali
rtNopol | Patched by Nopol
rtssFix | Patched by ssFix

## Automatic repair information sources:

* ACS: [Precise Condition Synthesis for Program Repair](https://dl.acm.org/citation.cfm?id=3097418)
* jKali: [Automatic Repair of Real Bugs in Java: A Large-Scale Experiment on the Defects4J Dataset](https://hal.archives-ouvertes.fr/hal-01387556/document)
* jGenProg: [Automatic Repair of Real Bugs in Java: A Large-Scale Experiment on the Defects4J Dataset](https://hal.archives-ouvertes.fr/hal-01387556/document)
* Nopol: [The Patches of the Nopol Automatic Repair System on the Bugs of Defects4J version 1.1.0](https://hal.archives-ouvertes.fr/hal-01480084)
