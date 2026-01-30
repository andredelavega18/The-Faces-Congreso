import { LoginForm } from './login-form';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <span className="font-bold text-lg">TF</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Bienvenido</h1>
                    <p className="text-sm text-muted-foreground">
                        Ingresa tus credenciales para acceder al panel.
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
