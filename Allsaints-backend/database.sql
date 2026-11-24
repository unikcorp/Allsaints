-- ========================================================================
-- ALL SAINTS PUBLIC SCHOOL — MASTER DATABASE SCHEMA & INITIAL SEED DATA
-- Database: allsaints_school_db
-- ========================================================================

CREATE DATABASE IF NOT EXISTS `allsaints`
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `allsaints`;

-- 0. ADMIN USERS
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('SUPER_ADMIN', 'PRINCIPAL', 'STAFF') DEFAULT 'STAFF',
  `is_active` TINYINT(1) DEFAULT 1,
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `admin_users` (`username`, `email`, `password_hash`, `role`)
VALUES ('admin', 'admin@allsaintspublicschool.com', 'publicschoolsaintsadoor', 'SUPER_ADMIN')
ON DUPLICATE KEY UPDATE `username`=`username`;

-- 1. OUR MANAGEMENT
CREATE TABLE IF NOT EXISTS `management_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `sub_role` VARCHAR(150) NULL,
  `photo_url` TEXT NOT NULL,
  `quote` TEXT NULL,
  `bio` TEXT NULL,
  `display_order` INT DEFAULT 1,
  `is_patron` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `management_members` (`name`, `role`, `sub_role`, `photo_url`, `quote`, `bio`, `display_order`, `is_patron`) VALUES
('His Excellency Most Rev. Dr. Samuel Mar Irenios', 'Patron & President', 'Bishop of Pathanamthitta Diocese', '/images/management/patron.jpg', 'To create creators of tomorrow — empowering young minds with divine wisdom, moral excellence, and academic distinction.', 'President of The Malankara Catholic Educational Society of the Diocese of Pathanamthitta.', 1, 1),
('His Excellency Most Rev. Yoohanon Mar Chrysostom', 'Former Patron', 'Bishop Emeritus, Diocese of Pathanamthitta', '/images/management/former-patron.jpg', 'Guided the school with steadfast faith, laying foundations of academic rigor, character building, and holistic education.', 'Blessings that fostered generations of students since the inception of All Saints Public School in June 2002.', 2, 1),
('Rev. Fr. Thomas Kumbakattil', 'Founder Manager', 'Founder & Spiritual Architect', '/images/management/founder-manager.jpg', 'Dedicated to holistic education that illuminates minds and uplifts rural communities.', 'Founded the institution in June 2002 under the blessings of Moran Mor Cyril Baselios Catholicose.', 3, 0),
('Rev. Dr. James (Joseph) Stephen Olikal', 'Principal', 'Academic & Administrative Head', '/images/management/principal.jpg', 'Excellence in academics goes hand in hand with integrity, moral fortitude, and compassionate service.', 'Steering the faculty and student body toward continuous 100% CBSE board achievement.', 4, 0),
('Fr. Philipose Charivupurayidathil (Jobin C Kurian)', 'Director', 'Institutional Director', '/images/management/director.jpg', 'Committed to providing world-class infrastructure and student-centered growth environments.', 'Guiding modern development, laboratory advancements, and campus operations.', 5, 0);

-- 2. PTA & SMC
CREATE TABLE IF NOT EXISTS `committee_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `committee_type` ENUM('PTA', 'SMC') NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `occupation` VARCHAR(150) NULL,
  `term_period` VARCHAR(50) NOT NULL,
  `phone_number` VARCHAR(20) NULL,
  `photo_url` TEXT NULL,
  `display_order` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `committee_members` (`committee_type`, `name`, `designation`, `occupation`, `term_period`, `phone_number`, `display_order`) VALUES
('SMC', 'Rev. Dr. James Stephen Olikal', 'Member Secretary / Principal', 'Principal, All Saints Public School', '2025-2027', '+91 4734 224455', 1),
('SMC', 'Fr. Philipose Charivupurayidathil', 'Manager Nominee', 'Director, ASPS', '2025-2027', '+91 4734 224456', 2),
('PTA', 'Adv. Mathew K. Thomas', 'PTA President', 'Advocate, District Court', '2025-2026', '+91 94471 23456', 1),
('PTA', 'Mrs. Priya S. Nair', 'PTA Vice President', 'Higher Secondary Teacher', '2025-2026', '+91 94472 34567', 2);

-- 3. FACULTY
CREATE TABLE IF NOT EXISTS `faculty_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `designation` ENUM('PGT', 'TGT', 'PRT', 'NTT', 'LAB_ASSISTANT', 'LIBRARIAN', 'PET', 'OTHER') NOT NULL,
  `qualification` VARCHAR(150) NOT NULL,
  `experience_years` INT DEFAULT 0,
  `photo_url` TEXT NULL,
  `email` VARCHAR(100) NULL,
  `display_order` INT DEFAULT 1,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `faculty_members` (`name`, `department`, `designation`, `qualification`, `experience_years`, `display_order`) VALUES
('Rev. Dr. James Stephen', 'Administration & English', 'PGT', 'M.A., M.Ed., Ph.D.', 22, 1),
('Mr. Abraham George', 'Mathematics', 'PGT', 'M.Sc., B.Ed.', 16, 2),
('Mrs. Rachel Mathew', 'Physics', 'PGT', 'M.Sc. Physics, B.Ed.', 14, 3),
('Mrs. Ancy Varghese', 'Chemistry', 'PGT', 'M.Sc. Chemistry, B.Ed.', 12, 4),
('Mr. Thomas K. Philip', 'Computer Science', 'PGT', 'MCA, M.Tech.', 11, 5),
('Mrs. Sunitha Kumari', 'Malayalam', 'TGT', 'M.A. Malayalam, B.Ed.', 15, 6);

-- 4. ANNUAL REPORT
CREATE TABLE IF NOT EXISTS `annual_reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `academic_year` VARCHAR(20) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `summary` TEXT NULL,
  `pdf_url` TEXT NOT NULL,
  `cover_image_url` TEXT NULL,
  `presented_by` VARCHAR(150) NULL,
  `published_at` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `annual_reports` (`academic_year`, `title`, `summary`, `pdf_url`, `presented_by`, `published_at`) VALUES
('2025-2026', 'Annual School Report 2025-2026', 'Comprehensive record of academic achievements, 100% CBSE board results, infrastructure expansion, and national co-curricular awards.', '/documents/annual-report-2025-26.pdf', 'Rev. Dr. James Stephen Olikal (Principal)', '2026-03-31');

-- 5. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS `achievements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` ENUM('SPORTS', 'ACADEMIC', 'ARTS_CULTURE', 'SCIENCE_EXPO', 'OLYMPIAD', 'OTHER') NOT NULL,
  `level` ENUM('INTER_SCHOOL', 'DISTRICT', 'STATE', 'NATIONAL', 'INTERNATIONAL') NOT NULL,
  `winner_name` VARCHAR(150) NOT NULL,
  `class_grade` VARCHAR(50) NULL,
  `award_title` VARCHAR(100) NOT NULL,
  `event_date` DATE NOT NULL,
  `photo_url` TEXT NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `achievements` (`title`, `category`, `level`, `winner_name`, `class_grade`, `award_title`, `event_date`, `description`) VALUES
('CBSE Cluster Athletics Championship', 'SPORTS', 'STATE', 'School Athletics Team', 'Class IX-XII', 'Overall Runner-Up Trophy', '2026-01-18', 'Exceptional performance in 400m sprint and high jump events.'),
('State Science & Robotics Fair', 'SCIENCE_EXPO', 'STATE', 'Master Joel K. Mathew & Team', 'Class XI Science', 'First Prize & Gold Medal', '2025-11-20', 'Innovative automated smart campus irrigation system project.');

-- 6. ENROLLMENT
CREATE TABLE IF NOT EXISTS `enrollment_statistics` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `academic_year` VARCHAR(20) NOT NULL,
  `class_grade` VARCHAR(50) NOT NULL,
  `section` VARCHAR(10) NOT NULL,
  `stream` VARCHAR(50) DEFAULT 'General',
  `boys_count` INT DEFAULT 0,
  `girls_count` INT DEFAULT 0,
  `total_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `enrollment_statistics` (`academic_year`, `class_grade`, `section`, `stream`, `boys_count`, `girls_count`, `total_count`) VALUES
('2025-2026', 'Class X', 'A', 'General', 22, 23, 45),
('2025-2026', 'Class X', 'B', 'General', 21, 24, 45),
('2025-2026', 'Class XII', 'A', 'Science', 25, 23, 48),
('2025-2026', 'Class XII', 'B', 'Commerce', 18, 22, 40);

-- 7. FEE STRUCTURE
CREATE TABLE IF NOT EXISTS `fee_structures` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `academic_year` VARCHAR(20) NOT NULL,
  `grade_category` VARCHAR(100) NOT NULL,
  `tuition_fee` DECIMAL(10,2) DEFAULT 0.00,
  `annual_charges` DECIMAL(10,2) DEFAULT 0.00,
  `computer_lab_fee` DECIMAL(10,2) DEFAULT 0.00,
  `total_annual` DECIMAL(10,2) NOT NULL,
  `payment_terms` VARCHAR(150) NULL,
  `official_pdf_url` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `fee_structures` (`academic_year`, `grade_category`, `tuition_fee`, `annual_charges`, `computer_lab_fee`, `total_annual`, `payment_terms`) VALUES
('2026-2027', 'Pre-Primary (LKG & UKG)', 18000.00, 4500.00, 1500.00, 24000.00, '3 Term Installments (June, Oct, Jan)'),
('2026-2027', 'Primary (Class I - V)', 22000.00, 5000.00, 2500.00, 29500.00, '3 Term Installments (June, Oct, Jan)'),
('2026-2027', 'Secondary (Class VI - X)', 26000.00, 5500.00, 3500.00, 35000.00, '3 Term Installments (June, Oct, Jan)'),
('2026-2027', 'Senior Secondary (Class XI - XII)', 32000.00, 6000.00, 4500.00, 42500.00, '3 Term Installments (June, Oct, Jan)');

-- 8. ACADEMIC CALENDAR
CREATE TABLE IF NOT EXISTS `academic_calendar_events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `academic_year` VARCHAR(20) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `event_type` ENUM('EXAM', 'HOLIDAY', 'CELEBRATION', 'VACATION', 'PTA_MEETING') NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NULL,
  `applicable_for` VARCHAR(100) DEFAULT 'All Classes',
  `description` TEXT NULL,
  `calendar_pdf_url` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `academic_calendar_events` (`academic_year`, `title`, `event_type`, `start_date`, `end_date`, `applicable_for`, `description`) VALUES
('2026-2027', 'School Reopening for Academic Session 2026-27', 'CELEBRATION', '2026-06-01', '2026-06-01', 'All Classes', 'Reopening prayer service, welcoming new students.'),
('2026-2027', 'First Mid-Term Assessments', 'EXAM', '2026-07-20', '2026-07-25', 'Class I to XII', 'Periodic test 1 for primary and secondary sections.'),
('2026-2027', 'Onam Holidays', 'VACATION', '2026-08-25', '2026-09-04', 'All Classes', 'Festival vacation and school cultural gathering.');

-- 9. SCHOOL PARLIAMENT
CREATE TABLE IF NOT EXISTS `student_parliament` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `academic_year` VARCHAR(20) NOT NULL,
  `portfolio` VARCHAR(100) NOT NULL,
  `student_name` VARCHAR(150) NOT NULL,
  `class_grade` VARCHAR(50) NOT NULL,
  `house_name` VARCHAR(50) NULL,
  `photo_url` TEXT NULL,
  `motto_pledge` TEXT NULL,
  `display_order` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `student_parliament` (`academic_year`, `portfolio`, `student_name`, `class_grade`, `house_name`, `motto_pledge`, `display_order`) VALUES
('2026-2027', 'School Head Boy', 'Kevin George Mathew', 'Class XII Science', 'St. Peter', 'Leadership through humble service and academic dedication.', 1),
('2026-2027', 'School Head Girl', 'Ananya S. Pillai', 'Class XII Commerce', 'St. Paul', 'Inspiring every voice with empathy and unity.', 2),
('2026-2027', 'General Sports Captain', 'Abhishek R.', 'Class XI Science', 'St. Thomas', 'Discipline on field, excellence in character.', 3);

-- 10. RESULTS & TOPPERS
CREATE TABLE IF NOT EXISTS `board_results` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `academic_year` VARCHAR(20) NOT NULL,
  `standard` ENUM('Class X', 'Class XII') NOT NULL,
  `total_registered` INT NOT NULL,
  `total_passed` INT NOT NULL,
  `pass_percentage` DECIMAL(5,2) NOT NULL,
  `distinction_count` INT DEFAULT 0,
  `remarks` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `result_toppers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `result_id` INT NOT NULL,
  `student_name` VARCHAR(150) NOT NULL,
  `stream` VARCHAR(50) NOT NULL,
  `percentage` DECIMAL(5,2) NOT NULL,
  `grade` VARCHAR(50) NULL,
  `photo_url` TEXT NULL,
  FOREIGN KEY (`result_id`) REFERENCES `board_results`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `board_results` (`id`, `academic_year`, `standard`, `total_registered`, `total_passed`, `pass_percentage`, `distinction_count`, `remarks`) VALUES
(1, '2025-2026', 'Class XII', 90, 90, 100.00, 52, '100% Pass record with outstanding full A1 distinctions in Science & Commerce.'),
(2, '2025-2026', 'Class X', 95, 95, 100.00, 61, '100% Pass record in Secondary School Examination AISSE.');

INSERT INTO `result_toppers` (`result_id`, `student_name`, `stream`, `percentage`, `grade`) VALUES
(1, 'Sneha Mariam Varghese', 'Science Stream', 98.60, 'Full A1 Scorer - School First'),
(1, 'Rahul S. Kumar', 'Commerce Stream', 97.80, 'Full A1 Scorer'),
(2, 'Diya Elizabeth George', 'All Subjects', 99.20, 'Class X School Topper');

-- 11. ONLINE ADMISSION
CREATE TABLE IF NOT EXISTS `admission_applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `application_no` VARCHAR(50) NOT NULL UNIQUE,
  `student_name` VARCHAR(150) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `dob` DATE NOT NULL,
  `blood_group` VARCHAR(10) NULL,
  `class_applied` VARCHAR(50) NOT NULL,
  `academic_year` VARCHAR(20) NOT NULL,
  `father_name` VARCHAR(150) NOT NULL,
  `father_phone` VARCHAR(20) NOT NULL,
  `mother_name` VARCHAR(150) NOT NULL,
  `mother_phone` VARCHAR(20) NULL,
  `email` VARCHAR(100) NOT NULL,
  `residential_address` TEXT NOT NULL,
  `student_photo_url` TEXT NULL,
  `birth_cert_url` TEXT NULL,
  `status` ENUM('PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'FEE_PAID') DEFAULT 'PENDING',
  `tracking_pin` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. GALLERY
CREATE TABLE IF NOT EXISTS `gallery_albums` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `subtitle` VARCHAR(200) NULL,
  `category` VARCHAR(100) DEFAULT 'General',
  `cover_image_url` TEXT NOT NULL,
  `display_order` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `gallery_photos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `album_id` INT NOT NULL,
  `image_url` TEXT NOT NULL,
  `caption` VARCHAR(255) NULL,
  FOREIGN KEY (`album_id`) REFERENCES `gallery_albums`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `gallery_videos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `category` VARCHAR(100) DEFAULT 'Campus Life',
  `youtube_url` TEXT NOT NULL,
  `thumbnail_url` TEXT NULL,
  `duration` VARCHAR(20) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `gallery_albums` (`id`, `title`, `subtitle`, `category`, `cover_image_url`, `display_order`) VALUES
(1, 'Campus Infrastructure & Smart Classrooms', 'State-of-the-Art Facilities', 'Infrastructure', '/images/infrastructure/infra-campus.jpg', 1),
(2, 'Annual Athletic Meet 2026', 'Sports & Physical Excellence', 'Sports', '/images/gallery/event-5.jpg', 2);

-- 13. NEWS & BULLETINS
CREATE TABLE IF NOT EXISTS `news_bulletins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` ENUM('Official Notice', 'Press Release', 'Board Result', 'Campus Event', 'General') NOT NULL,
  `publish_date` DATE NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` TEXT NULL,
  `image_url` TEXT NULL,
  `video_url` TEXT NULL,
  `circular_pdf_url` TEXT NULL,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `news_bulletins` (`title`, `category`, `publish_date`, `excerpt`, `image_url`, `is_featured`, `is_published`) VALUES
('Triumph of Excellence: Class XII CBSE Results 2026', 'Board Result', '2026-05-20', 'All Saints Public School secures 100% pass rate in the CBSE Senior School Certificate Examination (Class XII) 2026, with an extraordinary tally of full A1 grades.', '/images/school_content/1773902602-199036049569bb9b0a252c9_news.jpg', 1, 1),
('Class X CBSE Results 2026: A Legacy of Academic Excellence Continued', 'Board Result', '2026-04-30', 'We are immensely proud to announce 100% pass results in the Secondary School Examination (Class X) 2026, upholding our enduring tradition of academic dedication.', '/images/school_content/revaluation-a1-toppers.png', 0, 1),
('Admissions Open for Pre-Primary to Class XII (Session 2026-27)', 'Official Notice', '2026-03-15', 'Admissions are officially open for academic session 2026-27. Enroll your child in a vibrant CBSE atmosphere combining high scholastic rigor and sports academies.', '/images/infrastructure/infra-campus.jpg', 0, 1);

-- 14. STATUTORY CBSE DOCUMENTS
CREATE TABLE IF NOT EXISTS `statutory_documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `doc_number` VARCHAR(100) NULL,
  `issuing_authority` VARCHAR(150) NOT NULL,
  `valid_until` DATE NULL,
  `compliance_status` VARCHAR(100) DEFAULT 'Valid & Verified',
  `file_url` TEXT NOT NULL,
  `file_type` VARCHAR(20) DEFAULT 'PDF',
  `description` TEXT NULL,
  `display_order` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `statutory_documents` (`title`, `category`, `doc_number`, `issuing_authority`, `valid_until`, `file_url`, `display_order`) VALUES
('Copies of Affiliation / Upgradation Letter & Recent Extension', 'Mandatory Disclosure', 'CBSE/AFF/930501/EX-02456', 'Central Board of Secondary Education', '2028-03-31', '/documents/cbse-affiliation.pdf', 1),
('Copies of Societies / Trust / Company Registration / Renewal Certificate', 'Mandatory Disclosure', 'MCES/PTA/REG-104/2002', 'Govt of Kerala Sub-Registrar', '2029-12-31', '/documents/trust-registration.pdf', 2),
('Copy of No Objection Certificate (NOC) Issued by State Govt', 'Mandatory Disclosure', 'G.O.(MS) No. 142/2004/G.Edn', 'General Education Department, Govt of Kerala', '2030-05-31', '/documents/noc-kerala.pdf', 3),
('Copies of Recognition Certificate Under RTE Act, 2009', 'Mandatory Disclosure', 'B4/4590/2022/K.Dis', 'District Educational Officer, Adoor', '2027-05-31', '/documents/rte-recognition.pdf', 4),
('Copy of Valid Building Safety Certificate (National Building Code)', 'Safety & Fitness', 'AE/LSGD/ADR/FIT-2025/12', 'Assistant Executive Engineer, LSGD Section', '2027-04-30', '/documents/building-safety.pdf', 5),
('Copy of Valid Fire Safety Certificate Issued by Competent Authority', 'Safety & Fitness', 'F&RS/ADR/NOC/2025/08', 'Station Officer, Fire & Rescue Station, Adoor', '2026-06-30', '/documents/fire-safety.pdf', 6);

-- 15. COMPLAINTS & GRIEVANCE REDRESSAL CELL
CREATE TABLE IF NOT EXISTS `complaints_grievances` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ticket_no` VARCHAR(50) NOT NULL UNIQUE,
  `complainant_name` VARCHAR(150) NOT NULL,
  `user_type` ENUM('Parent', 'Student', 'Staff', 'Alumni', 'Other') NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `category` ENUM('Academics', 'Transport', 'Facilities', 'Safety_POCSO', 'Anti_Bullying', 'Fee', 'Other') NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('SUBMITTED', 'UNDER_INVESTIGATION', 'ACTION_TAKEN', 'RESOLVED') DEFAULT 'SUBMITTED',
  `resolution_notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. CONTACT US & ADMISSION ENQUIRIES
CREATE TABLE IF NOT EXISTS `contact_enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `inquiry_type` ENUM('Admission Enquiry', 'General Contact', 'Transfer Certificate', 'Career') DEFAULT 'General Contact',
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `grade_interested` VARCHAR(50) NULL,
  `subject` VARCHAR(200) NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('NEW', 'CONTACTED', 'CAMPUS_VISIT_SCHEDULED', 'CLOSED') DEFAULT 'NEW',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. HERO CAMPUS SLIDES
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `image_url` VARCHAR(500) NOT NULL,
  `title` VARCHAR(200) NOT NULL DEFAULT 'All Saints Public School Campus',
  `caption` VARCHAR(300) NULL,
  `display_order` INT NOT NULL DEFAULT 1,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `hero_slides` (`image_url`, `title`, `caption`, `display_order`) VALUES
('/images/home_slider/slider-1.jpg', 'All Saints Public School Campus', 'CBSE Affiliated (930501) · LKG to Class XII · Pannivizha, Adoor', 1),
('/images/home_slider/slider-2.jpg', 'Eco-Friendly Lush Green Grounds', 'Spacious Campus, Play Arenas & High-Tech Smart Classrooms', 2),
('/images/home_slider/slider-3.jpg', 'Nurturing Mind, Body & Spirit', 'To Create Creators · Holistic Academic & Moral Excellence', 3),
('/images/school_content/1773902398-126526803569bb9a3e60523_infra.jpg', 'State-of-the-Art Infrastructure', 'Future-Ready Learning with 100% CBSE Success Record', 4)
ON DUPLICATE KEY UPDATE `id`=`id`;
