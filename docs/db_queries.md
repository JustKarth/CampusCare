--USER MODEL-----------------------------------------------
#1 findByEmail
SELECT user_id FROM user_profiles WHERE email = <email>;

#2 findById
SELECT hashed_password FROM user_profiles WHERE user_id = <userid>;

#3 createUserId
INSERT INTO user_profiles (email, hashed_password, reg_no, first_name, last_name, college_id, course_id) VALUES (<email>, <pass>, <regno>, <firstname>, <lastname>, <collegeid>, <courseid>);

#4 update
UPDATE user_profiles SET <col1> = <val1>, <col2> = <val2> WHERE user_id = <userid>;

#5 findByIdWithDetails
SELECT is_moderator, is_admin, reg_no, email, avatar_id, date_of_birth, first_name, middle_name, last_name, college_id, course_id, graduation_year, native_state_id, native_city, created_at FROM user_profiles WHERE user_id = <userid>;

#6 findCollegeByEmailDomain
SELECT 