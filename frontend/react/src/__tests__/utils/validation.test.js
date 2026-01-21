import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateNumber,
  validateRegistrationForm,
  validateBlogForm,
  validateCommentForm,
} from '../../utils/validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('validates correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('rejects invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('validates password with 6+ characters', () => {
      expect(validatePassword('password123')).toBe(true);
    });

    it('rejects short passwords', () => {
      expect(validatePassword('short')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('validates non-empty strings', () => {
      expect(validateRequired('test')).toBe(true);
    });

    it('rejects empty strings', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
    });
  });

  describe('validateNumber', () => {
    it('validates numbers within range', () => {
      expect(validateNumber('5', 1, 10)).toBe(true);
    });

    it('rejects numbers outside range', () => {
      expect(validateNumber('15', 1, 10)).toBe(false);
      expect(validateNumber('0', 1, 10)).toBe(false);
    });
  });

  describe('validateRegistrationForm', () => {
    it('validates correct registration data', () => {
      const formData = {
        email: 'test@example.com',
        password: 'password123',
        confirm_password: 'password123',
        reg_no: 'REG123',
        first_name: 'John',
        last_name: 'Doe',
        course_id: '1',
        graduation_year: '2025',
        date_of_birth: '2000-01-01',
      };
      const result = validateRegistrationForm(formData);
      expect(result.isValid).toBe(true);
    });

    it('rejects invalid registration data', () => {
      const formData = {
        email: 'invalid-email',
        password: 'short',
        confirm_password: 'different',
        reg_no: '',
        first_name: '',
        last_name: '',
        course_id: '0',
        graduation_year: '1999',
        date_of_birth: '',
      };
      const result = validateRegistrationForm(formData);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    });
  });

  describe('validateBlogForm', () => {
    it('validates correct blog data', () => {
      const result = validateBlogForm('Test Title', 'Test content');
      expect(result.isValid).toBe(true);
    });

    it('rejects empty title', () => {
      const result = validateBlogForm('', 'Content');
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });

    it('rejects title over 128 characters', () => {
      const longTitle = 'a'.repeat(129);
      const result = validateBlogForm(longTitle, 'Content');
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });
  });

  describe('validateCommentForm', () => {
    it('validates correct comment', () => {
      const result = validateCommentForm('This is a comment');
      expect(result.isValid).toBe(true);
    });

    it('rejects empty comment', () => {
      const result = validateCommentForm('');
      expect(result.isValid).toBe(false);
      expect(result.errors.content).toBeDefined();
    });

    it('rejects comment over 1000 characters', () => {
      const longComment = 'a'.repeat(1001);
      const result = validateCommentForm(longComment);
      expect(result.isValid).toBe(false);
      expect(result.errors.content).toBeDefined();
    });
  });
});
