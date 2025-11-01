import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VS Code Chat Integration',
  description: 'Demo chat UI and API for VS Code integration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1>VS Code Chat Integration</h1>
            <p className="subtitle">Web service + UI to integrate with VS Code chat clients</p>
          </header>
          <main>{children}</main>
          <footer className="footer">? {new Date().getFullYear()} VS Code Chat Integration</footer>
        </div>
      </body>
    </html>
  );
}
