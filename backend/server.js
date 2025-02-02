const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to calculate profile score
function calculateProfileScore(profileData) {
    let score = 0;
    const weights = {
        experience_quality: 30,
        skills_relevance: 25,
        education_strength: 15,
        certifications: 15,
        profile_completeness: 15
    };

    // Experience Quality (30 points)
    if (profileData.experiences) {
        const hasQualityExperience = profileData.experiences.some(exp => 
            exp.description && 
            exp.description.length > 100 &&
            (exp.description.toLowerCase().includes('ai') || 
             exp.description.toLowerCase().includes('machine learning'))
        );
        score += hasQualityExperience ? weights.experience_quality : weights.experience_quality * 0.5;
    }

    // Skills Relevance (25 points)
    if (profileData.skills) {
        const relevantSkills = ['artificial intelligence', 'machine learning', 'python', 'deep learning', 'data science'];
        const hasRelevantSkills = profileData.skills.some(skill => 
            relevantSkills.some(relevantSkill => 
                skill.toLowerCase().includes(relevantSkill)
            )
        );
        score += hasRelevantSkills ? weights.skills_relevance : weights.skills_relevance * 0.3;
    }

    // Education Strength (15 points)
    if (profileData.education && profileData.education.length > 0) {
        const hasRelevantEducation = profileData.education.some(edu => 
            edu.field_of_study && 
            (edu.field_of_study.toLowerCase().includes('computer') || 
             edu.field_of_study.toLowerCase().includes('engineering') ||
             edu.field_of_study.toLowerCase().includes('mathematics'))
        );
        score += hasRelevantEducation ? weights.education_strength : weights.education_strength * 0.5;
    }

    // Certifications (15 points)
    if (profileData.certifications && profileData.certifications.length > 0) {
        const hasAICerts = profileData.certifications.some(cert => 
            cert.name.toLowerCase().includes('ai') || 
            cert.name.toLowerCase().includes('machine learning')
        );
        score += hasAICerts ? weights.certifications : weights.certifications * 0.5;
    }

    // Profile Completeness (15 points)
    let completenessScore = 0;
    if (profileData.summary) completenessScore += 3;
    if (profileData.experiences?.length > 0) completenessScore += 3;
    if (profileData.education?.length > 0) completenessScore += 3;
    if (profileData.skills?.length > 0) completenessScore += 3;
    if (profileData.profile_pic_url) completenessScore += 3;
    score += (completenessScore / 15) * weights.profile_completeness;

    return Math.round(score);
}

// Helper function to get profile highlights
function getProfileHighlights(profileData) {
    const highlights = [];
    
    // Analyze experience and role impact
    if (profileData.experiences && profileData.experiences.length > 0) {
        const mostRecentRole = profileData.experiences[0];
        if (mostRecentRole.title && mostRecentRole.company) {
            const roleHighlight = `Leading ${mostRecentRole.company} as ${mostRecentRole.title}, focusing on AI development and automation solutions`;
            highlights.push(roleHighlight);
        }
    }

    // Analyze certifications and skills for expertise
    if (profileData.certifications && profileData.certifications.length > 0) {
        const techStack = profileData.certifications
            .filter(cert => cert.name.toLowerCase().includes('ai') || 
                          cert.name.toLowerCase().includes('machine learning') ||
                          cert.name.toLowerCase().includes('data'))
            .map(cert => cert.name)
            .slice(0, 2);
        
        if (techStack.length > 0) {
            const expertiseHighlight = `Certified expertise in ${techStack.join(' and ')}, demonstrating commitment to AI advancement`;
            highlights.push(expertiseHighlight);
        }
    }

    // Analyze projects and achievements
    if (profileData.accomplishment_projects || profileData.summary) {
        const projectsText = profileData.accomplishment_projects?.length > 0 
            ? profileData.accomplishment_projects[0].description
            : profileData.summary;

        if (projectsText) {
            const achievementHighlight = `Demonstrated success in developing AI solutions, including automated systems and machine learning models`;
            highlights.push(achievementHighlight);
        }
    }

    // Ensure we have exactly 3 highlights
    while (highlights.length < 3) {
        const fallbackHighlights = [
            "Innovative approach to AI development with focus on practical business applications",
            "Strong foundation in both technical implementation and strategic planning",
            "Proven track record of delivering impactful technology solutions"
        ];
        highlights.push(fallbackHighlights[highlights.length]);
    }

    return highlights.slice(0, 3);
}

// Helper function to get areas to improve
async function analyzeProfile(profileData) {
    const score = calculateProfileScore(profileData);
    const highlights = getProfileHighlights(profileData);
    const improvements = await getGeminiImprovementSuggestions(profileData);
    const priority_actions = getPriorityActions(profileData, score);

    return {
        ...profileData,
        profile_pic: profileData.profile_pic_url,
        full_name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
        occupation: profileData.occupation || profileData.headline || '',
        network_size: profileData.connections || '0',
        score,
        highlights,
        improvements,
        priority_actions
    };
}

// Helper function to get priority actions
function getPriorityActions(profileData, score) {
    const actions = [];
    
    if (score < 70) {
        actions.push({
            title: "Enhance Technical Depth",
            action: "Add detailed technical specifications and outcomes for your AI projects. Include frameworks used, architecture decisions, and performance metrics."
        });
    }

    if (!profileData.summary || profileData.summary.length < 200) {
        actions.push({
            title: "Craft Compelling Summary",
            action: "Write a technical summary that showcases your AI expertise, vision for technology, and unique approach to solving complex problems."
        });
    }

    if (!profileData.experiences?.some(exp => exp.description?.length > 200)) {
        actions.push({
            title: "Detail Project Impact",
            action: "For each role, describe 2-3 major projects with quantifiable results. Example: 'Developed NLP model achieving 95% accuracy, processing 1M+ customer queries monthly'."
        });
    }

    if (!profileData.certifications?.length > 2) {
        actions.push({
            title: "Add Technical Credentials",
            action: "Pursue advanced AI certifications from recognized providers like Google, AWS, or specialized deep learning courses."
        });
    }

    return actions.slice(0, 3);
}

async function getGeminiImprovementSuggestions(profileData) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `
        You are a professional LinkedIn profile analyzer. Analyze this LinkedIn profile data and provide 3-4 personalized suggestions for improvement.
        Be encouraging, specific, and focus on the individual's potential based on their current profile.

        Profile Data:
        ${JSON.stringify(profileData)}

        Guidelines:
        1. Each suggestion should be unique and tailored to the profile
        2. Focus on positive growth opportunities
        3. Be specific but encouraging
        4. Consider the person's industry and experience level
        5. Provide actionable steps in the details
        6. Keep the tone professional but friendly

        Format your response as a JSON array with exactly this structure:
        [
            {
                "title": "A brief, encouraging title for the improvement area",
                "details": "2-3 sentences explaining the suggestion and how to implement it. Be specific and actionable."
            }
        ]

        Example format (but make yours unique to this profile):
        [
            {
                "title": "Showcase Your Project Impact",
                "details": "Your experience shows great potential. Consider adding specific metrics and outcomes for your key projects, such as 'Increased team productivity by 40%' or 'Led successful migration of 100k users'."
            }
        ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        try {
            const suggestions = JSON.parse(text);
            // Ensure we have at least 3 suggestions
            return suggestions.slice(0, 4);
        } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            // Fallback suggestions if parsing fails
            return [
                {
                    title: "Enhance Your Professional Summary",
                    details: "Consider expanding your profile summary to highlight your key achievements and career aspirations. A well-crafted summary helps you stand out to recruiters."
                },
                {
                    title: "Add More Project Details",
                    details: "Your experience section could benefit from more specific project examples and outcomes. Share your achievements with metrics when possible."
                },
                {
                    title: "Expand Your Network",
                    details: "Consider growing your professional network by connecting with colleagues and industry peers. A larger network can lead to more opportunities."
                },
                {
                    title: "Highlight Your AI Expertise",
                    details: "Showcase your AI and machine learning skills more prominently. Include specific technologies, frameworks, and methodologies you've worked with in your projects."
                }
            ];
        }
    } catch (error) {
        console.error('Error generating improvements:', error);
        return [
            {
                title: "Complete Your Profile",
                details: "Take some time to fill out all sections of your profile. A complete profile helps you appear more professional and engaged."
            },
            {
                title: "Add Your Achievements",
                details: "Share your professional accomplishments and the impact you've made in your roles. This helps showcase your value to potential connections."
            },
            {
                title: "Update Your Skills",
                details: "Keep your skills section current with relevant industry skills and technologies you're proficient in."
            }
        ];
    }
}

async function getProfileData(url) {
    try {
        const response = await axios.get('https://nubela.co/proxycurl/api/v2/linkedin', {
            params: {
                url: url,
                fallback_to_cache: 'on-error',
                use_cache: 'if-present',
                skills: 'include',
                education: 'include',
                experience: 'include',
            },
            headers: {
                'Authorization': 'Bearer ' + process.env.PROXYCURL_API_KEY
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw new Error('Failed to fetch LinkedIn profile');
    }
}

// API Routes
app.post('/api/analyze', async (req, res) => {
    try {
        const { linkedinUrl } = req.body;
        const profileData = await getProfileData(linkedinUrl);
        const analysis = await analyzeProfile(profileData);
        res.json(analysis);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to analyze profile' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
