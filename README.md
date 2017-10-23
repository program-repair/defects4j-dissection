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
mdAdd | Add method
mdRem | Remove method
mdRen | Rename method
mdParAdd | Add method parameter
mdParRem | Remove method parameter
mdRetTyChange | Change method return type
mdParTyChange | Change method parameter type
mcAdd | Add method call
mcRem | Remove method call
mcRepl | Replace method call
mcParSwap | Swap method call argument
mcParAdd | Add method call argument
mcParRem | Change method call argument
mcParValChange | Change method call argument value
mcMove | Move method call
objInstAdd | Add object instantiation
objInstRem | Remove object instantiation
objInstMod | Modify object instantiation
varAdd | Add variable
varRem | Remove variable
varRepl | Replace variable
exTryCatchAdd | Add Try Catch
exTryCatchRem | Remove Try Catch
exThrowsAdd | Add Throws
exThrowsRem | Remove Throws
condExpRed | Reduce conditional expression
condExpExpand | Expand conditional expression
condExpMod | Modify conditional expression
condBranIfAdd | Add conditional (if) branch
condBranIfElseAdd | Add conditional (if-else) branches
condBranElseAdd | Add conditional (else) branch
condBranRem | Remove conditional (if or else) branch
assignAdd | Add assignment
assignRem | Remove assignment
assignExpChange | Change assignment expression
loopAdd | Add loop
loopRem | Remove loop
loopCondChange | Change loop conditional expression
loopInitVector | Add, remove or modify a vector initialisation in a loop
loopInitChange | Change loop Initialisation fields
tyChange | Change variable type
dsInitValChange | Change initialisation of a data structure (object, vector or variable)
tyModChange | Change type modifier
dsDimChange | Change dimension of a data structure
typObj2Met | Replace direct reference to an object by a method call
tyAdd | Create a new type
typImpInterf | Change impelmented interface in type
retExpChange | Change returned value, modifying expression
retBranchAdd | Add return statement
retRem | Remove return statement
wrapsIf | Wrap with an if
wrapsIfElse | Wrap with an else/if
wrapsElse | Wrap with an else
wrapsTryCatch | Wrap with a try/catch
wrapsMethod | Wrap with a method invocation
wrapsLoop | Wrap with a loop
unwrap | Unwrap
condBlockExcAdd | Add conditional block with Exception Throws statement
condBlockRetAdd | Add conditional block with return statement
condBlockOthersAdd | Add other kind of conditional blocks
condBlockRem | Remove conditional block
missNullCheckP | Add a missing null check
missNullCheckN | Add a missing not null check
expLogicExpand | Expand logic expression
expLogicReduce | Reduce Logic expression
expLogicMod | Modify logic expression
expArithMod | Expand arithmetic expression
initFix | Fix Initialisation
codeMove | Move code
wrongRef | Wrong Reference
singleLine | Single line
notClassified | Not classified
copyPaste | Copy/Paste
rtAcs | Fix with ACS
rtAstor | Fix with jKali
rtDynaMoth | Fix with DynaMoth
rtGenProg | Fix with jGenProg
rtHDRepair | Fix with HDRepair
rtNopol | Fix with Nopol
