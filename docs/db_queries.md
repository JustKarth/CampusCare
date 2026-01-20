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
SELECT college_id, college_name, city, state_id FROM colleges WHERE email_domain = <domain>;

--BLOG MODEL--------------------------

NOTE : THIS SECTION WILL HAVE TWO QUERIES PER FUNCTION, ONE FOR BLOG THE OTHER FOR IMAGES

#1.a. findAll
SELECT blog_id, user_id, blog_title, blog_content, created_at FROM blog WHERE college_id = <id> ORDER BY created_at DESC;

#2.a. findById
SELECT user_id, college_id, blog_title, blog_content, create_at FROM blog WHERE blog_id = <id>;

#3.a. create (for blog content)
INSERT INTO blog (user_id, college_id, blog_title, blog_content, created_at) VALUES (<userid>, <collegeid>, <blog_title>, <blog_content>, <created_at>)