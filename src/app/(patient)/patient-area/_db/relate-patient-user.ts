import "server-only";

import { db } from "~/server/db";

export async function relatePatientUser(
  userId: string,
  organizationId: string,
) {
  return await db.$transaction(async (tx) => {
    try {
      const user = await tx.user.findFirst({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const patient = await tx.patient.findFirst({
        where: {
          email: user.email,
          organizationId: organizationId,
        },
      });

      if (!patient) {
        throw new Error("Paciente não encontrado");
      }

      await tx.user.update({
        where: { id: user.id },
        data: {
          patientUser: {
            connect: { id: patient.id },
          },
        },
      });
    } catch (error) {
      throw new Error("Erro interno do servidor");
    }
  });
}
