import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import styles from '../styles/Auth.module.css';
import { ApiResponse, TokenPayload } from '../types';

const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ id: number } | null>(null);
  const [protectedData, setProtectedData] = useState<{ userId: number; message: string } | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/protected', {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Not authenticated');
        }

        const data: ApiResponse<{ userId: number }> = await res.json();
        
        if (!data.data) {
          throw new Error('No data received');
        }

        setProtectedData({
          userId: data.data.userId,
          message: 'Welcome to your dashboard!'
        });
        setUser({ id: data.data.userId });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
        router.push('/login');
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        router.push('/login');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className={styles.authContainer}>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.dashboard}>
        <div className={styles.dashboardHeader}>
          <h1>Dashboard</h1>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.protectedContent}>
          <h2>Protected Content</h2>
          {protectedData && (
            <div>
              <p>User ID: {protectedData.userId}</p>
              <p>Message: {protectedData.message}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;