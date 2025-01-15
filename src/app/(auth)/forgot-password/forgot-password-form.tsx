'use client';

import { Alert, AlertDescription } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { authClient } from '~/lib/auth-client';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function ForgotPasswordForm(props: { email?: string }) {
    const [email, setEmail] = useState(props.email || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const res = await authClient.forgetPassword({
                email,
                redirectTo: '/reset-password',
            });
            setIsSubmitted(true);
        } catch (err) {
            setError('Ocorreu um erro. Por favor, tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <main className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Verifique seu email</CardTitle>
                        <CardDescription>
                            Enviamos um link para redefinir sua senha para o seu
                            email.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>
                                Se você não receber o email, verifique sua caixa
                                de spam.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setIsSubmitted(false)}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o
                            login
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Esqueci minha senha</CardTitle>
                    <CardDescription>
                        Você receberá um email com instruções para redefinir sua
                        senha
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {error && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button
                            className="w-full mt-4"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/login">
                        <Button variant="link" className="px-0">
                            Voltar para o login
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </main>
    );
}