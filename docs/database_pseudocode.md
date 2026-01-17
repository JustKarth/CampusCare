Fields to be filled during sign up



E-mail ID (Mandatory)

Password (Mandatory)

Confirm Password (frontend) (Mandatory)

DOB (Mandatory)

First Name (Mandatory)

Middle Name (optional)

Last Name (optional)

College Name (Auto-Filled based on email id?) (Mandatory)

Graduation Year (Auto-Filled based on email id? Depends on how .ac.in emails are in general) (Mandatory)

Native State (optional)

Native City (optional)



---



# DATABASE



--avatars Table------------------------------------------------------

avatar_id		INT		PRIMARY KEY	AUTO_INCREMENT

avatar_url		VARCHAR(2048)	NOT NULL



--states Table-------------------------------------------------------

state_id		INT		PRIMARY KEY	AUTO_INCREMENT

state_name		VARCHAR(50)		NOT NULL



--colleges Table-----------------------------------------------------

college_id		INT		PRIMARY KEY	AUTO_INCREMENT

email_domain		VARCHAR(255)	NOT NULL

college_name		VARCHAR(255)	NOT NULL

city			VARCHAR(50)	NOT NULL

state_id		INT		FOREIGN KEY	NOT NULL



--courses Table------------------------------------------------------

course_id		INT		PRIMARY KEY	AUTO_INCREMENT

college_id		INT		FOREIGN KEY	NOT NULL		

course_name		VARCHAR(128)	NOT NULL

UNIQUE KEY(course_id, college_id)



--local_guide_categories Table---------------------------------------

category_id		INT		PRIMARY KEY	AUTO_INCREMENT

category_name		VARCHAR(100)	NOT NULL



--user_profiles Table------------------------------------------------

user_id			INT		PRIMARY KEY	AUTO_INCREMENT

is_moderator		BOOLEAN		DEFAULT 0

is_admin		BOOLEAN		DEFAULT 0

reg_no			VARCHAR(50)	NOT NULL

email 			VARCHAR(254)	NOT NULL

hashed_password 	VARCHAR(255)	NOT NULL

avatar_id		INT		FOREIGN KEY	DEFAULT 1

date_of_birth 		DATE 		NOT NULL

first_name 		VARCHAR(50)	NOT NULL

middle_name		VARCHAR(50)

last_name 		VARCHAR(50)

college_id		INT		FOREIGN KEY	NOT NULL--|

&nbsp;			        					  |--Composite Foreign Key

course_id		INT		FOREIGN KEY	NOT NULL--|

graduation_year 	INT		NOT NULL

native_state_id		INT		FOREIGN KEY

native_city		VARCHAR(50)

created_at		TIMESTAMP	DEFAULT CURRENT_TIMESTAMP



--blog_images Table--------------------------------------------------

blog_image_id		INT		PRIMARY KEY	AUTO_INCREMENT

blog_image_url		VARCHAR(2048)	NOT NULL



--blog Table---------------------------------------------------------

blog_id			INT 		PRIMARY KEY	AUTO_INCREMENT

user_id			INT		FOREIGN KEY	NOT NULL

college_id		INT		FOREIGN KEY 	NOT NULL 

blog_title		VARCHAR(128)	NOT NULL

blog_content		TEXT		NOT NULL

created_at		TIMESTAMP	DEFAULT CURRENT_TIMESTAMP



--blog_specific_images Table------------------------------------------

blog_id			INT		FOREIGN KEY	NOT NULL

blog_image_id		INT		FOREIGN KEY	NOT NULL

image_index		TINYINT		NOT NULL

PRIMARY KEY(blog_id, blog_image_id),

UNIQUE(blog_id, image_index)



--blog_comments Table-------------------------------------------------

comment_id		INT		PRIMARY KEY	AUTO_INCREMENT

blog_id			INT		FOREIGN KEY	NOT NULL

user_id			INT		FOREIGN KEY	NOT NULL

comment_content		TEXT		NOT NULL

created_at		TIMESTAMP	DEFAULT CURRENT_TIMESTAMP



--blog_likes Table----------------------------------------------------

blog_id			INT		FOREIGN KEY	NOT NULL

user_id			INT		FOREIGN KEY	NOT NULL

PRIMARY KEY(blog_id, user_id)



--academic_resources Table--------------------------------------------

resource_id		INT		PRIMARY KEY	AUTO_INCREMENT

college_id		INT		FOREIGN KEY	NOT NULL

resource_title		VARCHAR(255)	NOT NULL

resource_description	TEXT

resource_link		VARCHAR(2048)	NOT NULL



--places Table--------------------------------------------------------

place_id		INT		PRIMARY KEY	AUTO_INCREMENT

category_id		INT		FOREIGN KEY	NOT NULL

college_id		INT		FOREIGN KEY	NOT NULL

place_name		VARCHAR(255)	NOT NULL

place_description	TEXT

address			VARCHAR(255)

distance		DECIMAL(6, 2)

website			VARCHAR(2048)

phone			VARCHAR(20)



--place_rating-------------------------------------------------------

place_id		INT		FOREIGN KEY	NOT NULL

user_id			INT		FOREIGN KEY	NOT NULL

rating			TINYINT		NOT NULL	CHECK (rating BETWEEN 1 AND 5)

PRIMARY KEY(place_id, user_id)
