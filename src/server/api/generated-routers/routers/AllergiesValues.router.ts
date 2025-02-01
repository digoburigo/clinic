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

        aggregate: procedure.input($Schema.AllergiesValuesInputSchema.aggregate).query(({ ctx, input }) => checkRead(db(ctx).allergiesValues.aggregate(input as any))),

        createMany: procedure.input($Schema.AllergiesValuesInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).allergiesValues.createMany(input as any))),

        create: procedure.input($Schema.AllergiesValuesInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).allergiesValues.create(input as any))),

        deleteMany: procedure.input($Schema.AllergiesValuesInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).allergiesValues.deleteMany(input as any))),

        delete: procedure.input($Schema.AllergiesValuesInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).allergiesValues.delete(input as any))),

        findFirst: procedure.input($Schema.AllergiesValuesInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).allergiesValues.findFirst(input as any))),

        findFirstOrThrow: procedure.input($Schema.AllergiesValuesInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).allergiesValues.findFirstOrThrow(input as any))),

        findMany: procedure.input($Schema.AllergiesValuesInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).allergiesValues.findMany(input as any))),

        findUnique: procedure.input($Schema.AllergiesValuesInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).allergiesValues.findUnique(input as any))),

        findUniqueOrThrow: procedure.input($Schema.AllergiesValuesInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).allergiesValues.findUniqueOrThrow(input as any))),

        groupBy: procedure.input($Schema.AllergiesValuesInputSchema.groupBy).query(({ ctx, input }) => checkRead(db(ctx).allergiesValues.groupBy(input as any))),

        updateMany: procedure.input($Schema.AllergiesValuesInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).allergiesValues.updateMany(input as any))),

        update: procedure.input($Schema.AllergiesValuesInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).allergiesValues.update(input as any))),

        upsert: procedure.input($Schema.AllergiesValuesInputSchema.upsert).mutation(async ({ ctx, input }) => checkMutate(db(ctx).allergiesValues.upsert(input as any))),

        count: procedure.input($Schema.AllergiesValuesInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).allergiesValues.count(input as any))),

    }
    );
}
