import { prisma } from '@/lib/prisma';
import { Fragment } from 'react';
import { FloatingActions } from '@/components/FloatingActions';
import {
    MethodologySection,
    VideoSection,
    SpeakersSection,
    FoundersSection,
    TicketsSection,
    AboutSection,
    AdditionalInfoSection,
    InstagramSection,
    VenueSection,
    LaboratoriesSection,
    HeroBanner,
    IntroCard,
} from '@/components/sections';
import { Footer } from '@/components/layout/Footer';

async function getSiteData() {
    const [siteConfig, speakers, checkouts, sections, companyAssets] = await Promise.all([
        prisma.siteConfig.findMany(),
        prisma.speaker.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
        }),
        prisma.checkoutConfig.findMany({
            where: { isActive: true },
            orderBy: [{ packageType: 'asc' }, { price: 'desc' }],
        }),
        prisma.eventSection.findMany({
            where: { isVisible: true },
            orderBy: { displayOrder: 'asc' },
        }),
        prisma.mediaAsset.findMany({
            where: {
                assetType: 'image',
                assetCategory: 'sponsors',
            },
            orderBy: { createdAt: 'desc' },
            select: { fileUrl: true, fileName: true },
        }),
    ]);

    // Convert config array to object
    const config: Record<string, unknown> = {};
    siteConfig.forEach((item) => {
        config[item.key] = item.value;
    });

    // Convert sections array to ordered list with content
    const sectionsList = sections.map((section) => ({
        key: section.sectionKey,
        name: section.sectionName,
        content: section.content as Record<string, unknown>,
        order: section.displayOrder,
    }));

    // Serialize checkouts to plain objects for client components
    const serializedCheckouts = checkouts.map((checkout) => ({
        ...checkout,
        price: checkout.price.toNumber(),
    }));

    return { config, speakers, checkouts: serializedCheckouts, sections: sectionsList, companyAssets };
}

// Component mapping for dynamic rendering
function renderSection(
    sectionKey: string,
    content: Record<string, unknown>,
    data: {
        speakers: Awaited<ReturnType<typeof getSiteData>>['speakers'];
        checkouts: Awaited<ReturnType<typeof getSiteData>>['checkouts'];
        config: Record<string, unknown>;
        companyAssets: Awaited<ReturnType<typeof getSiteData>>['companyAssets'];
    }
) {
    const eventDate = (data.config.event_date as string) || '5 y 6 de junio de 2026';
    const eventLocation = (data.config.event_location as string) || 'Convention Center - Hotel Westin - Lima - Perú';

    switch (sectionKey) {
        case 'hero':
            return (
                <Fragment key="hero">
                    <HeroBanner
                        title={content.title as string}
                        date={eventDate}
                        location={eventLocation}
                        tagline={content.tagline as string}
                    />
                    <section className="w-full bg-slate-50">
                        <IntroCard
                            description={content.subtitle as string}
                        />
                    </section>
                </Fragment>
            );
        case 'speakers':
            return (
                <SpeakersSection
                    key="speakers"
                    content={content}
                    speakers={data.speakers as any}
                />
            );

        case 'founders':
            return <FoundersSection key="founders" content={content} />;
        case 'methodology':
            return <MethodologySection key="methodology" content={content} />;
        case 'video':
            return <VideoSection key="video" content={content} />;
        case 'intro':
            return <MethodologySection key="methodology" content={content} />;

        case 'tickets':
            return (
                <TicketsSection
                    key="tickets"
                    content={content}
                    checkouts={data.checkouts as any}
                />
            );
        case 'about':
            return <AboutSection key="about" content={content} />;
        case 'instagram':
            return <InstagramSection key="instagram" content={content} />;
        case 'additional':
            return <AdditionalInfoSection key="additional" content={content} />;
        case 'venue':
            return <VenueSection key="venue" content={content} />;
        case 'labs':
            return <LaboratoriesSection key="labs" content={content} assets={data.companyAssets as any} />;
        case 'contact':
        case 'footer':
            return (
                <Footer
                    key="footer"
                    content={content}
                />
            );
        default:
            return null;
    }
}

// Define the strict order of sections
const SECTION_ORDER = [
    'hero',
    'video',
    'methodology', // Previously 'intro' in some contexts
    'tickets',
    'speakers',
    'labs',
    'instagram',
    'about', // Quienes Somos
    'founders',
    'additional', // Benefits / Additional Info
    'venue',
    'footer'
] as const;

export default async function HomePage() {
    const { config, speakers, checkouts, sections, companyAssets } = await getSiteData();

    // Create a map for quick access to dynamic content from DB
    const dbSectionsMap = new Map(sections.map(s => [s.key, s]));

    // Build the final list of sections based on SECTION_ORDER
    // This ensures:
    // 1. Correct order always
    // 2. All core sections are present (falling back to default content if not in DB)
    const sortedSections = SECTION_ORDER.map(key => {
        const dbSection = dbSectionsMap.get(key);

        // Use DB content if available, otherwise empty object for default internal props
        return {
            key,
            content: dbSection?.content || {},
            // We ignore dbSection.order because SECTION_ORDER is the master truth now
        };
    });

    const contactSection = sections.find((s) => s.key === 'contact' || s.key === 'footer');
    const whatsapp = ((contactSection?.content as any)?.whatsapp as string) || '51954723998';

    return (
        <>
            <main className="min-h-screen bg-background relative">
                {sortedSections.map((section) => {
                    // Skip footer in the main loop if we want to render it explicitly at the end,
                    // but renderSection handles usage of 'footer' key.
                    // However, our design often puts footer outside the loop or as the last item.
                    // Given renderSection handles 'footer', we can leave it here.
                    if (section.key === 'footer') return null;

                    return renderSection(section.key, section.content, {
                        speakers,
                        checkouts,
                        config,
                        companyAssets,
                    });
                })}

                {/* Explicitly render Footer at the end to ensure it's always there */}
                <Footer
                    content={dbSectionsMap.get('footer')?.content || dbSectionsMap.get('contact')?.content || {}}
                />
            </main>
            <FloatingActions whatsapp={whatsapp} />
        </>
    );
}
