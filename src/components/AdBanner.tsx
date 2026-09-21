import React, { useEffect, useRef } from 'react';

type AdType = '300x250' | '320x50' | '160x300' | 'native';

interface AdBannerProps {
  type: AdType;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, className = '' }) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = bannerRef.current;
    if (!container) return;

    // Clear previous contents on remount
    container.innerHTML = '';

    if (type === 'native') {
      const targetDiv = document.createElement('div');
      targetDiv.id = 'container-adf1d50cd1319002190c9dc6c9d133f3';

      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl31364324.profitableratecpmnetwork.com/adf1d50cd1319002190c9dc6c9d133f3/invoke.js';

      container.appendChild(script);
      container.appendChild(targetDiv);
    } else {
      const config: { key: string; width: number; height: number } =
        type === '300x250'
          ? { key: '773d1a6e37eeb938c3325f27a2b91206', width: 300, height: 250 }
          : type === '320x50'
          ? { key: '34db237f9012c3029769b37c98642706', width: 320, height: 50 }
          : { key: '9a7ed2e908e0c4b97bb74df1a8481b96', width: 160, height: 300 };

      // Set global window.atOptions for Adsterra iframe invoke script
      (window as any).atOptions = {
        key: config.key,
        format: 'iframe',
        height: config.height,
        width: config.width,
        params: {},
      };

      const scriptConfig = document.createElement('script');
      scriptConfig.type = 'text/javascript';
      scriptConfig.text = `atOptions = ${JSON.stringify((window as any).atOptions)};`;

      const scriptInvoke = document.createElement('script');
      scriptInvoke.type = 'text/javascript';
      scriptInvoke.src = `https://www.highrevenueformat.com/${config.key}/invoke.js`;

      container.appendChild(scriptConfig);
      container.appendChild(scriptInvoke);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [type]);

  return (
    <div className={`flex flex-col items-center justify-center my-4 overflow-hidden rounded-xl border border-slate-800/60 bg-slate-950/40 p-2 text-center ${className}`}>
      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">SPONSORED ADVERT</span>
      <div ref={bannerRef} className="flex justify-center items-center max-w-full min-h-[50px]" />
    </div>
  );
};
