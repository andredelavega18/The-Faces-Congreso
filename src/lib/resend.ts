
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface PurchaseDetails {
    customerName: string;
    customerEmail: string;
    packageName: string;
    quantity: number;
    amount: number;
    currency: string;
    ticketId: string;
}

export async function sendPurchaseConfirmation(details: PurchaseDetails) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set. Skipping email sending.');
        return;
    }

    try {
        const { customerName, customerEmail, packageName, quantity, amount, currency, ticketId } = details;

        const data = await resend.emails.send({
            from: 'The Faces Congreso <onboarding@resend.dev>', // Usar dominio verificado en producción
            to: [customerEmail],
            subject: `Confirmación de compra - ${packageName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h1 style="color: #000;">¡Gracias por tu compra, ${customerName}!</h1>
                    <p>Hemos recibido tu pago correctamente. Aquí están los detalles de tu inscripción:</p>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h2 style="margin-top: 0; font-size: 18px;">Detalles del Pedido</h2>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 10px;"><strong>Paquete:</strong> ${packageName}</li>
                            <li style="margin-bottom: 10px;"><strong>Cantidad:</strong> ${quantity}</li>
                            <li style="margin-bottom: 10px;"><strong>Total Pagado:</strong> ${currency} ${amount.toFixed(2)}</li>
                            <li style="margin-bottom: 10px;"><strong>ID de Registro:</strong> ${ticketId}</li>
                        </ul>
                    </div>

                    <p>Nos pondremos en contacto contigo pronto para coordinar los detalles adicionales de tu asistencia.</p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                    
                    <p style="font-size: 12px; color: #888;">Si tienes alguna pregunta, responde a este correo o contáctanos a través de nuestros canales oficiales.</p>
                </div>
            `,
        });

        console.log('Email sent successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}
