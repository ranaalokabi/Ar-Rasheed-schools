/**
 * Official Data and Knowledge Base for Ar-Rasheed Modern Schools - Moeen English Branch
 * Academic Year 2026 - 2027 (مدارس الرشيد الحديثة - فرع معين إنجليزي)
 */

export interface GradeFee {
  id: string;
  gradeAr: string;
  gradeEn: string;
  stageAr: string;
  tuitionYER: number;
  booksYER: number;
  uniformBoysYER: number;
  uniformGirlsYER: number;
  uniformSameYER?: number;
  uniformDescriptionAr: string;
}

export const OFFICIAL_FEES_2026_2027: GradeFee[] = [
  {
    id: 'kg',
    gradeAr: 'التمهيدي (قسم العربي)',
    gradeEn: 'Kindergarten (Arabic Section)',
    stageAr: 'التمهيدي',
    tuitionYER: 390000,
    booksYER: 13000,
    uniformBoysYER: 15000,
    uniformGirlsYER: 15000,
    uniformSameYER: 15000,
    uniformDescriptionAr: '15,000 ريال',
  },
  {
    id: 'g1',
    gradeAr: 'الأول الأساسي (قسم العربي)',
    gradeEn: 'Grade 1 Basic (Arabic Section)',
    stageAr: 'الأول أساسي',
    tuitionYER: 535000,
    booksYER: 13000,
    uniformBoysYER: 18000,
    uniformGirlsYER: 18000,
    uniformSameYER: 18000,
    uniformDescriptionAr: '18,000 ريال',
  },
  {
    id: 'g2-6',
    gradeAr: '2 - 6 الأساسي',
    gradeEn: 'Grades 2 - 6 Basic',
    stageAr: '2 - 6 الأساسي',
    tuitionYER: 685000,
    booksYER: 35000,
    uniformBoysYER: 18000,
    uniformGirlsYER: 18000,
    uniformSameYER: 18000,
    uniformDescriptionAr: '18,000 ريال',
  },
  {
    id: 'g7-8',
    gradeAr: '7 - 8 الأساسي',
    gradeEn: 'Grades 7 - 8 Basic',
    stageAr: '7 - 8 الأساسي',
    tuitionYER: 770000,
    booksYER: 35000,
    uniformBoysYER: 20000,
    uniformGirlsYER: 10000,
    uniformDescriptionAr: 'الأولاد 20,000 ريال / البنات 10,000 ريال',
  },
  {
    id: 'g9',
    gradeAr: 'التاسع الأساسي',
    gradeEn: 'Grade 9 Basic',
    stageAr: 'التاسع الأساسي',
    tuitionYER: 770000,
    booksYER: 27000,
    uniformBoysYER: 20000,
    uniformGirlsYER: 10000,
    uniformDescriptionAr: 'الأولاد 20,000 ريال / البنات 10,000 ريال',
  },
  {
    id: 'g10',
    gradeAr: 'الأول ثانوي',
    gradeEn: '1st Secondary (Grade 10)',
    stageAr: 'الأول ثانوي',
    tuitionYER: 935000,
    booksYER: 38000,
    uniformBoysYER: 20000,
    uniformGirlsYER: 10000,
    uniformDescriptionAr: 'الأولاد 20,000 ريال / البنات 10,000 ريال',
  },
  {
    id: 'g11',
    gradeAr: 'الثاني ثانوي',
    gradeEn: '2nd Secondary (Grade 11)',
    stageAr: 'الثاني ثانوي',
    tuitionYER: 935000,
    booksYER: 54000,
    uniformBoysYER: 20000,
    uniformGirlsYER: 10000,
    uniformDescriptionAr: 'الأولاد 20,000 ريال / البنات 10,000 ريال',
  },
  {
    id: 'g12',
    gradeAr: 'الثالث ثانوي',
    gradeEn: '3rd Secondary (Grade 12)',
    stageAr: 'الثالث ثانوي',
    tuitionYER: 990000,
    booksYER: 62000,
    uniformBoysYER: 20000,
    uniformGirlsYER: 10000,
    uniformDescriptionAr: 'الأولاد 20,000 ريال / البنات 10,000 ريال',
  },
];

export const OFFICIAL_TRANSPORTATION = {
  minYER: 120000,
  maxYER: 160000,
  rangeAr: 'من 120,000 ريال إلى 160,000 ريال للسنة بحسب البُعد',
  noteAr: 'رسوم المواصلات تتراوح من 120,000 ريال إلى 160,000 ريال للسنة بحسب البُعد، وقد تتغير أسعار المواصلات بحسب أسعار الوقود.',
};

export const OFFICIAL_DISCOUNTS = {
  fullPayment: {
    titleAr: 'خصم كامل السداد',
    titleEn: 'Full Payment Discount',
    ramadanPercent: 20,
    shawwalPercent: 15,
    conditionAr:
      'إذا قام ولي الأمر بسداد الرسوم الدراسية كاملة خلال شهر رمضان، يحصل على خصم بنسبة 20%. وإذا قام بسداد الرسوم كاملة خلال الشهر التالي لرمضان، وهو شهر شوال، يحصل على خصم بنسبة 15%. وإذا تم السداد بعد شهر شوال، فلا يتم احتساب خصم كامل السداد.',
  },
  republicAndBasicCertificate: {
    titleAr: 'خصم أوائل الجمهورية وطلاب الشهادة الأساسية (الصف التاسع)',
    titleEn: 'Republic Top Students & Basic Certificate (9th Grade)',
    ranks: [
      {
        rankAr: 'الحاصلون على ترتيب الأول إلى الخامس على مستوى الجمهورية في الصف التاسع',
        rankEn: '1st to 5th Rank Republic-wide in 9th Grade',
        discountPercent: 100,
        noteAr: 'خصم 100% من الرسوم',
      },
      {
        rankAr: 'الحاصلون على ترتيب السادس إلى العاشر على مستوى الجمهورية في الصف التاسع',
        rankEn: '6th to 10th Rank Republic-wide in 9th Grade',
        discountPercent: 80,
        noteAr: 'خصم 80% من الرسوم',
      },
      {
        rankAr: 'الطلاب الحاصلون على نسبة 95% أو أكثر في الشهادة الأساسية في الصف التاسع، ولكنهم ليسوا من أوائل الجمهورية',
        rankEn: '95% or higher in Basic Certificate (Grade 9, non-top republic)',
        discountPercent: 30,
        noteAr: 'خصم 30% من الرسوم',
      },
    ],
  },
  corporate: {
    titleAr: 'خصم الشركات',
    titleEn: 'Corporate Discount',
    percent: 10,
    conditionAr: 'الطلاب المستفيدون من الشركات التي وقعت اتفاقية مع المدرسة: خصم 10%.',
  },
  schoolToppers: {
    titleAr: 'خصم أوائل المدرسة',
    titleEn: 'School Top Students (Class Rank - Grades 4 to 12 only)',
    explanationAr:
      'هذا الخصم خاص بأوائل الطلاب على مستوى الصف نفسه، وليس على مستوى المدرسة كاملة، وليس على مستوى الجمهورية.',
    ranks: [
      {
        rankAr: 'الطالب الحاصل على المركز الأول في صفه',
        rankEn: '1st Rank in Class',
        discountPercent: 15,
        noteAr: 'خصم 15% من الرسوم',
      },
      {
        rankAr: 'الطالب الحاصل على المركز الثاني في صفه',
        rankEn: '2nd Rank in Class',
        discountPercent: 12,
        noteAr: 'خصم 12% من الرسوم',
      },
      {
        rankAr: 'الطالب الحاصل على المركز الثالث في صفه',
        rankEn: '3rd Rank in Class',
        discountPercent: 10,
        noteAr: 'خصم 10% من الرسوم',
      },
    ],
    targetAr: 'يشمل هذا الخصم طلاب النقل من الصف الرابع الأساسي إلى الصف الثالث الثانوي فقط.',
  },
};

export const OFFICIAL_INSTALLMENTS = {
  providerAr: 'بنك اليمن والكويت',
  durationMonths: 12,
  descriptionAr: 'تتوفر إمكانية تقسيط الرسوم على 12 شهراً من خلال بنك اليمن والكويت، بما يوفر خطة تقسيط مريحة.',
};

export const OFFICIAL_REFUND_POLICY = {
  descriptionAr: 'في حال الاسترجاع، يتم خصم مبلغ الفترة التي درس فيها الطالب فقط.',
};

// Maintained for backward compatibility with modal selectors
export const DISCOUNT_POLICIES = {
  fullPayment: OFFICIAL_DISCOUNTS.fullPayment,
  republicAndBasicCertificate: OFFICIAL_DISCOUNTS.republicAndBasicCertificate,
  corporate: OFFICIAL_DISCOUNTS.corporate,
  schoolToppers: OFFICIAL_DISCOUNTS.schoolToppers,
};

export const TRANSPORTATION_ROUTES = [
  {
    zoneNameAr: 'رسوم المواصلات المعتمدة (حسب البُعد)',
    zoneNameEn: 'Accredited Transportation (According to distance)',
    minYER: 120000,
    maxYER: 160000,
    descriptionAr: 'رسوم المواصلات تتراوح من 120,000 ريال إلى 160,000 ريال للسنة بحسب البُعد، وقد تتغير بحسب أسعار الوقود.',
  },
];

export const SCHOOL_INFO = {
  nameAr: 'مدارس الرشيد الحديثة – فرع معين إنجليزي',
  nameEn: 'Ar-Rasheed Modern Schools - Moeen English Branch',
  visionAr: 'حيث التربية رسالة، والتعلم متعة، والإبداع ممارسة.',
  missionAr:
    'إعداد جيل مبدع يشارك في بناء وطنه، من خلال بيئة تربوية وتعليمية مشوقة، وتنمية مهنية مستدامة، وتقنية معاصرة، وشراكة مجتمعية فاعلة.',
  number: '1 218 606',
  phone: '+967 771 444 242',
  locationAr: 'مدارس الرشيد الحديثة – فرع معين إنجليزي',
  locationEn: 'Ar-Rasheed Modern Schools - Moeen English Branch',
  googleMapsUrl: 'https://maps.app.goo.gl/grq2F6qbFRLy6FHP6?g_st=aw',
  workingHoursAr:
    'السبت إلى الثلاثاء: من 7:30 صباحاً إلى 1:40 ظهراً | الأربعاء: من 7:30 صباحاً إلى 1:15 ظهراً | الخميس: من 8:00 صباحاً إلى 1:00 ظهراً (الجمعة عطلة)',
  workingHoursEn:
    'Sat - Tue: 7:30 AM - 1:40 PM | Wed: 7:30 AM - 1:15 PM | Thu: 8:00 AM - 1:00 PM (Fri off)',
  scheduleByDay: {
    saturdayToTuesday: 'من 7:30 صباحاً إلى 1:40 ظهراً',
    wednesday: 'من 7:30 صباحاً إلى 1:15 ظهراً',
    thursday: 'من 8:00 صباحاً إلى 1:00 ظهراً',
    friday: 'عطلة أسبوعية رسمية',
  },
};

export const OFFICIAL_REGISTRATION_RULES = {
  requiredDocuments: [
    'صورة من شهادة الميلاد.',
    'صورة من شهادة التطعيم.',
    'صورة من بطاقة الأب.',
    'عدد 4 صور شخصية مقاس 4×6.',
    'يجب أن تكون الوثائق كاملة ومختومة ومعمدة من مكتب التربية.',
  ],
  transferRequirements: {
    insideCapitalSecretariat: {
      originAr: 'إذا كان الطالب قادماً من مدرسة أخرى داخل أمانة العاصمة',
      requirementAr: 'يجب إحضار استمارة نقل داخلي.',
    },
    otherGovernorates: {
      originAr: 'إذا كان الطالب قادماً من خارج أمانة العاصمة ومن محافظة أخرى داخل اليمن',
      requirementAr: 'يجب إحضار استمارة نقل محافظات.',
    },
    outsideYemen: {
      originAr: 'إذا كان الطالب قادماً من خارج اليمن',
      requirementAr:
        'يجب أن تكون الوثائق الدراسية معمدة من الجهة المختصة في البلد الذي أتى منه الطالب، ثم يتم اعتمادها من وزارة الخارجية، ثم من الكنترول.',
      steps: [
        'تعميد الوثائق الدراسية من الجهة المختصة في البلد الذي أتى منه الطالب.',
        'اعتمادها من وزارة الخارجية.',
        'اعتمادها من الكنترول.',
      ],
    },
  },
  acceptedAges: [
    { stageKey: 'kg1', nameAr: 'KG1', ageAr: 'أربع سنوات ونصف' },
    { stageKey: 'kg2', nameAr: 'KG2', ageAr: 'خمس سنوات ونصف' },
    { stageKey: 'grade1', nameAr: 'الصف الأول', ageAr: 'ست سنوات ونصف' },
    { stageKey: 'grade2', nameAr: 'الصف الثاني', ageAr: 'سبع سنوات ونصف' },
  ],
};

export const OFFICIAL_EMPLOYMENT_RULES = {
  minQualificationAr: 'درجة البكالوريوس لأي وظيفة، كحد أدنى.',
  vacancyPolicyAr:
    'الشروط والتفاصيل الخاصة بكل وظيفة يتم الإعلان عنها عند توفر أي وظيفة شاغرة، ويجب على المستخدم الرجوع إلى صفحة الوظائف الرسمية للمدرسة لمعرفة الشروط المطلوبة لكل إعلان.',
  jobsUrl: 'https://www.rasheed.school/arabic/jobs',
  guidanceAr:
    'صفحة الوظائف الرسمية هي المكان المعتمد للإعلانات الوظيفية، وتُنشر الوظائف الشاغرة وشروطها هناك.',
};

export const OFFICIAL_ACADEMIC_SYSTEM = {
  registrationSchedule: {
    startAr: 'يبدأ التسجيل في مدارس الرشيد الحديثة من شهر رمضان.',
    endAr: 'يستمر التسجيل حتى قبل نهاية السنة الدراسية بشهر ونصف تقريباً.',
    lateRegistrationAr:
      'بالنسبة للطلاب الذين يتم تسجيلهم في وقت متأخر: يجب أن يكون لديهم ورقة من المنطقة التعليمية.',
    instructionNoteAr:
      'لا يتم تحديد تاريخ ميلادي أو هجري دقيق لبداية أو نهاية التسجيل ما لم يتم تزويدنا بتاريخ رسمي محدد.',
  },
  curriculumAndLanguage: {
    curriculums: ['Macmillan', 'Oxford'],
    primaryLanguageAr: 'اللغة الإنجليزية هي اللغة الأساسية للتدريس.',
    exceptionsAr:
      'يستثنى من ذلك الصف الأول والتمهيدي، حيث تكون لغة التدريس فيهما العربية.',
  },
  studyDays: {
    policyAr:
      'عدد أيام الدراسة الفعلية يتم تحديده وفقاً لـ: عدد أيام الدراسة في التقويم، الإجازات الطارئة، والإجازات الوطنية. لذلك لا يُعطى رقم ثابت لعدد أيام الدراسة السنوية ما لم توجد معلومة رسمية محددة.',
  },
  examSystem: {
    stages: [
      {
        stageAr: 'امتحانات منتصف السنة',
        timingAr: 'بعد مرور شهرين من الدراسة يتم إجراء امتحانات منتصف السنة.',
      },
      {
        stageAr: 'امتحانات نهاية السنة',
        timingAr: 'بعد مرور شهرين آخرين يتم إجراء امتحانات نهاية السنة.',
      },
    ],
  },
  parentFollowUp: {
    channels: [
      {
        nameAr: 'تطبيق الرشيد اقرأ',
        descriptionAr: 'تطبيق الرشيد اقرأ لمتابعة مستوى الطالب والاطلاع على الواجبات.',
      },
      {
        nameAr: 'مجموعة WhatsApp الخاصة بالصف',
        descriptionAr: 'مجموعة WhatsApp الخاصة بالصف للمتابعة والواجبات.',
      },
    ],
  },
  calendar: {
    systemAr:
      'يتم احتساب التقويم الدراسي وفق التقويم الهجري، ويبدأ العام الدراسي من 1 محرم.',
    noteAr:
      'يعتمد التقويم على التاريخ الهجري وبدايته من 1 محرم (دون تحويل لتاريخ ميلادي تقريبي).',
  },
  resultsReceipt: {
    midtermAr:
      'نتائج الامتحانات النصفية: يتم استلامها بعد أسبوعين من انتهاء الامتحانات.',
    finalAr:
      'نتائج الامتحانات النهائية: يتم استلامها بعد شهر من انتهاء الامتحانات (وسبب المدة الإضافية هو مراجعة الشهادة في الوزارة وإجراء المطابقة).',
  },
};


