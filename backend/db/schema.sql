CREATE DATABASE IF NOT EXISTS campus_care;
USE campus_care;

CREATE TABLE avatars (
	avatar_id INT AUTO_INCREMENT PRIMARY KEY,
    avatar_url VARCHAR(2048) NOT NULL
);

CREATE TABLE states (
	state_id INT AUTO_INCREMENT PRIMARY KEY,
    state_name VARCHAR(50) NOT NULL
);

CREATE TABLE colleges (
	college_id INT AUTO_INCREMENT PRIMARY KEY,
    email_domain VARCHAR(255) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state_id INT NOT NULL,
    FOREIGN KEY (state_id) REFERENCES states(state_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE courses (
	course_id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    course_name VARCHAR(128) NOT NULL,
    UNIQUE KEY(course_id, college_id),
    FOREIGN KEY (college_id) REFERENCES colleges(college_id)
);

CREATE TABLE local_guide_categories(
	category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

CREATE TABLE user_profiles (
	user_id INT AUTO_INCREMENT PRIMARY KEY,
    is_moderator BOOLEAN DEFAULT 0,
    is_admin BOOLEAN DEFAULT 0,
    reg_no VARCHAR(50) NOT NULL,
    email VARCHAR(254) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    avatar_id INT DEFAULT 1,
    date_of_birth DATE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50),
    college_id INT NOT NULL,
    course_id INT NOT NULL,
    graduation_year INT NOT NULL,
    native_state_id INT,
    native_city VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id, college_id) REFERENCES courses(course_id, college_id),
    FOREIGN KEY (avatar_id) REFERENCES avatars(avatar_id),
    FOREIGN KEY (college_id) REFERENCES colleges(college_id),
    FOREIGN KEY (native_state_id) REFERENCES states(state_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE blog_images (
	blog_image_id INT AUTO_INCREMENT PRIMARY KEY,
    blog_image_url VARCHAR(2048) NOT NULL
);

CREATE TABLE blog (
	blog_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    college_id INT NOT NULL,
    blog_title VARCHAR(128) NOT NULL,
    blog_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id)
);

CREATE TABLE blog_specific_images (
	blog_id INT NOT NULL,
    blog_image_id INT NOT NULL,
    image_index TINYINT NOT NULL,
    PRIMARY KEY(blog_id, blog_image_id),
    FOREIGN KEY (blog_id) REFERENCES blog(blog_id) ON DELETE CASCADE,
    FOREIGN KEY (blog_image_id) REFERENCES blog_images(blog_image_id) ON DELETE CASCADE,
    UNIQUE(blog_id, image_index)
);

CREATE TABLE blog_comments (
	comment_id INT AUTO_INCREMENT PRIMARY KEY,
    blog_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blog_id) REFERENCES blog(blog_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

CREATE TABLE blog_likes (
	blog_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (blog_id) REFERENCES blog(blog_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    PRIMARY KEY (blog_id, user_id)
);

CREATE TABLE academic_resources (
	resource_id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    resource_title VARCHAR(255) NOT NULL,
    resource_description TEXT,
    resource_link VARCHAR(2048) NOT NULL,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id)
);

CREATE TABLE places (
	place_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    college_id INT NOT NULL,
    place_name VARCHAR(255) NOT NULL,
    place_description TEXT,
    address VARCHAR(255),
    distance DECIMAL(6, 2),
    website VARCHAR(2048),
    phone VARCHAR(20),
    FOREIGN KEY (category_id) REFERENCES local_guide_categories(category_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id)
);

CREATE TABLE place_rating(
	place_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    PRIMARY KEY(place_id, user_id)
);