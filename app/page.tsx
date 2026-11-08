import React from 'react';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Screenshots } from '@/components/Screenshots';
import { Docs } from '@/components/Docs';
import { License } from '@/components/License';
import { Pricing } from '@/components/Pricing';
import { Faq } from '@/components/Faq';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Screenshots />
      <Docs />
      <License />
      <Pricing />
      <Faq />
    </>
  );
}
