import { z } from 'zod';
import { initContract } from '@ts-rest/core';
export const AddPetBody = z.object({
    name: z.string(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['available', 'pending', 'sold']).optional(),
});
export const CreatePetResponse = z.object({ id: z.number().int() });
export const GetPetResponse = z.object({
    id: z.number().int(),
    name: z.string(),
    status: z.enum(['available', 'pending', 'sold']),
});
export const PlaceOrderBody = z.object({
    petId: z.number().int(),
    quantity: z.number().int(),
    shipDate: z.string(),
    status: z.enum(['placed', 'approved', 'delivered']),
    complete: z.boolean().optional(),
});
export const CreateOrderResponse = z.object({ id: z.number().int() });
export const GetOrderResponse = z.object({
    id: z.number().int(),
    petId: z.number().int(),
    status: z.enum(['placed', 'approved', 'delivered']),
    quantity: z.number().int(),
});
export const CreateUserBody = z.object({
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    password: z.string(),
    phone: z.string(),
    userStatus: z.number().int().optional(),
});
export const CreateUserResponse = z.object({ id: z.number().int() });
export const GetUserResponse = z.object({
    id: z.number().int(),
    username: z.string(),
    email: z.string(),
    phone: z.string(),
});
export const ApiContract = {
    addPet: {
        method: 'POST',
        path: '/pet',
        description: `Add a new pet to the store.`,
        body: AddPetBody,
        responses: {
            [200]: z.object({ id: z.number().int() }),
        },
    },
    getPetById: {
        method: 'GET',
        path: '/pet/:petId',
        description: `Retrieve a pet by ID.`,
        pathParams: z.object({
            petId: z.number().int(),
        }),
        responses: {
            [200]: GetPetResponse,
        },
    },
    placeOrder: {
        method: 'POST',
        path: '/store/order',
        body: PlaceOrderBody,
        responses: {
            [200]: z.object({ id: z.number().int() }),
        },
    },
    getOrderById: {
        method: 'GET',
        path: '/store/order/:orderId',
        description: `Retrieve an order by ID.`,
        pathParams: z.object({
            orderId: z.number().int(),
        }),
        responses: {
            [200]: GetOrderResponse,
        },
    },
    createUser: {
        method: 'POST',
        path: '/user',
        body: CreateUserBody,
        responses: {
            [200]: z.object({ id: z.number().int() }),
        },
    },
    getUserByUsername: {
        method: 'GET',
        path: '/user/:username',
        description: `Retrieve a user by username.`,
        pathParams: z.object({
            username: z.string(),
        }),
        responses: {
            [200]: GetUserResponse,
        },
    },
};
export const ApiOperations = {
    'add pet': 'addPet',
    'get pet by id': 'getPetById',
    'place order': 'placeOrder',
    'get order by id': 'getOrderById',
    'create user': 'createUser',
    'get user by username': 'getUserByUsername',
};
export const contract = initContract().router(ApiContract);
