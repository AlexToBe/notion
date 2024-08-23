import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

export const archive = mutation({
    args: {
        id: v.id('documents'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthorized')
        const userId = identity.subject
        const doc = await ctx.db.get(args.id)
        if (!doc) throw new Error('Document not found')
        if (doc.userId !== userId) throw new Error('Unauthorized')
        const recursiveAchive = async (documentId: Id<'documents'>)=> {
            const children = await ctx.db.query('documents')
                .withIndex('by_user_parent', q => q.eq('userId', userId).eq('parentDocument',documentId)).collect()
            
            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: true,
                })
                await recursiveAchive(child._id)
            }
        }
            
        const document = await ctx.db.patch(args.id, {
            isArchived: true,
        })
         await recursiveAchive(args.id)
        return document
    },
})


export const getSideBar = query({
    args: {
        parentDocument: v.optional( v.id('documents')),
    },
    handler: async (ctx,args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthorized')
        const userId = identity.subject
        const doc = await ctx.db.query('documents').withIndex('by_user_parent', (q) => 
            q.eq('userId', userId).eq('parentDocument', args.parentDocument)
            
        ).filter((q)=>q.eq(q.field('isArchived'),false)).order('desc').collect()
        
        return doc
    },
})


export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id('documents')),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthorized')
            const userId = identity.subject
        const id = await ctx.db.insert('documents', {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPulished:false,
        })
        return id
    },
})

export const getTrash = query({
    
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthorized')
        const userId = identity.subject
        const doc = await ctx.db.query('documents').withIndex('by_user', (q) => 
            q.eq('userId', userId)
        ).filter((q)=>q.eq(q.field('isArchived'),true)).order('desc').collect()
        
        return doc
    },
})

export const restore = mutation({
    args: {
        id: v.id('documents'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthorized')
            const userId = identity.subject
        const existingDoc = await ctx.db.get(args.id)
        if (!existingDoc) throw new Error('Document not found') 
        if (existingDoc.userId !== userId) throw new Error('Unauthorized')
        const options: Partial<Doc<'documents'>> = {
            isArchived: false,
        }

        const recursiveAchive = async (documentId: Id<'documents'>)=> {
            const children = await ctx.db.query('documents')
                .withIndex('by_user_parent', q => q.eq('userId', userId).eq('parentDocument',documentId)).collect()
            
            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: false,
                })
                await recursiveAchive(child._id)
            }
        }

        if (existingDoc.parentDocument) {
            const parent = await ctx.db.get(existingDoc.parentDocument)
            if (!parent) throw new Error('Parent document not found')
            if (parent?.isArchived) {
                options.parentDocument = undefined
            }
        }
            
        const patchedDoc = await ctx.db.patch(args.id, options)
        await recursiveAchive(args.id)
        return patchedDoc
    },
})

export const remove = mutation({
    args: {
        id: v.id('documents'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthorized')
        const userId = identity.subject
        

        const doc = await ctx.db.get(args.id)
        if (!doc) throw new Error('Document not found')
        if (doc.userId !== userId) throw new Error('Unauthorized')
        const docremove = await ctx.db.delete(args.id)
        return docremove
    },
})


export const getSearch= query({
    
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthorized')
        const userId = identity.subject
        const doc = await ctx.db.query('documents').withIndex('by_user', (q) => 
            q.eq('userId', userId)
        ).filter((q)=>q.eq(q.field('isArchived'),false)).order('desc').collect()
        
        return doc
    },
})

export const getById= query({
     args: {
        id: v.id('documents'),
    },
    handler: async (ctx,args) => {
        const identity = await ctx.auth.getUserIdentity()
        

        const doc = await ctx.db.get(args.id)
        if (!doc) throw new Error('Document not found')
        if (doc.isPulished && !doc.isArchived) {
            return doc
        }
        if (!identity) throw new Error('Unauthorized')
        const userId = identity.subject
        if (doc.userId !== userId) throw new Error('Unauthorized')
        return doc
    },
})

export const update = mutation({
    args: {
        id: v.id('documents'),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        icon: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        isPulished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthorized')
        const userId = identity.subject
        const doc = await ctx.db.get(args.id)
        if (!doc) throw new Error('Document not found')
        if (doc.userId !== userId) throw new Error('Unauthorized')
        
        const {id,...rest} = args
        
       
            
        const document = await ctx.db.patch(args.id, {...rest})
        return document
    },
})

export const removeIcon = mutation({
    args: {
        id: v.id('documents'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthorized')
        const userId = identity.subject
        

        const doc = await ctx.db.get(args.id)
        if (!doc) throw new Error('Document not found')
        if (doc.userId !== userId) throw new Error('Unauthorized')
        const docremove = await ctx.db.patch(args.id, {
            icon:undefined
        })
        return docremove
    },
})

export const removeCover = mutation({
    args: {
        id: v.id('documents'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthorized')
        const userId = identity.subject
        

        const doc = await ctx.db.get(args.id)
        if (!doc) throw new Error('Document not found')
        if (doc.userId !== userId) throw new Error('Unauthorized')
        const docremove = await ctx.db.patch(args.id, {
            coverImage:undefined
        })
        return docremove
    },
})