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
export declare const UpdatePetBody: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name?: string;
}, {
    name?: string;
}>;
export declare const ApiContract: {
    updatePet: {
        method: "POST";
        path: string;
        pathParams: z.ZodObject<{
            petId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            petId?: number;
        }, {
            petId?: number;
        }>;
        body: z.ZodObject<{
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name?: string;
        }, {
            name?: string;
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
    'update pet': "updatePet";
    'add pet': "addPet";
    'get pet by id': "getPetById";
};
export declare const contract: {
    updatePet: {
        pathParams: z.ZodObject<{
            petId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            petId?: number;
        }, {
            petId?: number;
        }>;
        method: "POST";
        body: z.ZodObject<{
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name?: string;
        }, {
            name?: string;
        }>;
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
    addPet: {
        description: string;
        method: "POST";
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
        pathParams: z.ZodObject<{
            petId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            petId?: number;
        }, {
            petId?: number;
        }>;
        description: string;
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
