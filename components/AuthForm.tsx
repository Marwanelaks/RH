import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Auth.module.css';
import { UserInput, LoginInput, ApiResponse } from '../types';

type AuthFormProps = {
  type: 'register' | 'login';
};

const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<UserInput>({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = type === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = type === 'register' ? formData : {
        email: formData.email,
        password: formData.password
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1>{type === 'register' ? 'Create Account' : 'Login'}</h1>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.authForm}>
        {type === 'register' && (
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          className={styles.submitButton}
        >
          {loading ? 'Processing...' : type === 'register' ? 'Register' : 'Login'}
        </button>
      </form>
      <div className={styles.authFooter}>
        {type === 'register' ? (
          <p>Already have an account? <a href="/login">Login</a></p>
        ) : (
          <p>Don't have an account? <a href="/register">Register</a></p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;