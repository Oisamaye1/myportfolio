-- Seed Experience table with sample data

INSERT INTO experience (
    company, 
    position, 
    location, 
    start_date, 
    end_date, 
    is_current, 
    description, 
    responsibilities, 
    technologies, 
    achievements,
    company_logo,
    company_website,
    order_index, 
    is_active
) VALUES 
(
    'Tech Solutions Inc.',
    'Senior Full Stack Developer',
    'San Francisco, CA',
    'Jan 2022',
    NULL,
    true,
    'Leading development of scalable web applications and mentoring junior developers.',
    ARRAY[
        'Lead a team of 4 developers in building modern web applications',
        'Architect and implement scalable backend systems',
        'Collaborate with product managers and designers',
        'Code review and maintain high code quality standards',
        'Mentor junior developers and conduct technical interviews'
    ],
    ARRAY['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
    ARRAY[
        'Improved application performance by 40%',
        'Successfully launched 3 major product features',
        'Reduced deployment time from 2 hours to 15 minutes',
        'Mentored 5 junior developers who were promoted'
    ],
    '/placeholder.svg?height=80&width=80&text=Tech+Solutions',
    'https://techsolutions.example.com',
    1,
    true
),
(
    'StartupXYZ',
    'Frontend Developer',
    'Remote',
    'Jun 2020',
    'Dec 2021',
    false,
    'Developed responsive web applications and improved user experience across multiple products.',
    ARRAY[
        'Built responsive web applications using React and Vue.js',
        'Collaborated with UX/UI designers to implement pixel-perfect designs',
        'Optimized application performance and accessibility',
        'Participated in agile development processes',
        'Contributed to component library and design system'
    ],
    ARRAY['React', 'Vue.js', 'JavaScript', 'CSS3', 'SASS', 'Webpack', 'Jest'],
    ARRAY[
        'Increased user engagement by 25%',
        'Reduced page load times by 50%',
        'Built reusable component library used across 5 products',
        'Achieved 98% accessibility score on all pages'
    ],
    '/placeholder.svg?height=80&width=80&text=StartupXYZ',
    'https://startupxyz.example.com',
    2,
    true
),
(
    'Digital Agency Pro',
    'Junior Web Developer',
    'New York, NY',
    'Aug 2019',
    'May 2020',
    false,
    'Developed websites for clients and learned modern web development practices.',
    ARRAY[
        'Built custom websites for small to medium businesses',
        'Maintained and updated existing client websites',
        'Collaborated with designers and project managers',
        'Learned and applied modern web development best practices',
        'Provided technical support to clients'
    ],
    ARRAY['HTML5', 'CSS3', 'JavaScript', 'PHP', 'WordPress', 'MySQL', 'Git'],
    ARRAY[
        'Successfully delivered 15+ client projects',
        'Improved website loading speeds by 30% on average',
        'Received excellent client feedback ratings',
        'Quickly learned new technologies and frameworks'
    ],
    '/placeholder.svg?height=80&width=80&text=Digital+Agency',
    'https://digitalagencypro.example.com',
    3,
    true
);

COMMIT;
