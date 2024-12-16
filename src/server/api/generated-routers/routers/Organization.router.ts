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

        aggregate: procedure.input($Schema.OrganizationInputSchema.aggregate).query(({ ctx, input }) => checkRead(db(ctx).organization.aggregate(input as any))),

        createMany: procedure.input($Schema.OrganizationInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).organization.createMany(input as any))),

        create: procedure.input($Schema.OrganizationInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).organization.create(input as any))),

        deleteMany: procedure.input($Schema.OrganizationInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).organization.deleteMany(input as any))),

        delete: procedure.input($Schema.OrganizationInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).organization.delete(input as any))),

        findFirst: procedure.input($Schema.OrganizationInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).organization.findFirst(input as any))),

        findFirstOrThrow: procedure.input($Schema.OrganizationInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).organization.findFirstOrThrow(input as any))),

        findMany: procedure.input($Schema.OrganizationInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).organization.findMany(input as any))),

        findUnique: procedure.input($Schema.OrganizationInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).organization.findUnique(input as any))),

        findUniqueOrThrow: procedure.input($Schema.OrganizationInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).organization.findUniqueOrThrow(input as any))),

        groupBy: procedure.input($Schema.OrganizationInputSchema.groupBy).query(({ ctx, input }) => checkRead(db(ctx).organization.groupBy(input as any))),

        updateMany: procedure.input($Schema.OrganizationInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).organization.updateMany(input as any))),

        update: procedure.input($Schema.OrganizationInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).organization.update(input as any))),

        upsert: procedure.input($Schema.OrganizationInputSchema.upsert).mutation(async ({ ctx, input }) => checkMutate(db(ctx).organization.upsert(input as any))),

        count: procedure.input($Schema.OrganizationInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).organization.count(input as any))),

    }
    );
}
