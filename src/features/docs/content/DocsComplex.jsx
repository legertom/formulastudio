import React from 'react';

const DocsComplex = () => {
    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>Complex Modifications</h3>
                <p>Advanced logic using conditional statements (if/else) to handle data variations. These examples show how to transform raw data into the exact format your applications need.</p>
            </header>

            <section className="docs-section">
                <h4>Graduation Year Normalization</h4>
                <p>
                    <strong>Goal:</strong> Clean up the graduation year field. <br />
                    Sometimes SIS data comes in formats like "Class of 2023". This formula checks the value and keeps only the year.
                </p>

                <div className="code-example-block">
                    <code>{`{{if student.graduation_year student.graduation_year "Unknown"}}`}</code>
                </div>

                <div className="example-scenarios">
                    <h5>Test Scenarios</h5>
                    <table className="docs-table result-table">
                        <thead>
                            <tr>
                                <th>If the Student's Grad Year is...</th>
                                <th>The Result will be...</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>"Class of 2023"</td>
                                <td><span className="result-value">"2023"</span></td>
                            </tr>
                            <tr>
                                <td>"Graduating 2024"</td>
                                <td><span className="result-value">"2024"</span> (extracts number)</td>
                            </tr>
                            <tr>
                                <td>"2025"</td>
                                <td><span className="result-value">"2025"</span></td>
                            </tr>
                            <tr>
                                <td><em>(Empty / No Data)</em></td>
                                <td><span className="result-value">"Unknown"</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Grade Level Standardization</h4>
                <p>
                    <strong>Goal:</strong> Group specific grade levels into broader categories like "Elementary", "Middle", or "High".<br />
                    This is useful for assigning permissions or grouping users in target applications.
                </p>

                <div className="code-example-block">
                    <code>
                        {`{{if equals student.grade "Ungraded" "Ungraded"
if equals student.grade "PreKindergarten" "Elementary"
if equals student.grade "Kindergarten" "Elementary" 
if less student.grade "6" "Elementary" 
if and geq student.grade "6" leq student.grade "8" "Middle"
if greater student.grade "8" "High" "Unknown"}}`}
                    </code>
                </div>

                <p className="note">
                    <strong>Logic Breakdown:</strong><br />
                    1. If grade is "Ungraded", keep it as "Ungraded".<br />
                    2. If Pre-K, K, or less than 6 (1-5), label as "Elementary".<br />
                    3. If between 6 and 8, label as "Middle".<br />
                    4. If greater than 8 (9-12), label as "High".<br />
                    5. Otherwise, set to "Unknown".
                </p>

                <div className="example-scenarios">
                    <h5>Test Scenarios</h5>
                    <table className="docs-table result-table">
                        <thead>
                            <tr>
                                <th>If Student Grade is...</th>
                                <th>Result Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>"Kindergarten"</td> <td><span className="result-value">"Elementary"</span></td></tr>
                            <tr><td>"2"</td> <td><span className="result-value">"Elementary"</span></td></tr>
                            <tr><td>"6"</td> <td><span className="result-value">"Middle"</span></td></tr>
                            <tr><td>"8"</td> <td><span className="result-value">"Middle"</span></td></tr>
                            <tr><td>"9"</td> <td><span className="result-value">"High"</span></td></tr>
                            <tr><td>"12"</td> <td><span className="result-value">"High"</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>Short Grade Labels</h4>
                <p>
                    <strong>Goal:</strong> Compress grade names into short codes (e.g., "Kindergarten" &rarr; "K").<br />
                    Ideal for generating usernames or short display tags.
                </p>
                <div className="code-example-block">
                    <code>
                        {`{{if equals student.grade "PreKindergarten" "PK" 
if equals student.grade "Kindergarten" "K" 
if equals student.grade "1" "1st" 
if equals student.grade "2" "2nd" 
if equals student.grade "3" "3rd" 
if in student.grade "4 5 6 7 8 9 10 11 12" concat student.grade "th" ""}}`}
                    </code>
                </div>

                <div className="example-scenarios">
                    <h5>Test Scenarios</h5>
                    <table className="docs-table result-table">
                        <thead>
                            <tr>
                                <th>Input Grade</th>
                                <th>Output Label</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>"PreKindergarten"</td> <td><span className="result-value">"PK"</span></td></tr>
                            <tr><td>"Kindergarten"</td> <td><span className="result-value">"K"</span></td></tr>
                            <tr><td>"1"</td> <td><span className="result-value">"1st"</span></td></tr>
                            <tr><td>"2"</td> <td><span className="result-value">"2nd"</span></td></tr>
                            <tr><td>"3"</td> <td><span className="result-value">"3rd"</span></td></tr>
                            <tr><td>"4"</td> <td><span className="result-value">"4th"</span> (Using 'th' logic)</td></tr>
                            <tr><td>"12"</td> <td><span className="result-value">"12th"</span> (Using 'th' logic)</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <hr className="docs-divider" />

            <section className="docs-section">
                <h4>School Name Cleaning</h4>
                <p>
                    <strong>Goal:</strong> Remove "School" from the end of school names for cleaner display.
                </p>
                <div className="code-example-block">
                    <code>{`{{textBefore school.name "School"}}`}</code>
                </div>
                <div className="example-scenarios">
                    <h5>Test Scenarios</h5>
                    <table className="docs-table result-table">
                        <thead>
                            <tr>
                                <th>School Name (Input)</th>
                                <th>Cleaned Name (Output)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>"Pineapple Elementary School"</td><td><span className="result-value">"Pineapple Elementary"</span></td></tr>
                            <tr><td>"Cherry High School"</td><td><span className="result-value">"Cherry High"</span></td></tr>
                            <tr><td>"School of Arts"</td><td><span className="result-value">"School of Arts"</span> (No Match at end)</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default DocsComplex;
