import Link from 'next/link';
import { ReactNode } from 'react';
import styles from '../styles/Auth.module.css';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <nav>
          <Link href="/" className={styles.logo}>Auth App</Link>
          <div className={styles.navLinks}>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </div>
        </nav>
      </header>
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Next.js Auth Demo</p>
      </footer>
    </div>
  );
};

export default Layout;