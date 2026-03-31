export type CourseCategory = 'certificate' | 'advanced-certificate' | 'nvq' | 'diploma';

type BaseCourse = {
  id: string;
  title: string;
  hidden: boolean;
};

export type SimpleCourse = BaseCourse & {
  variant: 'simple';
};

export type DetailedCourse = BaseCourse & {
  variant: 'detailed';
  courseId?: string;
  level: string;
  method: string;
  medium: string;
  duration: string;
  entryRequirements: string[];
  modulesInfo: string;
  feesInfo: string;
};

export type Course = SimpleCourse | DetailedCourse;

export type CourseCatalog = Record<CourseCategory, Course[]>;

const advancedEntryRequirements = [
  'G.C.E. A/L - 03 Passes, OR',
  'G.C.E. O/L six passes plus one year working experience OR',
  'Students following any other professional qualification.',
];

const nvqEntryRequirements = ['G.C.E. O/L OR', 'Completion of NVQ Level 2 or equivalent qualifications.'];

const diplomaEntryRequirements = [
  'GCE (A/L) Examination in three (3) subjects OR',
  'Foundation Program equivalent to the GCE (A/L) OR',
  'GCE (O/L) Examination with accredited work experience or accredited prior learning followed by a relevant programme of study equivalent to a minimum of 30 credits OR',
  'Demonstrated competence in the relevant field and potential for future career development OR',
  'Completion of NVQ Level 4 or equivalent qualifications OR',
  'A good working knowledge of the language of instruction of the Diploma program.',
];

const advancedCourseDefaults = {
  level: 'Advanced Certificate Programme',
  method: 'Full Time',
  medium: 'English & Sinhala',
  duration: '03 Months',
  entryRequirements: advancedEntryRequirements,
  modulesInfo: 'For further details, contact us. +94702 88 99 00',
  feesInfo: 'LOCAL PARTICIPANT COURSE FEE - LKR 30,000 (payable in 3 installments)',
  hidden: false,
} as const;

const nvqCourseDefaults = {
  method: 'Full Time/ Part Time',
  medium: 'English & Sinhala',
  duration: 'For further details, contact us. +947 02 88 99 00',
  entryRequirements: nvqEntryRequirements,
  modulesInfo: 'For further details, contact us. +947 02 88 99 00',
  feesInfo: 'For further details, contact us. +947 02 88 99 00 (Payable in 3 installments)',
  hidden: false,
} as const;

const diplomaCourseDefaults = {
  level: 'NVQ Level 5/6 Certificate Programme',
  method: 'Full Time/ Part Time',
  medium: 'English & Sinhala',
  duration: 'For further details, contact us. +947 02 88 99 00',
  entryRequirements: diplomaEntryRequirements,
  modulesInfo: 'For further details, contact us. +947 02 88 99 00',
  feesInfo: 'For further details, contact us. +947 02 88 99 00 (Payable in 3 installments)',
  hidden: false,
} as const;

export const initialCourseCatalog: CourseCatalog = {
  certificate: [
    { id: 'certificate-1', variant: 'simple', title: 'Basics in Child Psychology', hidden: false },
    { id: 'certificate-2', variant: 'simple', title: 'Basics in Geriatric Psychology', hidden: false },
    { id: 'certificate-3', variant: 'simple', title: 'English for Professionals', hidden: false },
    { id: 'certificate-4', variant: 'simple', title: 'Dementia Care Training', hidden: false },
    { id: 'certificate-5', variant: 'simple', title: 'Basic Nursing Care', hidden: false },
    { id: 'certificate-6', variant: 'simple', title: 'Psychological First Aid', hidden: false },
    { id: 'certificate-7', variant: 'simple', title: 'First Aid', hidden: false },
    { id: 'certificate-8', variant: 'simple', title: 'Understanding AI', hidden: false },
  ],
  'advanced-certificate': [
    { id: 'advanced-certificate-1', variant: 'detailed', title: 'Advanced Certificate in Psychology', courseId: 'ACP', ...advancedCourseDefaults },
    { id: 'advanced-certificate-2', variant: 'detailed', title: 'Advanced Certificate in Child Psychology', courseId: 'ACCP', ...advancedCourseDefaults },
    { id: 'advanced-certificate-3', variant: 'detailed', title: 'Advanced Certificate in Geriatric Psychology', courseId: 'ACGP', ...advancedCourseDefaults },
    { id: 'advanced-certificate-4', variant: 'detailed', title: 'Advanced Certificate in Human Resource Management', courseId: 'ACHRM', ...advancedCourseDefaults },
    { id: 'advanced-certificate-5', variant: 'detailed', title: 'Advanced Certificate in Marketing Management', courseId: 'ACMM', ...advancedCourseDefaults },
    { id: 'advanced-certificate-6', variant: 'detailed', title: 'Advanced Certificate in Basic Life Support', courseId: 'ACBLC', ...advancedCourseDefaults },
  ],
  nvq: [
    { id: 'nvq-1', variant: 'detailed', title: 'NVQ Level 3 - Child Care & Therapy Assistant (Special Needs)', level: 'NVQ Level 3 Certificate Programme', ...nvqCourseDefaults },
    { id: 'nvq-2', variant: 'detailed', title: 'NVQ Level 3 - Caregiver', level: 'NVQ Level 3 Certificate Programme', ...nvqCourseDefaults },
    { id: 'nvq-3', variant: 'detailed', title: 'NVQ Level 3 - Child Caregiver', level: 'NVQ Level 3 Certificate Programme', ...nvqCourseDefaults },
    { id: 'nvq-4', variant: 'detailed', title: 'NVQ Level 3 - Child Care Center Operations', level: 'NVQ Level 3 Certificate Programme', ...nvqCourseDefaults },
    { id: 'nvq-5', variant: 'detailed', title: 'NVQ Level 3 - Early Childhood Development Centre Assistant', level: 'NVQ Level 3 Certificate Programme', ...nvqCourseDefaults },
    { id: 'nvq-6', variant: 'detailed', title: 'NVQ Level 2 - Health Care and Supportive Assistant', level: 'NVQ Level 3 Certificate Programme', ...nvqCourseDefaults },
    { id: 'nvq-7', variant: 'detailed', title: 'NVQ Level 4 - Nurse Assistant', level: 'NVQ Level 3 Certificate Programme', ...nvqCourseDefaults },
    { id: 'nvq-8', variant: 'detailed', title: 'NVQ Level 3 - Human Resources Associate', level: 'NVQ Level 3 Certificate Programme', ...nvqCourseDefaults },
    { id: 'nvq-9', variant: 'detailed', title: 'NVQ Level 3 - Mental Health Care Assistant', level: 'NVQ Level 3 Certificate Programme', ...nvqCourseDefaults },
    { id: 'nvq-10', variant: 'detailed', title: 'NVQ Level 3 - Hairdresser', level: 'NVQ Level 3 Certificate Programme', ...nvqCourseDefaults },
    { id: 'nvq-11', variant: 'detailed', title: 'NVQ Level 3 - Beautician', level: 'NVQ Level 3 Certificate Programme', ...nvqCourseDefaults },
  ],
  diploma: [
    { id: 'diploma-1', variant: 'detailed', title: 'Diploma in Psychology', ...diplomaCourseDefaults },
    { id: 'diploma-2', variant: 'detailed', title: 'Diploma in Psychological Counselling', ...diplomaCourseDefaults },
    { id: 'diploma-3', variant: 'detailed', title: 'Diploma in Education', ...diplomaCourseDefaults },
    { id: 'diploma-4', variant: 'detailed', title: 'Diploma in Business Management', ...diplomaCourseDefaults },
    { id: 'diploma-5', variant: 'detailed', title: 'Diploma in Accounting', ...diplomaCourseDefaults },
    { id: 'diploma-6', variant: 'detailed', title: 'Diploma in Child Care Center Management', ...diplomaCourseDefaults },
    { id: 'diploma-7', variant: 'detailed', title: 'Diploma in Early Childhood Development Education', ...diplomaCourseDefaults },
    { id: 'diploma-8', variant: 'detailed', title: 'Diploma in Event Management', ...diplomaCourseDefaults },
    { id: 'diploma-9', variant: 'detailed', title: 'Diploma in Fashion Design Technology', ...diplomaCourseDefaults },
    { id: 'diploma-10', variant: 'detailed', title: 'Diploma in Hospitality Management', ...diplomaCourseDefaults },
    { id: 'diploma-11', variant: 'detailed', title: 'Diploma in Human Resource Management', ...diplomaCourseDefaults },
    { id: 'diploma-12', variant: 'detailed', title: 'Diploma in Marketing Management', ...diplomaCourseDefaults },
    { id: 'diploma-13', variant: 'detailed', title: 'Diploma in Nursing', ...diplomaCourseDefaults },
    { id: 'diploma-14', variant: 'detailed', title: 'Diploma in Teaching English as a Second Language', ...diplomaCourseDefaults },
  ],
};

export function createEmptyCourse(category: CourseCategory): Course {
  const id = `${category}-${Date.now()}`;

  if (category === 'certificate') {
    return {
      id,
      variant: 'simple',
      title: '',
      hidden: false,
    };
  }

  if (category === 'advanced-certificate') {
    return {
      id,
      variant: 'detailed',
      title: '',
      courseId: '',
      level: advancedCourseDefaults.level,
      method: advancedCourseDefaults.method,
      medium: advancedCourseDefaults.medium,
      duration: advancedCourseDefaults.duration,
      entryRequirements: [...advancedCourseDefaults.entryRequirements],
      modulesInfo: advancedCourseDefaults.modulesInfo,
      feesInfo: advancedCourseDefaults.feesInfo,
      hidden: false,
    };
  }

  if (category === 'nvq') {
    return {
      id,
      variant: 'detailed',
      title: '',
      courseId: '',
      level: 'NVQ Level 3 Certificate Programme',
      method: nvqCourseDefaults.method,
      medium: nvqCourseDefaults.medium,
      duration: nvqCourseDefaults.duration,
      entryRequirements: [...nvqCourseDefaults.entryRequirements],
      modulesInfo: nvqCourseDefaults.modulesInfo,
      feesInfo: nvqCourseDefaults.feesInfo,
      hidden: false,
    };
  }

  return {
    id,
    variant: 'detailed',
    title: '',
    courseId: '',
    level: diplomaCourseDefaults.level,
    method: diplomaCourseDefaults.method,
    medium: diplomaCourseDefaults.medium,
    duration: diplomaCourseDefaults.duration,
    entryRequirements: [...diplomaCourseDefaults.entryRequirements],
    modulesInfo: diplomaCourseDefaults.modulesInfo,
    feesInfo: diplomaCourseDefaults.feesInfo,
    hidden: false,
  };
}
