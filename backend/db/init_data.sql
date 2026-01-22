<<<<<<< HEAD
USE campus_care;
=======
/*USE campus_care;*/
>>>>>>> main

/*
INSERT INTO avatars (avatar_url) VALUES 
('<path>');

INSERT INTO local_guide_categories (category_name) VALUES
('<category_name>');

INSERT INTO academic_resources (college_id, resource_title, resource_description, resource_link) VALUES
(1, '<title>', '<description>', '<link>');

INSERT INTO places (category_id, college_id, place_name, place_description, address, distance, website, phone) VALUES
(<category_id>, 1, <name>, <description>, <address>, <distance>, <website>, <phone>);
*/ 

-- Minimum required reference data (safe to re-run)
-- Default avatar: user_profiles.avatar_id defaults to 1 and is a foreign key
INSERT INTO avatars (avatar_id, avatar_url)
SELECT 1, 'https://example.com/default-avatar.png'
WHERE NOT EXISTS (SELECT 1 FROM avatars WHERE avatar_id = 1);

-- Local guide categories used by routes like /api/local-guide/places/:category
INSERT INTO local_guide_categories (category_name)
SELECT 'healthcare'
WHERE NOT EXISTS (SELECT 1 FROM local_guide_categories WHERE category_name = 'healthcare');

INSERT INTO local_guide_categories (category_name)
SELECT 'tech'
WHERE NOT EXISTS (SELECT 1 FROM local_guide_categories WHERE category_name = 'tech');

INSERT INTO local_guide_categories (category_name)
SELECT 'clothing'
WHERE NOT EXISTS (SELECT 1 FROM local_guide_categories WHERE category_name = 'clothing');

INSERT INTO local_guide_categories (category_name)
SELECT 'food'
WHERE NOT EXISTS (SELECT 1 FROM local_guide_categories WHERE category_name = 'food');

INSERT INTO local_guide_categories (category_name)
SELECT 'logistics'
WHERE NOT EXISTS (SELECT 1 FROM local_guide_categories WHERE category_name = 'logistics');

INSERT INTO states (state_name) VALUES
('Andhra Pradesh'),
('Arunachal Pradesh'),
('Assam'),
('Bihar'),
('Chattisgarh'),
('Goa'),
('Gujrat'),
('Haryana'),
('Himachal Pradesh'),
('Jharkhand'),
('Karnataka'),
('Kerala'),
('Madhya Pradesh'),
('Maharashtra'),
('Manipur'),
('Meghalaya'),
('Mizoram'),
('Nagaland'),
('Odisha'),
('Punjab'),
('Rajasthan'),
('Sikkim'),
('Tamil Nadu'),
('Telangana'),
('Tripura'),
('Uttar Pradesh'),
('Uttarakhand'),
('West Bengal'),
('UT : Andaman and Nicobar Islands'),
('UT : Chandigarh'),
('UT : Dadra and Nagar Haveli and Daman and Diu'),
('UT : Delhi(NCT)'),
('UT : Jammu and Kashmir'),
('UT : Ladakh'),
('UT : Lakshadweep'),
('UT : Puducherry');

-- Email domain should be stored without '@' (backend matches both, but this is the clean format)
INSERT INTO colleges (college_id, email_domain, college_name, city, state_id) VALUES (1, 'mnnit.ac.in', 'Motilal Nehru National Institute of Technology Allahabad', 'Prayagraj', 26);

INSERT INTO courses (college_id, course_name) VALUES
(1, 'B.Tech. in Computer Science and Engineering'),
(1, 'B.Tech. in Electronics and Communication Engineering'),
(1, 'B.Tech. in Electrical Engineering'),
(1, 'B.Tech. in Mechanical Engineering'),
(1, 'B.Tech. in Chemical Engineering'),
(1, 'B.Tech. in Civil Engineering'),
(1, 'B.Tech. in Bio Technology'),
(1, 'B.Tech. in Materials Engineering'),
(1, 'B.Tech. in Production and Industrial Engineering');