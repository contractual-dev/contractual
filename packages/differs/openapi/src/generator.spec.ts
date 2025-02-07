import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { diffSpecs } from './generator.js';

const dummyOpenApiSpecBreaking = `
openapi: 3.0.0
info:
  title: Petstore API
  description: A simple API for managing a pet store.
  version: 0.0.0
tags: []
paths:
  /pet:
    post:
      operationId: addPet
      description: Add a new pet to the store.
      parameters: []
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreatePetResponse'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AddPetBody'
  /pet/{petId}:
    get:
      operationId: getPetById
      description: Retrieve a pet by ID.
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: integer
            format: int32
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetPetResponse'
  /store/order:
    post:
      operationId: placeOrder
      parameters: []
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreateOrderResponse'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PlaceOrderBody'
  /store/order/{orderId}:
    get:
      operationId: getOrderById
      description: Retrieve an order by ID.
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: integer
            format: int32
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetOrderResponse'
  /user:
    post:
      operationId: createUser
      parameters: []
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreateUserResponse'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserBody'
  /user/{username}:
    get:
      operationId: getUserByUsername
      description: Retrieve a user by username.
      parameters:
        - name: username
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetUserResponse'
components:
  schemas:
    AddPetBody:
      type: object
      required:
        - name
      properties:
        name:
          type: string
          description: Name of the pet.
        category:
          type: string
          description: Category of the pet (e.g., dog, cat, bird).
        tags:
          type: array
          items:
            type: string
          description: List of tags associated with the pet.
        status:
          type: string
          enum:
            - available
            - pending
            - sold
          description: The current status of the pet in the store.
      description: Request body for adding a new pet.
    ApiResponse:
      type: object
      required:
        - code
        - type
        - message
      properties:
        code:
          type: integer
          format: int32
          description: Status code of the response.
        type:
          type: string
          description: The type of response (e.g., success, error).
        message:
          type: string
          description: Detailed message about the response.
      description: Represents a standard API response for messages or errors.
    CreateOrderResponse:
      type: object
      required:
        - id
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier of the created order.
      description: Response for creating an order.
    CreatePetResponse:
      type: object
      required:
        - id
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier of the created pet.
      description: Response for creating a pet.
    CreateUserBody:
      type: object
      required:
        - username
        - firstName
        - lastName
        - email
        - password
        - phone
      properties:
        username:
          type: string
          description: Username of the user.
        firstName:
          type: string
          description: First name of the user.
        lastName:
          type: string
          description: Last name of the user.
        email:
          type: string
          description: Email address of the user.
        password:
          type: string
          description: Password for the user account.
        phone:
          type: string
          description: Phone number of the user.
        userStatus:
          type: integer
          format: int32
          description: User status (e.g., 1 for active, 0 for inactive).
      description: Create a new user.
    CreateUserResponse:
      type: object
      required:
        - id
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier of the created user.
      description: Response for creating a user.
    GetOrderResponse:
      type: object
      required:
        - id
        - petId
        - status
        - quantity
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier of the order.
        petId:
          type: integer
          format: int32
          description: Identifier of the pet associated with the order.
        status:
          type: string
          enum:
            - placed
            - approved
            - delivered
          description: The current status of the order.
        quantity:
          type: integer
          format: int32
          description: Quantity of pets ordered.
      description: Response for retrieving an order.
    GetPetResponse:
      type: object
      required:
        - id
        - name
        - status
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier of the pet.
        name:
          type: string
          description: Name of the pet.
        status:
          type: string
          enum:
            - available
            - pending
            - sold
          description: The current status of the pet in the store.
      description: Response for retrieving a pet.
    GetUserResponse:
      type: object
      required:
        - id
        - username
        - email
        - phone
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier of the user.
        username:
          type: string
          description: Username associated with the user.
        email:
          type: string
          description: Email address of the user.
        phone:
          type: string
          description: Phone number of the user.
      description: Response for retrieving a user.
    Order:
      type: object
      required:
        - id
        - petId
        - quantity
        - shipDate
        - status
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier for the order.
        petId:
          type: integer
          format: int32
          description: ID of the pet being ordered.
        quantity:
          type: integer
          format: int32
          description: Quantity of pets ordered.
        shipDate:
          type: string
          description: Shipping date for the order.
        status:
          type: string
          enum:
            - placed
            - approved
            - delivered
          description: The current status of the order.
        complete:
          type: boolean
          description: Indicates whether the order is complete.
      description: Represents an order for purchasing a pet.
    Pet:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier for the pet.
        name:
          type: string
          description: Name of the pet.
        category:
          type: string
          description: Category of the pet (e.g., dog, cat, bird).
        tags:
          type: array
          items:
            type: string
          description: List of tags associated with the pet.
        status:
          type: string
          enum:
            - available
            - pending
            - sold
          description: The current status of the pet in the store.
      description: Represents a pet in the store.
    PlaceOrderBody:
      type: object
      required:
        - petId
        - quantity
        - shipDate
        - status
      properties:
        petId:
          type: integer
          format: int32
          description: ID of the pet being ordered.
        quantity:
          type: integer
          format: int32
          description: Quantity of pets ordered.
        shipDate:
          type: string
          description: Shipping date for the order.
        status:
          type: string
          enum:
            - placed
            - approved
            - delivered
          description: The current status of the order.
        complete:
          type: boolean
          description: Indicates whether the order is complete.
      description: Place an order for a pet.
    User:
      type: object
      required:
        - id
        - username
        - firstName
        - lastName
        - email
        - password
        - phone
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier for the user.
        username:
          type: string
          description: Username of the user.
        firstName:
          type: string
          description: First name of the user.
        lastName:
          type: string
          description: Last name of the user.
        email:
          type: string
          description: Email address of the user.
        password:
          type: string
          description: Password for the user account.
        phone:
          type: string
          description: Phone number of the user.
        userStatus:
          type: integer
          format: int32
          description: User status (e.g., 1 for active, 0 for inactive).
      description: Represents a user of the pet store.
`;

const dummyOpenApiSpecMinor = `
openapi: 3.0.0
info:
  title: Petstore API
  description: A simple API for managing a pet store.
  version: 0.0.0
tags: []
paths:
  /pet:
    post:
      operationId: addPet
      description: Add a new pet to the store.
      parameters: []
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreatePetResponse'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AddPetBody'
  /pet/{petId}:
    get:
      operationId: getPetById
      description: Retrieve a pet by ID.
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: integer
            format: int32
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetPetResponse'
  /store/order:
    post:
      operationId: placeOrder
      parameters: []
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreateOrderResponse'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PlaceOrderBody'
  /store/order/{orderId}:
    get:
      operationId: getOrderById
      description: Retrieve an order by ID.
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: integer
            format: int32
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetOrderResponse'
  /user:
    post:
      operationId: createUser
      parameters: []
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreateUserResponse'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserBody'
  /user/{username}:
    get:
      operationId: getUserByUsername
      description: Retrieve a user by username.
      parameters:
        - name: username
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: The request has succeeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetUserResponse'
components:
  schemas:
    AddPetBody:
      type: object
      required:
        - name
      properties:
        name:
          type: string
          description: Name of the pet.
        category:
          type: string
          description: Category of the pet (e.g., dog, cat, bird).
        tags:
          type: array
          items:
            type: string
          description: List of tags associated with the pet.
        status:
          type: string
          enum:
            - available
            - pending
            - sold
          description: The current status of the pet in the store.
      description: Request body for adding a new pet.
    ApiResponse:
      type: object
      required:
        - code
        - type
        - message
      properties:
        code:
          type: integer
          format: int32
          description: Status code of the response.
        type:
          type: string
          description: The type of response (e.g., success, error).
        message:
          type: string
          description: Detailed message about the response.
      description: Represents a standard API response for messages or errors.
    CreateOrderResponse:
      type: object
      required:
        - id
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier of the created order.
      description: Response for creating an order.
    CreatePetResponse:
      type: object
      required:
        - id
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier of the created pet.
      description: Response for creating a pet.
    CreateUserBody:
      type: object
      required:
        - username
        - firstName
        - lastName
        - email
        - password
        - phone
      properties:
        username:
          type: string
          description: Username of the user.
        firstName:
          type: string
          description: First name of the user.
        lastName:
          type: string
          description: Last name of the user.
        email:
          type: string
          description: Email address of the user.
        password:
          type: string
          description: Password for the user account.
        phone:
          type: string
          description: Phone number of the user.
        userStatus:
          type: integer
          format: int32
          description: User status (e.g., 1 for active, 0 for inactive).
      description: Create a new user.
    CreateUserResponse:
      type: object
      required:
        - id
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier of the created user.
      description: Response for creating a user.
    GetOrderResponse:
      type: object
      required:
        - id
        - petId
        - status
        - quantity
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier of the order.
        petId:
          type: integer
          format: int32
          description: Identifier of the pet associated with the order.
        status:
          type: string
          enum:
            - placed
            - approved
            - delivered
          description: The current status of the order.
        quantity:
          type: integer
          format: int32
          description: Quantity of pets ordered.
      description: Response for retrieving an order.
    GetPetResponse:
      type: object
      required:
        - id
        - name
        - status
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier of the pet.
        name:
          type: string
          description: Name of the pet.
        status:
          type: string
          enum:
            - available
            - pending
            - sold
          description: The current status of the pet in the store.
        category:
          type: string
          description: Category of the pet (e.g., dog, cat, bird).
        nickname:
          type: string
          description: Category of the pet (e.g., dog, cat, bird).
      description: Response for retrieving a pet.
    GetUserResponse:
      type: object
      required:
        - id
        - username
        - email
        - phone
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier of the user.
        username:
          type: string
          description: Username associated with the user.
        email:
          type: string
          description: Email address of the user.
        phone:
          type: string
          description: Phone number of the user.
      description: Response for retrieving a user.
    Order:
      type: object
      required:
        - id
        - petId
        - quantity
        - shipDate
        - status
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier for the order.
        petId:
          type: integer
          format: int32
          description: ID of the pet being ordered.
        quantity:
          type: integer
          format: int32
          description: Quantity of pets ordered.
        shipDate:
          type: string
          description: Shipping date for the order.
        status:
          type: string
          enum:
            - placed
            - approved
            - delivered
          description: The current status of the order.
        complete:
          type: boolean
          description: Indicates whether the order is complete.
      description: Represents an order for purchasing a pet.
    Pet:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier for the pet.
        name:
          type: string
          description: Name of the pet.
        category:
          type: string
          description: Category of the pet (e.g., dog, cat, bird).
        tags:
          type: array
          items:
            type: string
          description: List of tags associated with the pet.
        status:
          type: string
          enum:
            - available
            - pending
            - sold
          description: The current status of the pet in the store.
      description: Represents a pet in the store.
    PlaceOrderBody:
      type: object
      required:
        - petId
        - quantity
        - shipDate
        - status
      properties:
        petId:
          type: integer
          format: int32
          description: ID of the pet being ordered.
        quantity:
          type: integer
          format: int32
          description: Quantity of pets ordered.
        shipDate:
          type: string
          description: Shipping date for the order.
        status:
          type: string
          enum:
            - placed
            - approved
            - delivered
          description: The current status of the order.
        complete:
          type: boolean
          description: Indicates whether the order is complete.
      description: Place an order for a pet.
    User:
      type: object
      required:
        - id
        - username
        - firstName
        - lastName
        - email
        - password
        - phone
      properties:
        id:
          type: integer
          format: int32
          description: Unique identifier for the user.
        username:
          type: string
          description: Username of the user.
        firstName:
          type: string
          description: First name of the user.
        lastName:
          type: string
          description: Last name of the user.
        email:
          type: string
          description: Email address of the user.
        password:
          type: string
          description: Password for the user account.
        phone:
          type: string
          description: Phone number of the user.
        userStatus:
          type: integer
          format: int32
          description: User status (e.g., 1 for active, 0 for inactive).
      description: Represents a user of the pet store.
`;

describe('diffSpecs', () => {
  const tempDir = path.resolve(new URL('.', import.meta.url).pathname, 'temp');
  const spec1Path = path.join(tempDir, 'spec1.yaml');
  const spec2Path = path.join(tempDir, 'spec2.yaml');

  beforeAll(() => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
  });

  afterAll(() => {
    fs.rmSync(tempDir, { force: true, recursive: true });
  });

  it.only('should detect no changes between identical specs', async () => {
    fs.writeFileSync(spec1Path, dummyOpenApiSpecBreaking);
    fs.writeFileSync(spec2Path, dummyOpenApiSpecMinor);
    const result = await diffSpecs(spec2Path, spec1Path);
    expect(result.version).toBe('minor');
    expect(result.diff).toEqual([]);
  });
});
