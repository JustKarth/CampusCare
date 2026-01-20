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

#4.a. update
UPDATE blog SET <column> = <data>, ... WHERE blog_id = <id> AND user_id = <id>;

#5.a. delete 
DELETE FROM blog WHERE blog_id = <id> AND user_id = <id>;

#6.a. verify ownership


--COMMENT MODEL------------------------------------
#1 FIND BY BLOG ID

SELECT comment_id, user_id, comment_content, created_at FROM blog_comments WHERE blog_id = <id>;

#2 create comment

INSERT INTO blog_comments (blog_id, user_id, comment_content) VALUES (<blog_id>, <userid>, <content>);

#3 delete comment

DELETE FROM blog_comments WHERE comment_id = <id> AND user_id = <id>;

#4 verify ownership


--REACTION MODEL-------------------------------------
#1 check if like exists

#2 add a like

INSERT INTO blog_likes (blog_id, user_id) VALUES (<blogid>, <userid>);

#3 remove a like
DELETE FROM blog_likes WHERE blog_id = <blogid> AND user_id = <userid>;

#4 get like count
SELECT COUNT(*) FROM blog_likes WHERE blog_id = <blog_id>;

--RESOURCE MODEL----------------------------------

#1 find by college id
SELECT * FROM academic_resources WHERE college_id = <id> LIMIT <limit> OFFSET <pageno-1>*<limit>;

#2 find by id
SELECT * FROM academic_resources WHERE resource_id = <id>;

#3 create 
INSERT INTO academic_resources (college_id, resource_title, resource_description, resource_link) VALUES (<title>, <description>, <link>);

#4 update

UPDATE academic_resources SET <col1> = <val1>,... WHERE resource_id = <id>;

#5 delete

DELETE FROM academic_resources where resource_id = <id>l

--Local Guide Model-------------------------------------

#1 fetching categories
