# Defects4J Dissection

Defects4J Dissection presents data to help researchers and practitioners to better understand the Defects4J bug dataset. 
It is the open-science appendix of "Dissection of a bug dataset: anatomy of 395 patches from Defects4J".

```bibtex
@inproceedings{defects4J-dissection,
    title = {{Dissection of a bug dataset: anatomy of 395 patches from Defects4J}},
    author = {Sobreira, Victor and Durieux, Thomas and Madeiral, Fernanda and Monperrus, Martin and Maia, Marcelo A.}
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
mdParAdd | Method parameter addition
mdParRem | Method parameter removal
mdRetTyChange | Method return type modification
mdParTyChange | Method parameter type modification
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
varRepl | Variable replacement by another variable
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
loopInitVector | Add, remove or modify a vector initialization in a loop
loopInitChange | Change loop initialization fields
tyChange | Variable type change
tyModChange | Variable modifier change
tyObj2Met | Variable replacement by method call
tyAdd | Type addition
typImpInterf | Type implemented interface modification
retExpChange | Return expression modification
retBranchAdd | Return statement addition
retRem | Return statement removal
wrapsIf | Wrap with if statement
wrapsIfElse | Wrap with if-else statement
wrapsElse | Wrap with else statement
wrapsTryCatch | Wrap with try-catch block
wrapsMethod | Wrap with method call
wrapsLoop | Wrap with loop
unwrap | Unwrap
condBlockExcAdd | Conditional block addition with exception throwing
condBlockRetAdd | Conditional block addition with return statement
condBlockOthersAdd | Simple conditional block addition
condBlockRem | Conditional block removal
missNullCheckP | Missing null check addition
missNullCheckN | Missing non-null check addition
expLogicExpand | Logic expression expansion
expLogicReduce | Logic expression reduction
expLogicMod | Logic expression modification
expArithMod | Arithmetic expression modification
initFix | Initialization Fix
codeMove | Code Moving
wrongRef | Wrong Reference
singleLine | Single Line
notClassified | Not classified
copyPaste | Copy/Paste
rtAcs | Fixed by ACS
rtKali | Fixed by jKali
rtDynaMoth | Fixed by DynaMoth
rtGenProg | Fixed by jGenProg
rtHDRepair | Fixed by HDRepair
rtNopol | Fixed by Nopol
