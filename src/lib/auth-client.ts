import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "~/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [organizationClient(), adminClient()],
});

type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    {
      pt: string;
    }
  >
>;

const errorCodes = {
  USER_ALREADY_EXISTS: {
    pt: "Usuário já registrado",
  },
  ACCOUNT_NOT_FOUND: {
    pt: "Conta não encontrada",
  },
  USER_NOT_FOUND: {
    pt: "Usuário não encontrado",
  },
  CREDENTIAL_ACCOUNT_NOT_FOUND: {
    pt: "Credenciais não encontradas",
  },
  EMAIL_CAN_NOT_BE_UPDATED: {
    pt: "Email não pode ser atualizado",
  },
  EMAIL_NOT_VERIFIED: {
    pt: "Email não verificado",
  },
  FAILED_TO_CREATE_SESSION: {
    pt: "Falha ao criar sessão",
  },
  FAILED_TO_CREATE_USER: {
    pt: "Falha ao criar usuário",
  },
  FAILED_TO_GET_SESSION: {
    pt: "Falha ao obter sessão",
  },
  FAILED_TO_GET_USER_INFO: {
    pt: "Falha ao obter informações do usuário",
  },
  FAILED_TO_UNLINK_LAST_ACCOUNT: {
    pt: "Falha ao desvincular a última conta",
  },
  FAILED_TO_UPDATE_USER: {
    pt: "Falha ao atualizar usuário",
  },
  ID_TOKEN_NOT_SUPPORTED: {
    pt: "Token de identificação não suportado",
  },
  INVALID_EMAIL: {
    pt: "Email inválido",
  },
  INVALID_EMAIL_OR_PASSWORD: {
    pt: "Email ou senha inválidos",
  },
  INVALID_PASSWORD: {
    pt: "Senha inválida",
  },
  INVALID_TOKEN: {
    pt: "Token inválido",
  },
  INVITATION_NOT_FOUND: {
    pt: "Convite não encontrado",
  },
  INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION: {
    pt: "O usuário que enviou o convite não é mais membro da organização",
  },
  MEMBER_NOT_FOUND: {
    pt: "Membro não encontrado",
  },
  NO_ACTIVE_ORGANIZATION: {
    pt: "Nenhuma organização ativa encontrada",
  },
  ONLY_ADMINS_CAN_ACCESS_THIS_ENDPOINT: {
    pt: "Apenas administradores podem acessar este endpoint",
  },
  ORGANIZATION_ALREADY_EXISTS: {
    pt: "Organização já existe",
  },
  PASSWORD_TOO_LONG: {
    pt: "Senha muito longa",
  },
  PASSWORD_TOO_SHORT: {
    pt: "Senha muito curta",
  },
  PROVIDER_NOT_FOUND: {
    pt: "Provedor não encontrado",
  },
  ROLE_NOT_FOUND: {
    pt: "Função não encontrada",
  },
  SESSION_EXPIRED: {
    pt: "Sessão expirada",
  },
  SOCIAL_ACCOUNT_ALREADY_LINKED: {
    pt: "Conta social já vinculada",
  },
  USER_EMAIL_NOT_FOUND: {
    pt: "Email do usuário não encontrado",
  },
  USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION: {
    pt: "Usuário já é membro desta organização",
  },
  USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: {
    pt: "Usuário já convidado para esta organização",
  },
  USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION: {
    pt: "Usuário não é membro desta organização",
  },
  YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION: {
    pt: "Você não tem permissão para cancelar este convite",
  },
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER: {
    pt: "Você não tem permissão para deletar este membro",
  },
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION: {
    pt: "Você não tem permissão para deletar esta organização",
  },
  YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE: {
    pt: "Você não tem permissão para convidar um usuário com esta função",
  },
  YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION: {
    pt: "Você não tem permissão para convidar usuários para esta organização",
  },
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION: {
    pt: "Você não tem permissão para atualizar esta organização",
  },
  YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: {
    pt: "Você não é o destinatário do convite",
  },
  YOU_CANNOT_BAN_YOURSELF: {
    pt: "Você não pode banir você mesmo",
  },
  YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER: {
    pt: "Você não pode deixar a organização como o único proprietário",
  },
  ORGANIZATION_NOT_FOUND: {
    pt: "Organização não encontrada",
  },
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION: {
    pt: "Você não tem permissão para criar uma nova organização",
  },
  YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS: {
    pt: "Você atingiu o número máximo de organizações",
  },
} satisfies ErrorTypes;

export const getErrorMessage = (code: string, lang: "pt") => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes][lang];
  }
  return "";
};

// usage example
// const { error } = await authClient.signUp.email({
// 	email: "user@email.com",
// 	password: "password",
// 	name: "User",
// });
// if(error?.code){
//     alert(getErrorMessage(error.code), "pt");
// }
