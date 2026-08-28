import type { Metadata } from 'next';
import LegalPageRenderer from '../_legal/LegalPageRenderer';

export const metadata: Metadata = {
  title: 'Return Policy',
  description: 'Knotty Affairs by Mridul return and refund policy.',
};

export default function Page() {
  return <LegalPageRenderer slug="return-policy" />;
}
