import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (contentRef.current) {
      const children = Array.from(contentRef.current.children);
      children.forEach((child, index) => {
        const element = child as HTMLElement;
        element.style.animationDelay = `${index * 100}ms`;
        element.classList.add('page-content');
      });
    }

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((element) => {
      element.classList.remove('visible');
    });
  }, [location.pathname]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      revealElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [location.pathname]);

  return (
    <div className="page-enter">
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
