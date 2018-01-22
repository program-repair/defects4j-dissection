# Defects4J Dissection

Defects4J Dissection presents data to help researchers and practitioners to better understand the Defects4J bug dataset. 
It is the open-science appendix of "Dissection of a bug dataset: anatomy of 395 patches from Defects4J" (https://arxiv.org/abs/1801.06393).

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
		"project":"Chart",
		"bugId":8,
		"activeSynStruct":1,
		"activePat":2,
		"repairTools":1,
		"files":1,
		"linesAdd":0,
		"linesRem":0,
		"linesMod":1,
		"sizeInLines":1,
		"chunks":1,
		"spreadAllLines":0,
		"spreadCodeOnly":0,
		"mcParValChange":true,
		... 
		// more repair operations ("name": true)
		"Observations":"Changes params passed to constructor.",
		"program":"jfreechart",
		"revisionId":"1085",
		"failingTests":[
			{
				"className":" org.jfree.data.time.junit.WeekTests",
				"methodName":"testConstructor",
				"error":"junit.framework.AssertionFailedError",
				"message":"expected:<35> but was:<	34>"
			}
		]
		"diff":"git diff of the source"
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
rtAcs | Fixed by ACS
rtCardumen | Fixed by Cardumen
rtDeepRepair | Fixed by DeepRepair
rtDynaMoth | Fixed by DynaMoth
rtElixir | Fixed by Elixir
rtGPFL | Fixed by GPFL
rtHDRepair | Fixed by HDRepair
rtGenProg | Fixed by jGenProg
rtKali | Fixed by jKali
rtNopol | Fixed by Nopol
rtssFix | Fixed by ssFix

## Automatic repair information sources:

* ACS: [Precise Condition Synthesis for Program Repair](https://dl.acm.org/citation.cfm?id=3097418)
* jKali: [Automatic Repair of Real Bugs in Java: A Large-Scale Experiment on the Defects4J Dataset](https://hal.archives-ouvertes.fr/hal-01387556/document)
* jGenProg: [Automatic Repair of Real Bugs in Java: A Large-Scale Experiment on the Defects4J Dataset](https://hal.archives-ouvertes.fr/hal-01387556/document)
* Nopol: [The Patches of the Nopol Automatic Repair System on the Bugs of Defects4J version 1.1.0](https://hal.archives-ouvertes.fr/hal-01480084)
