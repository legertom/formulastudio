import React, { useState } from 'react';

const FIELDS_DATA = [
    {
        category: "Identity & Demographics",
        fields: [
            { name: "Names", formula: ["{{name.first}}", "{{name.last}}", "{{name.middle}}"], availability: ["all"] },
            { name: "Preferred Name", formula: ["{{student.preferred_name.first}}", "{{student.preferred_name.last}}"], availability: ["student"] },
            { name: "Email", formula: ["{{email}}", "{{student._meta.sis_email}}"], availability: ["all"] },
            { name: "SIS ID", formula: ["{{student.sis_id}}", "{{teacher.sis_id}}"], availability: ["student", "teacher"] },
            { name: "State ID", formula: ["{{student.state_id}}", "{{teacher.state_id}}"], availability: ["student", "teacher"] },
            { name: "Student Number", formula: ["{{student.student_number}}"], availability: ["student"] },
            { name: "Employee ID", formula: ["{{teacher.teacher_number}}", "{{staff.staff_id}}"], availability: ["teacher", "staff"] },
            { name: "Title", formula: ["{{staff.title}}", "{{teacher.title}}"], availability: ["staff", "teacher"] },
            { name: "Birthday", formula: ["{{student.dob}}"], availability: ["student"] },
            { name: "Gender", formula: ["{{student.gender}}"], availability: ["student"] },
            { name: "Race/Ethnicity", formula: ["{{student.race}}", "{{student.hispanic_ethnicity}}"], availability: ["student"] },
            { name: "Language", formula: ["{{student.home_language}}", "{{student.native_language}}"], availability: ["student"] }
        ]
    },
    {
        category: "School & Academic",
        fields: [
            { name: "School Name", formula: ["{{school_name}}", "{{school.name}}"], availability: ["all"] },
            { name: "Grade Level", formula: ["{{student.grade}}"], availability: ["student"] },
            { name: "Graduation Year", formula: ["{{student.graduation_year}}"], availability: ["student"] },
            { name: "GPA", formula: ["{{student.unweighted_gpa}}", "{{student.weighted_gpa}}"], availability: ["student"] },
            { name: "Program Status", formula: ["{{student.ell_status}}", "{{student.iep_status}}", "{{student.section_504_status}}", "{{student.gifted_status}}"], availability: ["student"] },
            { name: "Lunch Status", formula: ["{{student.frl_status}}"], availability: ["student"] },
            { name: "Department", formula: ["{{staff.department}}"], availability: ["staff"] },
            { name: "Roles", formula: ["{{staff.roles}}"], availability: ["staff"] }
        ]
    },
    {
        category: "Contact & Location",
        fields: [
            { name: "Home Address", formula: ["{{student.location.address}}", "{{student.location.city}}", "{{student.location.state}}", "{{student.location.zip}}"], availability: ["student"] },
            { name: "Principals", formula: ["{{school.principal.name}}", "{{school.principal.email}}"], availability: ["all"] }
        ]
    },
    {
        category: "Credentials",
        fields: [
            { name: "District Username", formula: ["{{student.credentials.district_username}}", "{{teacher.credentials.district_username}}", "{{staff.credentials.district_username}}"], availability: ["all"], note: "Often used for email generation" },
            { name: "District Password", formula: ["{{student.credentials.district_password}}", "{{teacher.credentials.district_password}}", "{{staff.credentials.district_password}}"], availability: ["all"], note: "Sensitive data" }
        ]
    }
];

const DocsFields = () => {
    const [filter, setFilter] = useState('all'); // all, student, teacher, staff

    const filterOptions = [
        { id: 'all', label: 'All Users' },
        { id: 'student', label: 'Students' },
        { id: 'teacher', label: 'Teachers' },
        { id: 'staff', label: 'Staff' }
    ];

    const getFilteredFields = (fields) => {
        if (filter === 'all') return fields;
        return fields.filter(field => {
            if (field.availability.includes('all')) return true;
            return field.availability.includes(filter);
        });
    };

    const renderAvailability = (avail) => {
        if (avail.includes('all')) return <span className="tag-all">All Users</span>;
        return (
            <div className="tag-group">
                {avail.includes('student') && <span className="tag-student">Student</span>}
                {avail.includes('teacher') && <span className="tag-teacher">Teacher</span>}
                {avail.includes('staff') && <span className="tag-staff">Staff</span>}
            </div>
        );
    };

    return (
        <div className="docs-page">
            <header className="docs-page-header">
                <h3>Supported Fields</h3>
                <p>Data available from the SIS, categorized by user type.</p>

                <div className="docs-filter-bar">
                    <span className="filter-label">Show fields for:</span>
                    <div className="filter-buttons">
                        {filterOptions.map(opt => (
                            <button
                                key={opt.id}
                                className={`filter-btn ${filter === opt.id ? 'active' : ''}`}
                                onClick={() => setFilter(opt.id)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {FIELDS_DATA.map((section, idx) => {
                const visibleFields = getFilteredFields(section.fields);

                // Hide section if empty
                if (visibleFields.length === 0) return null;

                return (
                    <section key={idx} className="docs-section">
                        <h4>{section.category}</h4>
                        <table className="docs-table">
                            <thead>
                                <tr>
                                    <th>Field Name</th>
                                    <th>Formula</th>
                                    <th>{section.category === "Credentials" ? "Notes" : "Availability"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleFields.map((field, fIdx) => (
                                    <tr key={fIdx}>
                                        <td>{field.name}</td>
                                        <td>
                                            {field.formula.map((f, i) => (
                                                <React.Fragment key={i}>
                                                    <code>{f}</code>{i < field.formula.length - 1 && <br />}
                                                </React.Fragment>
                                            ))}
                                        </td>
                                        <td>
                                            {field.note ? field.note : renderAvailability(field.availability)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                );
            })}

            {/* Empty State Message */}
            {FIELDS_DATA.every(s => getFilteredFields(s.fields).length === 0) && (
                <div className="docs-empty-state">
                    No fields match the selected filter.
                </div>
            )}
        </div>
    );
};

export default DocsFields;
