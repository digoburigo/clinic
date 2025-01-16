/******************************************************************************
* This file was generated by ZenStack CLI.
******************************************************************************/

/* eslint-disable */
// @ts-nocheck

import type { AnyTRPCRouter as AnyRouter } from "@trpc/server";
import type { PrismaClient } from "@zenstackhq/runtime/models";
import { createTRPCRouter } from "../../trpc";
import createPostRouter from "./Post.router";
import createCidRouter from "./Cid.router";
import createUserRouter from "./User.router";
import createSessionRouter from "./Session.router";
import createAccountRouter from "./Account.router";
import createVerificationRouter from "./Verification.router";
import createOrganizationRouter from "./Organization.router";
import createMemberRouter from "./Member.router";
import createInvitationRouter from "./Invitation.router";
import createPatientRouter from "./Patient.router";
import createAppointmentRouter from "./Appointment.router";
import createPatientAllergyRouter from "./PatientAllergy.router";
import createAllergyRouter from "./Allergy.router";

export function db(ctx: any) {
    if (!ctx.prisma) {
        throw new Error('Missing "prisma" field in trpc context');
    }
    return ctx.prisma as PrismaClient;
}

export function createRouter() {
    return createTRPCRouter({
        post: createPostRouter(),
        cid: createCidRouter(),
        user: createUserRouter(),
        session: createSessionRouter(),
        account: createAccountRouter(),
        verification: createVerificationRouter(),
        organization: createOrganizationRouter(),
        member: createMemberRouter(),
        invitation: createInvitationRouter(),
        patient: createPatientRouter(),
        appointment: createAppointmentRouter(),
        patientAllergy: createPatientAllergyRouter(),
        allergy: createAllergyRouter(),
    }
    );
}
