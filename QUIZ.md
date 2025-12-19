# IDM Formula Quiz

A collection of formula challenges and their solutions.

## Reference Data
```json
{
  "name": {
    "first": "Jean-O'Luc",
    "last": "Picard"
  },
  "student": {
    "graduation_year": "2030"
  },
  "id": "12345"
}
```

---

## 1. First Name Template
**Goal:** Create a template for the first name.
**Solution:** `{{name.first}}`
**Explanation:** Simply references the `first` field within the `name` object.
**Result:** `Jean-O'Luc`

## 2. Full Name Template
**Goal:** Create a template for first name + last name with a space in between.
**Solution:** `{{concat name.first " "}}{{ name.last}}`
**Explanation:** 
- `{{concat name.first " "}}` concatenates the first name with a space.
- `{{ name.last}}` appends the last name. (Note: The leading space in the solution image `{{ name.last}}` might be a typo in the quiz or just whitespace tolerance).
**Result:** `Jean-O'Luc Picard`

## 3. ID Generation Template
**Goal:** Create a template for first initial + last name + graduation year with no spaces.
**Solution:** `{{substr name.first 0 1}}{{name.last}}{{student.graduation_year}}`
**Explanation:**
- `{{substr name.first 0 1}}`: Takes the substring of `name.first` starting at index 0 with length 1 ("J").
- `{{name.last}}`: Appends the last name ("Picard").
- `{{student.graduation_year}}`: Appends the graduation year ("2030").
**Result:** `JPicard2030`

## 4. Hyphen Replacement
**Goal:** Create a template to replace hyphens with spaces in a first name.
**Solution:** `{{replace name.first "-" " "}}`
**Explanation:** 
- `replace` takes 3 args: source (`name.first`), target (`"-"`), replacement (`" "`).
**Result:** `Jean O'Luc`

## 5. Length Conditional
**Goal:** Create a template that outputs "Long name" if the length of a first name is greater than 5 and "Short name" otherwise.
**Solution:** `{{if greater len name.first 5 "Long name" "Short name"}}`
**Explanation:** 
- `len name.first` returns 10.
- `greater 10 5` returns true.
- `if` returns "Long name".
**Result:** `Long name`

## 6. Secret ID
**Goal:** Create a template that outputs "secret" if a user's id is "secret-id" and "not so secret" otherwise.
**Solution:** `{{if equals id "secret-id" "secret" "not so secret"}}`
**Explanation:**
- Checks if the root `id` field equals "secret-id".
- Returns "secret" if true, "not so secret" if false.
**Result:** `not so secret` (since id is "12345" in reference data).

## 7. Graduation Status
**Goal:** Create a template that outputs "New Student" if a student's graduation year is 2037, "Former Student" if the graduation year is 2025, and "Current Student" otherwise.
**Solution:** `{{if equals student.graduation_year "2037" "New Student" if equals student.graduation_year "2025" "Former Student" "Current Student"}}`
**Explanation:**
- Nested `if` structure in Polish notation.
- 1st `if`: Checks if year is "2037". True -> "New Student". False -> evaluate next `if`.
- 2nd `if`: Checks if year is "2025". True -> "Former Student". False -> "Current Student".
**Result:** `Current Student` (since graduation_year is "2030" in reference data).

## 8. Middle Name Handling
**Goal:** Create a template that outputs the middle name of a user. If the user does not have a middle name, output nothing.
**Solution:** `{{ignoreIfNull name.middle}}`
**Explanation:** 
- `ignoreIfNull` returns the value if it exists, or an empty string if it is null/undefined.
**Result:** `` (Empty string).

## 9. Middle Name with Fallback
**Goal:** Create a template that outputs the middle name of a user. If the user does not have a middle name, output "No Middle Name".
**Solution:** `{{if ignoreIfNull name.middle name.middle "No Middle Name"}}`
**Explanation:** 
- **Important:** Accessing `name.middle` directly would cause a "missing field" error if it doesn't exist.
- `ignoreIfNull` suppresses this error and returns `""` (empty string) instead.
- The `if` function then sees `""` (False) and returns "No Middle Name".
- Note: The second argument `name.middle` is technically lazily evaluated or also needs protection in some parsers, but in this specific Polish notation implementation, relying on `ignoreIfNull` in the condition is key. *Correction based on error:* If the second argument also triggers the error, we might need `{{if ignoreIfNull name.middle ignoreIfNull name.middle "No Middle Name"}}`.
**Revised Solution (Safe):** `{{if ignoreIfNull name.middle ignoreIfNull name.middle "No Middle Name"}}`
**Result:** `No Middle Name`

## 10. Full Name with Optional Middle
**Goal:** Create a template that appends a user's first, middle, and last name together with spaces in between. If the user does not have a middle name, only output the first and last name with a space in between.
**Solution:** `{{concat name.first concat " " concat if ignoreIfNull name.middle concat ignoreIfNull name.middle " " "" name.last}}`
**Explanation:**
- Logic: `First` + `" "` + (`Middle` + `" "` IF exists, ELSE `""`) + `Last`.
- `concat` chain builds the string from left to right (conceptually).
- `if ignoreIfNull name.middle`: Checks if middle name exists.
  - True: Returns `concat ignoreIfNull name.middle " "` (e.g., "James ").
  - False: Returns `""`.
- Finally appends `name.last`.
**Result:** `Jean-O'Luc Picard` (since middle name is missing in reference, it adds empty string).
