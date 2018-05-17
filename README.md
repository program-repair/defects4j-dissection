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
    "bugId": 18,
    "changedFiles": {
      "org/jfree/data/DefaultKeyedValues.java": {
        "changes": [ // contains lines that are changed by the patch 
          [
            335
          ]
        ],
        "deletes": [ // contains lines that are deleted by the patch 
          [
            318
          ],
          [
            320
          ]
        ]
      },
      "org/jfree/data/DefaultKeyedValues2D.java": {
        "inserts": [ // contains lines *before* which code is inserted by the patch 
          [
            455, // multiple lines in an inner array represent multiple possible locations to insert the code
            456
          ],
          [
            458
          ],
          [
            459
          ]
        ]
      } // caution: '-1' as a line number represents the insertion of a method or variable declaration that can not be tied to a specific location
    },
    "diff": "--- a/source/org/jfree/data/DefaultKeyedValues.java\n+++ b/source/org/jfree/data/DefaultKeyedValues.java\n@@ -315,30 +315,29 @@ private void rebuildIndex () {\n     public void removeValue(int index) {\n         this.keys.remove(index);\n         this.values.remove(index);\n-        if (index < this.keys.size()) {\n         rebuildIndex();\n-        }\n     }\n \n     /**\n      * Removes a value from the collection.\n      *\n      * @param key  the item key (<code>null</code> not permitted).\n      * \n      * @throws IllegalArgumentException if <code>key</code> is \n      *     <code>null</code>.\n      * @throws UnknownKeyException if <code>key</code> is not recognised.\n      */\n     public void removeValue(Comparable key) {\n         int index = getIndex(key);\n         if (index < 0) {\n-\t\t\treturn;\n+            throw new UnknownKeyException(\"The key (\" + key \n+                    + \") is not recognised.\");\n         }\n         removeValue(index);\n     }\n     \n     /**\n      * Clears all values from the collection.\n      * \n      * @since 1.0.2\n      */\n--- a/source/org/jfree/data/DefaultKeyedValues2D.java\n+++ b/source/org/jfree/data/DefaultKeyedValues2D.java\n@@ -454,12 +454,21 @@ public void removeColumn(int columnIndex) {\n     public void removeColumn(Comparable columnKey) {\r\n+    \tif (columnKey == null) {\r\n+    \t\tthrow new IllegalArgumentException(\"Null 'columnKey' argument.\");\r\n+    \t}\r\n+    \tif (!this.columnKeys.contains(columnKey)) {\r\n+    \t\tthrow new UnknownKeyException(\"Unknown key: \" + columnKey);\r\n+    \t}\r\n         Iterator iterator = this.rows.iterator();\r\n         while (iterator.hasNext()) {\r\n             DefaultKeyedValues rowData = (DefaultKeyedValues) iterator.next();\r\n+            int index = rowData.getIndex(columnKey);\r\n+            if (index >= 0) {\r\n                 rowData.removeValue(columnKey);\r\n+            }\r\n         }\r\n         this.columnKeys.remove(columnKey);\r\n     }\r\n \r\n     /**\r\n      * Clears all the data and associated keys.\r\n      */\r\n",
    "failingTests": [
      {
        "className": " org.jfree.data.category.junit.DefaultCategoryDatasetTests",
        "error": "java.lang.IndexOutOfBoundsException",
        "message": "Index: 0, Size: 0",
        "methodName": "testBug1835955"
      },
      {
        "className": " org.jfree.data.junit.DefaultKeyedValues2DTests",
        "error": "java.lang.IndexOutOfBoundsException",
        "message": "Index: 0, Size: 0",
        "methodName": "testRemoveColumnByKey"
      },
      {
        "className": " org.jfree.data.junit.DefaultKeyedValuesTests",
        "error": "junit.framework.AssertionFailedError",
        "message": "",
        "methodName": "testRemoveValue"
      },
      {
        "className": " org.jfree.data.junit.DefaultKeyedValuesTests",
        "error": "junit.framework.AssertionFailedError",
        "message": "expected:<-1> but was:<0>",
        "methodName": "testGetIndex2"
      }
    ],
    "metrics": {
      "chunks": 6,
      "classes": 2,
      "files": 2,
      "linesAdd": 10,
      "linesMod": 1,
      "linesRem": 2,
      "methods": 3,
      "sizeInLines": 13,
      "spreadAllLines": 19,
      "spreadCodeOnly": 9
    },
    "observations": "Replaces return point by throw exception.",
    "program": "jfreechart",
    "project": "Chart",
    "repairActions": [
      "assignAdd",
      "condBranIfAdd",
      "condBranRem",
      "exThrowsAdd",
      "mcAdd",
      "mcRem",
      "objInstAdd",
      "retRem",
      "varAdd"
    ],
    "repairPatterns": [
      "condBlockExcAdd",
      "missNullCheckP",
      "unwrapIfElse",
      "wrapsIf"
    ],
    "repairTools": [
      "rtDeepRepair",
      "rtGPFL"
    ],
    "revisionId": "621"
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
