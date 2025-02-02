// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Moon, Sun, Download, CheckCircle2, AlertCircle, ChevronDown, Loader2 } from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';
import PrivacyPage from './PrivacyPage';
import TermsPage from './TermsPage';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function App() {
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [expandedArea, setExpandedArea] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setProfileData(null);

        try {
            const response = await axios.post('http://localhost:5000/api/analyze', { linkedinUrl });
            setProfileData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = () => {
        if (!profileData) return;
        
        // Create new PDF document with larger page size
        const doc = new jsPDF({
            format: 'a4',
            unit: 'mm',
            orientation: 'portrait'
        });
        
        // Set initial position
        let yPos = 20;
        const margin = 20;
        const pageWidth = doc.internal.pageSize.width;
        
        // Helper function for text wrapping
        const addWrappedText = (text, y, fontSize = 12, maxWidth = 170) => {
            doc.setFontSize(fontSize);
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, margin, y);
            return y + (lines.length * fontSize * 0.3527) + 5; // Convert pt to mm and add spacing
        };
        
        // Add title
        yPos = addWrappedText('LinkedIn Profile Analysis Report', yPos, 20);
        
        // Add profile info
        yPos += 5;
        doc.setFontSize(14);
        yPos = addWrappedText(`Name: ${profileData.full_name}`, yPos, 14);
        yPos = addWrappedText(`Occupation: ${profileData.occupation}`, yPos, 14);
        yPos = addWrappedText(`Network Size: ${profileData.network_size}`, yPos, 14);
        
        // Add Profile Score
        yPos += 5;
        yPos = addWrappedText('Profile Score', yPos, 16);
        yPos = addWrappedText(`Score: ${profileData.score}/100`, yPos, 14);
        yPos = addWrappedText(getScoreDescription(profileData.score), yPos, 12);
        
        // Add Highlights
        yPos += 5;
        yPos = addWrappedText('Profile Highlights', yPos, 16);
        profileData.highlights.forEach(highlight => {
            yPos = addWrappedText(`• ${highlight}`, yPos, 12);
        });
        
        // Add Improvements
        yPos += 5;
        yPos = addWrappedText('Areas to Improve', yPos, 16);
        profileData.improvements.forEach(item => {
            // Check if we need a new page
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            yPos = addWrappedText(`• ${item.title}`, yPos, 14);
            yPos = addWrappedText(item.details, yPos + 2, 12);
            yPos += 5;
        });
        
        // Add Priority Actions
        if (yPos > 230) {
            doc.addPage();
            yPos = 20;
        }
        yPos += 5;
        yPos = addWrappedText('Priority Actions', yPos, 16);
        profileData.priority_actions.forEach(action => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            yPos = addWrappedText(`• ${action.title}`, yPos, 14);
            yPos = addWrappedText(action.action, yPos + 2, 12);
            yPos += 5;
        });
        
        // Save the PDF
        doc.save('linkedin-profile-analysis.pdf');
    };

    const getScoreColor = (score) => {
        if (score >= 70) return '#0A8D48';
        if (score >= 50) return '#F5B800';
        return '#E51400';
    };

    const getScoreMessage = (score) => {
        if (score >= 70) return 'Excellent Profile!';
        if (score >= 50) return 'Good Progress!';
        return 'Getting Started';
    };

    const getScoreDescription = (score) => {
        if (score >= 70) {
            return "Your profile is well-developed and engaging. Keep up the great work!";
        }
        if (score >= 50) {
            return "You're on the right track! A few enhancements could make your profile even better.";
        }
        return "Your profile has potential! Let's work on making it shine.";
    };

    return (
        <div className="min-h-screen bg-background transition-colors duration-300">
            <Routes>
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/" element={
                    <div className="h-full w-full">
                        {/* Header */}
                        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-6 shadow-sm transition-colors duration-300">
                            <div className="flex items-center gap-3">
                                <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                                </svg>
                                <span className="text-lg font-semibold text-foreground">Profile Analyzer</span>
                            </div>
                            <button
                                onClick={toggleDarkMode}
                                className="rounded-full p-2 hover:bg-muted transition-colors duration-150"
                                aria-label="Toggle dark mode"
                            >
                                {darkMode ? (
                                    <Sun className="h-5 w-5 text-foreground" />
                                ) : (
                                    <Moon className="h-5 w-5 text-foreground" />
                                )}
                            </button>
                        </header>

                        <main className="container mx-auto px-4 py-6">
                            {!profileData ? (
                                <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
                                    <div className="w-full max-w-md space-y-6">
                                        <div className="text-center space-y-2">
                                            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
                                                LinkedIn Profile Analyzer
                                            </h1>
                                            <p className="text-base text-muted-foreground">
                                                Get detailed insights and improvement suggestions for your LinkedIn profile
                                            </p>
                                        </div>
                                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div className="space-y-2">
                                                    <label htmlFor="linkedin-url" className="text-sm font-medium text-foreground">
                                                        Profile URL
                                                    </label>
                                                    <div className={`rounded-lg border bg-background p-2 transition-all duration-150 ${
                                                        loading ? 'opacity-50' : ''
                                                    } focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 dark:focus-within:ring-offset-background`}>
                                                        <input
                                                            id="linkedin-url"
                                                            type="url"
                                                            value={linkedinUrl}
                                                            onChange={(e) => setLinkedinUrl(e.target.value)}
                                                            placeholder="https://linkedin.com/in/username"
                                                            className="w-full bg-transparent px-2 py-1.5 text-base outline-none text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed"
                                                            required
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="relative w-full rounded-lg bg-primary px-4 py-2.5 text-base font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/50 transition-all duration-150"
                                                >
                                                    {loading ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                            <span>Analyzing Profile...</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span>Analyze Profile</span>
                                                        </div>
                                                    )}
                                                </button>
                                            </form>
                                        </div>
                                        {loading && (
                                            <div className="rounded-lg bg-card border p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="space-y-2 w-full">
                                                        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                                                            <div className="h-full w-1/2 animate-progress rounded-full bg-primary"></div>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            Please wait while we analyze your profile. This usually takes about 30 seconds.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {error && (
                                            <div className="animate-shake rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <span>{error}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-12 gap-6">
                                    {/* Left Column */}
                                    <div className="col-span-12 lg:col-span-3">
                                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="relative">
                                                    <img
                                                        src={profileData.profile_pic || '/default-avatar.png'}
                                                        alt="Profile"
                                                        className="h-24 w-24 rounded-full border-4 border-background shadow-sm"
                                                    />
                                                    <div className="absolute -right-1 bottom-0 rounded-full bg-primary p-1.5 shadow-sm">
                                                        <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                                                    </div>
                                                </div>
                                                <h2 className="mt-4 text-xl font-semibold text-foreground">{profileData.full_name}</h2>
                                                <p className="text-muted-foreground">{profileData.occupation}</p>

                                                <div className="mt-6 w-full">
                                                    <div className="rounded-lg border bg-card p-4">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Network Size</span>
                                                            <span className="font-medium text-foreground">{profileData.network_size}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={downloadReport}
                                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-primary-foreground hover:bg-primary/90 transition-colors duration-150"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Download Report
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Column */}
                                    <div className="col-span-12 space-y-6 lg:col-span-6">
                                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                                            <h3 className="text-xl font-semibold text-foreground">Profile Highlights</h3>
                                            <div className="mt-4 space-y-3">
                                                {profileData.highlights.map((highlight, i) => (
                                                    <div key={i} className="flex items-start gap-3 rounded-lg bg-success/10 p-4 text-success">
                                                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                                                        <span className="text-sm">{highlight}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                                            <h3 className="text-xl font-semibold text-foreground">Areas to Improve</h3>
                                            <div className="mt-4 space-y-3">
                                                {profileData.improvements.map((item, i) => (
                                                    <div key={i} className="overflow-hidden rounded-lg border">
                                                        <button
                                                            onClick={() => setExpandedArea(expandedArea === i ? null : i)}
                                                            className="flex w-full items-center justify-between bg-card p-4 text-left hover:bg-muted/20 transition-colors duration-150"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                                                                <span className="font-medium text-foreground">{item.title}</span>
                                                            </div>
                                                            <ChevronDown
                                                                className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                                                                    expandedArea === i ? 'rotate-180' : ''
                                                                }`}
                                                            />
                                                        </button>
                                                        {expandedArea === i && (
                                                            <div className="bg-card border-t p-4">
                                                                <p className="text-foreground/80">{item.details}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="col-span-12 space-y-6 lg:col-span-3">
                                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                                            <div className="text-center">
                                                <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">Profile Score</h3>
                                                <div className="relative mx-auto mt-6 h-36 w-36">
                                                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                                                        <path
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="3"
                                                            className="text-muted"
                                                        />
                                                        <path
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            fill="none"
                                                            stroke={getScoreColor(profileData.score)}
                                                            strokeWidth="3"
                                                            strokeDasharray={`${profileData.score}, 100`}
                                                            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="space-y-0.5 text-center px-2">
                                                            <div className="font-heading text-3xl font-bold tracking-tight text-foreground">
                                                                {profileData.score}
                                                            </div>
                                                            <div className="text-xs font-medium" style={{ color: getScoreColor(profileData.score) }}>
                                                                {getScoreMessage(profileData.score)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="mt-4 text-sm text-muted-foreground">
                                                    {getScoreDescription(profileData.score)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                                            <h3 className="text-xl font-semibold text-foreground">Priority Actions</h3>
                                            <div className="mt-4 space-y-3">
                                                {profileData.priority_actions.map((action, i) => (
                                                    <div
                                                        key={i}
                                                        className="rounded-lg bg-primary/10 p-4 text-sm hover:bg-primary/15 transition-colors duration-150"
                                                    >
                                                        <div className="font-medium text-primary">{action.title}</div>
                                                        <p className="mt-1 text-primary/80">{action.action}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </main>

                        {/* Footer */}
                        <footer className="mt-auto border-t bg-card transition-colors duration-300">
                            <div className="container mx-auto py-8 px-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Left Column */}
                                    <div className="flex flex-col items-center md:items-start space-y-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                                            </svg>
                                            <span className="text-lg font-semibold text-foreground">Profile Analyzer</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground text-center md:text-left">
                                            Enhance your LinkedIn presence with AI-powered insights and recommendations.
                                        </p>
                                    </div>

                                    {/* Middle Column */}
                                    <div className="flex flex-col items-center space-y-4">
                                        <h3 className="font-semibold text-foreground">Legal</h3>
                                        <div className="flex flex-col items-center space-y-2">
                                            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                                Privacy Policy
                                            </Link>
                                            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                                Terms of Service
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="flex flex-col items-center md:items-end space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">
                                                Built with{" "}
                                                <span className="text-red-500" aria-label="love">
                                                    ❤️
                                                </span>
                                                {" "}by
                                            </span>
                                            <a 
                                                href="https://www.linkedin.com/company/blue-printai/" 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-primary hover:text-primary/80 font-medium transition-colors"
                                            >
                                                BluePrint AI
                                            </a>
                                        </div>
                                        <button 
                                            onClick={() => window.location.reload()} 
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            Refresh Analysis
                                        </button>
                                        <div className="text-xs text-muted-foreground">
                                            © {new Date().getFullYear()} LinkedIn Profile Analyzer
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                } />
            </Routes>
        </div>
    );
}

export default App;
