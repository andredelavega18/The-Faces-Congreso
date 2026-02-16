'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
    interface Window {
        fbq: (...args: unknown[]) => void;
    }
}

export function FacebookPixel() {
    const pathname = usePathname();

    useEffect(() => {
        // Fire PageView on every route change
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'PageView');
        }

        // Fire InitiateCheckout when visiting checkout pages
        if (pathname?.startsWith('/checkout')) {
            if (typeof window !== 'undefined' && window.fbq) {
                window.fbq('track', 'InitiateCheckout');
            }
        }
    }, [pathname]);

    return (
        <>
            <Script id="facebook-pixel" strategy="afterInteractive">
                {`
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
                    s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '1546145490022800');
                    fbq('track', 'PageView');
                `}
            </Script>
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src="https://www.facebook.com/tr?id=1546145490022800&ev=PageView&noscript=1"
                    alt=""
                />
            </noscript>
        </>
    );
}
