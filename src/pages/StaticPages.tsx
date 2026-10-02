import React from 'react';
import { AboutSection } from '../components/home/AboutSection.tsx';
import { DeliverySection } from '../components/home/DeliverySection.tsx';
import { ContactSection } from '../components/home/ContactSection.tsx';
import { Benefits } from '../components/home/Benefits.tsx';

export const AboutPage: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="py-8 space-y-6">
      <AboutSection onLearnMore={() => onNavigate('products')} />
      <Benefits />
    </div>
  );
};

export const DeliveryPage: React.FC = () => {
  return (
    <div className="py-8 space-y-6">
      <DeliverySection />
      <Benefits />
    </div>
  );
};

export const ContactPage: React.FC = () => {
  return (
    <div className="py-8">
      <ContactSection />
    </div>
  );
};
