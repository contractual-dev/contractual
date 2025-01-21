import { z } from 'zod';
import type { AppRouter } from '@ts-rest/core';
import { initContract } from '@ts-rest/core';

export const Pet = z.object({
  id: z.number().int(),
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
export const Order = z.object({
  id: z.number().int(),
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
export const User = z.object({
  id: z.number().int(),
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
    method: 'POST' as const,
    path: '/pet',
    description: `Add a new pet to the store.`,
    body: Pet,
    responses: {
      [200]: z.object({ id: z.number().int() }),
    },
  },
  getPetById: {
    method: 'GET' as const,
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
    method: 'POST' as const,
    path: '/store/order',
    description: `Place an order for a pet.`,
    body: Order,
    responses: {
      [200]: z.object({ id: z.number().int() }),
    },
  },
  getOrderById: {
    method: 'GET' as const,
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
    method: 'POST' as const,
    path: '/user',
    description: `Create a new user.`,
    body: User,
    responses: {
      [200]: z.object({ id: z.number().int() }),
    },
  },
  getUserByUsername: {
    method: 'GET' as const,
    path: '/user/:username',
    description: `Retrieve a user by username.`,
    pathParams: z.object({
      username: z.string(),
    }),
    responses: {
      [200]: GetUserResponse,
    },
  },
} satisfies AppRouter;

export const ApiOperations = {
  'add pet': 'addPet',
  'get pet by id': 'getPetById',
  'place order': 'placeOrder',
  'get order by id': 'getOrderById',
  'create user': 'createUser',
  'get user by username': 'getUserByUsername',
} satisfies Record<string, keyof typeof ApiContract>;

export const contract = initContract().router(ApiContract);
