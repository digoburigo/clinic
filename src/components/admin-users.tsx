
'use client';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table';
import { cn } from '~/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
    Calendar as CalendarIcon,
    Loader2,
    Plus,
    RefreshCw,
    Trash,
    UserCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '~/lib/auth-client';

export function AdminUsers() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        name: '',
        role: 'user' as const,
    });
    const [isLoading, setIsLoading] = useState<string | undefined>();
    const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
    const [banForm, setBanForm] = useState({
        userId: '',
        reason: '',
        expirationDate: undefined as Date | undefined,
    });

    const { data: users, isLoading: isUsersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const data = await authClient.admin.listUsers(
                {
                    query: {
                        limit: 10,
                        sortBy: 'createdAt',
                        sortDirection: 'desc',
                    },
                },
                {
                    throw: true,
                }
            );
            return data?.users || [];
        },
    });

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading('create');
        try {
            await authClient.admin.createUser({
                email: newUser.email,
                password: newUser.password,
                name: newUser.name,
                role: newUser.role,
            });
            toast.success('Usuário criado com sucesso');
            setNewUser({ email: '', password: '', name: '', role: 'user' });
            setIsDialogOpen(false);
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
        } catch (error: any) {
            toast.error(error.message || 'Falha ao criar usuário');
        } finally {
            setIsLoading(undefined);
        }
    };

    const handleDeleteUser = async (id: string) => {
        setIsLoading(`delete-${id}`);
        try {
            await authClient.admin.removeUser({ userId: id });
            toast.success('Usuário deletado com sucesso');
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
        } catch (error: any) {
            toast.error(error.message || 'Falha ao deletar usuário');
        } finally {
            setIsLoading(undefined);
        }
    };

    const handleRevokeSessions = async (id: string) => {
        setIsLoading(`revoke-${id}`);
        try {
            await authClient.admin.revokeUserSessions({ userId: id });
            toast.success('Sessões revogadas para o usuário');
        } catch (error: any) {
            toast.error(error.message || 'Falha ao revogar sessões');
        } finally {
            setIsLoading(undefined);
        }
    };

    const handleImpersonateUser = async (id: string) => {
        setIsLoading(`impersonate-${id}`);
        try {
            await authClient.admin.impersonateUser({ userId: id });
            toast.success('Usuário imitato com sucesso');
            router.push('/');
        } catch (error: any) {
            toast.error(error.message || 'Falha ao imitar usuário');
        } finally {
            setIsLoading(undefined);
        }
    };

    const handleBanUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(`ban-${banForm.userId}`);
        try {
            if (!banForm.expirationDate) {
                throw new Error('Data de expiração é obrigatória');
            }
            await authClient.admin.banUser({
                userId: banForm.userId,
                banReason: banForm.reason,
                banExpiresIn:
                    banForm.expirationDate.getTime() - new Date().getTime(),
            });
            toast.success('Usuário banido com sucesso');
            setIsBanDialogOpen(false);
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
        } catch (error: any) {
            toast.error(error.message || 'Falha ao banir usuário');
        } finally {
            setIsLoading(undefined);
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl">Usuários</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                Criar Usuário
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Criar Novo Usuário</DialogTitle>
                            </DialogHeader>
                            <form
                                onSubmit={handleCreateUser}
                                className="space-y-4"
                            >
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) =>
                                            setNewUser({
                                                ...newUser,
                                                email: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password">Senha</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) =>
                                            setNewUser({
                                                ...newUser,
                                                password: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                        id="name"
                                        value={newUser.name}
                                        onChange={(e) =>
                                            setNewUser({
                                                ...newUser,
                                                name: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="role">Função</Label>
                                    <Select
                                        value={newUser.role}
                                        onValueChange={(
                                            value: 'admin' | 'user'
                                        ) =>
                                            setNewUser({
                                                ...newUser,
                                                role: value as 'user',
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a função" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">
                                                Administrador
                                            </SelectItem>
                                            <SelectItem value="user">
                                                Usuário
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading === 'create'}
                                >
                                    {isLoading === 'create' ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Criando...
                                        </>
                                    ) : (
                                        'Criar Usuário'
                                    )}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <Dialog
                        open={isBanDialogOpen}
                        onOpenChange={setIsBanDialogOpen}
                    >
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Banir Usuário</DialogTitle>
                            </DialogHeader>
                            <form
                                onSubmit={handleBanUser}
                                className="space-y-4"
                            >
                                <div>
                                    <Label htmlFor="reason">Motivo</Label>
                                    <Input
                                        id="reason"
                                        value={banForm.reason}
                                        onChange={(e) =>
                                            setBanForm({
                                                ...banForm,
                                                reason: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="expirationDate">
                                        Data de Expiração
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="expirationDate"
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full justify-start text-left font-normal',
                                                    !banForm.expirationDate &&
                                                        'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {banForm.expirationDate ? (
                                                    format(
                                                        banForm.expirationDate,
                                                        'PPP'
                                                    )
                                                ) : (
                                                    <span>Selecione uma data</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    banForm.expirationDate
                                                }
                                                onSelect={(date) =>
                                                    setBanForm({
                                                        ...banForm,
                                                        expirationDate: date,
                                                    })
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        isLoading === `ban-${banForm.userId}`
                                    }
                                >
                                    {isLoading === `ban-${banForm.userId}` ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Banindo...
                                        </>
                                    ) : (
                                        'Banir Usuário'
                                    )}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {isUsersLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Função</TableHead>
                                    <TableHead>Banido</TableHead>
                                    <TableHead>Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users?.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>
                                            {user.role || 'user'}
                                        </TableCell>
                                        <TableCell>
                                            {user.banned ? (
                                                <Badge variant="destructive">
                                                    Yes
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">
                                                    No
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteUser(
                                                            user.id
                                                        )
                                                    }
                                                    disabled={isLoading?.startsWith(
                                                        'delete'
                                                    )}
                                                >
                                                    {isLoading ===
                                                    `delete-${user.id}` ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleRevokeSessions(
                                                            user.id
                                                        )
                                                    }
                                                    disabled={isLoading?.startsWith(
                                                        'revoke'
                                                    )}
                                                >
                                                    {isLoading ===
                                                    `revoke-${user.id}` ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <RefreshCw className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleImpersonateUser(
                                                            user.id
                                                        )
                                                    }
                                                    disabled={isLoading?.startsWith(
                                                        'impersonate'
                                                    )}
                                                >
                                                    {isLoading ===
                                                    `impersonate-${user.id}` ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <UserCircle className="h-4 w-4 mr-2" />
                                                            Impersonate
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={async () => {
                                                        setBanForm({
                                                            userId: user.id,
                                                            reason: '',
                                                            expirationDate:
                                                                undefined,
                                                        });
                                                        if (user.banned) {
                                                            setIsLoading(
                                                                `ban-${user.id}`
                                                            );
                                                            await authClient.admin.unbanUser(
                                                                {
                                                                    userId: user.id,
                                                                },
                                                                {
                                                                    onError(
                                                                        context
                                                                    ) {
                                                                        toast.error(
                                                                            context
                                                                                .error
                                                                                .message ||
                                                                                'Failed to unban user'
                                                                        );
                                                                        setIsLoading(
                                                                            undefined
                                                                        );
                                                                    },
                                                                    onSuccess() {
                                                                        queryClient.invalidateQueries(
                                                                            {
                                                                                queryKey:
                                                                                    [
                                                                                        'users',
                                                                                    ],
                                                                            }
                                                                        );
                                                                        toast.success(
                                                                            'User unbanned successfully'
                                                                        );
                                                                    },
                                                                }
                                                            );
                                                            queryClient.invalidateQueries(
                                                                {
                                                                    queryKey: [
                                                                        'users',
                                                                    ],
                                                                }
                                                            );
                                                        } else {
                                                            setIsBanDialogOpen(
                                                                true
                                                            );
                                                        }
                                                    }}
                                                    disabled={isLoading?.startsWith(
                                                        'ban'
                                                    )}
                                                >
                                                    {isLoading ===
                                                    `ban-${user.id}` ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : user.banned ? (
                                                        'Unban'
                                                    ) : (
                                                        'Ban'
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
