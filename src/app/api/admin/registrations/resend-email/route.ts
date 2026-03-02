import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mail';

export async function GET() {
    return NextResponse.json(
        { error: 'Usa POST para enviar correos' },
        { status: 405 }
    );
}

export async function POST(request: NextRequest) {
    try {
        const { registrationId } = await request.json();

        if (!registrationId) {
            return NextResponse.json({ error: 'ID de registro requerido' }, { status: 400 });
        }

        const registration = await prisma.registration.findUnique({
            where: { id: registrationId },
            include: { checkout: true },
        });

        if (!registration) {
            return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 });
        }

        const checkout = registration.checkout;
        const quantity = (registration.metadata as any)?.quantity || 1;
        const totalPrice = Number(registration.amountPaid || 0);

        const result = await sendEmail({
            to: registration.email,
            subject: `✅ Confirmación de compra – THE FACES 2026`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                        <tr>
                            <td align="center" style="padding: 40px 0;">
                                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                                    <tr>
                                        <td height="8" style="background: linear-gradient(90deg, #0d9488 0%, #2dd4bf 100%);"></td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 40px 50px;">
                                            <h1 style="margin: 0 0 20px 0; color: #01121d; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">¡Gracias por tu compra, ${registration.fullName.split(' ')[0]}!</h1>
                                            <p style="margin: 0; font-size: 16px; line-height: 24px; color: #475569;">Tu inscripción para el mayor congreso de inyectores está oficialmente confirmada. Estamos felices de que formes parte de <strong>THE FACES 2026</strong>.</p>
                                            
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 35px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                                                <tr>
                                                    <td style="padding: 25px;">
                                                        <h2 style="margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #0d9488; font-weight: 700;">Detalle de la compra</h2>
                                                        
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                            <tr>
                                                                <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #64748b; font-size: 14px;">Evento</td>
                                                                <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">THE FACES 2026</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #64748b; font-size: 14px;">Paquete</td>
                                                                <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">${checkout?.packageName || 'N/A'}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #64748b; font-size: 14px;">Entradas</td>
                                                                <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">${quantity}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Total Pagado</td>
                                                                <td style="padding: 8px 0; color: #0d9488; font-size: 18px; font-weight: 700; text-align: right;">${checkout?.currency || 'USD'} ${totalPrice.toFixed(2)}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>

                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 30px;">
                                                <tr>
                                                    <td style="padding: 20px; background-color: #f0fdfa; border-radius: 12px; border-left: 4px solid #0d9488;">
                                                        <p style="margin: 0; font-size: 14px; line-height: 22px; color: #134e4a;">
                                                            <strong>Próximos pasos:</strong> En las próximas horas recibirás un correo con las indicaciones de acceso y cronograma detallado.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>

                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 30px;">
                                                <tr>
                                                    <td style="color: #64748b; font-size: 13px;">
                                                        Fecha: ${new Date(registration.registeredAt).toLocaleString('es-PE', { timeZone: 'America/Lima', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}<br>
                                                        Código: <span style="font-family: monospace; color: #0f172a; font-weight: bold;">${registration.paymentId || registration.id.slice(0, 8)}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding: 30px 50px; background-color: #fafafa; border-top: 1px solid #f1f5f9; text-align: center;">
                                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #475569;">¿Tienes dudas? Escríbenos a:</p>
                                            <a href="mailto:info@thefacescongreso.com" style="display: inline-block; padding: 10px 20px; background-color: #ffffff; color: #0d9488; text-decoration: none; border: 1px solid #0d9488; border-radius: 8px; font-weight: 600; font-size: 14px;">info@thefacescongreso.com</a>
                                            <p style="margin: 20px 0 0 0; font-size: 12px; color: #94a3b8;">
                                                © 2026 THE FACES - Master Inyector<br>
                                                <a href="https://thefacescongreso.com" style="color: #94a3b8; text-decoration: none;">thefacescongreso.com</a>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
        });

        if (result.ok) {
            return NextResponse.json({ success: true, message: 'Correo enviado correctamente' });
        } else {
            console.error('Email send failed:', result.error);
            return NextResponse.json(
                { error: `Error al enviar: ${result.error instanceof Error ? result.error.message : String(result.error)}` },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error resending email:', error);
        return NextResponse.json(
            { error: `Error interno: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        );
    }
}
