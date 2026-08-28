import type { Metadata } from 'next';
import LegalPageRenderer from '../_legal/LegalPageRenderer';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using Knotty Affairs by Mridul.',
};

export default function Page() {
  return <LegalPageRenderer slug="terms-and-conditions" />;
}
