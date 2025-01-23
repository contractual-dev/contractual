import { z } from 'zod';
export declare const AddPetBody: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    status: z.ZodOptional<z.ZodEnum<["available", "pending", "sold"]>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    category?: string;
    status?: "available" | "pending" | "sold";
    tags?: string[];
}, {
    name?: string;
    category?: string;
    status?: "available" | "pending" | "sold";
    tags?: string[];
}>;
export declare const CreatePetResponse: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id?: number;
}, {
    id?: number;
}>;
export declare const GetPetResponse: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    status: z.ZodEnum<["available", "pending", "sold"]>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    status?: "available" | "pending" | "sold";
    id?: number;
}, {
    name?: string;
    status?: "available" | "pending" | "sold";
    id?: number;
}>;
export declare const PlaceOrderBody: z.ZodObject<{
    petId: z.ZodNumber;
    quantity: z.ZodNumber;
    shipDate: z.ZodString;
    status: z.ZodEnum<["placed", "approved", "delivered"]>;
    complete: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    status?: "placed" | "approved" | "delivered";
    petId?: number;
    quantity?: number;
    shipDate?: string;
    complete?: boolean;
}, {
    status?: "placed" | "approved" | "delivered";
    petId?: number;
    quantity?: number;
    shipDate?: string;
    complete?: boolean;
}>;
export declare const CreateOrderResponse: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id?: number;
}, {
    id?: number;
}>;
export declare const GetOrderResponse: z.ZodObject<{
    id: z.ZodNumber;
    petId: z.ZodNumber;
    status: z.ZodEnum<["placed", "approved", "delivered"]>;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    status?: "placed" | "approved" | "delivered";
    id?: number;
    petId?: number;
    quantity?: number;
}, {
    status?: "placed" | "approved" | "delivered";
    id?: number;
    petId?: number;
    quantity?: number;
}>;
export declare const CreateUserBody: z.ZodObject<{
    username: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodString;
    userStatus: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    userStatus?: number;
}, {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    userStatus?: number;
}>;
export declare const CreateUserResponse: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id?: number;
}, {
    id?: number;
}>;
export declare const GetUserResponse: z.ZodObject<{
    id: z.ZodNumber;
    username: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id?: number;
    username?: string;
    email?: string;
    phone?: string;
}, {
    id?: number;
    username?: string;
    email?: string;
    phone?: string;
}>;
export declare const ApiContract: {
    addPet: {
        method: "POST";
        path: string;
        description: string;
        body: z.ZodObject<{
            name: z.ZodString;
            category: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            status: z.ZodOptional<z.ZodEnum<["available", "pending", "sold"]>>;
        }, "strip", z.ZodTypeAny, {
            name?: string;
            category?: string;
            status?: "available" | "pending" | "sold";
            tags?: string[];
        }, {
            name?: string;
            category?: string;
            status?: "available" | "pending" | "sold";
            tags?: string[];
        }>;
        responses: {
            200: z.ZodObject<{
                id: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                id?: number;
            }, {
                id?: number;
            }>;
        };
    };
    getPetById: {
        method: "GET";
        path: string;
        description: string;
        pathParams: z.ZodObject<{
            petId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            petId?: number;
        }, {
            petId?: number;
        }>;
        responses: {
            200: z.ZodObject<{
                id: z.ZodNumber;
                name: z.ZodString;
                status: z.ZodEnum<["available", "pending", "sold"]>;
            }, "strip", z.ZodTypeAny, {
                name?: string;
                status?: "available" | "pending" | "sold";
                id?: number;
            }, {
                name?: string;
                status?: "available" | "pending" | "sold";
                id?: number;
            }>;
        };
    };
    placeOrder: {
        method: "POST";
        path: string;
        body: z.ZodObject<{
            petId: z.ZodNumber;
            quantity: z.ZodNumber;
            shipDate: z.ZodString;
            status: z.ZodEnum<["placed", "approved", "delivered"]>;
            complete: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            status?: "placed" | "approved" | "delivered";
            petId?: number;
            quantity?: number;
            shipDate?: string;
            complete?: boolean;
        }, {
            status?: "placed" | "approved" | "delivered";
            petId?: number;
            quantity?: number;
            shipDate?: string;
            complete?: boolean;
        }>;
        responses: {
            200: z.ZodObject<{
                id: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                id?: number;
            }, {
                id?: number;
            }>;
        };
    };
    getOrderById: {
        method: "GET";
        path: string;
        description: string;
        pathParams: z.ZodObject<{
            orderId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            orderId?: number;
        }, {
            orderId?: number;
        }>;
        responses: {
            200: z.ZodObject<{
                id: z.ZodNumber;
                petId: z.ZodNumber;
                status: z.ZodEnum<["placed", "approved", "delivered"]>;
                quantity: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                status?: "placed" | "approved" | "delivered";
                id?: number;
                petId?: number;
                quantity?: number;
            }, {
                status?: "placed" | "approved" | "delivered";
                id?: number;
                petId?: number;
                quantity?: number;
            }>;
        };
    };
    createUser: {
        method: "POST";
        path: string;
        body: z.ZodObject<{
            username: z.ZodString;
            firstName: z.ZodString;
            lastName: z.ZodString;
            email: z.ZodString;
            password: z.ZodString;
            phone: z.ZodString;
            userStatus: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            username?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            password?: string;
            phone?: string;
            userStatus?: number;
        }, {
            username?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            password?: string;
            phone?: string;
            userStatus?: number;
        }>;
        responses: {
            200: z.ZodObject<{
                id: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                id?: number;
            }, {
                id?: number;
            }>;
        };
    };
    getUserByUsername: {
        method: "GET";
        path: string;
        description: string;
        pathParams: z.ZodObject<{
            username: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            username?: string;
        }, {
            username?: string;
        }>;
        responses: {
            200: z.ZodObject<{
                id: z.ZodNumber;
                username: z.ZodString;
                email: z.ZodString;
                phone: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id?: number;
                username?: string;
                email?: string;
                phone?: string;
            }, {
                id?: number;
                username?: string;
                email?: string;
                phone?: string;
            }>;
        };
    };
};
export declare const ApiOperations: {
    'add pet': "addPet";
    'get pet by id': "getPetById";
    'place order': "placeOrder";
    'get order by id': "getOrderById";
    'create user': "createUser";
    'get user by username': "getUserByUsername";
};
export declare const contract: {
    addPet: {
        description: string;
        body: z.ZodObject<{
            name: z.ZodString;
            category: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            status: z.ZodOptional<z.ZodEnum<["available", "pending", "sold"]>>;
        }, "strip", z.ZodTypeAny, {
            name?: string;
            category?: string;
            status?: "available" | "pending" | "sold";
            tags?: string[];
        }, {
            name?: string;
            category?: string;
            status?: "available" | "pending" | "sold";
            tags?: string[];
        }>;
        method: "POST";
        path: string;
        responses: {
            200: z.ZodObject<{
                id: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                id?: number;
            }, {
                id?: number;
            }>;
        };
    };
    getPetById: {
        description: string;
        pathParams: z.ZodObject<{
            petId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            petId?: number;
        }, {
            petId?: number;
        }>;
        method: "GET";
        path: string;
        responses: {
            200: z.ZodObject<{
                id: z.ZodNumber;
                name: z.ZodString;
                status: z.ZodEnum<["available", "pending", "sold"]>;
            }, "strip", z.ZodTypeAny, {
                name?: string;
                status?: "available" | "pending" | "sold";
                id?: number;
            }, {
                name?: string;
                status?: "available" | "pending" | "sold";
                id?: number;
            }>;
        };
    };
    placeOrder: {
        body: z.ZodObject<{
            petId: z.ZodNumber;
            quantity: z.ZodNumber;
            shipDate: z.ZodString;
            status: z.ZodEnum<["placed", "approved", "delivered"]>;
            complete: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            status?: "placed" | "approved" | "delivered";
            petId?: number;
            quantity?: number;
            shipDate?: string;
            complete?: boolean;
        }, {
            status?: "placed" | "approved" | "delivered";
            petId?: number;
            quantity?: number;
            shipDate?: string;
            complete?: boolean;
        }>;
        method: "POST";
        path: string;
        responses: {
            200: z.ZodObject<{
                id: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                id?: number;
            }, {
                id?: number;
            }>;
        };
    };
    getOrderById: {
        description: string;
        pathParams: z.ZodObject<{
            orderId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            orderId?: number;
        }, {
            orderId?: number;
        }>;
        method: "GET";
        path: string;
        responses: {
            200: z.ZodObject<{
                id: z.ZodNumber;
                petId: z.ZodNumber;
                status: z.ZodEnum<["placed", "approved", "delivered"]>;
                quantity: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                status?: "placed" | "approved" | "delivered";
                id?: number;
                petId?: number;
                quantity?: number;
            }, {
                status?: "placed" | "approved" | "delivered";
                id?: number;
                petId?: number;
                quantity?: number;
            }>;
        };
    };
    createUser: {
        body: z.ZodObject<{
            username: z.ZodString;
            firstName: z.ZodString;
            lastName: z.ZodString;
            email: z.ZodString;
            password: z.ZodString;
            phone: z.ZodString;
            userStatus: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            username?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            password?: string;
            phone?: string;
            userStatus?: number;
        }, {
            username?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            password?: string;
            phone?: string;
            userStatus?: number;
        }>;
        method: "POST";
        path: string;
        responses: {
            200: z.ZodObject<{
                id: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                id?: number;
            }, {
                id?: number;
            }>;
        };
    };
    getUserByUsername: {
        description: string;
        pathParams: z.ZodObject<{
            username: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            username?: string;
        }, {
            username?: string;
        }>;
        method: "GET";
        path: string;
        responses: {
            200: z.ZodObject<{
                id: z.ZodNumber;
                username: z.ZodString;
                email: z.ZodString;
                phone: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id?: number;
                username?: string;
                email?: string;
                phone?: string;
            }, {
                id?: number;
                username?: string;
                email?: string;
                phone?: string;
            }>;
        };
    };
};
