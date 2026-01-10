import React from 'react';
import { Link } from 'react-router-dom';
import { CURRICULUM } from '../../lib/curriculum';
import NavBar from '../../components/NavBar';

const TrainingIntro = () => {
    return (
        <div style={{
            minHeight: '100%',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            padding: '2rem',
            overflowY: 'auto'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Training Center
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Welcome to Formula Studio Training. Master the art of formulas through our interactive curriculum.
                    </p>
                </header>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {CURRICULUM.map((chapter, index) => (
                        <Link
                            key={chapter.id}
                            to={`/training/${index + 1}/1`}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                                e.currentTarget.style.borderColor = 'var(--primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                e.currentTarget.style.borderColor = 'var(--glass-border)';
                            }}
                        >
                            <div style={{
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: 'var(--primary)',
                                marginBottom: '0.5rem',
                                fontWeight: '600'
                            }}>
                                Chapter {index + 1}
                            </div>
                            <h2 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                marginBottom: '0.75rem',
                                lineHeight: '1.4'
                            }}>
                                {chapter.title}
                            </h2>
                            <div style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.9rem'
                            }}>
                                {chapter.steps.length} Steps
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainingIntro;
