# Group Example - Foxfire School

```
{{forEach "item" sections if equals school_name "Foxfire School" concat "Grp - FX Grade " if in item.grade "1 2 3 4 5 6 7 8" concat concat "0" item.grade " Teachers - AG" if equals item.grade "Kindergarten" "00 Teachers - AG" if equals item.grade "PreKindergarten" "00 Teachers - AG" if equals item.grade "TransitionalKindergarten" "00 Teachers - AG" "" ""}}
```
