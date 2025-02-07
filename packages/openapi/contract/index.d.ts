import { z } from 'zod';
export declare const CreatePetRequest: z.ZodObject<{
    name: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<["available", "pending", "sold"]>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    status?: "available" | "pending" | "sold";
}, {
    name?: string;
    status?: "available" | "pending" | "sold";
}>;
export declare const CreatePetResponse: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id?: number;
}, {
    id?: number;
}>;
export declare const UpdatePetRequest: z.ZodObject<{
    name: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<["available", "pending", "sold"]>>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    status?: "available" | "pending" | "sold";
}, {
    name?: string;
    status?: "available" | "pending" | "sold";
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
export declare const ApiContract: {
    addPet: {
        method: "POST";
        path: string;
        description: string;
        body: z.ZodObject<{
            name: z.ZodString;
            status: z.ZodOptional<z.ZodEnum<["available", "pending", "sold"]>>;
        }, "strip", z.ZodTypeAny, {
            name?: string;
            status?: "available" | "pending" | "sold";
        }, {
            name?: string;
            status?: "available" | "pending" | "sold";
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
    updatePet: {
        method: "PUT";
        path: string;
        description: string;
        body: z.ZodObject<{
            name: z.ZodString;
            status: z.ZodOptional<z.ZodEnum<["available", "pending", "sold"]>>;
        }, "strip", z.ZodTypeAny, {
            name?: string;
            status?: "available" | "pending" | "sold";
        }, {
            name?: string;
            status?: "available" | "pending" | "sold";
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
};
export declare const ApiOperations: {
    'add pet': "addPet";
    'update pet': "updatePet";
    'get pet by id': "getPetById";
};
export declare const contract: {
    addPet: {
        description: string;
        body: z.ZodObject<{
            name: z.ZodString;
            status: z.ZodOptional<z.ZodEnum<["available", "pending", "sold"]>>;
        }, "strip", z.ZodTypeAny, {
            name?: string;
            status?: "available" | "pending" | "sold";
        }, {
            name?: string;
            status?: "available" | "pending" | "sold";
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
    updatePet: {
        description: string;
        body: z.ZodObject<{
            name: z.ZodString;
            status: z.ZodOptional<z.ZodEnum<["available", "pending", "sold"]>>;
        }, "strip", z.ZodTypeAny, {
            name?: string;
            status?: "available" | "pending" | "sold";
        }, {
            name?: string;
            status?: "available" | "pending" | "sold";
        }>;
        method: "PUT";
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
};
