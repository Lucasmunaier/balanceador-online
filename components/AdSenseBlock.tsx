import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseBlockProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
}

const AdSenseBlock: React.FC<AdSenseBlockProps> = ({
  adSlot,
  adFormat = 'auto',
  style = { display: 'block' },
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div style={{ minWidth: '250px', minHeight: '100px', textAlign: 'center' }}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-2675104243806210"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdSenseBlock;