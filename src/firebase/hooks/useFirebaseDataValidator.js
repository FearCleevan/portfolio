// src/firebase/hooks/useFirebaseDataValidator.js
import { useBlogPosts } from "./useBlogPosts";
import { useCertifications } from "./useCertifications";
import { useExperience } from "./useExperience";
import { useAboutContent } from "./useFirestore";
import { usePersonalDetails } from "./usePersonalDetails";
import { useProjects } from "./useProjects";
import { useTechStack } from "./useTechStack";

export const useFirebaseDataValidator = () => {
    const { personalDetails, loading: personalLoading } = usePersonalDetails();
    const { projects, loading: projectsLoading } = useProjects();
    const { experience, loading: experienceLoading } = useExperience();
    const { techStack, loading: techStackLoading } = useTechStack();
    const { certifications, loading: certsLoading } = useCertifications();
    const { blogPosts, loading: blogLoading } = useBlogPosts();
    const { aboutContent, loading: aboutLoading } = useAboutContent();

    const isDataLoading = personalLoading || projectsLoading || experienceLoading || 
                         techStackLoading || certsLoading || blogLoading || aboutLoading;

    // Validate data structure
    const validateData = () => {
        const issues = [];

        if (!personalDetails) issues.push('Personal details are null/undefined');
        if (!projects) issues.push('Projects data is null/undefined');
        if (!experience) issues.push('Experience data is null/undefined');
        if (!techStack) issues.push('Tech stack data is null/undefined');
        if (!certifications) issues.push('Certifications data is null/undefined');
        if (!blogPosts) issues.push('Blog posts data is null/undefined');
        if (!aboutContent) issues.push('About content data is null/undefined');

        return issues;
    };

    const getValidatedData = () => {
        if (isDataLoading) return null;

        const dataIssues = validateData();
        if (dataIssues.length > 0) {
            console.warn('Firebase Data Issues:', dataIssues);
        }

        return {
            personalDetails: personalDetails || {},
            projects: projects || [],
            experience: experience || [],
            techStack: techStack || [],
            certifications: certifications || [],
            blogPosts: blogPosts || [],
            aboutContent: aboutContent || [],
            hasDataIssues: dataIssues.length > 0,
            dataIssues
        };
    };

    return {
        data: getValidatedData(),
        loading: isDataLoading,
        validated: !isDataLoading
    };
};