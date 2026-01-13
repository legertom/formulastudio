# Password Strength Logic

This example demonstrates a complex nested logic structure for determining password strength.

{{if and greater length student.credentials.district_password 8 and contains student.credentials.district_password "#" not contains student.credentials.district_password "password" "Strong" "Weak"}}
