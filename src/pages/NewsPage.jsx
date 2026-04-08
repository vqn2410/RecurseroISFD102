import React from 'react';
import NewsSection from '../components/NewsSection';
import { LandingFooter } from '../components/LandingUI';

const NewsPage = () => {
    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', minHeight: '80vh' }}>
            <div style={{ marginBottom: '4rem' }}>
                <NewsSection />
            </div>
            <LandingFooter />
        </div>
    );
};

export default NewsPage;
