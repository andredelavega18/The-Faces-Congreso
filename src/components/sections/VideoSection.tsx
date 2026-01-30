import { Play } from 'lucide-react';

function getEmbedUrl(url: string): string | null {
    if (!url) return null;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        try {
            const parsed = new URL(url);
            const id = parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
            return id ? `https://www.youtube.com/embed/${id}` : null;
        } catch {
            return null;
        }
    }

    if (url.includes('vimeo.com')) {
        const id = url.split('/').pop();
        return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    return null;
}

interface VideoSectionProps {
    content: {
        title?: string;
        subtitle?: string;
        description?: string;
        videoUrl?: string;
        posterUrl?: string;
    };
}

export function VideoSection({ content }: VideoSectionProps) {
    const {
        title = 'VIDEO 1',
        videoUrl = 'https://bcwkitzndcbwnxidmxbx.supabase.co/storage/v1/object/public/videos/video-1.webm',
        posterUrl = '',
    } = content;

    const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null;

    return (
        <section id="video" className="relative">
            <div className="w-full">
                <div className="relative w-full overflow-hidden bg-black shadow-xl">
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="aspect-video w-full"
                        />
                    ) : videoUrl ? (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            poster={posterUrl}
                            preload="metadata"
                            className="aspect-video w-full bg-black"
                        >
                            <source src={videoUrl} />
                            <track kind="captions" src="data:text/vtt;charset=utf-8,WEBVTT" label="Español" default />
                        </video>
                    ) : (
                        <div className="flex aspect-video items-center justify-center text-neutral-400">
                            <Play className="h-12 w-12" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

