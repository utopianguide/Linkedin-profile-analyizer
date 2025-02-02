import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function TermsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-grow">
                <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Analyzer
                </Link>
                
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Terms of Service</h1>
                    
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground">
                            By accessing and using the LinkedIn Profile Analyzer, you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">2. Service Description</h2>
                        <p className="text-muted-foreground">
                            LinkedIn Profile Analyzer is a tool that analyzes LinkedIn profiles to provide insights and
                            improvement suggestions. The service uses advanced technology to process and analyze
                            profile data to help you improve your professional presence.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">3. User Responsibilities</h2>
                        <p className="text-muted-foreground">
                            You agree to:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                            <li>Provide accurate LinkedIn profile URLs</li>
                            <li>Use the service only for its intended purpose</li>
                            <li>Not attempt to reverse engineer or manipulate the service</li>
                            <li>Not use the service for any illegal or unauthorized purpose</li>
                            <li>Respect the privacy and security measures in place</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">4. Disclaimer of Warranties</h2>
                        <p className="text-muted-foreground">
                            The service is provided "as is" without any warranties, express or implied. We do not guarantee
                            the accuracy, completeness, or reliability of any analysis or suggestions provided. The results
                            should be used as general guidance only.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">5. Limitation of Liability</h2>
                        <p className="text-muted-foreground">
                            We shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                            resulting from your use of or inability to use the service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">6. Privacy and Data Protection</h2>
                        <p className="text-muted-foreground">
                            Your use of the service is also governed by our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                            By using this service, you consent to the collection and use of information as detailed in the
                            Privacy Policy.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">7. Changes to Terms</h2>
                        <p className="text-muted-foreground">
                            We reserve the right to modify these terms at any time. We will notify users of any changes by
                            updating the date at the bottom of this page. Continued use of the service after changes
                            constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="text-xl font-semibold text-foreground">8. Contact Information</h2>
                        <p className="text-muted-foreground">
                            For any questions about these Terms of Service, please contact us at:{" "}
                            <a href="mailto:odaajneh@gmail.com" className="text-primary hover:text-primary/80 transition-colors">
                                odaajneh@gmail.com
                            </a>
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

export default TermsPage; 