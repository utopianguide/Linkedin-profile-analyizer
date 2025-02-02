import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-grow">
                <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Analyzer
                </Link>
                
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
                    
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Introduction</h2>
                        <p className="text-muted-foreground">
                            Welcome to the LinkedIn Profile Analyzer Privacy Policy. We are committed to protecting your privacy
                            and ensuring the security of your personal information. This policy explains how we collect, use,
                            and protect your data when you use our service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
                        <div className="space-y-2">
                            <h3 className="font-medium text-foreground">LinkedIn Profile Data</h3>
                            <p className="text-muted-foreground">
                                We collect the following information from your LinkedIn profile:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                                <li>Name and occupation</li>
                                <li>Profile picture</li>
                                <li>Work experience and education</li>
                                <li>Skills and certifications</li>
                                <li>Network size</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">How We Use Your Information</h2>
                        <p className="text-muted-foreground">
                            We use your information solely for:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                            <li>Analyzing your LinkedIn profile</li>
                            <li>Generating personalized improvement suggestions using AI technology</li>
                            <li>Calculating your profile score</li>
                            <li>Providing actionable recommendations</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Data Security</h2>
                        <p className="text-muted-foreground">
                            We implement appropriate technical and organizational measures to protect your personal data against
                            unauthorized or unlawful processing, accidental loss, destruction, or damage. We do not store your
                            profile data after analysis is complete.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Third-Party Services</h2>
                        <p className="text-muted-foreground">
                            We use secure third-party services to help analyze and process your profile data. All third-party
                            providers are carefully selected and required to maintain high standards of security and privacy.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
                        <p className="text-muted-foreground">
                            If you have any questions about this Privacy Policy, please contact us at:{" "}
                            <a href="mailto:odaajneh@gmail.com" className="text-primary hover:underline">
                                odaajneh@gmail.com
                            </a>
                        </p>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="text-xl font-semibold text-foreground">Updates to This Policy</h2>
                        <p className="text-muted-foreground">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                            the new Privacy Policy on this page.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPage; 