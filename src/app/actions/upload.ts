'use server';

import { supabaseAdmin } from '@/lib/supabase/server';

export async function uploadTicketImage(formData: FormData) {
    const file = formData.get('file') as File;

    if (!file) {
        return { error: 'No se encontró el archivo' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `ticket-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        const { error } = await supabaseAdmin.storage
            .from('tickets')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            return { error: `Error Supabase: ${error.message}` };
        }

        const { data } = supabaseAdmin.storage
            .from('tickets')
            .getPublicUrl(fileName);

        return { url: data.publicUrl };
    } catch (error) {
        console.error('Server upload error:', error);
        return { error: 'Error interno al subir imagen' };
    }
}
