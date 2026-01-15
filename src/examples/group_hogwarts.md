# Group Example - Hogwarts Elementary

```
{{forEach "item" sections if equals school_name "Hogwarts Elementary" concat "Grp - HW Grade " if in item.grade "1 2 3 4 5 6 7 8" concat concat "0" item.grade " Teachers - AG" if equals item.grade "Kindergarten" "00 Teachers - AG" if equals item.grade "PreKindergarten" "00 Teachers - AG" if equals item.grade "TransitionalKindergarten" "00 Teachers - AG" "" ""}}
```
