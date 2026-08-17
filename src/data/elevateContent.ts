export type ElevateApproachStep = {
    icon: string;
    title: string;
    items: string[];
};

export type ElevateTrainingArea = {
    icon: string;
    title: string;
    items: string[];
};

export type ElevateHighlight = {
    icon: string;
    text: string;
};

export type ElevatePricingPackage = {
    title: string;
    idealFor: string;
    price: string;
    items: string[];
};

export const approachSteps: ElevateApproachStep[] = [
    {
        icon: 'fas fa-magnifying-glass-chart',
        title: 'Identify',
        items: [
            'Organizational consultation',
            'Skills gap analysis',
            'Management discussions',
            'Employee competency assessment',
        ],
    },
    {
        icon: 'fas fa-pen-ruler',
        title: 'Customized Program Design',
        items: [
            'Tailor-made training modules',
            'Industry-specific content',
            'Flexible delivery methods',
            'Alignment with company objectives',
        ],
    },
    {
        icon: 'fas fa-chalkboard-user',
        title: 'Professional Training Delivery',
        items: [
            'Interactive workshops',
            'Case studies & simulations',
            'Practical workplace applications',
            'Experienced trainers & subject experts',
        ],
    },
    {
        icon: 'fas fa-arrows-rotate',
        title: 'Evaluation & Follow-Up',
        items: [
            'Training effectiveness assessment',
            'Feedback analysis',
            'Post-training recommendations',
            'Continuous improvement support',
        ],
    },
];

export const trainingAreas: ElevateTrainingArea[] = [
    {
        icon: 'fas fa-brain',
        title: 'Mental Health & Well-Being',
        items: [
            'Workplace Mental Health Awareness',
            'Stress Management & Burnout Prevention',
            'Psychological First Aid',
            'Employee Resilience Training',
            'Work–Life Balance Programs',
        ],
    },
    {
        icon: 'fas fa-people-group',
        title: 'Human Resource Development',
        items: [
            'Employee Engagement',
            'Workplace Ethics & Professional Conduct',
            'Conflict Management',
            'Team Building Programs',
            'Organizational Culture Development',
        ],
    },
    {
        icon: 'fas fa-helmet-safety',
        title: 'Safety, Health & Emergency Preparedness',
        items: [
            'Workplace Safety Awareness',
            'Occupational Health & Safety (OHS)',
            'Fire Safety & Fire Warden Training',
            'First Aid at the Workplace',
            'Hazard Identification & Risk Assessment',
            'Emergency Response & Evacuation Procedures',
            'PPE Awareness and Safe Usage',
            'Disaster Preparedness & Business Continuity',
            'Safety Leadership',
            'Environmental Health & Safety (EHS)',
            'Food Safety & Hygiene',
        ],
    },
    {
        icon: 'fas fa-chess-king',
        title: 'Leadership & Management',
        items: [
            'Leadership Development',
            'Supervisory Skills',
            'Strategic Thinking',
            'Decision Making',
            'Performance Management',
        ],
    },
    {
        icon: 'fas fa-comments',
        title: 'Communication & Soft Skills',
        items: [
            'Effective Communication',
            'Customer Service Excellence',
            'Presentation Skills',
            'Emotional Intelligence',
            'Workplace Professionalism',
        ],
    },
    {
        icon: 'fas fa-user-nurse',
        title: 'Healthcare & Caregiver Training',
        items: [
            'Basic Nursing & Caregiving Skills',
            'Elder Care & Dementia Care',
            'Patient Handling & Safety',
            'Healthcare Support Staff Training',
        ],
    },
];

export const whyChooseHighlights: ElevateHighlight[] = [
    { icon: 'fas fa-sliders', text: 'Fully customized training solutions' },
    { icon: 'fas fa-user-tie', text: 'Industry-experienced trainers' },
    { icon: 'fas fa-hands-clapping', text: 'Practical and interactive learning approach' },
    { icon: 'fas fa-chart-line', text: 'Long-term organizational development focus' },
];

export const trainingFormats: string[] = [
    'On-Site Corporate Training',
    'Online & Hybrid Training Sessions',
    'Executive Workshops',
    'Short Skill Development Programs',
    'Leadership Retreats',
    'Annual Training Partnerships',
];

export const pricingPackages: ElevatePricingPackage[] = [
    {
        title: 'Essential Training Package',
        idealFor: 'Small teams and focused skill development',
        price: 'Starting From LKR 20,000',
        items: [
            'Training Needs Discussion',
            'Half-Day Training Program (3–4 Hours)',
            'Up to 25 Participants',
            'Training Materials',
            'Participation Certificates + Post-Training Feedback Report',
        ],
    },
    {
        title: 'Professional Training Package',
        idealFor: 'Department-level training and workforce development',
        price: 'Starting From LKR 35,000',
        items: [
            'Training Needs Assessment',
            'Full-Day Training Program (6–8 Hours)',
            'Up to 30 Participants',
            'Interactive Activities & Case Studies',
            'Training Materials',
            'Certificates + Evaluation Report',
        ],
    },
    {
        title: 'Executive Development Package',
        idealFor: 'Managers, supervisors, and leadership teams',
        price: 'Starting From LKR 50,000',
        items: [
            'Customized Leadership Training',
            'Strategic Planning Workshop',
            'Team Assessments',
            'Action Planning Session',
            'Executive Coaching Elements',
            'Detailed Training Report',
        ],
    },
    {
        title: 'Safety & Compliance Training Package',
        idealFor: 'Manufacturing, construction, logistics, healthcare, and service industries',
        price: 'Starting From LKR 45,000',
        items: [
            'Workplace Safety Training',
            'Fire Safety & Emergency Preparedness',
            'First Aid Awareness',
            'Hazard Identification & Risk Assessment',
            'Safety Compliance Guidance',
            'Certificates',
        ],
    },
    {
        title: 'Mental Health & Employee Well-Being Package',
        idealFor: 'Organizations focused on employee wellness',
        price: 'Starting From LKR 35,000',
        items: [
            'Workplace Mental Health Awareness',
            'Stress Management',
            'Burnout Prevention',
            'Psychological First Aid',
            'Resilience Building',
            'Employee Support Strategies',
        ],
    },
    {
        title: 'Annual Corporate Learning Partnership',
        idealFor: 'Organizations seeking continuous staff development',
        price: 'Depending on Requirements',
        items: [
            'Annual Training Needs Analysis',
            'Quarterly Training Programs',
            'Leadership Development Sessions',
            'Employee Well-Being Programs',
            'Safety Training Programs',
            'Annual Learning Report',
        ],
    },
];

export const additionalServices: string[] = [
    'Training Needs Assessment',
    'Employee Surveys',
    'Competency Assessments',
    'Leadership Coaching',
    'Team Building Events',
    'Customized Training Development',
];
