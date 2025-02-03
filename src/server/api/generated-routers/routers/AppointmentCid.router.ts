/******************************************************************************
* This file was generated by ZenStack CLI.
******************************************************************************/

/* eslint-disable */
// @ts-nocheck

import { db } from ".";
import { createTRPCRouter } from "../../trpc";
import { procedure } from "../../trpc";
import * as _Schema from '@zenstackhq/runtime/zod/input';
const $Schema: typeof _Schema = (_Schema as any).default ?? _Schema;
import { checkRead, checkMutate } from '../helper';

export default function createRouter() {
    return createTRPCRouter({

        aggregate: procedure.input($Schema.AppointmentCidInputSchema.aggregate).query(({ ctx, input }) => checkRead(db(ctx).appointmentCid.aggregate(input as any))),

        createMany: procedure.input($Schema.AppointmentCidInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).appointmentCid.createMany(input as any))),

        create: procedure.input($Schema.AppointmentCidInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).appointmentCid.create(input as any))),

        deleteMany: procedure.input($Schema.AppointmentCidInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).appointmentCid.deleteMany(input as any))),

        delete: procedure.input($Schema.AppointmentCidInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).appointmentCid.delete(input as any))),

        findFirst: procedure.input($Schema.AppointmentCidInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).appointmentCid.findFirst(input as any))),

        findFirstOrThrow: procedure.input($Schema.AppointmentCidInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).appointmentCid.findFirstOrThrow(input as any))),

        findMany: procedure.input($Schema.AppointmentCidInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).appointmentCid.findMany(input as any))),

        findUnique: procedure.input($Schema.AppointmentCidInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).appointmentCid.findUnique(input as any))),

        findUniqueOrThrow: procedure.input($Schema.AppointmentCidInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).appointmentCid.findUniqueOrThrow(input as any))),

        groupBy: procedure.input($Schema.AppointmentCidInputSchema.groupBy).query(({ ctx, input }) => checkRead(db(ctx).appointmentCid.groupBy(input as any))),

        updateMany: procedure.input($Schema.AppointmentCidInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).appointmentCid.updateMany(input as any))),

        update: procedure.input($Schema.AppointmentCidInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).appointmentCid.update(input as any))),

        upsert: procedure.input($Schema.AppointmentCidInputSchema.upsert).mutation(async ({ ctx, input }) => checkMutate(db(ctx).appointmentCid.upsert(input as any))),

        count: procedure.input($Schema.AppointmentCidInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).appointmentCid.count(input as any))),

    }
    );
}
